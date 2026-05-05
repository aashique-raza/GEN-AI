import { loadTxtDocuments } from "../loaders/documentLoader.js";
import { splitDocumentsIntoChunks } from "../splitters/textSplitter.js";
import {
  createEmbedding,
  createEmbeddings,
} from "../embeddings/embeddingService.js";
// import { MemoryVectorStore } from "../vectorStore/memoryVectorStore.js";
import { MemoryVectorStore } from "../vectorStore/memoryVectorStoreMultiple.js";
import { ai } from "../config/gemini.js";

export async function createRagSystem({
  dataDir = "data",
  paragraphsPerChunk = 5,
  minScore = 0.55,
} = {}) {
  console.log("Loading documents...");
  const documents = await loadTxtDocuments(dataDir);

  console.log(`Loaded ${documents.length} document(s).`);

  console.log("Splitting documents into chunks...");
  const chunks = splitDocumentsIntoChunks(documents, paragraphsPerChunk);

  console.log(`Created ${chunks.length} chunk(s).`);

  const vectorStore = new MemoryVectorStore();

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
  console.log('vector store',vectorStore)

  return {
  vectorStore,
  totalChunks: vectorStore.documents.length,
  minScore,
};
}

export async function askRag(ragSystem, question) {
  const questionEmbedding = await createEmbedding(question);

  const results = ragSystem.vectorStore.similaritySearch(questionEmbedding, {
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

  const prompt = `
You are a helpful tutor.

Answer the user's question using ONLY the provided context.

If the answer is not present in the context, say:
"I don't have enough information in the provided context."

Context:
${context}

Question:
${question}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  return {
    answer: response.text,
    sources: results.map((item) => ({
      score: item.score,
      metadata: item.metadata,
      text: item.text,
    })),
  };
}
