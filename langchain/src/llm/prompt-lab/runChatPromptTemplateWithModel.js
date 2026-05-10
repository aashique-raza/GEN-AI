// This file tests ChatPromptTemplate with actual model call.
// Goal:
// 1. Generate system + human messages using ChatPromptTemplate
// 2. Send those messages to ChatGroq
// 3. Print only AIMessage.content

import { basicChatPromptTemplate } from "../../prompts/templates/chatPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create chat model from existing provider layer.
// This avoids hard-coding Groq inside prompt-lab files.
const model = createChatModel();

// Step 1: Fill dynamic prompt variable
const promptValue = await basicChatPromptTemplate.invoke({
  topic: "ChatPromptTemplate",
});

// Step 2: Convert PromptValue into chat messages
const messages = promptValue.toChatMessages();

console.log("\n--- MESSAGES SENT TO MODEL ---");
console.log(messages);

// Step 3: Send messages to model
const response = await model.invoke(messages);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);