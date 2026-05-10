// src/lcel/02-debug-chain-steps.js


import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createChatModel } from "../providers/chatProvider.js";

// Model provider file se aa raha hai.
// LCEL file ka kaam sirf chain/debug logic hai.
const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful Hinglish AI tutor. Keep answers short and practical.",
  ],
  ["human", "Question: {question}"],
]);

const parser = new StringOutputParser();

const input = {
  question: "LCEL me pipe ka role kya hai?",
};

// 1. Prompt step manually run
const promptOutput = await prompt.invoke(input);

console.log("\n--- 1. PROMPT OUTPUT ---\n");
console.dir(promptOutput.toChatMessages(), { depth: null });

// 2. Model step manually run
const modelOutput = await model.invoke(promptOutput);

console.log("\n--- 2. MODEL OUTPUT ---\n");
console.dir(modelOutput, { depth: null });

// 3. Parser step manually run
const parserOutput = await parser.invoke(modelOutput);

console.log("\n--- 3. PARSER OUTPUT ---\n");
console.log(parserOutput);

// 4. Same thing using LCEL chain
const chain = prompt.pipe(model).pipe(parser);

const finalAnswer = await chain.invoke(input);

console.log("\n--- 4. FINAL CHAIN OUTPUT ---\n");
console.log(finalAnswer);