import fs from "fs/promises";
import path from "path";
import { Document } from "@langchain/core/documents";
import { extractMetadataFromPath } from "../utils/pathMetadata.js";

export class CustomTxtLoader {
  constructor(filePath, extraMetadata = {}) {
    this.filePath = filePath;
    this.extraMetadata = extraMetadata;
  }

  async load() {
    const absolutePath = path.resolve(this.filePath);
    const text = await fs.readFile(absolutePath, "utf-8");

    return [
      new Document({
        pageContent: text,
        metadata: {
          ...extractMetadataFromPath(this.filePath),
          ...this.extraMetadata,
        },
      }),
    ];
  }
}