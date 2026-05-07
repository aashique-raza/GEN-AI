import "dotenv/config";

export const env = {
  CHAT_PROVIDER: process.env.CHAT_PROVIDER || "groq",

  GROQ_API_KEY: process.env.GROQ_API_KEY,
  GROQ_MODEL: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",

  HF_TOKEN: process.env.HF_TOKEN,
  HF_MODEL: process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct",

  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  EMBEDDING_PROVIDER: process.env.EMBEDDING_PROVIDER || "gemini",
};