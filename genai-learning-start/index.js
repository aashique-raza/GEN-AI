import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



// console.log('Gemini CLI started.');
// console.log("Type your question. Type 'exit' to quit.");

async function aiResponse(input){
   
    try {
        const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: input,
    });

    console.log('\nAI:');
    console.log(response.text);
    } catch (error) {
        console.log('Error',error.message)
    }
}

 async function startChat(){
  const rl = readline.createInterface({ input, output });
  const userInput = await rl.question('\nYou: ');

    if (!userInput.trim()) {
    console.log('Please type something.');
    
  }

   await aiResponse(userInput)
   startChat()
}

startChat()

