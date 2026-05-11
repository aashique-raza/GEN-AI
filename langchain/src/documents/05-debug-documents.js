import { Document } from "@langchain/core/documents";
import { debugDocuments } from "./utils/debugDocuments.js";

const docs = [
  new Document({
    pageContent:
      "Chlorophyll is the green pigment present in leaves. It helps plants absorb sunlight.",
    metadata: {
      classLevel: "10",
      subject: "science",
      chapter: "life-processes",
      board: "bihar-board",
      source: "data/class-10/science/life-processes.txt",
    },
  }),

  new Document({
    pageContent:
      "Hormones are chemical messengers secreted by endocrine glands.",
    metadata: {
      classLevel: "10",
      subject: "science",
      chapter: "control-and-coordination",
      board: "bihar-board",
      source: "data/class-10/science/control-and-coordination.txt",
    },
  }),
];

debugDocuments(docs, {
  previewLength: 80,
});