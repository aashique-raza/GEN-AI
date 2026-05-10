// Structured output prompt.
// Goal: ask the model to return JSON only.
//
// Warning:
// In LangChain prompt templates, single braces {} are treated as variables.
// So JSON braces must be escaped as double braces: {{ and }}

import { ChatPromptTemplate } from "@langchain/core/prompts";

export const structuredOutputPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a strict JSON response generator.

Rules:
- Return only valid JSON.
- Do not use markdown.
- Do not wrap JSON in triple backticks.
- Do not add explanation outside JSON.
- Use this exact JSON shape:

{{
  "answer": "short answer here",
  "confidence": "high | medium | low",
  "reason": "why this confidence was selected"
}}
`,
  ],
  [
    "human",
    `
Question:
{question}

Context:
{context}
`,
  ],
]);