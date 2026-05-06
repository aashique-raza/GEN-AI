function formatScore(score) {
  if (typeof score !== "number") return "N/A";
  return score.toFixed(3);
}

function formatMetadata(metadata = {}) {
  const parts = [];

  if (metadata.classLevel) parts.push(`Class: ${metadata.classLevel}`);
  if (metadata.subject) parts.push(`Subject: ${metadata.subject}`);
  if (metadata.chapter) parts.push(`Chapter: ${metadata.chapter}`);
  if (metadata.board) parts.push(`Board: ${metadata.board}`);
  if (metadata.source) parts.push(`File: ${metadata.source}`);
  if (metadata.chunkIndex !== undefined) {
    parts.push(`Chunk: ${metadata.chunkIndex}`);
  }

  return parts.join("\n");
}

export function buildContextFromSources(results = []) {
  if (!Array.isArray(results)) {
    throw new Error("Results must be an array");
  }

  return results
    .map((item, index) => {
      return `Source ${index + 1}
Score: ${formatScore(item.score)}
${formatMetadata(item.metadata)}

Content:
${item.text}`;
    })
    .join("\n\n---\n\n");
}

export function formatSourcesForResponse(results = []) {
  if (!Array.isArray(results)) {
    throw new Error("Results must be an array");
  }

  return results.map((item, index) => ({
    sourceNumber: index + 1,
    score: item.score,
    formattedScore: formatScore(item.score),
    metadata: item.metadata,
    text: item.text,
  }));
}