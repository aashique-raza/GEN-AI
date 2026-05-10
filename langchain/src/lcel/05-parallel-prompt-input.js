// src/lcel/05-parallel-prompt-input.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda, RunnableParallel } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();

// Fake docs: abhi real retriever nahi hai.
// Session 4/5 ke baad yahi real retrieved docs banenge.
const fakeDocs = [
  {
    pageContent:
      "LCEL means LangChain Expression Language. It connects prompt, model, parser, retriever, and custom functions into a pipeline.",
    metadata: {
      source: "fake-doc-1",
      topic: "lcel",
    },
  },
  {
    pageContent:
      "RunnableParallel can prepare multiple values at the same time, such as question and context for a RAG prompt.",
    metadata: {
      source: "fake-doc-2",
      topic: "runnable-parallel",
    },
  },
];

// Raw RAG mapping: formatContext(docs)
function formatDocs(docs) {
  return docs
    .map((doc, index) => {
      return `Source ${index + 1}:\n${doc.pageContent}`;
    })
    .join("\n\n---\n\n");
}

// Branch 1: original question ko preserve karo
const questionStep = RunnableLambda.from((input) => {
  return input.question;
});

// Branch 2: docs ko context string me convert karo
const contextStep = RunnableLambda.from(() => {
  return formatDocs(fakeDocs);
});

// Parallel step ka output prompt ke liye ready object banega:
// {
//   question: "...",
//   context: "..."
// }
const preparePromptInput = RunnableParallel.from({
  question: questionStep,
  context: contextStep,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a strict RAG tutor.
Answer only from the given context.
If answer is not in context, say: "Context me answer nahi mila."`,
  ],
  [
    "human",
    `Context:
{context}

Question:
{question}`,
  ],
]);

// Flow:
// input question -> prepare { question, context } -> prompt -> model -> parser
const chain = preparePromptInput.pipe(prompt).pipe(model).pipe(parser);

const answer = await chain.invoke({
  question: "LCEL me RunnableParallel ka use RAG me kyu hota hai?",
});

console.log("\n--- FINAL ANSWER ---\n");
console.log(answer);