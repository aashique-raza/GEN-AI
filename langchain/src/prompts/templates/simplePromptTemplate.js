
import { PromptTemplate } from "@langchain/core/prompts";


export const staticRagPrompt = PromptTemplate.fromTemplate(`
Explain RAG in simple Hinglish in 5 lines.
`);


export const dynamicTopicPrompt = PromptTemplate.fromTemplate(`
Explain {topic} in simple Hinglish.

Rules:
- Keep it short.
- Use simple words.
- Give one small example.
`);