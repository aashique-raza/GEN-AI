// This file is only for testing PromptTemplate.
// No model call here.
// First we only want to see how LangChain generates the final prompt text.

import {
  staticRagPrompt,
  dynamicTopicPrompt,
} from "../../prompts/templates/simplePromptTemplate.js";

// Test 1: Static prompt
const staticPromptValue = await staticRagPrompt.invoke({});
console.log('staticPromptValue',staticPromptValue)

// .toString() converts LangChain PromptValue into plain text.
console.log("\n--- STATIC PROMPT ---");
console.log(staticPromptValue.toString());

// Test 2: Dynamic prompt
const dynamicPromptValue = await dynamicTopicPrompt.invoke({
  topic: "Vector Store",
});
console.log('dynamicPromptValue',dynamicPromptValue)

console.log("\n--- DYNAMIC PROMPT ---");
console.log(dynamicPromptValue.toString());