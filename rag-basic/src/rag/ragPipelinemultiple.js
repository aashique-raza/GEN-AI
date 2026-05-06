import { loadTxtDocuments } from "../loaders/documentLoader.js";
import { splitDocumentsIntoChunks } from "../splitters/textSplitter.js";
import { createEmbedding } from "../embeddings/embeddingService.js";
// import { MemoryVectorStore } from "../vectorStore/memoryVectorStore.js";
import { MemoryVectorStore } from "../vectorStore/memoryVectorStoreMultiple.js";
// import { ai } from "../config/gemini.js";
import { generateWithGroq } from "../llm/groqClient.js";

import {
  fileExists,
  saveVectorStore,
  loadVectorStoreData,
} from "../storage/vectorStoreStorage.js";

import { retrieveRelevantChunks } from "../retrievers/retriever.js";

export async function createRagSystem({
  dataDir = "data",
  paragraphsPerChunk = 5,
  minScore = 0.55,
  storagePath = "storage/vector-store.json",
  forceRebuild = false,
} = {}) {
  const vectorStore = new MemoryVectorStore();

  const hasSavedVectorStore = await fileExists(storagePath);

  if (hasSavedVectorStore && !forceRebuild) {
    console.log("Loading vector store from storage...");

    const savedDocuments = await loadVectorStoreData(storagePath);

    vectorStore.addDocuments(savedDocuments);

    console.log(`Loaded ${vectorStore.documents.length} chunk(s) from storage.`);

    return {
      vectorStore,
      totalChunks: vectorStore.documents.length,
      minScore,
    };
  }

  console.log("Loading documents...");
  const documents = await loadTxtDocuments(dataDir);

  console.log(`Loaded ${documents.length} document(s).`);

  console.log("Splitting documents into chunks...");
  const chunks = splitDocumentsIntoChunks(documents, paragraphsPerChunk);

  console.log(`Created ${chunks.length} chunk(s).`);

  console.log("Generating embeddings...");

  for (const chunk of chunks) {
    const embedding = await createEmbedding(chunk.text);

    vectorStore.addDocument({
      text: chunk.text,
      embedding,
      metadata: chunk.metadata,
    });
  }

  console.log("Vector store ready.");

  await saveVectorStore(vectorStore, storagePath);

  return {
    vectorStore,
    totalChunks: vectorStore.documents.length,
    minScore,
  };
}

export async function askRag(ragSystem, question) {
  const results = await retrieveRelevantChunks({
    vectorStore: ragSystem.vectorStore,
    question,
    topK: 3,
    minScore: ragSystem.minScore,
  });

  if (results.length === 0) {
    return {
      answer: "I don't have enough information in the provided context.",
      sources: [],
    };
  }

  const context = results
    .map((item, index) => {
      return `Source ${index + 1}:
Metadata: ${JSON.stringify(item.metadata)}
Content:
${item.text}`;
    })
    .join("\n\n---\n\n");

  console.log("\n--- CONTEXT SENT TO GROQ ---");
  console.log(context);
  console.log("--- END CONTEXT ---\n");

  const answer = await generateWithGroq({
    question,
    context,
  });

  return {
    answer,
    sources: results.map((item) => ({
      score: item.score,
      metadata: item.metadata,
      text: item.text,
    })),
  };
}
