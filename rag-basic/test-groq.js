import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function testGroq() {
  try {
    const response = await client.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "Explain RAG in 3 simple lines. RAG means Retrieval-Augmented Generation...",
        },
      ],
      temperature: 0.2,
    });

    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Groq Error:", error.message);
    console.error(error);
  }
}

testGroq();