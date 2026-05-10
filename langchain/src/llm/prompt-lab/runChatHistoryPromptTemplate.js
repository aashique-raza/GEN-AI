// This file tests MessagesPlaceholder with fake chat history.
// Goal:
// 1. Insert old messages inside ChatPromptTemplate
// 2. Add current question after history
// 3. Send final messages to model

import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { chatHistoryPromptTemplate } from "../../prompts/templates/chatHistoryPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create chat model from provider layer.
const model = createChatModel();

// Fake history.
// Later this can come from your conversationMemory.js.
const history = [
  new HumanMessage("What is RAG?"),
  new AIMessage("RAG means Retrieval-Augmented Generation."),
  new HumanMessage("What is vector store?"),
  new AIMessage("A vector store keeps embeddings searchable."),
];

// Current user question.
// Notice: "it" depends on previous history.
const question = "Why is it useful in RAG?";

// Fill prompt variables.
// history goes into MessagesPlaceholder("history")
// question goes into {question}
const promptValue = await chatHistoryPromptTemplate.invoke({
  history,
  question,
});

// Convert prompt value into final messages.
const messages = promptValue.toChatMessages();

console.log("\n--- FINAL MESSAGES WITH HISTORY ---");
console.log(messages);

// Send messages to model.
const response = await model.invoke(messages);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);