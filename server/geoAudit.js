import * as cheerio from "cheerio";
import { normalizeWebsiteUrl, safeFetch } from "./http.js";
import { createStructuredResponse, OPENAI_MODEL } from "./openai.js";

const PAGE_LIMIT = 6;
const TEXT_LIMIT_PER_PAGE = 8_000;

const AI_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["businessSummary", "entityClarity", "answerReadiness", "trustQuality", "strengths", "issues", "missingQuestions"],
  properties: {
    businessSummary: { type: "string" },
    entityClarity: { type: "integer" },
    answerReadiness: { type: "integer" },
    trustQuality: { type: "integer" },
    strengths: { type: "array", items: { type: "string" } },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["priority", "category", "title", "explanation", "action"],
        properties: {
          priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
          category: { type: "string", enum: ["discoverability", "businessIdentity", "answerReadiness", "trust", "technical"] },
          title: { type: "string" },
          explanation: { type: "string" },
          action: { type: "string" },
        },
      },
    },
    missingQuestions: { type: "array", items: { type: "string" } },
  },
};

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function parsePage(html, url) {
  const raw = cheerio.load(html);
  const jsonLd = [];
  raw("script[type='application/ld+json']").each((_, element) => {
    try { jsonLd.push(JSON.parse(raw(element).text())); } catch { /* invalid JSON-LD is scored separately */ }
  });

  const $ = cheerio.load(html);
  $("script,style,noscript,svg,template").remove();

  const links = [];
  $("a[href]").each((_, element) => {
    try {
      const href = new URL($(element).attr("href"), url);
      if (["http:", "https:"].includes(href.protocol)) links.push(href.href.split("#")[0]);
    } catch { /* ignore malformed links */ }
  });

  const headings = $("h1,h2,h3").map((_, element) => cleanText($(element).text())).get().filter(Boolean);
  const bodyText = cleanText($("body").text()).slice(0, TEXT_LIMIT_PER_PAGE);
  const title = cleanText($("title").first().text());
  const description = cleanText($("meta[name='description']").attr("content"));
  const canonical = $("link[rel='canonical']").attr("href") || "";
  const robots = cleanText($("meta[name='robots']").attr("content")).toLowerCase();
  const images = $("img").length;
  const imagesWithAlt = $("img[alt]").filter((_, element) => cleanText($(element).attr("alt")).length > 0).length;

  return { url, title, description, canonical, robots, headings, bodyText, jsonLd, links, images, imagesWithAlt };
}

function schemaTypes(value, result = []) {
  if (!value || typeof value !== "object") return result;
  if (Array.isArray(value)) {
    value.forEach((item) => schemaTypes(item, result));
    return result;
  }
  if (value["@type"]) result.push(...(Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]]));
  Object.values(value).forEach((item) => schemaTypes(item, result));
  return result;
}

function selectInternalPages(homePage, origin) {
  const patterns = [/about/i, /contact/i, /service/i, /faq/i, /location/i, /testimonial/i, /case-stud/i];
  const unique = [...new Set(homePage.links)]
    .filter((href) => {
      try {
        const url = new URL(href);
        return url.origin === origin && url.pathname !== "/" && !/\.(pdf|jpe?g|png|gif|svg|webp|zip)$/i.test(url.pathname);
      } catch { return false; }
    });
  const ranked = unique.sort((a, b) => Number(patterns.some((pattern) => pattern.test(b))) - Number(patterns.some((pattern) => pattern.test(a))));
  return ranked.slice(0, PAGE_LIMIT - 1);
}

function checkRobotsForSearchBot(robotsText) {
  if (!robotsText) return { allowed: true, explicit: false };
  const groups = robotsText.split(/(?=^user-agent\s*:)/gim);
  const relevant = groups.filter((group) => /user-agent\s*:\s*(oai-searchbot|\*)/i.test(group));
  const blocked = relevant.some((group) => /disallow\s*:\s*\/\s*$/im.test(group));
  return { allowed: !blocked, explicit: /user-agent\s*:\s*oai-searchbot/i.test(robotsText) };
}

function clamp(value, max) {
  return Math.max(0, Math.min(max, Number.isFinite(Number(value)) ? Number(value) : 0));
}

function deterministicScores({ pages, robotsText, sitemapFound }) {
  const home = pages[0];
  const allText = pages.map((page) => page.bodyText.toLowerCase()).join(" ");
  const allTypes = pages.flatMap((page) => page.jsonLd.flatMap((item) => schemaTypes(item))).map(String);
  const crawler = checkRobotsForSearchBot(robotsText);
  const hasBusinessSchema = allTypes.some((type) => /LocalBusiness|Organization|ProfessionalService/i.test(type));
  const hasAbout = pages.some((page) => /\/about/i.test(page.url));
  const hasContactPage = pages.some((page) => /\/contact/i.test(page.url));
  const hasContactSignals = /\b(?:902[-.)\s]|prince edward island|pei\b|contact us|email us)/i.test(allText);
  const hasFAQ = pages.some((page) => /faq|frequently asked|questions/i.test(`${page.url} ${page.headings.join(" ")}`));
  const hasServicePage = pages.some((page) => /service|product|solution/i.test(`${page.url} ${page.headings.join(" ")}`));
  const hasTrust = /testimonial|case study|review|our team|years of experience|licensed|certified/i.test(allText);
  const indexable = !home.robots.includes("noindex");
  const validTitles = pages.filter((page) => page.title).length;
  const validDescriptions = pages.filter((page) => page.description).length;
  const altRatio = pages.reduce((sum, page) => sum + page.imagesWithAlt, 0) / Math.max(1, pages.reduce((sum, page) => sum + page.images, 0));

  return {
    discoverability: clamp((indexable ? 6 : 0) + (crawler.allowed ? 6 : 0) + (sitemapFound ? 4 : 0) + (robotsText ? 2 : 0) + (home.canonical ? 2 : 0), 20),
    businessIdentityBase: clamp((hasBusinessSchema ? 4 : 0) + (hasAbout ? 2 : 0) + (hasContactPage ? 2 : 0) + (hasContactSignals ? 2 : 0), 10),
    answerReadinessBase: clamp((hasFAQ ? 3 : 0) + (hasServicePage ? 2 : 0), 5),
    trustBase: clamp((hasTrust ? 5 : 0) + (hasAbout ? 2 : 0) + (hasContactSignals ? 2 : 0) + (allTypes.length ? 1 : 0), 10),
    technical: clamp((validTitles / pages.length) * 5 + (validDescriptions / pages.length) * 4 + (home.headings.length ? 3 : 0) + (home.canonical ? 3 : 0) + altRatio * 3 + (pages.length > 1 ? 2 : 0), 20),
    facts: { crawler, sitemapFound, hasBusinessSchema, hasAbout, hasContactPage, hasFAQ, hasServicePage, altRatio, indexable },
  };
}

function fallbackAnalysis(scores) {
  const issues = [];
  if (!scores.facts.crawler.allowed) issues.push({ priority: "critical", category: "discoverability", title: "ChatGPT search crawler is blocked", explanation: "OAI-SearchBot appears unable to crawl the website.", action: "Update robots.txt to allow OAI-SearchBot on public pages." });
  if (!scores.facts.sitemapFound) issues.push({ priority: "high", category: "discoverability", title: "No sitemap was detected", explanation: "AI search systems may discover important pages more slowly.", action: "Create an XML sitemap and reference it in robots.txt." });
  if (!scores.facts.hasBusinessSchema) issues.push({ priority: "high", category: "businessIdentity", title: "Business structured data is missing", explanation: "The site does not clearly identify a LocalBusiness or Organization entity in JSON-LD.", action: "Add accurate LocalBusiness or Organization structured data." });
  if (!scores.facts.hasFAQ) issues.push({ priority: "medium", category: "answerReadiness", title: "Customer questions are not answered directly", explanation: "The audited pages do not contain a clear FAQ or question-led section.", action: "Add concise answers to real pre-sale questions on relevant service pages." });
  if (!scores.facts.hasAbout) issues.push({ priority: "medium", category: "trust", title: "No clear About page was found", explanation: "AI systems and customers have limited evidence about who operates the business.", action: "Publish an About page with real experience, people, location and credentials." });
  return {
    businessSummary: "The technical audit is complete. Add an OpenAI API key to enable semantic content analysis and personalized recommendations.",
    entityClarity: 0,
    answerReadiness: 0,
    trustQuality: 0,
    strengths: ["The website was reachable and could be inspected."],
    issues: issues.slice(0, 5),
    missingQuestions: ["What services do you provide?", "Which areas do you serve?", "Why should customers choose your business?"],
  };
}

export async function runGeoAudit(urlValue) {
  const requestedUrl = normalizeWebsiteUrl(urlValue);
  const homeFetch = await safeFetch(requestedUrl);
  if (!homeFetch.response.ok) throw new Error(`The website returned HTTP ${homeFetch.response.status}.`);
  if (!/text\/html|application\/xhtml\+xml/i.test(homeFetch.response.headers.get("content-type") || "")) {
    throw new Error("The submitted URL is not an HTML website.");
  }

  const home = parsePage(homeFetch.text, homeFetch.finalUrl.href);
  const pageUrls = selectInternalPages(home, homeFetch.finalUrl.origin);
  const otherPages = (await Promise.all(pageUrls.map(async (url) => {
    try {
      const fetched = await safeFetch(url);
      return fetched.response.ok ? parsePage(fetched.text, fetched.finalUrl.href) : null;
    } catch { return null; }
  }))).filter(Boolean);
  const pages = [home, ...otherPages];

  let robotsText = "";
  let sitemapFound = false;
  try {
    const robots = await safeFetch(new URL("/robots.txt", homeFetch.finalUrl), { accept: "text/plain,*/*" });
    if (robots.response.ok) robotsText = robots.text;
  } catch { /* optional resource */ }
  try {
    const sitemapUrl = robotsText.match(/^sitemap:\s*(\S+)/im)?.[1] || new URL("/sitemap.xml", homeFetch.finalUrl).href;
    const sitemap = await safeFetch(sitemapUrl, { accept: "application/xml,text/xml,text/plain,*/*" });
    sitemapFound = sitemap.response.ok && /<urlset|<sitemapindex/i.test(sitemap.text);
  } catch { /* optional resource */ }

  const deterministic = deterministicScores({ pages, robotsText, sitemapFound });
  const compactPages = pages.map((page) => ({
    url: page.url,
    title: page.title,
    description: page.description,
    headings: page.headings.slice(0, 30),
    text: page.bodyText,
  }));

  let analysis = await createStructuredResponse({
    name: "geo_audit_analysis",
    schema: AI_SCHEMA,
    instructions: `You are a careful Generative Engine Optimization auditor for small businesses. Analyze only the supplied website evidence. Do not claim that a business is currently ranked, cited, or recommended by any AI system. Score entityClarity from 0-10, answerReadiness from 0-15, and trustQuality from 0-10. Prefer concrete, first-hand, local and verifiable content over generic marketing copy. Return 2-4 strengths, 3-6 prioritized issues, and 3-6 questions the website should answer. Make every action specific and understandable to a non-technical business owner.`,
    input: JSON.stringify({ deterministicFacts: deterministic.facts, pages: compactPages }),
  });
  const aiEnhanced = Boolean(analysis);
  if (!analysis) analysis = fallbackAnalysis(deterministic);

  const categoryScores = {
    discoverability: Math.round(deterministic.discoverability),
    businessIdentity: Math.round(deterministic.businessIdentityBase + clamp(analysis.entityClarity, 10)),
    answerReadiness: Math.round(deterministic.answerReadinessBase + clamp(analysis.answerReadiness, 15)),
    trust: Math.round(deterministic.trustBase + clamp(analysis.trustQuality, 10)),
    technical: Math.round(deterministic.technical),
  };
  const overallScore = Object.values(categoryScores).reduce((sum, value) => sum + value, 0);

  return {
    auditedUrl: home.url,
    auditedAt: new Date().toISOString(),
    model: aiEnhanced ? OPENAI_MODEL : null,
    aiEnhanced,
    overallScore,
    categoryScores,
    businessSummary: analysis.businessSummary,
    strengths: analysis.strengths.slice(0, 4),
    issues: analysis.issues.slice(0, 6),
    missingQuestions: analysis.missingQuestions.slice(0, 6),
    pagesAudited: pages.map((page) => page.url),
  };
}

