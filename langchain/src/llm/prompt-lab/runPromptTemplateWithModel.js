// This file tests PromptTemplate with an actual chat model.
// Goal:
// 1. Generate final prompt text from PromptTemplate
// 2. Send that final prompt text to the model
// 3. Print AIMessage.content

import { dynamicTopicPrompt } from "../../prompts/templates/simplePromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create model using existing provider abstraction.
// This keeps Groq config inside providers/chatProvider.js.
const model = createChatModel();

// Step 1: Generate final prompt from template
const promptValue = await dynamicTopicPrompt.invoke({
  topic: "Vector Store",
});

// Convert PromptValue into plain text.
// This is what we will send to the model.
const finalPromptText = promptValue.toString();

console.log("\n--- FINAL PROMPT SENT TO MODEL ---");
console.log(finalPromptText);

// Step 2: Send final prompt text to model
const response = await model.invoke(finalPromptText);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);