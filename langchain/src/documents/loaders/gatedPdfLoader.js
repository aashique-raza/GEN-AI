import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { extractMetadataFromPath } from "../utils/pathMetadata.js";
import { analyzeTextQuality } from "../utils/textQuality.js";
import { decidePdfSourceQuality } from "../utils/pdfDecision.js";

export async function loadPdfWithQualityGate(filePath) {
  const loader = new PDFLoader(filePath, {
    splitPages: true,
  });

  const rawDocs = await loader.load();
  const baseMetadata = extractMetadataFromPath(filePath);

  const docs = rawDocs.map((doc, index) => {
    const pageNumber = doc.metadata.loc?.pageNumber ?? index + 1;

    return new Document({
      pageContent: doc.pageContent,
      metadata: {
        ...doc.metadata,
        ...baseMetadata,
        pageNumber,
      },
    });
  });

  const pageReports = docs.map((doc) => {
    const quality = analyzeTextQuality(doc.pageContent);

    return {
      page: doc.metadata.pageNumber,
      status: quality.status,
      chars: quality.totalChars,
      devanagariRatio: quality.devanagariRatio,
      latinRatio: quality.latinRatio,
      preview: doc.pageContent.slice(0, 80).replaceAll("\n", " "),
    };
  });

  const decision = decidePdfSourceQuality(pageReports);

  return {
    docs: decision.canIndexForRag ? docs : [],
    blockedDocs: decision.canIndexForRag ? [] : docs,
    pageReports,
    decision,
  };
}