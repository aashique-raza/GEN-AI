// src/lcel/03-runnable-lambda.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful Hinglish AI tutor. Keep answers short and practical.",
  ],
  ["human", "Question: {question}"],
]);

const parser = new StringOutputParser();

// Custom JS function as LCEL step
// Input:  { question: "   LCEL    kya hai?   " }
// Output: { question: "LCEL kya hai?" }
const cleanQuestionStep = RunnableLambda.from((input) => {
  return {
    question: input.question.trim().replace(/\s+/g, " "),
  };
});

// Flow:
// raw input -> cleanQuestionStep -> prompt -> model -> parser
const chain = cleanQuestionStep.pipe(prompt).pipe(model).pipe(parser);

const answer = await chain.invoke({
  question: "     LCEL       me RunnableLambda       ka role kya hai?     ",
});

console.log("\n--- FINAL ANSWER ---\n");
console.log(answer);