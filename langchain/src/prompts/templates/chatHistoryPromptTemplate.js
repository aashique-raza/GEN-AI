// Chat history prompt.
// Goal: insert previous conversation messages into the prompt.
//
// Mental model:
// system = fixed behavior rules
// history = previous human/AI messages
// human = current user message

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export const chatHistoryPromptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
You are a helpful Hinglish AI tutor.

Rules:
- Use chat history only when it helps.
- Answer the latest user question.
- Keep the answer short and clear.
`,
  ],

  // This placeholder will inject previous messages here.
  // Input key name must be: history
  new MessagesPlaceholder("history"),

  [
    "human",
    `
Current question:
{question}
`,
  ],
]);