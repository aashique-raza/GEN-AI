import { ai } from "../config/gemini.js";

const EMBEDDING_MODEL = "gemini-embedding-001";

export async function createEmbedding(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Text is required for embedding");
  }

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text,
  });

  const embedding = response.embeddings?.[0]?.values;

  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Failed to create embedding");
  }

  return embedding;
}

export async function createEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) {
    throw new Error("Texts array is required for embeddings");
  }

  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: texts,
  });

  const embeddings = response.embeddings?.map((item) => item.values);

  if (!embeddings || embeddings.length !== texts.length) {
    throw new Error("Failed to create embeddings for all texts");
  }

  return embeddings;
}