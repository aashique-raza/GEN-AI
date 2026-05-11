/**
 * OCR fallback info.
 *
 * We are NOT implementing OCR now.
 * This file only explains what to do when PDF text extraction fails.
 */

export const OCR_FALLBACK_OPTIONS = [
  {
    name: "Tesseract.js",
    type: "local/free",
    bestFor: "small experiments, local OCR learning",
    downside: "slow and not always accurate for complex textbook PDFs",
  },
  {
    name: "Google Vision OCR",
    type: "cloud/paid",
    bestFor: "high OCR accuracy",
    downside: "paid and needs setup",
  },
  {
    name: "Azure OCR",
    type: "cloud/paid",
    bestFor: "document OCR pipelines",
    downside: "paid and needs setup",
  },
  {
    name: "Manual clean source PDF",
    type: "source replacement",
    bestFor: "best RAG quality if available",
    downside: "depends on finding better PDF/source text",
  },
];

export function getOcrFallbackInfo() {
  return {
    message:
      "OCR is required when PDFLoader cannot extract reliable text from a PDF.",
    whenNeeded: [
      "Scanned PDF",
      "Image-only PDF",
      "Empty extracted text",
      "Broken/unreliable extracted text",
      "Legacy-font PDF that cannot be safely decoded",
    ],
    options: OCR_FALLBACK_OPTIONS,
  };
}

export default getOcrFallbackInfo;