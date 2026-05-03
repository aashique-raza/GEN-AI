import "dotenv/config";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { createRagSystem, askRag } from "./rag/ragPipeline.js";

async function startCli() {
//   console.log("Building RAG system...");

  const ragSystem = await createRagSystem({
    filePath: "data/class-10/science/life-processes.txt",
    metadata: {
      classLevel: "10",
      subject: "science",
      chapter: "life-processes",
      board: "bihar-board",
    },
  });

  console.log("RAG system ready.");
  console.log("Total chunks:", ragSystem.totalChunks);
  console.log("\nAsk questions related to this document.");
  console.log("Type 'exit' to quit.\n");

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
      const result = await askRag({
        vectorStore: ragSystem.vectorStore,
        question: trimmedQuestion,
        topK: 3,
        minScore: 0.55,
      });

      console.log("\nAI:");
      console.log(result.answer);

      if (result.sources.length > 0) {
        console.log("\nSources used:");
        result.sources.forEach((source, index) => {
          console.log(
            `${index + 1}. Score: ${source.score.toFixed(4)} | Chunk: ${
              source.metadata.chunkIndex
            }`,
          );
        });
      } else {
        console.log("\nSources used: none");
      }

      console.log("");
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

startCli().catch((error) => {
  console.error("Fatal Error:", error.message);
});
