// src/lcel/07-mini-rag-style-chain.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableLambda,
  RunnableParallel,
  RunnableSequence,
} from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();

/**
 * Fake documents
 * Session 4 ke baad ye real LangChain Document objects honge.
 */
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
      "In RAG, retrieved documents are formatted into context and then sent to the model with the user question.",
    metadata: {
      source: "fake-doc-2",
      topic: "rag",
    },
  },
];

/**
 * Fake retriever
 * Raw RAG mapping: retrieve(question)
 */
function fakeRetrieve(question) {
  console.log("\n--- RETRIEVER INPUT ---");
  console.log(question);

  // Abhi hardcoded docs return kar rahe hain.
  // Future me yaha vectorStore similarity search hoga.
  return fakeDocs;
}

/**
 * Raw RAG mapping: formatContext(docs)
 */
function formatDocs(docs) {
  return docs
    .map((doc, index) => {
      return `Source ${index + 1}:
${doc.pageContent}`;
    })
    .join("\n\n---\n\n");
}

/**
 * Step 1:
 * Question se docs retrieve karo,
 * context banao,
 * sources preserve karo.
 */
const prepareRagInput = RunnableLambda.from((input) => {
  const docs = fakeRetrieve(input.question);

  return {
    question: input.question,
    context: formatDocs(docs),
    sources: docs.map((doc) => doc.metadata),
  };
});

/**
 * Grounded RAG prompt
 */
const ragPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a strict RAG assistant.
Answer only from the given context.
If the answer is not present in context, say: "Context me answer nahi mila."
Keep the answer short and practical.`,
  ],
  [
    "human",
    `Context:
{context}

Question:
{question}`,
  ],
]);

/**
 * Answer chain:
 * { question, context } -> prompt -> model -> parser
 */
const answerChain = RunnableSequence.from([
  RunnableLambda.from((input) => {
    return {
      question: input.question,
      context: input.context,
    };
  }),
  ragPrompt,
  model,
  parser,
]);

/**
 * Final RAG-style chain:
 *
 * input question
 * ↓
 * prepareRagInput
 * ↓
 * parallel output:
 *   - answer
 *   - sources
 */
const miniRagChain = prepareRagInput.pipe(
  RunnableParallel.from({
    answer: answerChain,

    // Sources ko model ke paas nahi bhejna.
    // Direct final response me return karna.
    sources: RunnableLambda.from((input) => input.sources),
  })
);

const result = await miniRagChain.invoke({
  question: "RAG me retrieved documents ka use kaise hota hai?",
});

console.log("\n--- FINAL ANSWER ---\n");
console.log(result.answer);

console.log("\n--- SOURCES ---\n");
console.dir(result.sources, { depth: null });