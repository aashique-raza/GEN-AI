import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

import { convertKrutiDevToUnicode } from "./utils/krutidevConverter.js";
import { cleanHindiText } from "./utils/cleanHindiText.js";
import { extractMetadataFromPath } from "./utils/pathMetadata.js";
import { debugDocuments } from "./utils/debugDocuments.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const rawDocs = await loader.load();
const baseMetadata = extractMetadataFromPath(filePath);

const cleanedDocs = rawDocs.map((doc, index) => {
  const pageNumber = doc.metadata.loc?.pageNumber ?? index + 1;

  const convertedText = convertKrutiDevToUnicode(doc.pageContent);
  const cleanedText = cleanHindiText(convertedText);

  return new Document({
    pageContent: cleanedText,
    metadata: {
      ...doc.metadata,
      ...baseMetadata,
      pageNumber,
      encodingFixed: true,
      cleaned: true,
      originalEncoding: "krutidev-like",
    },
  });
});

console.log("\n--- RAW CONVERTED PREVIEW ---");
console.log(convertKrutiDevToUnicode(rawDocs[0].pageContent).slice(0, 400));

console.log("\n--- CLEANED PREVIEW ---");
console.log(cleanedDocs[0].pageContent.slice(0, 400));

debugDocuments(cleanedDocs.slice(0, 2), {
  previewLength: 350,
});

console.log("\n--- TOTAL CLEANED DOCUMENTS ---");
console.log(cleanedDocs.length);