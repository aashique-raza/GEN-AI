// LangChain ka standard Document object.
// RAG me raw text ko isi format me normalize kiya jata hai.
import { Document } from "@langchain/core/documents";



const document = new Document({
  pageContent:
    "Chlorophyll is the green pigment present in leaves. It helps plants absorb sunlight.",

  metadata: {
    classLevel: "10",
    subject: "science",
    chapter: "life-processes",
    board: "bihar-board",
    source: "data/class-10/science/life-processes.txt",
  },
});

// Full object debug
console.log("\n--- FULL LANGCHAIN DOCUMENT ---");
console.log(document);

// Actual text
console.log("\n--- PAGE CONTENT ---");
console.log(document.pageContent);

// Metadata
console.log("\n--- METADATA ---");
console.log(document.metadata);

// Raw RAG style mapping
console.log("\n--- RAW RAG STYLE MAPPING ---");
console.log({
  content: document.pageContent,
  metadata: document.metadata,
});