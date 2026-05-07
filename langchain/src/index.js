import { env } from "./config/env.js";
import { createChatModel } from "./providers/chatProvider.js";

console.log("LangChain RAG project started.");

console.log("Current provider config:");
console.log({
  chatProvider: env.CHAT_PROVIDER,
  groqModel: env.GROQ_MODEL,
  hfModel: env.HF_MODEL,
  embeddingProvider: env.EMBEDDING_PROVIDER,
});

const model = createChatModel();

console.log("Chat model factory test passed.");
console.log("Model object created for provider:", env.CHAT_PROVIDER);