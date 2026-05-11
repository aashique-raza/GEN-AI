import path from "path";
import { fileURLToPath } from "url";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

import { convertKrutiDevToUnicode } from "./utils/krutidevConverter.js";
import { cleanHindiText } from "./utils/cleanHindiText.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.join(
  __dirname,
  "../../data/class-10/science/class-10-chapter-1-book-vigyan-bihar-board.pdf",
);

function previewText(title, text, length = 700) {
  console.log(`\n--- ${title} ---`);
  console.log(text.slice(0, length));
}

async function main() {
  const loader = new PDFLoader(pdfPath, {
    splitPages: true,
  });

  const docs = await loader.load();

  console.log("\nTotal PDF pages loaded:", docs.length);

  for (const [index, doc] of docs.entries()) {
    const pageNumber = index + 1;

    const rawText = doc.pageContent || "";
    const convertedText = convertKrutiDevToUnicode(rawText);
    const cleanupResult = cleanHindiText(convertedText);

    console.log("\n====================================");
    console.log(`PAGE: ${pageNumber}`);
    console.log("Raw chars:", rawText.length);
    console.log("Converted chars:", convertedText.length);
    console.log("Cleaned chars:", cleanupResult.text.length);
    console.log("Cleaned:", cleanupResult.cleaned);
    console.log("Applied fixes:", cleanupResult.appliedFixes);
    console.log("Suspicious leftovers:", cleanupResult.suspiciousLeftovers);
    console.log("Readable enough:", cleanupResult.readableEnough);

    previewText("BEFORE CLEANUP", convertedText);
    previewText("AFTER CLEANUP", cleanupResult.text);

    // Keep inspection small for now
    if (pageNumber >= 3) {
      console.log("\nStopped after 3 pages for safe inspection.");
      break;
    }
  }
}

main().catch((error) => {
  console.error("Hindi cleanup review failed:", error);
});
