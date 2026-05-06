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
You are a strict RAG answer generator.

Rules:
1. Answer only from the provided context.
2. Do not use outside knowledge.
3. Do not explain your reasoning.
4. Do not say phrases like:
   - "Since the question asks..."
   - "Based on the context..."
   - "The answer is..."
5. Do not repeat the same answer twice.
6. If the answer is not found in the context, say exactly:
   "I don't have enough information in the provided context."
7. 7. Keep answers short, clear, and student-friendly, but include all directly relevant facts from the context.
8. For definition questions:
   - say what it is
   - include its function/use if the context mentions it
9. For comparison questions:
   - define both items first
   - then compare them in simple bullets
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