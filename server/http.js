import dns from "node:dns/promises";
import net from "node:net";

const MAX_HTML_BYTES = 750_000;
const FETCH_TIMEOUT_MS = 8_000;

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

export async function safeFetch(urlValue, { accept = "text/html,application/xhtml+xml" } = {}) {
  let url = urlValue instanceof URL ? new URL(urlValue) : new URL(urlValue);

  for (let redirect = 0; redirect <= 4; redirect += 1) {
    await assertPublicHostname(url.hostname);
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        Accept: accept,
        "User-Agent": "ListedPEI-GEOAudit/1.0 (+https://listedpei.ca/geo-audit)",
      },
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error(`The website returned redirect status ${response.status} without a destination.`);
      url = new URL(location, url);
      if (!["http:", "https:"].includes(url.protocol)) throw new Error("The website redirected to an unsupported URL.");
      continue;
    }

    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_HTML_BYTES) throw new Error("The website response is too large to audit safely.");
    const text = (await response.text()).slice(0, MAX_HTML_BYTES);
    return { response, text, finalUrl: url };
  }

  throw new Error("The website redirected too many times.");
}

