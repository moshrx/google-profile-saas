import dns from "node:dns/promises";
import net from "node:net";

const MAX_HTML_BYTES = 750_000;
const FETCH_TIMEOUT_MS = 8_000;
const BROWSER_FETCH_TIMEOUT_MS = 20_000;
const AUDIT_USER_AGENT = "ListedPEI-GEOAudit/1.0 (+https://listedpei.ca/geo-audit)";
const BROWSER_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";

function isPrivateIPv4(address) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    a >= 224
  );
}

function isPrivateIPv6(address) {
  const normalized = address.toLowerCase();
  return normalized === "::" || normalized === "::1" || normalized.startsWith("fc") ||
    normalized.startsWith("fd") || normalized.startsWith("fe8") || normalized.startsWith("fe9") ||
    normalized.startsWith("fea") || normalized.startsWith("feb") || normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") || normalized.startsWith("::ffff:192.168.");
}

async function assertPublicHostname(hostname) {
  const lower = hostname.toLowerCase();
  if (lower === "localhost" || lower.endsWith(".local") || lower.endsWith(".internal")) {
    throw new Error("Private network addresses cannot be audited.");
  }

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length) throw new Error("The website hostname could not be resolved.");
  for (const { address } of addresses) {
    const version = net.isIP(address);
    if (!version || (version === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address))) {
      throw new Error("Private network addresses cannot be audited.");
    }
  }
}

export function normalizeWebsiteUrl(value) {
  const input = String(value || "").trim();
  if (!input) throw new Error("Enter a website URL.");
  const withProtocol = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  const url = new URL(withProtocol);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only HTTP and HTTPS websites can be audited.");
  url.hash = "";
  return url;
}

function logUrl(url) {
  return `${url.origin}${url.pathname}`;
}

function logBlockedResponse(url, response, attempt) {
  console.warn("GEO audit website fetch was blocked", {
    url: logUrl(url),
    status: response.status,
    attempt,
    server: response.headers.get("server") || "unknown",
    cfRay: response.headers.get("cf-ray") || "not-present",
  });
}

async function fetchDirect(url, accept, browserCompatible = false) {
  const headers = browserCompatible
    ? {
        Accept: accept,
        "Accept-Language": "en-CA,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": BROWSER_USER_AGENT,
      }
    : { Accept: accept, "User-Agent": AUDIT_USER_AGENT };

  return fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers,
  });
}

async function fetchWithBrowser(url) {
  const token = String(process.env.BROWSERLESS_API_TOKEN || "").trim();
  if (!token) return null;

  const endpoint = new URL(process.env.BROWSERLESS_ENDPOINT || "https://production-sfo.browserless.io/content");
  if (endpoint.protocol !== "https:") throw new Error("BROWSERLESS_ENDPOINT must use HTTPS.");
  endpoint.searchParams.set("token", token);
  endpoint.searchParams.set("stealth", "true");

  const response = await fetch(endpoint, {
    method: "POST",
    signal: AbortSignal.timeout(BROWSER_FETCH_TIMEOUT_MS),
    headers: {
      "Cache-Control": "no-cache",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: url.href,
      bestAttempt: true,
      gotoOptions: { waitUntil: "domcontentloaded", timeout: 15_000 },
      rejectResourceTypes: ["image", "media", "font"],
    }),
  });

  if (!response.ok) {
    console.warn("GEO audit managed-browser fallback failed", {
      url: logUrl(url),
      status: response.status,
    });
    return null;
  }

  const declaredLength = Number(response.headers.get("content-length") || 0);
  if (declaredLength > MAX_HTML_BYTES) throw new Error("The website response is too large to audit safely.");
  const text = (await response.text()).slice(0, MAX_HTML_BYTES);
  if (/cf-chl-|attention required|access denied|just a moment/i.test(text.slice(0, 20_000))) {
    console.warn("GEO audit managed-browser fallback received a block page", { url: logUrl(url) });
    return null;
  }

  console.info("GEO audit used managed-browser fallback", { url: logUrl(url) });
  return {
    response: new Response(text, { status: 200, headers: { "content-type": "text/html; charset=utf-8" } }),
    text,
    finalUrl: url,
    fetchMethod: "managed-browser",
  };
}

export async function safeFetch(urlValue, { accept = "text/html,application/xhtml+xml", browserFallback = false } = {}) {
  let url = urlValue instanceof URL ? new URL(urlValue) : new URL(urlValue);

  for (let redirect = 0; redirect <= 4; redirect += 1) {
    await assertPublicHostname(url.hostname);
    let response = await fetchDirect(url, accept);

    if (response.status === 403) {
      logBlockedResponse(url, response, "identified-crawler");
      response = await fetchDirect(url, accept, true);
      if (response.status === 403) logBlockedResponse(url, response, "browser-compatible");
    }

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`The website returned redirect status ${response.status} without a destination.`);
      url = new URL(location, url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("The website redirected to an unsupported URL.");
      continue;
    }

    if (response.status === 403 && browserFallback) {
      const browserResult = await fetchWithBrowser(url);
      if (browserResult) return browserResult;
    }

    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_HTML_BYTES) throw new Error("The website response is too large to audit safely.");
    const text = (await response.text()).slice(0, MAX_HTML_BYTES);
    return { response, text, finalUrl: url, fetchMethod: "direct" };
  }

  throw new Error("The website redirected too many times.");
}

