import { env } from "../config/env.js";

export function createEmbeddings(provider = env.EMBEDDING_PROVIDER) {
  if (provider === "gemini") {
    throw new Error("Gemini embeddings not implemented yet. This will come in Session 6.");
  }

  if (provider === "hf") {
    throw new Error("Hugging Face embeddings not implemented yet. This will come in Session 6.");
  }

  if (provider === "ollama") {
    throw new Error("Ollama/local embeddings not implemented yet. This will come in Session 6.");
  }

  throw new Error(`Unsupported EMBEDDING_PROVIDER: ${provider}`);
}