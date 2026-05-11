import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

import { cleanEnglishPdfText } from "../utils/cleanEnglishPdfText.js";

/**
 * Extracts simple metadata from file path.
 */
function getPdfPathMetadata(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  const parts = normalizedPath.split("/");

  const classLevel = parts.includes("class-10") ? "10" : "unknown";
  const subject = parts.includes("science") ? "science" : "unknown";
  const fileName = path.basename(filePath);
  const chapter = fileName.replace(".pdf", "");

  return {
    source: normalizedPath,
    classLevel,
    subject,
    chapter,
    board: "cbse",
    fileType: "pdf",
    language: "english",
  };
}

/**
 * Loads English PDF page-wise.
 */
export async function loadEnglishPdf(filePath) {
  const loader = new PDFLoader(filePath, {
    splitPages: true,
  });

  const rawDocs = await loader.load();
  const baseMetadata = getPdfPathMetadata(filePath);

  const docs = rawDocs.map((doc, index) => {
    const cleanedResult = cleanEnglishPdfText(doc.pageContent);

    return new Document({
      pageContent: cleanedResult.text,
      metadata: {
        ...baseMetadata,
        pageNumber: index + 1,
        totalPages: rawDocs.length,
        extractedBy: "PDFLoader",
        encodingFixed: cleanedResult.encodingFixed,
        cleaned: cleanedResult.cleaned,
        originalEncoding: cleanedResult.encodingFixed
          ? "private-use-font-fixed"
          : "unicode-or-standard-pdf-text",
      },
    });
  });

  return docs;
}

export default loadEnglishPdf;