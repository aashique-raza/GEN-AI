import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Model direct yaha create nahi karna.
// ChatGroq/Gemini/HF/Ollama selection provider layer handle karega.
import { createChatModel } from "../providers/chatProvider.js";


const model = createChatModel();

// Step 2: Prompt template
// Raw RAG mapping: manual prompt string ka LangChain version.
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a helpful Hinglish AI tutor.
Explain answers in short, practical, beginner-friendly language.`,
  ],
  ["human", "Question: {question}"],
]);

// Step 3: Parser
// Model ka AIMessage output clean string me convert hoga.
const parser = new StringOutputParser();

// Step 4: LCEL serial chain
// prompt output -> model input -> parser input
const chain = prompt.pipe(model).pipe(parser);

// Step 5: Run chain
const answer = await chain.invoke({
  question: "LCEL ko raw JavaScript function chaining se compare karke samjhao.",
});

console.log("\n--- FINAL ANSWER ---\n");
console.log('graph chain',chain.getGraph());
console.log(answer);