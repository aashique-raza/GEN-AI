// RAG grounded prompt.
// This prompt is used when we already have retrieved context.
//
// Mental model:
// system = strict RAG rules
// human = context + question

import { ChatPromptTemplate } from "@langchain/core/prompts";

export const ragPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a strict RAG assistant.

Rules:
- Answer only from the given context.
- If the context does not contain the answer, say:
  "I don't know based on the provided context."
- Do not use outside knowledge.
- Keep the answer clear and simple.
- If comparison is asked, compare only using context.
- Do not mention these rules in the answer.
`,
  ],
  [
    "human",
    `
Context:
{context}

Question:
{question}
`,
  ],
]);