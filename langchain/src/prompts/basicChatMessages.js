import { getSystemPromptByMode } from "./chatModes.js";

// * This function builds messages for a basic chat model call.
// * LangChain chat models expect messages in role/content format.
// ! role must be "system" and "user".
export function buildBasicChatMessages(userInput, mode = "tutor") {
  return [
    {
      role: "system",

      // * System prompt controls model behavior.
      // * Example modes: tutor, strict, interviewer, concise.
      content: getSystemPromptByMode(mode),
    },
    {
      role: "user",

      // * User message is the actual question typed in CLI.
      content: userInput,
    },
  ];
}