import fs from "node:fs/promises";
import path from "node:path";

function cleanText(text) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function loadTextDocument(filePath, metadata = {}) {
  if (!filePath) {
    throw new Error("filePath is required");
  }

  const absolutePath = path.resolve(filePath);

  const rawText = await fs.readFile(absolutePath, "utf-8");
  const cleanedText = cleanText(rawText);

  if (!cleanedText) {
    throw new Error("Text file is empty");
  }

  return {
    pageContent: cleanedText,
    metadata: {
      source: path.basename(filePath),
      filePath,
      ...metadata,
    },
  };
}