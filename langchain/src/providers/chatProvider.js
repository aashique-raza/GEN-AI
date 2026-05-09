import { ChatGroq } from "@langchain/groq";
import { env } from "../config/env.js";

// * This function creates a chat model based on the active provider.
// * options lets us control model behavior without hard-coding values.
// TODO: Later we can add provider fallback: Groq -> Gemini -> HF -> Ollama.
export function createChatModel(options = {}) {
  // * Temperature controls randomness.
  // * 0 = stable, focused, best for RAG.
  const temperature = options.temperature ?? 0;

  // * maxTokens controls maximum output length.
  // * undefined means we are not forcing a custom output token limit.
  const maxTokens = options.maxTokens ?? undefined;

  // * maxRetries controls how many times LangChain retries failed API calls.
  const maxRetries = options.maxRetries ?? 2;

  if (env.CHAT_PROVIDER === "groq") {
    return new ChatGroq({
      // ! Never hard-code API keys.
      apiKey: env.GROQ_API_KEY,

      // * Model name comes from .env for easy switching.
      model: env.GROQ_MODEL,

      // * Controls randomness/creativity.
      temperature,

      // * Controls maximum answer length.
      maxTokens,

      // * Retries temporary provider/network failures.
      maxRetries,
    });
  }

  // ! Clear error if unsupported provider is selected.
  throw new Error(`Unsupported chat provider: ${env.CHAT_PROVIDER}`);
}