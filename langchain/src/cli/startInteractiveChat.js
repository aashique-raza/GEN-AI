import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { env } from "../config/env.js";
import { createChatModel } from "../providers/chatProvider.js";
import { buildBasicChatMessages } from "../prompts/basicChatMessages.js";

// * This function starts an interactive command-line chat.
// * It keeps the app running so we can ask many questions without restarting.
export async function startInteractiveChat() {
  console.log("LangChain Interactive Chat Started");
  console.log("Type your question and press Enter.");
  console.log("Commands:");
  console.log("  /temp 0      -> stable answer");
  console.log("  /temp 0.7    -> more natural answer");
  console.log("  /temp 1      -> more random answer");
  console.log("  /config      -> show current model config");
  console.log("  exit         -> stop chat\n");

  // * CLI state: current temperature used for model calls.
  // * Start with 0 because RAG needs stable grounded output.
  let currentTemperature = 0;

  // * Create model once using current temperature.
  // ! We recreate model only when temperature changes, not for every question.
  let model = createChatModel({
    temperature: currentTemperature,
  });

  // * Create readline interface for terminal input/output.
  const rl = readline.createInterface({ input, output });

  // * Print initial provider config.
  console.log("Current provider config:");
  console.log({
    chatProvider: env.CHAT_PROVIDER,
    groqModel: env.GROQ_MODEL,
    embeddingProvider: env.EMBEDDING_PROVIDER,
    temperature: currentTemperature,
  });

  while (true) {
    const userInput = await rl.question("\nYou: ");
    const cleanInput = userInput.trim();

    // ! Empty input should not call the model.
    if (!cleanInput) {
      console.log("Please type a question.");
      continue;
    }

    // * Exit command.
    if (cleanInput.toLowerCase() === "exit") {
      console.log("Chat stopped.");
      break;
    }

    // * Show current model config without calling the LLM.
    if (cleanInput === "/config") {
      console.log("Current model config:");
      console.log({
        provider: env.CHAT_PROVIDER,
        model: env.GROQ_MODEL,
        temperature: currentTemperature,
      });
      continue;
    }

    // * Temperature command format: /temp 0.7
    if (cleanInput.startsWith("/temp")) {
      const parts = cleanInput.split(" ");
      const nextTemperature = Number(parts[1]);

      // ! Reject invalid temperature values.
      if (Number.isNaN(nextTemperature)) {
        console.log("Invalid temperature. Example: /temp 0.7");
        continue;
      }

      // ! Keep range controlled for learning.
      if (nextTemperature < 0 || nextTemperature > 2) {
        console.log("Temperature should be between 0 and 2.");
        continue;
      }

      // * Update CLI state.
      currentTemperature = nextTemperature;

      // * Recreate model with new temperature.
      model = createChatModel({
        temperature: currentTemperature,
      });

      console.log(`Temperature changed to ${currentTemperature}`);
      continue;
    }

    try {
      // * Convert user input into LangChain messages.
      const messages = buildBasicChatMessages(cleanInput);

      // * Send messages to chat model.
      const response = await model.invoke(messages);

      // * Print only final answer content.
      console.log("\nAI:");
      console.log(response.content);
    } catch (error) {
      // ! Clean provider/API/model error handling.
      console.error("\nModel call failed:");
      console.error(error.message);
    }
  }

  // * Close terminal interface.
  rl.close();
}