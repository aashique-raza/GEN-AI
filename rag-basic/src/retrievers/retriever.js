import { createEmbedding } from "../embeddings/embeddingService.js";

export async function retrieveRelevantChunks({
  vectorStore,
  question,
  topK = 3,
  minScore = 0,
  metadataFilter = {},
} = {}) {
  if (!vectorStore) {
    throw new Error("Vector store is required");
  }

  if (!question || typeof question !== "string") {
    throw new Error("Question must be a non-empty string");
  }

  const questionEmbedding = await createEmbedding(question);

 const results = vectorStore.similaritySearch(questionEmbedding, {
  topK,
  minScore,
  metadataFilter,
  debug: true,
});

  return results;
}