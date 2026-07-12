import Anthropic from "@anthropic-ai/sdk";

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

/**
 * Calls Claude (Opus 4.8) with an enhanced prompt for Photo Tips & Keywords.
 *
 * ⚠️ SECURITY: This runs in the browser, so the API key is exposed to anyone
 * who opens DevTools. `dangerouslyAllowBrowser` is required to run the SDK
 * client-side. Before production, move this call behind a serverless proxy
 * (e.g. a Vercel function) that holds the key server-side and forwards the
 * request, and have the browser call that proxy instead.
 */
export async function generateProfile(formData) {
  if (!API_KEY || !API_KEY.trim()) throw new Error("API key is missing.");

  const client = new Anthropic({
    apiKey: API_KEY.trim(),
    dangerouslyAllowBrowser: true,
  });

  const prompt = `You are a local SEO expert specializing in Google Business Profiles for small businesses in PEI, Canada.

Business info:
- Name: ${formData.businessName}
- Category: ${formData.category}
- Location: ${formData.city}, PEI, Canada
- Address: ${formData.address}
- Phone: ${formData.phone}
- Website: ${formData.website || "Not provided"}
- Social Media: ${formData.socialLinks || "Not provided"}
- Services: ${formData.services}
- Hours: ${formData.hours}
- Unique qualities: ${formData.unique}

STRATEGY:
Use the website and social media links (if provided) to gather additional context about brand voice and updates. If unreachable, rely on the text data.

Generate the following and return ONLY valid JSON:
{
  "longDescription": "750 character max description, keyword-rich. DO NOT use markdown bold/italic (** or __).",
  "shortDescription": "250 character max short description. DO NOT use markdown bold/italic (** or __).",
  "googlePosts": ["post1", "post2", "post3", "post4", "post5"],
  "reviewResponses": {
    "positive": "response for 5-star",
    "neutral": "response for 3-star",
    "negative": "response for 1-star"
  },
  "categories": ["primary", "secondary 1", "secondary 2"],
  "faqs": [
    {"q": "question?", "a": "answer..."},
    {"q": "question?", "a": "answer..."},
    {"q": "question?", "a": "answer..."}
  ],
  "photoTips": [
    "Tip 1: What to shoot, lighting, and GBP SEO benefit",
    "Tip 2", "Tip 3", "Tip 4", "Tip 5"
  ],
  "competitorKeywords": {
    "primary": ["keyword1", "keyword2", "keyword3"],
    "local": ["keyword4", "keyword5", "keyword6"],
    "longTail": ["keyword7", "keyword8", "keyword9", "keyword10"]
  }
}

RULES:
- NO MARKDOWN FORMATTING: Do not use **bold**, *italic*, or any other markdown syntax in descriptions or posts.
- Each post in googlePosts must be plain text with NO markdown formatting.
- Photo tips must be ultra-specific to ${formData.category}.
- Keywords must reflect real PEI-specific searches (e.g. including cities like Charlottetown).
- Total 10 keywords across primary, local, and longTail groups.
- Respond with ONLY the JSON object, no preamble and no code fences.`;

  // Stream so the large-output request doesn't hit an HTTP timeout.
  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    messages: [{ role: "user", content: prompt }],
  });
  const message = await stream.finalMessage();

  let text = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();

  // Clean JSON markdown
  text = text.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/im, "").trim();
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }

  const parsed = JSON.parse(text);

  const stripStars = (str) => typeof str === "string" ? str.replace(/\*\*/g, "") : str;
  const truncate = (str, max) => {
    const s = typeof str === "string" ? str.trim() : "";
    if (s.length <= max) return s;
    // Try to break at last sentence boundary before limit
    const cut = s.lastIndexOf(". ", max - 3);
    if (cut > max * 0.7) return s.slice(0, cut + 1);
    return s.slice(0, max - 3) + "...";
  };

  return {
    longDescription: truncate(stripStars(parsed.longDescription), 750) || "Description not available.",
    shortDescription: truncate(stripStars(parsed.shortDescription), 250) || "Short description not available.",
    googlePosts: Array.isArray(parsed.googlePosts)
      ? parsed.googlePosts.map(post => stripStars(post))
      : ["Post error."],
    reviewResponses: {
      positive: stripStars(parsed.reviewResponses?.positive) || "...",
      neutral: stripStars(parsed.reviewResponses?.neutral) || "...",
      negative: stripStars(parsed.reviewResponses?.negative) || "..."
    },
    categories: Array.isArray(parsed.categories) ? parsed.categories : ["Category error."],
    faqs: Array.isArray(parsed.faqs) ? parsed.faqs.map(f => ({ q: stripStars(f.q), a: stripStars(f.a) })) : [],
    photoTips: Array.isArray(parsed.photoTips) ? parsed.photoTips.map(t => stripStars(t)) : [
      "Capture your storefront in natural morning light.",
      "Take photos of your best services to build trust.",
      "Show your team in action to humanize your business.",
      "Update photos seasonally for better GBP engagement.",
      "Post interior shots showing the PEI layout."
    ],
    competitorKeywords: parsed.competitorKeywords || {
      primary: ["Business SEO"], local: ["PEI Local Search"], longTail: ["Best local business PEI"]
    }
  };
}
