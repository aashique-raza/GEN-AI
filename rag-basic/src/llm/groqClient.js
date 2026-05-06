import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function generateWithGroq({ question, context }) {
  if (!question || typeof question !== "string") {
    throw new Error("Question is required for Groq generation");
  }

  if (!context || typeof context !== "string") {
    throw new Error("Context is required for Groq generation");
  }

  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0,
    messages: [
  {
    role: "system",
   content: `
Context:
${context}

Question:
${question}

Answer rules:
1. If the question asks for comparison, first define each item using exact facts from context.
2. Then write a simple comparison based only on those facts.
3. Do not refuse if both items are present in the context.
4. Do not add extra facts, categories, assumptions, or outside knowledge.
5. Do not add words like "animals", "humans", or "different sources" unless directly stated in the context.
6. Keep the answer short and clear.
`.trim(),
  },
  {
    role: "user",
    content: `
Context:
${context}

Question:
${question}

Answer rules:
1. If the question asks for comparison, first define each item using context.
2. Then write a simple comparison based only on those definitions.
3. Do not refuse if both items are present in the context.
4. Keep the answer short and clear.
`.trim(),
  },
],
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}
