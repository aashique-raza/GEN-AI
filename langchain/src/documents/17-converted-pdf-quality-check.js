import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { convertKrutiDevToUnicode } from "./utils/krutidevConverter.js";
import { analyzeTextQuality } from "./utils/textQuality.js";

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: true,
});

const rawDocs = await loader.load();

const report = rawDocs.map((doc, index) => {
  const convertedText = convertKrutiDevToUnicode(doc.pageContent);
  const quality = analyzeTextQuality(convertedText);

  return {
    page: doc.metadata.loc?.pageNumber ?? index + 1,
    chars: quality.totalChars,
    devanagariRatio: quality.devanagariRatio,
    latinRatio: quality.latinRatio,
    status: quality.status,
    preview: convertedText.slice(0, 80).replaceAll("\n", " "),
  };
});

console.log("\n--- CONVERTED PDF QUALITY REPORT ---");
console.table(report);

const summary = report.reduce((acc, item) => {
  acc[item.status] = (acc[item.status] || 0) + 1;
  return acc;
}, {});

console.log("\n--- QUALITY SUMMARY ---");
console.log(summary);