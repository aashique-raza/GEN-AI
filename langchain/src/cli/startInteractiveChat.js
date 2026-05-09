import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import { env } from "../config/env.js";
import { createChatModel } from "../providers/chatProvider.js";
import { buildBasicChatMessages } from "../prompts/basicChatMessages.js";

// * This function starts an interactive command-line chat.
// * It keeps the app running so we can test model settings without restarting.
export async function startInteractiveChat() {
  console.log("LangChain Interactive Chat Started");
  console.log("Type your question and press Enter.");
  console.log("Commands:");
  console.log("  /temp 0        -> stable answer");
  console.log("  /temp 0.7      -> more natural answer");
  console.log("  /tokens 50     -> short answer limit");
  console.log("  /tokens 150    -> longer answer limit");
  console.log("  /tokens none   -> remove custom token limit");
  console.log("  /config        -> show current model config");
  console.log("  exit           -> stop chat\n");

  // * Runtime model settings.
  // * These can change while CLI is running.
  let currentTemperature = 0;
  let currentMaxTokens = undefined;

  // * Helper function to create/recreate model with current settings.
  // ! Recreate model only when config changes, not for every question.
  function buildModel() {
    return createChatModel({
      temperature: currentTemperature,
      maxTokens: currentMaxTokens,
    });
  }

  // * Create initial model.
  let model = buildModel();

  // * Create terminal input/output interface.
  const rl = readline.createInterface({ input, output });

  console.log("Current provider config:");
  console.log({
    chatProvider: env.CHAT_PROVIDER,
    groqModel: env.GROQ_MODEL,
    embeddingProvider: env.EMBEDDING_PROVIDER,
    temperature: currentTemperature,
    maxTokens: currentMaxTokens ?? "none",
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

    // * Show current config.
    if (cleanInput === "/config") {
      console.log("Current model config:");
      console.log({
        provider: env.CHAT_PROVIDER,
        model: env.GROQ_MODEL,
        temperature: currentTemperature,
        maxTokens: currentMaxTokens ?? "none",
      });
      continue;
    }

    // * Temperature command: /temp 0.7
    if (cleanInput.startsWith("/temp")) {
      const parts = cleanInput.split(" ");
      const nextTemperature = Number(parts[1]);

      // ! Reject invalid temperature.
      if (Number.isNaN(nextTemperature)) {
        console.log("Invalid temperature. Example: /temp 0.7");
        continue;
      }

      // ! Keep range controlled for learning.
      if (nextTemperature < 0 || nextTemperature > 2) {
        console.log("Temperature should be between 0 and 2.");
        continue;
      }

      currentTemperature = nextTemperature;
      model = buildModel();

      console.log(`Temperature changed to ${currentTemperature}`);
      continue;
    }

    // * Token command: /tokens 50 OR /tokens none
    if (cleanInput.startsWith("/tokens")) {
      const parts = cleanInput.split(" ");
      const tokenValue = parts[1];

      // * Remove custom token limit.
      if (tokenValue === "none") {
        currentMaxTokens = undefined;
        model = buildModel();

        console.log("Max token limit removed.");
        continue;
      }

      const nextMaxTokens = Number(tokenValue);

      // ! Reject invalid token values.
      if (Number.isNaN(nextMaxTokens)) {
        console.log("Invalid token value. Example: /tokens 100 or /tokens none");
        continue;
      }

      // ! Very tiny token limit can cut answers badly.
      if (nextMaxTokens < 10) {
        console.log("Max tokens should be at least 10.");
        continue;
      }

      currentMaxTokens = nextMaxTokens;
      model = buildModel();

      console.log(`Max tokens changed to ${currentMaxTokens}`);
      continue;
    }

    try {
      // * Convert user input into LangChain messages.
      const messages = buildBasicChatMessages(cleanInput);

      // * Send messages to model.
      const response = await model.invoke(messages);

      // * Print final answer text.
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