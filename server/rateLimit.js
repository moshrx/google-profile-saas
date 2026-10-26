const buckets = new Map();

function requestIp(req) {
  const forwarded = String(req.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket?.remoteAddress || "unknown";
}

export function rateLimit(req, { key, limit, windowMs }) {
  const now = Date.now();
  const bucketKey = `${key}:${requestIp(req)}`;
  const current = buckets.get(bucketKey);
  if (!current || current.resetAt <= now) {
    buckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }
  current.count += 1;
  if (current.count > limit) return { allowed: false, remaining: 0, retryAfter: Math.ceil((current.resetAt - now) / 1000) };
  return { allowed: true, remaining: limit - current.count };
}

