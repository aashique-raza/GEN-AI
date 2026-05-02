import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

let mode = "simple";
let style = "normal";

let chatHistory = [];
const MAX_HISTORY_ITEMS = 12;

function buildSystemInstruction() {
  if (style === "normal") {
    return `
You are a helpful AI assistant.
Answer clearly and correctly.
`;
  }

  if (style === "short") {
    return `
You are a concise AI assistant.
Rules:
- Keep answers short
- No long explanation
- Give direct answer first
`;
  }

  if (style === "detailed") {
    return `
You are a detailed teacher.
Rules:
- Explain step by step
- Use examples
- Explain why, not only what
`;
  }

  if (style === "strict") {
    return `
You are a direct technical mentor.
Rules:
- No motivational fluff
- Be blunt and practical
- Point out mistakes clearly
- Focus on what works
`;
  }

  if (style === "teacher") {
    return `
You are a beginner-friendly MERN stack teacher.
Rules:
- Use simple English
- Explain like teaching a junior developer
- Use practical examples
`;
  }

  if (style === "interviewer") {
    return `
You are a senior technical interviewer.
Rules:
- Answer in interview-ready format
- Mention practical project usage
- Keep the explanation professional
`;
  }

  return "You are a helpful AI assistant.";
}

function buildPrompt(userInput) {
  if (mode === "simple") {
    return userInput;
  }

  if (mode === "beginner") {
    return `
Explain this like I am an absolute beginner MERN developer.

Question:
${userInput}

Rules:
- Use simple English
- Avoid heavy theory
- Give one small example
`;
  }

  if (mode === "hinglish") {
    return `
Is question ka answer simple Hinglish me do.

Question:
${userInput}

Rules:
- Hindi + English mix use karo
- Beginner friendly explanation do
- Ek real-world example do
`;
  }

  if (mode === "interview") {
    return `
Answer this like I am in a technical interview.

Question:
${userInput}

Format:
1. Short definition
2. Why it is used
3. Real project example
4. One-line final summary
`;
  }

  if (mode === "bullet") {
    return `
Answer the question in clean bullet points.

Question:
${userInput}

Rules:
- No long paragraphs
- Maximum 6 bullet points
- Keep it direct
`;
  }

  if (mode === "code") {
    return `
Explain this with a small JavaScript or Node.js code example.

Question:
${userInput}

Rules:
- First explain the concept
- Then give code
- Then explain the code line by line
`;
  }

  return userInput;
}

async function aiResponse(prompt) {
  const finalPrompt = buildPrompt(prompt);
  try {
    const currentUserMessage = {
      role: "user",
      parts: [{ text: finalPrompt }],
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [...chatHistory, currentUserMessage],
      config: {
        systemInstruction: buildSystemInstruction(),
      },
    });

    console.log("\nAI:");
    console.log(response.text);

    chatHistory.push(currentUserMessage);

    chatHistory.push({
      role: "model",
      parts: [{ text: response.text }],
    });

    if (chatHistory.length > MAX_HISTORY_ITEMS) {
      chatHistory = chatHistory.slice(-MAX_HISTORY_ITEMS);
    }
  } catch (error) {
    console.log("Error:", error.message);
  }
}

function showModes() {
  console.log(`
Available modes:

/mode simple      → normal answer
/mode beginner    → beginner explanation
/mode hinglish    → Hinglish explanation
/mode interview   → interview-style answer
/mode bullet      → bullet-point answer
/mode code        → code-based answer

Current mode: ${mode}
`);
}

function showStyles() {
  console.log(`
Available styles:

/style normal       → default helpful answer
/style short        → short and direct
/style detailed     → deep step-by-step explanation
/style strict       → blunt technical mentor style
/style teacher      → beginner-friendly teacher
/style interviewer  → senior interviewer style

Current style: ${style}
`);
}

async function startChat() {
  const rl = readline.createInterface({ input, output });
  const userInput = await rl.question("\nYou: ");
  const command = userInput.trim().toLowerCase();

  if (userInput.toLowerCase() === "exit") {
    console.log("Chat closed.");
    rl.close();
    return;
  }

  if (userInput === "/modes") {
    showModes();
    return startChat();
  }

  if (command === "/styles") {
    showStyles();
    return startChat();
  }

  if (command === '/clear') {
  chatHistory = [];
  console.log('Chat history cleared.');
  return startChat();
}

if (command === '/history') {
  console.log(JSON.stringify(chatHistory, null, 2));
  return startChat();
}

  if (userInput.startsWith("/mode ")) {
    const selectedMode = userInput.split(" ")[1];

    const allowedModes = [
      "simple",
      "beginner",
      "hinglish",
      "interview",
      "bullet",
      "code",
    ];

    if (!allowedModes.includes(selectedMode)) {
      console.log("Invalid mode. Type /modes to see available modes.");
      return startChat();
    }

    mode = selectedMode;
    console.log(`Mode changed to: ${mode}`);
    return startChat();
  }

  if (command.startsWith("/style ")) {
    const selectedStyle = command.split(" ")[1];

    const allowedStyles = [
      "normal",
      "short",
      "detailed",
      "strict",
      "teacher",
      "interviewer",
    ];

    if (!allowedStyles.includes(selectedStyle)) {
      console.log("Invalid style. Type /styles to see available styles.");
      return startChat();
    }

    style = selectedStyle;
    console.log(`Style changed to: ${style}`);
    return startChat();
  }

  if (!userInput.trim()) {
    console.log("Please type something.");
    return startChat();
  }

  await aiResponse(userInput);

  return startChat();
}

console.log("Gemini CLI started.");
console.log("Type your question. Type 'exit' to quit.");
console.log("Type '/modes' to see prompt modes.");
console.log("Type '/styles' to see response styles.");

startChat();
