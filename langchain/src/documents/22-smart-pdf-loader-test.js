import path from "path";
import { fileURLToPath } from "url";

import { loadSmartPdf } from "./loaders/smartPdfLoader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(
  __dirname,
  "../../data/class-10/science/CBSE-Class-10-NCERT-Science-Book-Acids-Bases-and-Salts-chapter-2.pdf"
);

function previewDoc(doc) {
  console.log("\n====================================");
  console.log("Page:", doc.metadata.pageNumber);
  console.log("Decision:", doc.metadata.smartDecision);
  console.log("Language:", doc.metadata.language);
  console.log("Encoding fixed:", doc.metadata.encodingFixed);
  console.log("Cleaned:", doc.metadata.cleaned);
  console.log("Chars:", doc.pageContent.length);

  console.log("\n--- CONTENT PREVIEW ---");
  console.log(doc.pageContent.slice(0, 800));
}

async function main() {
  const result = await loadSmartPdf(pdfPath);

  console.log("\n========== SMART PDF DECISION ==========");
  console.log(result.decision);

  console.log("\n========== PAGE REPORTS ==========");
  console.table(
    result.pageReports.map((report) => ({
      page: report.pageNumber,
      rawStatus: report.rawStatus,
      finalStatus: report.finalStatus,
      allowed: report.allowed,
      language: report.language,
    }))
  );

  console.log("\nAllowed docs:", result.docs.length);
  console.log("Blocked docs:", result.blockedDocs.length);

  if (result.blockedDocs.length > 0) {
    console.log("\n========== BLOCKED DOCS ==========");
    console.table(
      result.blockedDocs.map((doc) => ({
        page: doc.pageNumber,
        reason: doc.reason,
      }))
    );
  }

  for (const doc of result.docs.slice(0, 3)) {
    previewDoc(doc);
  }
}

main().catch((error) => {
  console.error("Smart PDF loader failed:", error.message);
});