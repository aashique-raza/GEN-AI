import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { runModelCallWithDebug } from "../debug/modelCallDebug.js";

import { env } from "../config/env.js";
import { createChatModel } from "../providers/chatProvider.js";
import { buildBasicChatMessages } from "../prompts/basicChatMessages.js";
import { getAvailableChatModes } from "../prompts/chatModes.js";

import {
  addAIMessage,
  addUserMessage,
  clearConversationHistory,
  getConversationHistory,
  getConversationHistoryStats,
} from "../memory/conversationMemory.js";

// * This function starts an interactive command-line chat.
// * It lets us test model settings without restarting the app.
export async function startInteractiveChat() {
  console.log("LangChain Interactive Chat Started");
  console.log("Type your question and press Enter.");
  let debugMode = false;
  console.log("Commands:");
  console.log("  /temp 0          -> stable answer");
  console.log("  /temp 0.7        -> more natural answer");
  console.log("  /tokens 50       -> short answer limit");
  console.log("  /tokens 150      -> longer answer limit");
  console.log("  /tokens none     -> remove custom token limit");
  console.log("  /mode tutor      -> simple Hinglish tutor mode");
  console.log("  /mode strict     -> strict mentor mode");
  console.log("  /mode interviewer -> interview-style mode");
  console.log("  /mode concise    -> very short answer mode");
  console.log("  /modes           -> show available modes");
  console.log("  /debug on       -> show model metadata after each answer");
  console.log("  /debug off      -> hide model metadata");
  console.log("  /mode genai      -> GenAI/LangChain/RAG mentor mode");
  console.log("  /history        -> show chat history stats");
  console.log("  /clear          -> clear chat history");
  console.log("  /config          -> show current model config");
  console.log("  exit             -> stop chat\n");

  // * Runtime model settings.
  let currentTemperature = 0;
  let currentMaxTokens = undefined;

  // * Runtime prompt behavior mode.
  // * This affects system message, not model provider.
  let currentMode = "genai";

  // * Create/recreate model with current model settings.
  function buildModel() {
    return createChatModel({
      temperature: currentTemperature,
      maxTokens: currentMaxTokens,
    });
  }

  // * Initial model object.
  let model = buildModel();

  // * Terminal input/output interface.
  const rl = readline.createInterface({ input, output });

  console.log("Current provider config:");
  console.log({
    provider: env.CHAT_PROVIDER,
    model: env.GROQ_MODEL,
    temperature: currentTemperature,
    maxTokens: currentMaxTokens ?? "none",
    mode: currentMode,
    debugMode,
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
        mode: currentMode,
      });
      continue;
    }

    // * Show available chat modes.
    if (cleanInput === "/modes") {
      console.log("Available modes:");
      console.log(getAvailableChatModes());
      continue;
    }

    // * Change chat behavior mode.
    // * Example: /mode strict
    if (cleanInput.startsWith("/mode")) {
      const parts = cleanInput.split(" ");
      const nextMode = parts[1];

      // ! Mode name is required.
      if (!nextMode) {
        console.log("Invalid mode. Example: /mode strict");
        continue;
      }

      const availableModes = getAvailableChatModes();

      // ! Reject unsupported mode.
      if (!availableModes.includes(nextMode)) {
        console.log(`Unsupported mode: ${nextMode}`);
        console.log("Available modes:", availableModes);
        continue;
      }

      // * Update current prompt behavior mode.
      // * No need to recreate model because mode only changes messages.
      currentMode = nextMode;

      console.log(`Chat mode changed to: ${currentMode}`);
      continue;
    }

    // * Temperature command: /temp 0.7
    if (cleanInput.startsWith("/temp")) {
      const parts = cleanInput.split(" ");
      const nextTemperature = Number(parts[1]);

      if (Number.isNaN(nextTemperature)) {
        console.log("Invalid temperature. Example: /temp 0.7");
        continue;
      }

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

      if (tokenValue === "none") {
        currentMaxTokens = undefined;
        model = buildModel();

        console.log("Max token limit removed.");
        continue;
      }

      const nextMaxTokens = Number(tokenValue);

      if (Number.isNaN(nextMaxTokens)) {
        console.log(
          "Invalid token value. Example: /tokens 100 or /tokens none",
        );
        continue;
      }

      if (nextMaxTokens < 10) {
        console.log("Max tokens should be at least 10.");
        continue;
      }

      currentMaxTokens = nextMaxTokens;
      model = buildModel();

      console.log(`Max tokens changed to ${currentMaxTokens}`);
      continue;
    }

    // * Debug command: /debug on OR /debug off
    if (cleanInput.startsWith("/debug")) {
      const parts = cleanInput.split(" ");
      const nextValue = parts[1];

      // ! Only allow on/off values.
      if (nextValue !== "on" && nextValue !== "off") {
        console.log("Invalid debug command. Example: /debug on or /debug off");
        continue;
      }

      // * Turn debug mode on/off.
      debugMode = nextValue === "on";

      console.log(`Debug mode: ${debugMode ? "ON" : "OFF"}`);
      continue;
    }

    // * Show current conversation history stats.
    if (cleanInput === "/history") {
      console.log("Conversation history stats:");
      console.log(getConversationHistoryStats());

      console.log("\nSaved messages:");
      console.dir(getConversationHistory(), { depth: null });

      continue;
    }
    // * Clear conversation history.
    if (cleanInput === "/clear") {
      clearConversationHistory();
      console.log("Conversation history cleared.");
      continue;
    }

    try {
      // * Get previous conversation history before current question.
      const history = getConversationHistory();

      // * Build messages using:
      // * system prompt + previous history + current user input.
      const messages = buildBasicChatMessages(cleanInput, currentMode, history);

      // * Run model call with debug wrapper.
      const { response, debugInfo } = await runModelCallWithDebug({
        model,
        messages,
      });

      // * Extract final answer.
      const aiAnswer = response.content;

      // * Print final answer text.
      console.log("\nAI:");
      console.log(aiAnswer);

      // * Save current turn into memory.
      // ! Save only after successful model response.
      addUserMessage(cleanInput);
      addAIMessage(aiAnswer);

      // * Print debug info only when debug mode is ON.
      if (debugMode) {
        console.log("\n--- MODEL DEBUG ---");
        console.log({
          provider: env.CHAT_PROVIDER,
          model: env.GROQ_MODEL,
          temperature: currentTemperature,
          maxTokens: currentMaxTokens ?? "none",
          mode: currentMode,
          history: getConversationHistoryStats(),
          latencyMs: debugInfo.latencyMs,
          contentLength: debugInfo.contentLength,
          responseMetadata: debugInfo.responseMetadata,
          usageMetadata: debugInfo.usageMetadata,
        });
      }
    } catch (error) {
      // ! Clean provider/API/model error handling.
      console.error("\nModel call failed:");
      console.error(error.message);
    }
  }

  // * Close terminal interface.
  rl.close();
}
