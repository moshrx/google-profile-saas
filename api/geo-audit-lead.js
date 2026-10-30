import { rateLimit } from "../server/rateLimit.js";
import { sendTemplateEmail } from "../server/email.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!rateLimit(req, { key: "geo-lead", limit: 10, windowMs: 60 * 60 * 1000 }).allowed) {
    return res.status(429).json({ error: "Submission limit reached. Please try again later." });
  }

  const { name, email, phone, businessName, website, score, issues, consent } = req.body || {};
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || "")) {
    return res.status(400).json({ error: "Enter your name and a valid business email." });
  }
  if (consent !== true) return res.status(400).json({ error: "Consent is required to send your details for follow-up." });

  try {
    await sendTemplateEmail("lead", {
      from_name: name.trim(),
      from_email: email.trim(),
      reply_to: email.trim(),
      phone: phone?.trim() || "Not provided",
      business_name: businessName?.trim() || website,
      website_status: "GEO Audit Lead",
      business_type: "AI Visibility Audit",
      employees: "",
      business_age: "",
      has_website: website,
      funding_goal: "Improve AI visibility",
      matched_grants: `AI Visibility Score: ${score}/100`,
      message: `Free GEO audit requested for ${website}.\nScore: ${score}/100\n\nTop findings:\n${(issues || []).slice(0, 6).map((issue) => `- ${issue.title}: ${issue.action}`).join("\n")}`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("GEO lead delivery error:", error);
    return res.status(error.statusCode || 500).json({ error: "We could not submit the request. Please try again." });
  }
}
