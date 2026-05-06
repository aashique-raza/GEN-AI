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

function matchesMetadataFilter(metadata = {}, metadataFilter = {}) {
  if (!metadataFilter || Object.keys(metadataFilter).length === 0) {
    return true;
  }

  return Object.entries(metadataFilter).every(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }

    if (Array.isArray(value)) {
      return value.includes(metadata[key]);
    }

    return metadata[key] === value;
  });
}

export class MemoryVectorStore {
  constructor() {
    this.documents = [];
  }

  addDocument(document) {
    if (!document.text) {
      throw new Error("Document text is required");
    }

    if (!Array.isArray(document.embedding)) {
      throw new Error("Document embedding is required");
    }

    this.documents.push(document);
  }

  addDocuments(documents) {
    if (!Array.isArray(documents)) {
      throw new Error("Documents must be an array");
    }

    for (const document of documents) {
      this.addDocument(document);
    }
  }

  // similaritySearch(queryEmbedding, options = {}) {
  //   if (!Array.isArray(queryEmbedding)) {
  //     throw new Error("Query embedding must be an array");
  //   }

  //   const { topK = 3, minScore = 0, metadataFilter = {} } = options;;

  //  return this.documents
  // .filter((document) =>
  //   matchesMetadataFilter(document.metadata, metadataFilter)
  // )
  // .map((document) => {
  //   const score = cosineSimilarity(queryEmbedding, document.embedding);

  //   return {
  //     ...document,
  //     score,
  //   };
  // })
  // .filter((document) => document.score >= minScore)
  // .sort((a, b) => b.score - a.score)
  // .slice(0, topK);
  // }

  similaritySearch(queryEmbedding, options = {}) {
  if (!Array.isArray(queryEmbedding)) {
    throw new Error("Query embedding must be an array");
  }

  const {
    topK = 3,
    minScore = 0,
    metadataFilter = {},
    debug = false,
  } = options;

  const metadataMatchedDocuments = this.documents.filter((document) =>
    matchesMetadataFilter(document.metadata, metadataFilter)
  );

  const scoredDocuments = metadataMatchedDocuments.map((document) => {
    const score = cosineSimilarity(queryEmbedding, document.embedding);

    return {
      ...document,
      score,
    };
  });

  const minScorePassedDocuments = scoredDocuments.filter(
    (document) => document.score >= minScore
  );

  const sortedDocuments = minScorePassedDocuments.sort(
    (a, b) => b.score - a.score
  );

  const finalResults = sortedDocuments.slice(0, topK);

  if (debug) {
    console.log("\n--- RETRIEVAL DEBUG ---");
    console.log("Total documents:", this.documents.length);
    console.log("After metadata filter:", metadataMatchedDocuments.length);
    console.log("topK:", topK);
    console.log("minScore:", minScore);

    console.log("\nAll scored chunks:");
    scoredDocuments
      .sort((a, b) => b.score - a.score)
      .forEach((doc, index) => {
        console.log(`\nRank ${index + 1}`);
        console.log("Score:", doc.score.toFixed(4));
        console.log("Metadata:", doc.metadata);
        console.log("Text:", doc.text.slice(0, 180));
      });

    console.log("\nFinal selected chunks:");
    finalResults.forEach((doc, index) => {
      console.log(`Source ${index + 1} | Score: ${doc.score.toFixed(4)}`);
      console.log("Metadata:", doc.metadata);
    });

    console.log("--- END RETRIEVAL DEBUG ---\n");
  }

  return finalResults;
}
}