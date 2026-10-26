import { runGeoAudit } from "../server/geoAudit.js";
import { rateLimit } from "../server/rateLimit.js";

const auditCache = new Map();
const CACHE_TTL_MS = 30 * 60 * 1000;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  const allowance = rateLimit(req, { key: "geo-audit", limit: 5, windowMs: 15 * 60 * 1000 });
  if (!allowance.allowed) {
    res.setHeader("Retry-After", allowance.retryAfter);
    return res.status(429).json({ error: "Too many audits from this connection. Please try again later." });
  }

  try {
    const cacheKey = String(req.body?.url || "").trim().toLowerCase();
    const cached = auditCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return res.status(200).json({ ...cached.result, cached: true });
    const result = await runGeoAudit(req.body?.url);
    auditCache.set(cacheKey, { result, expiresAt: Date.now() + CACHE_TTL_MS });
    return res.status(200).json(result);
  } catch (error) {
    console.error("GEO audit error:", error);
    const message = error?.name === "TimeoutError"
      ? "The website took too long to respond. Please try again."
      : error?.message || "The website could not be audited.";
    return res.status(400).json({ error: message });
  }
}

