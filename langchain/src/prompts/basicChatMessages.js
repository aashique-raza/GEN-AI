// * This function builds messages for a basic chat model call.
// * LangChain chat models expect an array of messages.
// ! Role names must be correct: "system" and "user".

export function buildBasicChatMessages(userInput) {
  return [
    {
      role: "system",

      // * System message controls model behavior.
      // * Later we will experiment with different system prompts.
      content:
        "You are a simple Hinglish AI tutor. Answer clearly, briefly, and step by step.",
    },
    {
      role: "user",

      // * User message is the actual question typed in CLI.
      content: userInput,
    },
  ];
}