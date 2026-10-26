import { emailConfigStatus, isValidEmail, sendTemplateEmail } from "../server/email.js";
import { rateLimit } from "../server/rateLimit.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    return res.status(200).json(emailConfigStatus());
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!rateLimit(req, { key: "email", limit: 12, windowMs: 15 * 60 * 1000 }).allowed) {
    return res.status(429).json({ error: "Too many email requests. Please try again later." });
  }

  try {
    const { type, params } = req.body || {};
    if (!["kit", "lead"].includes(type)) return res.status(400).json({ error: "Invalid email type." });
    if (!params || typeof params !== "object" || Array.isArray(params)) {
      return res.status(400).json({ error: "Email details are required." });
    }
    if (type === "kit" && !isValidEmail(params.to_email)) {
      return res.status(400).json({ error: "Enter a valid email address." });
    }
    if (type === "lead" && (!String(params.from_name || "").trim() || !isValidEmail(params.from_email))) {
      return res.status(400).json({ error: "Enter your name and a valid email address." });
    }

    await sendTemplateEmail(type, params);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email API error:", error);
    return res.status(error.statusCode || 500).json({ error: error.message || "Email delivery failed." });
  }
}
