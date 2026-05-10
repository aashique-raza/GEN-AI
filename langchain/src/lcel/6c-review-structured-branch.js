// src/lcel/06c-review-structured-branch.js

import "dotenv/config";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableBranch, RunnableSequence } from "@langchain/core/runnables";
import { createChatModel } from "../providers/chatProvider.js";

const model = createChatModel();
const parser = new StringOutputParser();

/**
 * 1. Strict schema
 * Model ko isi shape me output dena hoga:
 * {
 *   sentiment: "positive" | "negative" | "neutral"
 * }
 */
const SentimentSchema = z.object({
  sentiment: z
    .enum(["positive", "negative", "neutral"])
    .describe("Sentiment of the user review"),
});

/**
 * 2. Model ko structured output mode me wrap karo
 * Ab output plain string nahi, validated object hoga.
 */
const structuredSentimentModel = model.withStructuredOutput(SentimentSchema);

const sentimentPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `You are a strict sentiment classifier.
Classify the review sentiment as positive, negative, or neutral.`,
  ],
  ["human", "Review: {review}"],
]);

// Output example:
// { sentiment: "negative" }
const sentimentChain = sentimentPrompt.pipe(structuredSentimentModel);

/**
 * 3. Response chains
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
 * 4. Branch router
 * Ab branch condition reliable hai because sentiment schema se aa raha hai.
 */
const responseBranch = RunnableBranch.from([
  [(input) => input.sentiment === "positive", positiveResponseChain],
  [(input) => input.sentiment === "negative", negativeResponseChain],

  // default = neutral
  neutralResponseChain,
]);

/**
 * 5. Full chain
 *
 * review
 * ↓
 * structured sentiment classifier
 * ↓
 * { review, sentiment }
 * ↓
 * RunnableBranch
 * ↓
 * correct response chain
 */
const reviewResponseChain = RunnableSequence.from([
  {
    review: (input) => input.review,

    sentiment: async (input) => {
      const result = await sentimentChain.invoke({
        review: input.review,
      });

      // result is object, not string
      console.log("\n--- STRUCTURED SENTIMENT OUTPUT ---");
      console.log(result);

      return result.sentiment;
    },
  },

  responseBranch,
]);

const finalResponse = await reviewResponseChain.invoke({
  review: "The product is bad. Delivery was late and quality was poor.",
});

console.log("\n--- FINAL RESPONSE ---\n");
console.log(finalResponse);