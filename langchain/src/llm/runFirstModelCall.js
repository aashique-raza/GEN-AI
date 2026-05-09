import { createChatModel } from "../providers/chatProvider.js";
import { getFirstModelCallMessages } from "../prompts/firstModelCallMessages.js";

// * This function runs our first LangChain chat model call.
// * It is separate from index.js so index.js stays clean and thin.
export async function runFirstModelCall() {
  // * Create chat model using provider factory.
  // * Currently this should return ChatGroq because CHAT_PROVIDER=groq.
  const model = createChatModel();

  // * Get system + user messages from prompt file.
  // ! LangChain chat models expect messages in role/content format.
  const messages = getFirstModelCallMessages();

  // * Send messages to the model.
  // * model.invoke() returns an AIMessage object, not a plain string.
  const response = await model.invoke(messages);

  // * Return full response so we can inspect AIMessage in index.js.
  return response;
}