import path from "path";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { debugDocuments } from "./utils/debugDocuments.js";

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function extractMetadataFromPath(filePath) {
  const normalizedPath = normalizePath(filePath);
  const parts = normalizedPath.split("/");

  const dataIndex = parts.indexOf("data");
  const classFolder = parts[dataIndex + 1];
  const subject = parts[dataIndex + 2];

  const fileName = path.basename(normalizedPath);
  const chapter = fileName.replace(".txt", "");

  return {
    classLevel: classFolder?.replace("class-", ""),
    subject,
    chapter,
    board: "bihar-board",
    source: normalizedPath,
  };
}

const filePath = "data/class-10/science/life-processes.txt";

const loader = new TextLoader(filePath);
const docs = await loader.load();

const enrichedDocs = docs.map((doc) => ({
  ...doc,
  metadata: {
    ...doc.metadata,
    ...extractMetadataFromPath(filePath),
  },
}));

debugDocuments(enrichedDocs, {
  previewLength: 120,
});