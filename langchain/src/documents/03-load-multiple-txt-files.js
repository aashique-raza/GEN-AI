import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";

function extractMetadataFromPath(filePath) {
  const normalizedPath = filePath.replaceAll("\\", "/");
  const parts = normalizedPath.split("/");

  const fileName = parts.at(-1);
  const chapter = fileName.replace(".txt", "");

  return {
    classLevel: parts[1]?.replace("class-", ""),
    subject: parts[2],
    chapter,
    board: "bihar-board",
    source: normalizedPath,
  };
}

class CustomTxtLoader {
  constructor(filePath) {
    this.filePath = filePath;
  }

  async load() {
    const text = await fs.readFile(path.resolve(this.filePath), "utf-8");

    return [
      new Document({
        pageContent: text,
        metadata: extractMetadataFromPath(this.filePath),
      }),
    ];
  }
}

async function loadMultipleTxtFiles(filePaths) {
  const allDocs = [];

  for (const filePath of filePaths) {
    const loader = new CustomTxtLoader(filePath);
    const docs = await loader.load();

    allDocs.push(...docs);
  }

  return allDocs;
}

const filePaths = [
  "data/class-10/science/life-processes.txt",
  "data/class-10/science/control-and-coordination.txt",
];

const docs = await loadMultipleTxtFiles(filePaths);

console.log("\n--- TOTAL DOCUMENTS ---");
console.log(docs.length);

docs.forEach((doc, index) => {
  console.log(`\n--- DOCUMENT ${index + 1} ---`);
  console.log("Preview:", doc.pageContent.slice(0, 100));
  console.log("Metadata:", doc.metadata);
});