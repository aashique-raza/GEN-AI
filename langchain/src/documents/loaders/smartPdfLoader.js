import path from "path";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";

import { cleanEnglishPdfText } from "../utils/cleanEnglishPdfText.js";
import { analyzeEnglishTextQuality } from "../utils/englishTextQuality.js";

function countMatches(text, regex) {
  return (String(text).match(regex) || []).length;
}

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
    board: "unknown",
    fileType: "pdf",
  };
}

function analyzeRawPdfPage(text = "") {
  const value = String(text);
  const totalChars = value.length;

  const latinChars = countMatches(value, /[A-Za-z]/g);
  const devanagariChars = countMatches(value, /[\u0900-\u097F]/g);
  const privateUseChars = countMatches(value, /[\uF000-\uF8FF]/g);
  const replacementChars = countMatches(value, /�/g);

  const latinRatio = totalChars === 0 ? 0 : latinChars / totalChars;
  const devanagariRatio = totalChars === 0 ? 0 : devanagariChars / totalChars;
  const privateUseRatio = totalChars === 0 ? 0 : privateUseChars / totalChars;

  let rawStatus = "UNKNOWN_OR_MIXED";

  if (totalChars < 50) {
    rawStatus = "EMPTY_OR_SCANNED";
  } else if (privateUseRatio > 0.02) {
    rawStatus = "PRIVATE_USE_FONT";
  } else if (latinRatio > 0.35) {
    rawStatus = "STANDARD_ENGLISH";
  } else if (devanagariRatio > 0.25) {
    rawStatus = "UNICODE_HINDI";
  }

  return {
    totalChars,
    latinChars,
    devanagariChars,
    privateUseChars,
    replacementChars,
    latinRatio: Number(latinRatio.toFixed(4)),
    devanagariRatio: Number(devanagariRatio.toFixed(4)),
    privateUseRatio: Number(privateUseRatio.toFixed(4)),
    rawStatus,
  };
}

function buildBlockedPage({ pageNumber, reason, rawReport, metadata }) {
  return {
    pageNumber,
    reason,
    rawReport,
    metadata,
  };
}

/**
 * Smart PDF Loader
 *
 * Rules:
 * 1. Standard English -> allow
 * 2. Private-use English font -> decode + allow if readable
 * 3. Unicode Hindi -> allow only if already readable Unicode
 * 4. Empty/scanned -> block, OCR needed
 * 5. Unknown/mixed -> block
 *
 * Important:
 * Hindi legacy-font PDF should NOT be blindly indexed.
 */
export async function loadSmartPdf(filePath) {
  const loader = new PDFLoader(filePath, {
    splitPages: true,
  });

  const rawDocs = await loader.load();
  const baseMetadata = getPdfPathMetadata(filePath);

  const docs = [];
  const blockedDocs = [];
  const pageReports = [];

  for (const [index, rawDoc] of rawDocs.entries()) {
    const pageNumber = index + 1;
    const rawText = rawDoc.pageContent || "";
    const rawReport = analyzeRawPdfPage(rawText);

    const metadata = {
      ...baseMetadata,
      pageNumber,
      totalPages: rawDocs.length,
      extractedBy: "PDFLoader",
    };

    if (
      rawReport.rawStatus === "STANDARD_ENGLISH" ||
      rawReport.rawStatus === "PRIVATE_USE_FONT"
    ) {
      const cleanedResult = cleanEnglishPdfText(rawText);
      const quality = analyzeEnglishTextQuality(cleanedResult.text);

      const allowed = quality.status === "READABLE_ENGLISH";

      pageReports.push({
        pageNumber,
        rawStatus: rawReport.rawStatus,
        finalStatus: quality.status,
        allowed,
        language: "english",
        rawReport,
        finalQuality: quality,
      });

      if (!allowed) {
        blockedDocs.push(
          buildBlockedPage({
            pageNumber,
            reason: quality.status,
            rawReport,
            metadata,
          })
        );

        continue;
      }

      docs.push(
        new Document({
          pageContent: cleanedResult.text,
          metadata: {
            ...metadata,
            language: "english",
            cleaned: cleanedResult.cleaned,
            encodingFixed: cleanedResult.encodingFixed,
            originalEncoding: cleanedResult.encodingFixed
              ? "private-use-font-fixed"
              : "unicode-or-standard-pdf-text",
            smartDecision: "ALLOW_ENGLISH",
          },
        })
      );

      continue;
    }

    if (rawReport.rawStatus === "UNICODE_HINDI") {
      pageReports.push({
        pageNumber,
        rawStatus: rawReport.rawStatus,
        finalStatus: "READABLE_UNICODE_HINDI",
        allowed: true,
        language: "hindi",
        rawReport,
      });

      docs.push(
        new Document({
          pageContent: rawText.trim(),
          metadata: {
            ...metadata,
            language: "hindi",
            cleaned: false,
            encodingFixed: false,
            originalEncoding: "unicode-hindi",
            smartDecision: "ALLOW_UNICODE_HINDI",
          },
        })
      );

      continue;
    }

    const reason =
      rawReport.rawStatus === "EMPTY_OR_SCANNED"
        ? "OCR_REQUIRED"
        : "UNKNOWN_OR_UNRELIABLE_TEXT";

    pageReports.push({
      pageNumber,
      rawStatus: rawReport.rawStatus,
      finalStatus: reason,
      allowed: false,
      language: "unknown",
      rawReport,
    });

    blockedDocs.push(
      buildBlockedPage({
        pageNumber,
        reason,
        rawReport,
        metadata,
      })
    );
  }

  const decision = {
    totalPages: rawDocs.length,
    allowedPages: docs.length,
    blockedPages: blockedDocs.length,
    readyForIndexing: docs.length > 0 && blockedDocs.length === 0,
    status:
      blockedDocs.length === 0
        ? "READY_FOR_INDEXING"
        : docs.length > 0
          ? "PARTIAL_QUALITY"
          : "BLOCKED",
  };

  return {
    docs,
    blockedDocs,
    pageReports,
    decision,
  };
}

export default loadSmartPdf;