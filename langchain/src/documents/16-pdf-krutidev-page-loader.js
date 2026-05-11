import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

import { extractMetadataFromPath } from "./utils/pathMetadata.js";
import { convertKrutiDevToUnicode } from "./utils/krutidevConverter.js";
import { debugDocuments } from "./utils/debugDocuments.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const rawDocs = await loader.load();
const baseMetadata = extractMetadataFromPath(filePath);

const convertedDocs = rawDocs.map((doc, index) => {
  const pageNumber = doc.metadata.loc?.pageNumber ?? index + 1;

  const convertedText = convertKrutiDevToUnicode(doc.pageContent);

  return new Document({
    pageContent: convertedText,
    metadata: {
      ...doc.metadata,
      ...baseMetadata,
      pageNumber,
      encodingFixed: true,
      originalEncoding: "krutidev-like",
    },
  });
});

console.log("\n--- BEFORE CONVERSION PREVIEW ---");
console.log(rawDocs[0].pageContent.slice(0, 300));

console.log("\n--- AFTER CONVERSION PREVIEW ---");
console.log(convertedDocs[0].pageContent.slice(0, 300));

debugDocuments(convertedDocs.slice(0, 2), {
  previewLength: 400,
});

console.log("\n--- TOTAL CONVERTED DOCUMENTS ---");
console.log(convertedDocs.length);