// This file tests structured output with JsonOutputParser.
// Goal:
// 1. Ask model to return JSON only
// 2. Parse model output into JS object
// 3. Print parsed object

import { JsonOutputParser } from "@langchain/core/output_parsers";
import { structuredOutputPromptTemplate } from "../../prompts/templates/structuredOutputPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create chat model from provider layer.
const model = createChatModel();

// JsonOutputParser converts model JSON text into a real JS object.
const parser = new JsonOutputParser();

// Fake RAG context.
// Later this will come from retriever.
const context = `
RAG means Retrieval-Augmented Generation.
It retrieves relevant context before generating an answer.
`;

// User question.
const question = "What is RAG?";

// Fill prompt variables.
const promptValue = await structuredOutputPromptTemplate.invoke({
  question,
  context,
});

// Convert prompt to chat messages.
const messages = promptValue.toChatMessages();

console.log("\n--- STRUCTURED OUTPUT MESSAGES ---");
console.log(messages);

// Get model response.
const response = await model.invoke(messages);

console.log("\n--- RAW MODEL RESPONSE ---");
console.log(response.content);

// Parse JSON string into JS object.
const parsedOutput = await parser.invoke(response.content);

console.log("\n--- PARSED JS OBJECT ---");
console.log(parsedOutput);

console.log("\n--- DIRECT FIELD ACCESS ---");
console.log("Answer:", parsedOutput.answer);
console.log("Confidence:", parsedOutput.confidence);
console.log("Reason:", parsedOutput.reason);