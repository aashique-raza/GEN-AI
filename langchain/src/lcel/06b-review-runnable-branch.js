// src/lcel/06b-review-runnable-branch.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();


const sentimentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a strict sentiment classifier.
Return only one word: positive, negative, or neutral.
No explanation.`,
  ],

  ["human", "Review: The product is good and I am happy with it. What is the sentiment?"],
  ["ai", "positive"],

  ["human", "Review: The product is bad and I am unhappy with it. What is the sentiment?"],
  ["ai", "negative"],

  ["human", "Review: The product is okay. What is the sentiment?"],
  ["ai", "neutral"],

  ["human", "Review: {review}. What is the sentiment?"],
]);

const sentimentChain = sentimentPrompt.pipe(model).pipe(parser);

/**
 * 2. Response chains
 * Ye branches hain.
 */
const positiveResponseChain = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a positive review.
Reply warmly in Hinglish.
Keep it short.`,
  ],
  ["human", "Review: {review}"],
]).pipe(model).pipe(parser);

const negativeResponseChain = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a negative review.
Apologize briefly, accept the issue, and say you will improve.
Reply in Hinglish. Keep it short.`,
  ],
  ["human", "Review: {review}"],
]).pipe(model).pipe(parser);

const neutralResponseChain = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a neutral review.
Thank them and ask for one specific improvement suggestion.
Reply in Hinglish. Keep it short.`,
  ],
  ["human", "Review: {review}"],
]).pipe(model).pipe(parser);

/**
 * 3. RunnableBranch
 * Input shape:
 * {
 *   review: "...",
 *   sentiment: "positive" | "negative" | "neutral"
 * }
 */
const responseBranch = RunnableBranch.from([
  [
    (input) => input.sentiment === "positive",
    positiveResponseChain,
  ],
  [
    (input) => input.sentiment === "negative",
    negativeResponseChain,
  ],

  // Default branch = neutral response
  neutralResponseChain,
]);

/**
 * 4. Full chain
 *
 * Step 1:
 * review se sentiment nikalo
 *
 * Step 2:
 * review + sentiment ko branch router me bhejo
 *
 * Step 3:
 * matching response chain run hogi
 */
const reviewResponseChain = RunnableSequence.from([
  {
    review: (input) => input.review,

    // Sentiment output ko normalize kar rahe hain
    sentiment: async (input) => {
      const sentiment = await sentimentChain.invoke({
        review: input.review,
      });

      return sentiment.trim().toLowerCase();
    },
  },

  responseBranch,
]);

const result = await reviewResponseChain.invoke({
  review: "The product is bad. Delivery was late and quality was poor.",
});

console.log("\n--- FINAL REVIEW RESPONSE ---\n");
console.log(result);