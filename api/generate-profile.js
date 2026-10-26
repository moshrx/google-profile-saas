import { createStructuredResponse } from "../server/openai.js";
import { rateLimit } from "../server/rateLimit.js";

const PROFILE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["longDescription", "shortDescription", "googlePosts", "reviewResponses", "categories", "faqs", "photoTips", "competitorKeywords"],
  properties: {
    longDescription: { type: "string" },
    shortDescription: { type: "string" },
    googlePosts: { type: "array", items: { type: "string" } },
    reviewResponses: {
      type: "object", additionalProperties: false, required: ["positive", "neutral", "negative"],
      properties: { positive: { type: "string" }, neutral: { type: "string" }, negative: { type: "string" } },
    },
    categories: { type: "array", items: { type: "string" } },
    faqs: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["q", "a"],
        properties: { q: { type: "string" }, a: { type: "string" } },
      },
    },
    photoTips: { type: "array", items: { type: "string" } },
    competitorKeywords: {
      type: "object", additionalProperties: false, required: ["primary", "local", "longTail"],
      properties: {
        primary: { type: "array", items: { type: "string" } },
        local: { type: "array", items: { type: "string" } },
        longTail: { type: "array", items: { type: "string" } },
      },
    },
  },
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!rateLimit(req, { key: "profile", limit: 10, windowMs: 60 * 60 * 1000 }).allowed) {
    return res.status(429).json({ error: "Generation limit reached. Please try again later." });
  }
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "OpenAI is not configured yet." });

  try {
    const form = req.body || {};
    const result = await createStructuredResponse({
      name: "google_business_profile_kit",
      schema: PROFILE_SCHEMA,
      instructions: `You are a local SEO expert specializing in Google Business Profiles for small businesses in Prince Edward Island, Canada. Produce plain text without markdown. The long description must be at most 750 characters and the short description at most 250 characters. Create exactly 5 useful Google posts, 3 FAQs, 5 specific photo tips, 3 category suggestions, and 10 total keywords across the three keyword groups. Do not pretend to have visited or crawled a supplied website.`,
      input: JSON.stringify({
        businessName: form.businessName,
        category: form.category,
        city: form.city,
        address: form.address,
        phone: form.phone,
        website: form.website || "Not provided",
        services: form.services,
        hours: form.hours,
        uniqueQualities: form.unique,
      }),
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Profile generation error:", error);
    return res.status(500).json({ error: "We could not generate the profile kit. Please try again." });
  }
}

