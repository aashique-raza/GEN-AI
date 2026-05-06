import fs from "node:fs/promises";
import path from "node:path";

export async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function saveVectorStore(vectorStore, filePath = "storage/vector-store.json") {
  if (!vectorStore || !Array.isArray(vectorStore.documents)) {
    throw new Error("Valid vector store is required for saving");
  }

  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  const data = {
    version: 1,
    createdAt: new Date().toISOString(),
    totalDocuments: vectorStore.documents.length,
    documents: vectorStore.documents,
  };

  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`Vector store saved to ${filePath}`);
}

export async function loadVectorStoreData(filePath = "storage/vector-store.json") {
  const rawData = await fs.readFile(filePath, "utf-8");
  const parsedData = JSON.parse(rawData);

  if (!Array.isArray(parsedData.documents)) {
    throw new Error("Invalid vector store file: documents array missing");
  }

  return parsedData.documents;
}