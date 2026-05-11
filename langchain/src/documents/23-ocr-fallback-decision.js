import path from "path";
import { fileURLToPath } from "url";

import { loadSmartPdf } from "./loaders/smartPdfLoader.js";
import { getOcrFallbackInfo } from "./loaders/ocrFallbackInfo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Change this path to test any PDF.
const pdfPath = path.join(
  __dirname,
  "../../data/class-10/science/CBSE-Class-10-NCERT-Science-Book-Acids-Bases-and-Salts-chapter-2.pdf"
);

function printOcrDecision(result) {
  console.log("\n========== OCR FALLBACK DECISION ==========");

  console.log("Total pages:", result.decision.totalPages);
  console.log("Allowed pages:", result.decision.allowedPages);
  console.log("Blocked pages:", result.decision.blockedPages);
  console.log("PDF status:", result.decision.status);

  const ocrRequiredPages = result.blockedDocs.filter(
    (doc) => doc.reason === "OCR_REQUIRED"
  );

  const unreliablePages = result.blockedDocs.filter(
    (doc) => doc.reason !== "OCR_REQUIRED"
  );

  if (ocrRequiredPages.length === 0 && unreliablePages.length === 0) {
    console.log("\nOCR_REQUIRED: false");
    console.log("Reason: All pages have readable extracted text.");
    return;
  }

  if (ocrRequiredPages.length > 0) {
    console.log("\nOCR_REQUIRED: true");
    console.log("Pages needing OCR:");

    console.table(
      ocrRequiredPages.map((doc) => ({
        page: doc.pageNumber,
        reason: doc.reason,
        rawStatus: doc.rawReport.rawStatus,
        totalChars: doc.rawReport.totalChars,
      }))
    );
  }

  if (unreliablePages.length > 0) {
    console.log("\nUNRELIABLE_TEXT_FOUND: true");
    console.log("These pages should NOT be indexed blindly:");

    console.table(
      unreliablePages.map((doc) => ({
        page: doc.pageNumber,
        reason: doc.reason,
        rawStatus: doc.rawReport.rawStatus,
        totalChars: doc.rawReport.totalChars,
      }))
    );
  }

  console.log("\nOCR fallback options:");
  console.table(getOcrFallbackInfo().options);
}

async function main() {
  const result = await loadSmartPdf(pdfPath);

  printOcrDecision(result);
}

main().catch((error) => {
  console.error("OCR fallback decision failed:", error.message);
});