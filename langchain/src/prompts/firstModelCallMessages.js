export function getFirstModelCallMessages() {
  return [
    {
      role: "system",
      content:
        "You are a simple Hinglish AI tutor. Answer clearly, briefly, and step by step.",
    },
    {
      role: "user",
      content: "RAG ko 5 lines me explain karo.",
    },
  ];
}