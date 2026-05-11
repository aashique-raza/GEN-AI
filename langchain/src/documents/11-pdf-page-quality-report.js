import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { analyzeTextQuality } from "./utils/textQuality.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const docs = await loader.load();

const report = docs.map((doc, index) => {
  const quality = analyzeTextQuality(doc.pageContent);

  return {
    page: doc.metadata.loc?.pageNumber ?? index + 1,
    chars: quality.totalChars,
    devanagariRatio: quality.devanagariRatio,
    latinRatio: quality.latinRatio,
    status: quality.status,
    preview: doc.pageContent.slice(0, 60).replaceAll("\n", " "),
  };
});

console.log("\n--- PDF PAGE QUALITY REPORT ---");
console.table(report);

const summary = report.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, {});

console.log("\n--- QUALITY SUMMARY ---");
console.log(summary);

if (summary.BAD_HINDI_ENCODING > 0) {
  console.log("\nWARNING:");
  console.log("This PDF is not safe for direct RAG indexing.");
  console.log("Text extraction is garbled. Use OCR or cleaner Unicode text.");
}