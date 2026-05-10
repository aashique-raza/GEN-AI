// src/lcel/06-conditional-chain.js

import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();

// 1. Sentiment classification prompt
// Few-shot examples se model ko fixed output style sikha rahe hain.
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

// 2. Positive review response prompt
const positivePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a positive review.
Reply warmly in Hinglish.
Keep it short.
Do not overdo marketing.`,
  ],
  ["human", "User review: {review}"],
]);

const positiveResponseChain = positivePrompt.pipe(model).pipe(parser);

// 3. Negative review response prompt
const negativePrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a negative review.
Reply politely in Hinglish.
Accept the issue, apologize briefly, and say you will improve.
Keep it short.`,
  ],
  ["human", "User review: {review}"],
]);

const negativeResponseChain = negativePrompt.pipe(model).pipe(parser);

// 4. Neutral review response prompt
const neutralPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `User gave a neutral review.
Reply in Hinglish.
Thank them and ask for one specific improvement suggestion.
Keep it short.`,
  ],
  ["human", "User review: {review}"],
]);

const neutralResponseChain = neutralPrompt.pipe(model).pipe(parser);

// 5. Conditional router chain
// Pehle sentiment detect hoga.
// Phir sentiment ke basis par correct response chain chalegi.
const reviewResponseChain = RunnableLambda.from(async (input) => {
  const rawSentiment = await sentimentChain.invoke({
    review: input.review,
  });

  // Model output clean kar rahe hain
  const sentiment = rawSentiment.trim().toLowerCase();

  console.log("\n--- DETECTED SENTIMENT ---");
  console.log(sentiment);

  if (sentiment === "positive") {
    return await positiveResponseChain.invoke({
      review: input.review,
    });
  }

  if (sentiment === "negative") {
    return await negativeResponseChain.invoke({
      review: input.review,
    });
  }

  return await neutralResponseChain.invoke({
    review: input.review,
  });
});

// Test review
const finalResponse = await reviewResponseChain.invoke({
  review: "The product is bad. Delivery was late and quality was poor.",
});

console.log("\n--- FINAL RESPONSE ---\n");
console.log(finalResponse);