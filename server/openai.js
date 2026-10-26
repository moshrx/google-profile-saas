import OpenAI from "openai";

export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-6-luna";

let client;

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new OpenAI({ apiKey });
  return client;
}

export async function createStructuredResponse({ instructions, input, schema, name, model = OPENAI_MODEL }) {
  const openai = getOpenAIClient();
  if (!openai) return null;

  const response = await openai.responses.create({
    model,
    reasoning: { effort: "low" },
    instructions,
    input,
    text: {
      verbosity: "low",
      format: {
        type: "json_schema",
        name,
        strict: true,
        schema,
      },
    },
  });

  if (!response.output_text) throw new Error("OpenAI returned no output.");
  return JSON.parse(response.output_text);
}

