import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

if (!env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in .env file");
}

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const REFUSAL_MESSAGE =
  "Sorry, I can only answer Class 10 and Class 12 Bihar Board syllabus, exam, and book-related questions.";

const cleanJsonResponse = (text) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
};

export const classifyStudentMessage = async ({
  classLevel,
  message,
  history = [],
}) => {
  const conversationHistory = formatHistory(history);

  const prompt = `
You are a strict classifier for a Bihar Board study assistant.

The assistant is allowed to answer ONLY:
- Bihar Board Class 10 academic study questions
- Bihar Board Class 12 academic study questions
- Bihar Board syllabus questions
- Bihar Board exam preparation questions
- Bihar Board textbook/book/chapter based questions
- Class 10 or Class 12 subject explanation questions
- Bihar Board Class 10 or Class 12 exam paper requests
- Previous year paper requests
- Model paper requests
- Sample paper requests
- Important question requests
- Year-specific Bihar Board paper requests
- Follow-up questions that clearly continue a previous allowed academic topic

Important exam-paper rule:
If the student asks for "2026 paper", "this year paper", "exam paper chahiye", "question paper chahiye", "model paper", or "previous year paper" for Bihar Board Class 10 or Class 12, classify it as allowed.
Do not reject it only because it asks for an exam paper.
Reason should be: "Exam paper request. Exact official paper requires verified source."

The assistant must reject:
- coding/programming
- job/career/resume
- politics unrelated to syllabus
- movies/songs
- health/diet/gym
- finance/trading/crypto
- social media
- general personal advice
- anything outside Class 10 or Class 12 Bihar Board academics

Student selected class: ${classLevel}

Previous conversation:
${conversationHistory}

Current student message:
${message}

Important:
If the current message is a follow-up like "aur short me batao", "example do", "notes bnao", "MCQ do", and previous conversation was about Bihar Board Class 10/12 academics, allow it.

Return ONLY valid JSON. No markdown. No explanation.

JSON format:
{
  "isAllowed": true,
  "subject": "Mathematics",
  "topic": "Bihar Board 2026 Math Exam Paper",
  "reason": "Exam paper request. Exact official paper requires verified source."
}

If rejected:
{
  "isAllowed": false,
  "subject": null,
  "topic": null,
  "reason": "Out of scope",
  "studentMessage": "Sorry, I can only answer Class 10 and Class 12 Bihar Board syllabus, exam, and book-related questions."
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      temperature: 0,
    },
  });

  try {
    const cleaned = cleanJsonResponse(response.text);
    return JSON.parse(cleaned);
  } catch (error) {
    return {
      isAllowed: false,
      subject: null,
      topic: null,
      reason: "Classifier returned invalid JSON",
    };
  }
};

const buildSystemInstruction = () => {
  return `
You are BiharBoard AI Tutor.

Your job:
Help students study ONLY Bihar Board Class 10 and Class 12 syllabus, exams, and books.

Allowed scope:
- Bihar Board Class 10 syllabus
- Bihar Board Class 12 syllabus
- Bihar Board textbook/book based questions
- Bihar Board exam preparation
- Subject explanations for Class 10 and Class 12
- Chapter/topic explanation, definitions, examples, short notes, long answers, MCQs

Strict rules:
1. Answer ONLY if the question is related to Bihar Board Class 10 or Class 12 academic study.
2. If the question is outside this scope, refuse.
3. Do not answer coding, programming, job, politics, movies, health, finance, trading, crypto, social media, or personal advice.
4. Use the provided class level.
5. Infer subject and chapter from the student's message when possible.
6. Do not ask for subject/chapter unless absolutely required.
7. Answer in simple Hinglish.
8. Keep answer exam-focused.
9. Do not invent syllabus or book facts.
10. If unsure, say: "Mere paas is syllabus/book ka verified context nahi hai."

Fixed refusal message:
"${REFUSAL_MESSAGE}"
`;
};

const buildUserPrompt = ({ classLevel, message, history = [], classification }) => {
  const conversationHistory = formatHistory(history);

  return `
Student class:
Class ${classLevel}

Detected subject:
${classification.subject || "Unknown"}

Detected topic:
${classification.topic || "Unknown"}

Previous conversation:
${conversationHistory}

Current student message:
${message}

Answer rules:
- Pehle direct answer do
- Simple Hinglish use karo
- Bihar Board exam point of view se explain karo
- Follow-up question ho to previous conversation ka context use karo
- Subject/chapter ko infer karo
- Agar definition type question hai: definition + explanation + example do
- Agar exam answer type question hai: points me answer do
- Agar student asks for short answer, give short answer
- Agar student asks for notes, give notes format
- Agar student asks for MCQ, give MCQs with answers

Exam paper rule:
- If student asks for exact official current-year paper, board paper, or PDF, do not invent it.
- Do not claim you have the official paper unless it is provided in context.
- Say clearly: "Mere paas official verified paper/source available nahi hai."
- Then offer: model paper, important questions, previous-year style practice set, or chapter-wise questions.

Agar out of scope hai: fixed refusal message do
`;
};

export const generateBiharBoardAnswer = async ({
  classLevel,
  message,
  classification,
}) => {
  const prompt = buildUserPrompt({
    classLevel,
    message,
    classification,
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: prompt,
    config: {
      systemInstruction: buildSystemInstruction(),
      temperature: 0.3,
    },
  });

  return response.text;
};

const formatHistory = (history = []) => {
  if (!Array.isArray(history) || history.length === 0) {
    return "No previous conversation.";
  }

  return history
    .slice(-6)
    .map((item) => {
      const role = item.role === "assistant" ? "Assistant" : "Student";
      return `${role}: ${item.text}`;
    })
    .join("\n");
};

export { REFUSAL_MESSAGE };
