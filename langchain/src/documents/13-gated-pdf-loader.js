import { debugDocuments } from "./utils/debugDocuments.js";
import { loadPdfWithQualityGate } from "./loaders/gatedPdfLoader.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const result = await loadPdfWithQualityGate(filePath);

console.log("\n--- PDF DECISION ---");
console.log(result.decision);

console.log("\n--- PAGE QUALITY REPORT ---");
console.table(result.pageReports);

console.log("\n--- INDEXABLE DOCUMENTS ---");
console.log("Docs allowed for RAG indexing:", result.docs.length);
console.log("Docs blocked:", result.blockedDocs.length);

if (result.docs.length > 0) {
  debugDocuments(result.docs, {
    previewLength: 200,
  });
}

if (result.blockedDocs.length > 0) {
  console.log("\nBLOCKED:");
  console.log("This PDF should not be sent to splitter/embedding/vector DB.");
}