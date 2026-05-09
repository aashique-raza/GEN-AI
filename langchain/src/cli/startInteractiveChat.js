import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { env } from "../config/env.js";
import { createChatModel } from "../providers/chatProvider.js";
import { buildBasicChatMessages } from "../prompts/basicChatMessages.js";

// * This function starts an interactive command-line chat.
// * It keeps the process running so we do not restart the server again and again.
export async function startInteractiveChat() {
  console.log("LangChain Interactive Chat Started");
  console.log("Type your question and press Enter.");
  console.log("Type 'exit' to stop.\n");

  // * Create the model only once.
  // ! Do not create a new model object for every question.
  const model = createChatModel();

  // * Create readline interface for terminal input/output.
  const rl = readline.createInterface({ input, output });

  console.log("Current provider config:");
  console.log({
    chatProvider: env.CHAT_PROVIDER,
    groqModel: env.GROQ_MODEL,
    embeddingProvider: env.EMBEDDING_PROVIDER,
  });

  while (true) {
    // * Ask user for input in terminal.
    const userInput = await rl.question("\nYou: ");

    // * Clean extra spaces from input.
    const cleanInput = userInput.trim();

    // ! Empty question should not call the model.
    if (!cleanInput) {
      console.log("Please type a question.");
      continue;
    }

    // * Exit condition.
    if (cleanInput.toLowerCase() === "exit") {
      console.log("Chat stopped.");
      break;
    }

    try {
      // * Convert raw user input into LangChain messages.
      const messages = buildBasicChatMessages(cleanInput);

      // * Send messages to chat model.
      // * model.invoke() returns AIMessage object.
      const response = await model.invoke(messages);

      // * Print only useful answer text.
      console.log("\nAI:");
      console.log(response.content);
    } catch (error) {
      // ! Clean error handling for API key, quota, model, or network issues.
      console.error("\nModel call failed:");
      console.error(error.message);
    }
  }

  // * Close terminal input interface.
  rl.close();
}