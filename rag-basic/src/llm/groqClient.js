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
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content: `
You are a RAG assistant.

Rules:
- Answer only using the provided context.
- If the answer is not present in context, say: "I don't have enough information in the provided context."
- Do not make up facts.
        `.trim(),
      },
      {
        role: "user",
        content: `
Context:
${context}

Question:
${question}
        `.trim(),
      },
    ],
  });

  return response.choices?.[0]?.message?.content?.trim() || "";
}