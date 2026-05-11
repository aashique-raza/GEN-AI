import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { analyzeTextQuality } from "./utils/textQuality.js";
import { decidePdfSourceQuality } from "./utils/pdfDecision.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const docs = await loader.load();

const pageReports = docs.map((doc, index) => {
  const quality = analyzeTextQuality(doc.pageContent);

  return {
    page: doc.metadata.loc?.pageNumber ?? index + 1,
    status: quality.status,
    chars: quality.totalChars,
    preview: doc.pageContent.slice(0, 80).replaceAll("\n", " "),
  };
});

const decision = decidePdfSourceQuality(pageReports);

console.log("\n--- PAGE REPORTS ---");
console.table(pageReports);

console.log("\n--- PDF SOURCE DECISION ---");
console.log(decision);

if (!decision.canIndexForRag) {
  console.log("\nDO NOT INDEX THIS PDF DIRECTLY.");
  console.log("Reason:", decision.reason);
} else {
  console.log("\nPDF is safe for direct RAG indexing.");
}