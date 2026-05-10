// This file tests FewShotPromptTemplate with model call.
// Goal:
// 1. Show examples to the model
// 2. Ask a new topic
// 3. Check whether answer follows example style

import { fewShotTopicPromptTemplate } from "../../prompts/templates/fewShotPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create chat model from provider layer.
const model = createChatModel();

// Fill current input topic.
const promptValue = await fewShotTopicPromptTemplate.invoke({
  topic: "PromptTemplate",
});

// FewShotPromptTemplate returns a string-style prompt value.
const finalPromptText = promptValue.toString();

console.log("\n--- FEW-SHOT PROMPT SENT TO MODEL ---");
console.log(finalPromptText);

// Send final prompt text to model.
const response = await model.invoke(finalPromptText);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);