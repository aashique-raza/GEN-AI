// src/lcel/04-parallel-chain.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();

// Chain 1: short explanation
const explainPrompt = ChatPromptTemplate.fromMessages([
   [ "system",
    `You are explaining LangChain JavaScript LCEL.
LCEL means LangChain Expression Language.
Do not explain Java, concurrency libraries, or unrelated topics.
Answer in Hinglish, max 3 short lines.`,
  ],
  ["human", "Explain this topic: {topic}"],
]);

const explainChain = explainPrompt.pipe(model).pipe(parser);

// Chain 2: keywords extraction
const keywordPrompt = ChatPromptTemplate.fromMessages([
  ["system", "Extract only 5 important keywords. No explanation."],
  ["human", "Topic: {topic}"],
]);

const keywordChain = keywordPrompt.pipe(model).pipe(parser);

// Parallel runnable
// Same input { topic } dono chains ko milega.
const parallelChain = RunnableParallel.from({
  explanation: explainChain,
  keywords: keywordChain,
});

const result = await parallelChain.invoke({
  topic: "LCEL RunnableParallel",
});

console.log("\n--- EXPLANATION ---\n");
console.log(result.explanation);

console.log("\n--- KEYWORDS ---\n");
console.log(result.keywords);