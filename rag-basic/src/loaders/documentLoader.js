import fs from "node:fs/promises";
import path from "node:path";

async function getTxtFilesRecursive(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await getTxtFilesRecursive(fullPath);
      files.push(...nestedFiles);
    }

    if (entry.isFile() && entry.name.endsWith(".txt")) {
      files.push(fullPath);
    }
  }

  return files;
}

function extractMetadataFromFilePath(filePath) {
  const normalizedPath = filePath.split(path.sep).join("/");

  const parts = normalizedPath.split("/");

  const dataIndex = parts.indexOf("data");

  const classFolder = parts[dataIndex + 1];   // class-10
  const subject = parts[dataIndex + 2];       // science
  const fileName = parts[dataIndex + 3];      // life-processes.txt

  const classLevel = classFolder?.replace("class-", "");
  const chapter = fileName?.replace(".txt", "");

  return {
    classLevel,
    subject,
    chapter,
    board: "bihar-board",
    source: normalizedPath,
  };
}

export async function loadTxtDocuments(dataDir = "data") {
  const txtFiles = await getTxtFilesRecursive(dataDir);

  if (txtFiles.length === 0) {
    throw new Error(`No .txt files found inside ${dataDir}`);
  }

  const documents = [];

  for (const filePath of txtFiles) {
    const text = await fs.readFile(filePath, "utf-8");

    documents.push({
      text,
      metadata: extractMetadataFromFilePath(filePath),
    });
  }

  return documents;
}