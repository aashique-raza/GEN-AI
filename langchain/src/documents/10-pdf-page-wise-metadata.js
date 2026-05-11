import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { debugDocuments } from "./utils/debugDocuments.js";
import { extractMetadataFromPath } from "./utils/pathMetadata.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const docs = await loader.load();

const enrichedDocs = docs.map((doc) => {
  const pageNumber = doc.metadata.loc?.pageNumber;

  return {
    ...doc,
    metadata: {
      ...doc.metadata,
      ...extractMetadataFromPath(filePath),
      pageNumber,
    },
  };
});

debugDocuments(enrichedDocs, {
  previewLength: 180,
});

console.log("\n--- CLEAN PAGE METADATA CHECK ---");

enrichedDocs.forEach((doc, index) => {
  console.log({
    documentNumber: index + 1,
    pageNumber: doc.metadata.pageNumber,
    classLevel: doc.metadata.classLevel,
    subject: doc.metadata.subject,
    chapter: doc.metadata.chapter,
    fileType: doc.metadata.fileType,
    source: doc.metadata.source,
  });
});