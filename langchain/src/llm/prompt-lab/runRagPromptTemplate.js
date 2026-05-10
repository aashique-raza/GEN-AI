// This file tests RAG grounded prompt with fake context.
// No vector store yet.
// Goal:
// 1. Pass context + question into ChatPromptTemplate
// 2. Send generated messages to model
// 3. Check if model answers only from context

import { ragPromptTemplate } from "../../prompts/templates/ragPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create chat model using provider abstraction.
const model = createChatModel();

// Fake retrieved context.
// Later this will come from retriever/vector store.
const context = `
Source 1:
Chlorophyll is the green pigment present in leaves.
It helps plants absorb sunlight for photosynthesis.

Source 2:
Hormones are chemical messengers secreted by endocrine glands.
They help control and coordinate activities in the body.
`;

// User question.
// This question is answerable from the fake context above.
const question = "Compare chlorophyll and hormones.";

// Fill prompt variables.
const promptValue = await ragPromptTemplate.invoke({
  context,
  question,
});

// Convert to chat messages.
const messages = promptValue.toChatMessages();

console.log("\n--- RAG MESSAGES SENT TO MODEL ---");
console.log(messages);

// Call model.
const response = await model.invoke(messages);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);