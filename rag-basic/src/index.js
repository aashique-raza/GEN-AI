import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
// import { createRagSystem, askRag } from "./rag/ragPipeline.js";
import { createRagSystem, askRag } from "./rag/ragPipelinemultiple.js";
import { generateWithGroq } from "./llm/groqClient.js";
// import { generateWithGroq } from "../llm/groqClient.js";

async function startCli() {
  //   console.log("Building RAG system...");

  // for single document load------
  // const ragSystem = await createRagSystem({
  //   filePath: "data/class-10/science/life-processes.txt",
  //   metadata: {
  //     classLevel: "10",
  //     subject: "science",
  //     chapter: "life-processes",
  //     board: "bihar-board",
  //   },
  // });

  // const ragSystem = await createRagSystem({
  //   dataDir: "data",
  //   paragraphsPerChunk: 5,
  //   minScore: 0.55,
  // });

  const ragSystem = await createRagSystem({
    dataDir: "data",
    paragraphsPerChunk: 1,
    minScore: 0.67,
    storagePath: "storage/vector-store.json",
    forceRebuild: false,
  });

  // console.log("RAG system ready.");
  // console.log("Total chunks:", ragSystem.totalChunks);
  // console.log("\nAsk questions related to this document.");
  // console.log("Type 'exit' to quit.\n");

  const rl = readline.createInterface({ input, output });

  while (true) {
    const question = await rl.question("You: ");

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      console.log("Please type a valid question.\n");
      continue;
    }

    if (trimmedQuestion.toLowerCase() === "exit") {
      console.log("Chat closed.");
      rl.close();
      break;
    }

    try {
      // {
      //   metadataFilter: {
      //     chapter: "life-processes",
      //   },
      // }
      // const result = await askRag(ragSystem, trimmedQuestion);
      const result = await askRag(ragSystem, trimmedQuestion, );

      console.log("\nAI:");
      console.log(result.answer);

      if (result.sources.length > 0) {
        console.log("\nSources used:");
        result.sources.forEach((source, index) => {
          console.log(
            `${index + 1}. Score: ${source.score.toFixed(4)} | Chapter: ${
              source.metadata.chapter
            } | Source: ${source.metadata.source} | Chunk: ${
              source.metadata.chunkIndex
            }`,
          );
        });
      } else {
        console.log("\nSources used: none");
      }

      console.log("");
    } catch (error) {
      console.error("Error stack:");
      console.error(error.stack);
    }
  }
}

startCli().catch((error) => {
  console.error("Fatal Error:", error.message);
});
