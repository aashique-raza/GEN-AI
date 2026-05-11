import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

function extractMetadataFromPath(filePath) {
  const normalizedPath = normalizePath(filePath);
  const parts = normalizedPath.split("/");

  const dataIndex = parts.indexOf("data");
  const classFolder = parts[dataIndex + 1];
  const subject = parts[dataIndex + 2];

  const fileName = path.basename(normalizedPath);
  const chapter = fileName.replace(".txt", "");

  return {
    classLevel: classFolder?.replace("class-", ""),
    subject,
    chapter,
    board: "bihar-board",
    source: normalizedPath,
  };
}

async function findTxtFiles(folderPath) {
  const entries = await fs.readdir(folderPath, { withFileTypes: true });
  const txtFiles = [];

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await findTxtFiles(fullPath);
      txtFiles.push(...nestedFiles);
    }

    if (entry.isFile() && path.extname(entry.name) === ".txt") {
      txtFiles.push(normalizePath(fullPath));
    }
  }

  return txtFiles;
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

async function loadTxtFolder(folderPath) {
  const filePaths = await findTxtFiles(folderPath);
  const allDocs = [];

  filePaths.sort();

  for (const filePath of filePaths) {
    const loader = new CustomTxtLoader(filePath);
    const docs = await loader.load();

    allDocs.push(...docs);
  }

  return allDocs;
}

const docs = await loadTxtFolder("data/class-10/science");

console.log("\n--- TOTAL DOCUMENTS LOADED FROM FOLDER ---");
console.log(docs.length);

docs.forEach((doc, index) => {
  console.log(`\n--- DOCUMENT ${index + 1} ---`);
  console.log("Source:", doc.metadata.source);
  console.log("Chapter:", doc.metadata.chapter);
  console.log("Preview:", doc.pageContent.slice(0, 100));
});