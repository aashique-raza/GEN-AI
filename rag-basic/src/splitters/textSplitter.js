export function splitDocumentIntoChunks(document, paragraphsPerChunk = 5) {
  const paragraphs = document.text
    .split(/\n\s*\n/)
    .map((para) => para.trim())
    .filter(Boolean);

  const chunks = [];

  for (let i = 0; i < paragraphs.length; i += paragraphsPerChunk) {
    const chunkParagraphs = paragraphs.slice(i, i + paragraphsPerChunk);

    chunks.push({
      text: chunkParagraphs.join("\n\n"),
      metadata: {
        ...document.metadata,
        chunkIndex: chunks.length,
      },
    });
  }

  return chunks;
}

export function splitDocumentsIntoChunks(documents, paragraphsPerChunk = 5) {
  const allChunks = [];

  for (const document of documents) {
    const chunks = splitDocumentIntoChunks(document, paragraphsPerChunk);
    allChunks.push(...chunks);
  }

  return allChunks;
}