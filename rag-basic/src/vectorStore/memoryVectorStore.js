function cosineSimilarity(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error("Both vectors must be arrays");
  }

  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }

  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / (magnitudeA * magnitudeB);
}

export class MemoryVectorStore {
  constructor() {
    this.documents = [];
  }

  addDocuments(documents) {
    if (!Array.isArray(documents)) {
      throw new Error("Documents must be an array");
    }

    for (const document of documents) {
      if (!document.pageContent) {
        throw new Error("Document pageContent is required");
      }

      if (!Array.isArray(document.embedding)) {
        throw new Error("Document embedding is required");
      }

      this.documents.push(document);
    }
  }

  similaritySearch(queryEmbedding, topK = 3) {
    if (!Array.isArray(queryEmbedding)) {
      throw new Error("Query embedding must be an array");
    }

    return this.documents
      .map((document) => {
        const score = cosineSimilarity(queryEmbedding, document.embedding);

        return {
          ...document,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}