// This file tests controlled prompting with model call.
// Goal:
// 1. Use system message for strict rules
// 2. Use human message for actual task
// 3. Check whether model follows boundaries

import { controlledPromptTemplate } from "../../prompts/templates/controlledPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create model from provider layer.
// No Groq hard-coding here.
const model = createChatModel();

// Fill dynamic variables inside the prompt.
const promptValue = await controlledPromptTemplate.invoke({
  maxLines: 5,
  task: "Explain PromptTemplate vs ChatPromptTemplate",
});

// Convert prompt value into chat messages.
const messages = promptValue.toChatMessages();

console.log("\n--- CONTROLLED MESSAGES SENT TO MODEL ---");
console.log(messages);

// Send controlled messages to model.
const response = await model.invoke(messages);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);