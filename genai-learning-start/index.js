import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



let mode = 'simple'

function buildPrompt(userInput) {
  if (mode === 'simple') {
    return userInput;
  }

  if (mode === 'beginner') {
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

  if (mode === 'hinglish') {
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

  if (mode === 'interview') {
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

  if (mode === 'bullet') {
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

  if (mode === 'code') {
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
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: finalPrompt,
    });

    console.log('\nAI:');
    console.log(response.text);
  } catch (error) {
    console.log('Error:', error.message);
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



async function startChat() {
  const rl = readline.createInterface({ input, output });
  const userInput = await rl.question('\nYou: ');

  
  if (userInput.toLowerCase() === 'exit') {
    console.log('Chat closed.');
    rl.close();
    return;
  }

  if (!userInput.trim()) {
    console.log('Please type something.');
    return startChat();
  }

    if (userInput === '/modes') {
    showModes();
    return startChat();
  }

  if (userInput.startsWith('/mode ')) {
    const selectedMode = userInput.split(' ')[1];

    const allowedModes = ['simple', 'beginner', 'hinglish', 'interview', 'bullet', 'code'];

    if (!allowedModes.includes(selectedMode)) {
      console.log('Invalid mode. Type /modes to see available modes.');
      return startChat();
    }

    mode = selectedMode;
    console.log(`Mode changed to: ${mode}`);
    return startChat();
  }

   if (!userInput.trim()) {
    console.log('Please type something.');
    return startChat();
  }

  await aiResponse(userInput);

  return startChat();
}

console.log('Gemini CLI started.');
console.log("Type your question. Type 'exit' to quit.");
console.log("Type '/modes' to see prompt modes.");

startChat();
