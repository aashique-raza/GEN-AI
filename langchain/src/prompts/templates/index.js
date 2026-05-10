// Central export file for all prompt templates.
// Benefit:
// Other files can import prompts from one clean location.
//
// Example:
// import { ragPromptTemplate } from "../../prompts/templates/index.js";

export {
  staticRagPrompt,
  dynamicTopicPrompt,
} from "./simplePromptTemplate.js";

export { basicChatPromptTemplate } from "./chatPromptTemplate.js";

export { controlledPromptTemplate } from "./controlledPromptTemplate.js";

export { ragPromptTemplate } from "./ragPromptTemplate.js";

export { chatHistoryPromptTemplate } from "./chatHistoryPromptTemplate.js";

export { fewShotTopicPromptTemplate } from "./fewShotPromptTemplate.js";

export { structuredOutputPromptTemplate } from "./structuredOutputPromptTemplate.js";