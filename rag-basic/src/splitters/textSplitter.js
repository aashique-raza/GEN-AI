function cleanParagraph(paragraph) {
  return paragraph.replace(/\s+/g, " ").trim();
}

export function splitTextIntoChunks(document) {
  if (!document?.pageContent) {
    throw new Error("Document pageContent is required");
  }

  const paragraphs = document.pageContent
    .split(/\n\s*\n/)
    .map(cleanParagraph)
    .filter(Boolean);

  if (paragraphs.length === 0) {
    throw new Error("No valid paragraphs found for chunking");
  }

  return paragraphs.map((paragraph, index) => {
    return {
      pageContent: paragraph,
      metadata: {
        ...document.metadata,
        chunkIndex: index,
      },
    };
  });
}