export function decidePdfSourceQuality(pageReports) {
  const totalPages = pageReports.length;

  const counts = pageReports.reduce((acc, report) => {
    acc[report.status] = (acc[report.status] || 0) + 1;
    return acc;
  }, {});

  const badHindiPages = counts.BAD_HINDI_ENCODING || 0;
  const emptyPages = counts.EMPTY_OR_SCANNED || 0;
  const usablePages = counts.USABLE || 0;

  const badHindiRatio = totalPages ? badHindiPages / totalPages : 0;
  const emptyRatio = totalPages ? emptyPages / totalPages : 0;
  const usableRatio = totalPages ? usablePages / totalPages : 0;

  if (totalPages === 0) {
    return {
      status: "NO_PAGES",
      canIndexForRag: false,
      reason: "No pages found in PDF.",
      counts,
    };
  }

  if (badHindiRatio > 0.5) {
    return {
      status: "BAD_HINDI_ENCODING",
      canIndexForRag: false,
      reason: "Most pages have garbled Hindi text extraction.",
      counts,
    };
  }

  if (emptyRatio > 0.5) {
    return {
      status: "SCANNED_OR_EMPTY",
      canIndexForRag: false,
      reason: "Most pages have little or no extractable text.",
      counts,
    };
  }

  if (usableRatio > 0.7) {
    return {
      status: "USABLE",
      canIndexForRag: true,
      reason: "Most pages have readable extracted text.",
      counts,
    };
  }

  return {
    status: "MIXED_QUALITY",
    canIndexForRag: false,
    reason: "PDF has mixed text quality. Needs manual review.",
    counts,
  };
}