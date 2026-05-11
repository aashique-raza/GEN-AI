import path from "path";
import { fileURLToPath } from "url";

import { loadEnglishPdf } from "./loaders/englishPdfLoader.js";
import { analyzeEnglishTextQuality } from "./utils/englishTextQuality.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(
  __dirname,
  "../../data/class-10/science/CBSE-Class-10-NCERT-Science-Book-Acids-Bases-and-Salts-chapter-2.pdf"
);

function previewDoc(doc) {
  console.log("\n====================================");
  console.log("Page:", doc.metadata.pageNumber);
  console.log("Chars:", doc.pageContent.length);
  console.log("Metadata:", doc.metadata);

  const quality = analyzeEnglishTextQuality(doc.pageContent);

  console.log("Quality:", quality);

  console.log("\n--- PAGE CONTENT PREVIEW ---");
  console.log(doc.pageContent.slice(0, 1000));
}

function printQualitySummary(docs) {
  console.log("\n========== ENGLISH PDF QUALITY SUMMARY ==========");

  const reports = docs.map((doc) => {
    const quality = analyzeEnglishTextQuality(doc.pageContent);

    return {
      pageNumber: doc.metadata.pageNumber,
      chars: doc.pageContent.length,
      status: quality.status,
      latinRatio: quality.latinRatio,
      privateUseChars: quality.privateUseChars,
      replacementChars: quality.replacementChars,
    };
  });

  console.table(reports);

  const badPages = reports.filter(
    (report) => report.status !== "READABLE_ENGLISH"
  );

  console.log("\nTotal pages:", reports.length);
  console.log("Readable pages:", reports.length - badPages.length);
  console.log("Bad pages:", badPages.length);

  if (badPages.length > 0) {
    console.log("\nBad page reports:");
    console.table(badPages);
  }
}

async function main() {
  const docs = await loadEnglishPdf(pdfPath);

  console.log("\nTotal pages loaded:", docs.length);

  printQualitySummary(docs);

  for (const doc of docs.slice(0, 3)) {
    previewDoc(doc);
  }
}

main().catch((error) => {
  console.error("English PDF loading failed:", error.message);
});