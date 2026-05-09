import { env } from "./config/env.js";
import { runFirstModelCall } from "./llm/runFirstModelCall.js";

// * main() is the entry point of our LangChain learning app.
// * Keep index.js thin: no model creation, no prompt building, no heavy logic here.
async function main() {
  console.log("LangChain RAG project started.");

  // * Print current provider config so we know which model/provider is active.
  // ! Never print API keys in console.
  console.log("Current provider config:");
  console.log({
    chatProvider: env.CHAT_PROVIDER,
    groqModel: env.GROQ_MODEL,
    hfModel: env.HF_MODEL,
    embeddingProvider: env.EMBEDDING_PROVIDER,
  });

  // * Run our first LangChain model call.
  // * This returns an AIMessage object.
  const response = await runFirstModelCall();

  // ? Why print full response first?
  // * To understand that LangChain returns AIMessage, not plain text.
  console.log("\nFull AIMessage response:");
  console.dir(response, { depth: null });

  // * This is the actual answer text we normally need.
  console.log("\nOnly answer content:");
  console.log(response.content);
}

// * Global error handler for this entry file.
// ! If API key/model/quota is wrong, error will come here.
main().catch((error) => {
  console.error("\nModel call failed:");
  console.error(error.message);
});