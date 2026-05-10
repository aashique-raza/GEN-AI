// ChatPromptTemplate is used when we want proper chat messages.
// Best for chat models like ChatGroq.
//
// Mental model:
// system = rules / behavior
// human = user input / actual task

import { ChatPromptTemplate } from "@langchain/core/prompts";

export const basicChatPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a simple Hinglish AI tutor.

Rules:
- Explain in simple Hinglish.
- Keep the answer short.
- Use one small example if useful.
`,
  ],
  [
    "human",
    `
Explain this topic: {topic}
`,
  ],
]);