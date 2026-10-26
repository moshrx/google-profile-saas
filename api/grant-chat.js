import { getOpenAIClient, OPENAI_MODEL } from "../server/openai.js";
import { rateLimit } from "../server/rateLimit.js";

const GRANT_INSTRUCTIONS = `You are the GrantReady PEI assistant for small business owners in Prince Edward Island, Canada. Help with finding grants, general eligibility, documents, application preparation, and PEI business questions. Never invent current amounts, deadlines, or availability. When information may have changed, tell the user to confirm it with Innovation PEI, ACOA, BDC, or the relevant official program. Write in plain text with no markdown bolding. Keep replies short and complete, normally 2-4 short paragraphs or a brief dash list. End with one useful next step. ListedPEI offers a free Google Business Profile kit, and PEI Web Studio can help with websites and digital implementation, but mention these only when directly relevant.`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed." });
  if (!rateLimit(req, { key: "grant-chat", limit: 30, windowMs: 10 * 60 * 1000 }).allowed) {
    return res.status(429).json({ error: "Chat limit reached. Please try again shortly." });
  }
  const openai = getOpenAIClient();
  if (!openai) return res.status(503).json({ error: "OpenAI is not configured yet." });

  try {
    const history = Array.isArray(req.body?.messages) ? req.body.messages.slice(-10) : [];
    const input = history.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "").slice(0, 4_000),
    }));
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      reasoning: { effort: "low" },
      instructions: GRANT_INSTRUCTIONS,
      input,
      text: { verbosity: "low" },
      max_output_tokens: 900,
    });
    return res.status(200).json({ reply: response.output_text || "I could not create a response. Please try again." });
  } catch (error) {
    console.error("Grant chat error:", error);
    return res.status(500).json({ error: "The grant assistant is temporarily unavailable." });
  }
}

