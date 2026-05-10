// This file tests ChatPromptTemplate without model call first.
// Goal: see the generated message array.

import { basicChatPromptTemplate } from "../../prompts/templates/chatPromptTemplate.js";

// Generate messages using dynamic input.
// {topic} will be replaced with "ChatPromptTemplate".
const promptValue = await basicChatPromptTemplate.invoke({
  topic: "ChatPromptTemplate",
});

console.log("\n--- CHAT PROMPT VALUE ---");
console.log(promptValue);

// Convert to actual messages array.
// This is what chat models understand.
const messages = promptValue.toChatMessages();

console.log("\n--- CHAT MESSAGES ARRAY ---");
console.log(messages);