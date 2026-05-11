export function debugDocuments(docs, options = {}) {
  const previewLength = options.previewLength || 120;

  console.log("\n--- DOCUMENT DEBUG ---");
  console.log("Total documents:", docs.length);

  docs.forEach((doc, index) => {
    console.log(`\n--- DOCUMENT ${index + 1} ---`);
    console.log("Content length:", doc.pageContent.length);
    console.log("Preview:", doc.pageContent.slice(0, previewLength));
    console.log("Metadata:", doc.metadata);
  });
}