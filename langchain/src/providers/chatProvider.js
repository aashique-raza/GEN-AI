import { ChatGroq } from "@langchain/groq";
import { env } from "../config/env.js";

export function createChatModel(provider = env.CHAT_PROVIDER) {
  if (provider === "groq") {
    if (!env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY missing in .env");
    }

    return new ChatGroq({
      apiKey: env.GROQ_API_KEY,
      model: env.GROQ_MODEL,
      temperature: 0,
    });
  }

  if (provider === "hf") {
    throw new Error("Hugging Face chat provider not implemented yet.");
  }

  if (provider === "openrouter") {
    throw new Error("OpenRouter chat provider not implemented yet.");
  }

  if (provider === "ollama") {
    throw new Error("Ollama chat provider not implemented yet.");
  }

  throw new Error(`Unsupported CHAT_PROVIDER: ${provider}`);
}