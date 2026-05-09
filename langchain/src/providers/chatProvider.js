import { ChatGroq } from "@langchain/groq";
import { env } from "../config/env.js";

// * This function creates a chat model based on the active provider.
// * options allows us to override model behavior like temperature.
// TODO: Later we can add maxTokens, timeout, retries, etc.
export function createChatModel(options = {}) {
  // * Default temperature is 0 because we want stable answers for RAG learning.
  const temperature = options.temperature ?? 0;

  if (env.CHAT_PROVIDER === "groq") {
    return new ChatGroq({
      // ! API key should come only from env. Never hard-code secrets.
      apiKey: env.GROQ_API_KEY,

      // * Model name comes from .env so we can switch models without code changes.
      model: env.GROQ_MODEL,

      // * Temperature controls randomness/creativity of model output.
      temperature,
    });
  }

  // ! If provider is unsupported, fail clearly.
  throw new Error(`Unsupported chat provider: ${env.CHAT_PROVIDER}`);
}