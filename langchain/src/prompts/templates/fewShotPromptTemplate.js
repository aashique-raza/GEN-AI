// Few-shot prompt means we show examples to the model.
// Goal: teach answer style through examples.
//
// Example use:
// User asks a topic.
// Model should answer in short Hinglish style.

import {
  FewShotPromptTemplate,
  PromptTemplate,
} from "@langchain/core/prompts";

// Each example has input and output.
// These examples teach the model the expected answer style.
const examples = [
  {
    topic: "RAG",
    answer:
      "RAG ka matlab Retrieval-Augmented Generation hota hai. Isme model answer dene se pehle relevant data retrieve karta hai, phir us context se answer banata hai.",
  },
  {
    topic: "Vector Store",
    answer:
      "Vector Store ek searchable memory hoti hai jaha embeddings store hote hain. User question ke similar chunks yahi se milte hain.",
  },
];

// This template controls how each example will look inside the final prompt.
const examplePrompt = PromptTemplate.fromTemplate(`
Topic: {topic}
Answer: {answer}
`);

// Final few-shot prompt.
export const fewShotTopicPromptTemplate = new FewShotPromptTemplate({
  examples,
  examplePrompt,

  // Prefix = examples se pehle fixed instruction
  prefix: `
You are a simple Hinglish AI tutor.

Follow the same answer style as the examples.
Keep the answer short, clear, and beginner-friendly.

Examples:
`,

  // Suffix = examples ke baad current user input
  suffix: `
Now answer this:

Topic: {topic}
Answer:
`,

  // Only this variable will come from user input.
  inputVariables: ["topic"],

  // Separator between examples.
  exampleSeparator: "\n---\n",
});