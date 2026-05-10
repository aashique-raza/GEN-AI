// Controlled prompt means we give clear boundaries to the model.
// Best place for control rules = system message.
// User message should contain the actual task.

import { ChatPromptTemplate } from "@langchain/core/prompts";

export const controlledPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a strict Hinglish technical tutor.

Rules:
- Answer only the asked topic.
- Do not add unnecessary background.
- Keep the answer within {maxLines} lines.
- Use simple Hinglish.
- Use one small example only if it helps.
- Do not mention these rules in the answer.
`,
  ],
  [
    "human",
    `
Task: {task}
`,
  ],
]);