// This file tests partial prompt variables.
// Goal:
// 1. Fix {language} once using .partial()
// 2. Pass only {topic} at runtime
// 3. Send final prompt to model

import { createHinglishExplanationPrompt } from "../../prompts/templates/partialPromptTemplate.js";
import { createChatModel } from "../../providers/chatProvider.js";

// Create model using provider abstraction.
const model = createChatModel();

// Create partial prompt.
// language = already fixed inside this prompt.
const hinglishPrompt = await createHinglishExplanationPrompt();

// Now we only need to pass topic.
const promptValue = await hinglishPrompt.invoke({
  topic: "Partial Prompt Template",
});

const finalPromptText = promptValue.toString();

console.log("\n--- PARTIAL PROMPT SENT TO MODEL ---");
console.log(finalPromptText);

// Send generated prompt to model.
const response = await model.invoke(finalPromptText);

console.log("\n--- MODEL RESPONSE ---");
console.log(response.content);