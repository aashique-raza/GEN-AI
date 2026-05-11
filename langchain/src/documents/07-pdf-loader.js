import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
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
  const chapter = fileName.replace(".pdf", "");

  return {
    classLevel: classFolder?.replace("class-", ""),
    subject,
    chapter,
    board: "bihar-board",
    source: normalizedPath,
    fileType: "pdf",
  };
}

const filePath = "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: false,
});

const docs = await loader.load();

const enrichedDocs = docs.map((doc) => ({
  ...doc,
  metadata: {
    ...doc.metadata,
    ...extractMetadataFromPath(filePath),
  },
}));

debugDocuments(enrichedDocs, {
  previewLength: 300,
});