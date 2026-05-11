import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { debugDocuments } from "./utils/debugDocuments.js";

function analyzeTextQuality(text) {
  const totalChars = text.length;

  const devanagariChars = (text.match(/\p{Script=Devanagari}/gu) || []).length;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const weirdChars = (text.match(/[�]/g) || []).length;

  const devanagariRatio = totalChars === 0 ? 0 : devanagariChars / totalChars;
  const latinRatio = totalChars === 0 ? 0 : latinChars / totalChars;

  return {
    totalChars,
    devanagariChars,
    latinChars,
    weirdChars,
    devanagariRatio: Number(devanagariRatio.toFixed(4)),
    latinRatio: Number(latinRatio.toFixed(4)),
    isLikelyBadHindiExtraction: devanagariRatio < 0.05 && latinRatio > 0.3,
  };
}

const filePath =
  "data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf";

const loader = new PDFLoader(filePath, {
  splitPages: false,
});

const docs = await loader.load();
const firstDoc = docs[0];

const quality = analyzeTextQuality(firstDoc.pageContent);

debugDocuments(docs, {
  previewLength: 400,
});

console.log("\n--- PDF TEXT QUALITY CHECK ---");
console.log(quality);

if (quality.isLikelyBadHindiExtraction) {
  console.log("\nWARNING:");
  console.log("PDF text extraction is likely bad for Hindi RAG.");
  console.log("Use OCR, better Unicode PDF, or manually cleaned text source.");
} else {
  console.log("\nPDF text extraction looks usable.");
}