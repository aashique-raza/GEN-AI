import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";
import { createCipheriv } from "crypto";

// class CustomTxtLoader {
//   constructor(filePath, metadata = {}) {
//     this.filePath = filePath;
//     this.metadata = metadata;
//   }

//   async load() {
//     const absolutePath = path.resolve(this.filePath);
//     const text = await fs.readFile(absolutePath, "utf-8");

//     return [
//       new Document({
//         pageContent: text,
//         metadata: {
//           ...this.metadata,
//           source: this.filePath,
//         },
//       }),
//     ];
//   }
// }

// const loader = new CustomTxtLoader("data/class-10/science/life-processes.txt", {
//   classLevel: "10",
//   subject: "science",
//   chapter: "life-processes",
//   board: "bihar-board",
// });

// const docs = await loader.load();

// console.log("\n--- TOTAL DOCUMENTS ---");
// console.log(docs.length);

// console.log("\n--- DOCUMENT 1 PAGE CONTENT ---");
// console.log(docs[0].pageContent);

// console.log("\n--- DOCUMENT 1 METADATA ---");
// console.log(docs[0].metadata);

// const loader = new CustomTxtLoader("data/cricketer/virat_kohli/01-virat-kohli.txt", {
//   cricketer: "virat kohli",
//   subject: "about-virat-kohli",
  
// });

// const docs = await loader.load();

// console.log("\n--- TOTAL DOCUMENTS ---");
// console.log(docs.length);

// console.log("\n--- DOCUMENT 1 PAGE CONTENT ---");
// console.log(docs[0].pageContent);

// console.log("\n--- DOCUMENT 1 METADATA ---");
// console.log(docs[0].metadata);


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
    const absolutePath = path.resolve(this.filePath);
    const text = await fs.readFile(absolutePath, "utf-8");

    const metadata = extractMetadataFromPath(this.filePath);

    return [
      new Document({
        pageContent: text,
        metadata,
      }),
    ];
  }
}

const loader = new CustomTxtLoader("data/class-10/science/life-processes.txt");

const docs = await loader.load();

console.log("\n--- TOTAL DOCUMENTS ---");
console.log(docs.length);

console.log("\n--- PAGE CONTENT PREVIEW ---");
console.log(docs[0].pageContent.slice(0, 120));

console.log("\n--- AUTO METADATA ---");
console.log(docs[0].metadata);