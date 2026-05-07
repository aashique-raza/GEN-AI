import { env } from "./config/env.js";

console.log("LangChain RAG project started.");

console.log("Current provider config:");
console.log({
  chatProvider: env.CHAT_PROVIDER,
  groqModel: env.GROQ_MODEL,
  hfModel: env.HF_MODEL,
  embeddingProvider: env.EMBEDDING_PROVIDER,
});