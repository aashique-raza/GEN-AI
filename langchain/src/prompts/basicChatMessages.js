import { getSystemPromptByMode } from "./chatModes.js";

// * This function builds messages for a basic chat model call.
// * It includes:
// * 1. system message
// * 2. previous conversation history
// * 3. latest user question
// ! LangChain chat models understand role/content message format.
export function buildBasicChatMessages(userInput, mode = "genai", history = []) {
  return [
    {
      role: "system",

      // * System prompt controls model behavior.
      content: getSystemPromptByMode(mode),
    },

    // * Previous conversation messages.
    // * This lets the model understand follow-up questions like:
    // * "isme retriever ka role kya hai?"
    ...history,

    {
      role: "user",

      // * Latest user question.
      content: userInput,
    },
  ];
}