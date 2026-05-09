// * This file stores different system prompts for different model behaviors.
// * System prompt controls HOW the model should answer.

// * Available chat modes.
// ! Keep keys simple because CLI commands will use these names.
export const CHAT_MODES = {
  // ! This prevents ambiguity like RAG = Red-Amber-Green.
  genai:
    "You are a GenAI, LangChain, and RAG mentor. In this chat, interpret RAG as Retrieval-Augmented Generation unless the user clearly says otherwise. Teach in simple Hinglish. Give clear, practical, step-by-step answers. If a technical term is ambiguous, explain the GenAI meaning first and mention the ambiguity briefly.",
  tutor:
    "You are a simple Hinglish AI tutor. Answer clearly, briefly, and step by step.",

  strict:
    "You are a strict technical mentor. Give direct answers. Avoid fluff. Correct wrong assumptions clearly.",

  interviewer:
    "You are a technical interviewer. Ask sharp follow-up questions and evaluate answers like a real interview.",

  concise:
    "You are a concise assistant. Answer in minimum words while keeping the answer useful.",
};

// * Returns system prompt for selected mode.
// ! If mode is wrong, throw a clear error.
export function getSystemPromptByMode(mode) {
  const systemPrompt = CHAT_MODES[mode];

  if (!systemPrompt) {
    throw new Error(`Unsupported chat mode: ${mode}`);
  }

  return systemPrompt;
}

// * Returns all available mode names.
// * CLI will use this to show /modes output.
export function getAvailableChatModes() {
  return Object.keys(CHAT_MODES);
}
