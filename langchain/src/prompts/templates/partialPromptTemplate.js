// Partial Prompt Template.
// Goal: fix some prompt variables early,
// then fill remaining variables later at runtime.

import { PromptTemplate } from "@langchain/core/prompts";

// This base prompt has 2 variables:
// {language} and {topic}
export const baseExplanationPrompt = PromptTemplate.fromTemplate(`
Explain {topic} in {language}.

Rules:
- Keep it short.
- Use simple words.
- Give one practical example.
`);

// Factory function because .partial() is async.
// It returns a new prompt where language is already fixed.
export async function createHinglishExplanationPrompt() {
  return baseExplanationPrompt.partial({
    language: "simple Hinglish",
  });
}