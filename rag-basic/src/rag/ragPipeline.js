import { ai } from "../config/gemini.js";
import { loadTextDocument } from "../loaders/textLoader.js";
import { splitTextIntoChunks } from "../splitters/textSplitter.js";
import {
  createEmbedding,
  createEmbeddings,
} from "../embeddings/embeddingService.js";
import { MemoryVectorStore } from "../vectorStore/memoryVectorStore.js";

const GENERATION_MODEL = "gemini-2.5-flash-lite";

function buildContext(retrievedChunks) {
  return retrievedChunks
    .map((chunk, index) => {
      return `
Source ${index + 1}:
Class: ${chunk.metadata.classLevel}
Subject: ${chunk.metadata.subject}
Chapter: ${chunk.metadata.chapter}
Chunk Index: ${chunk.metadata.chunkIndex}

Content:
${chunk.pageContent}
`;
    })
    .join("\n-------------------\n");
}

export async function generateRagAnswer({ question, retrievedChunks }) {
  if (!question) {
    throw new Error("Question is required");
  }

  if (!Array.isArray(retrievedChunks) || retrievedChunks.length === 0) {
    throw new Error("Retrieved chunks are required");
  }

  const context = buildContext(retrievedChunks);

  const prompt = `
You are a beginner-friendly Bihar Board AI tutor.

Use ONLY the context below to answer the student's question.
Do not use outside knowledge.

Context:
${context}

Student Question:
${question}

Answer Rules:
- Give direct answer first
- Use simple English
- Preserve important textbook terms exactly
- Do not replace technical words with weaker words
- Keep answer beginner-friendly
- If the answer is not available in the context, say:
"I don't have enough information in the provided context."
`;

  const response = await ai.models.generateContent({
    model: GENERATION_MODEL,
    contents: prompt,
  });

  return response.text;
}

export async function createRagSystem({ filePath, metadata }) {
  const document = await loadTextDocument(filePath, metadata);

  const chunks = splitTextIntoChunks(document);

  const chunkTexts = chunks.map((chunk) => chunk.pageContent);

  const embeddings = await createEmbeddings(chunkTexts);

  const chunksWithEmbeddings = chunks.map((chunk, index) => {
    return {
      ...chunk,
      embedding: embeddings[index],
    };
  });

  const vectorStore = new MemoryVectorStore();
  vectorStore.addDocuments(chunksWithEmbeddings);

  return {
    vectorStore,
    totalChunks: chunksWithEmbeddings.length,
  };
}

export async function askRag({
  vectorStore,
  question,
  topK = 3,
  minScore = 0.55,
}) {
  if (!vectorStore) {
    throw new Error("Vector store is required");
  }

  if (!question) {
    throw new Error("Question is required");
  }

  const questionEmbedding = await createEmbedding(question);

  const retrievedChunks = vectorStore.similaritySearch(questionEmbedding, topK);

  const relevantChunks = retrievedChunks.filter((chunk) => {
    return chunk.score >= minScore;
  });

  if (relevantChunks.length === 0) {
    return {
      question,
      answer: "I don't have enough information in the provided context.",
      sources: [],
    };
  }

  const answer = await generateRagAnswer({
    question,
    retrievedChunks: relevantChunks,
  });

  const sources = relevantChunks.map((chunk) => {
    return {
      score: chunk.score,
      text: chunk.pageContent,
      metadata: chunk.metadata,
    };
  });

  return {
    question,
    answer,
    sources,
  };
}