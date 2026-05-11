import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { debugDocuments } from "./utils/debugDocuments.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const docs = await loader.load();

debugDocuments(docs, {
  previewLength: 250,
});

console.log("\n--- PAGE-WISE CHECK ---");

docs.forEach((doc, index) => {
  console.log({
    documentNumber: index + 1,
    contentLength: doc.pageContent.length,
    pageNumber: doc.metadata.loc?.pageNumber,
    source: doc.metadata.source,
  });
});