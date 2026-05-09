// * This utility cleans raw terminal input before we use it.
// * Main purpose: remove accidental prefixes like "You:" from user input.
// * Example: "You: RAG kya hai?" -> "RAG kya hai?"

export function cleanUserInput(rawInput) {
  // * First remove extra spaces from start/end.
  let cleanedInput = rawInput.trim();

  // * Remove repeated accidental prefixes.
  // * Example: "You: You: RAG kya hai?" -> "RAG kya hai?"
  // ! This is useful because CLI already shows "You:" prompt.
  while (/^(you|user)\s*:\s*/i.test(cleanedInput)) {
    cleanedInput = cleanedInput.replace(/^(you|user)\s*:\s*/i, "").trim();
  }

  // * Return clean question/command.
  return cleanedInput;
}