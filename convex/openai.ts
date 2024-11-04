import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";
import { useQuery } from "convex/react";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}
const openai = new OpenAI({ apiKey });


export const generateAnswer = action({
  args: {
    sessionId: v.string(),
    userId: v.string(),
    question: v.string(),
    timestamp: v.number()
  },
  handler: async(ctx, args) => {
  
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini", // Use "gpt-4" if you have access
    messages: [
      {
        role: "system",
        content: "You are an AI assistant that provides accurate answers based on the provided context.",
      },
      {
        role: "user",
        content: `Question: ${args.question}`,
      },
    ],
    temperature: 0,
    max_tokens: 150,
  });

  if (!response.choices.length) {
    throw new Error("No valid response received from OpenAI.");
  }
   // @ts-ignore: Object is possibly 'null'.
  const answer = response.choices[0].message.content.trim();

  console.log(answer)

  // Store the question and answer in chat history
  const data = await ctx.runMutation(api.chatHistory.addChatHistory, {
    sessionId: args.sessionId,
    userId: args.userId,
    question: args.question,
    answer: answer,
    timestamp: args.timestamp
  });

  return answer
  }
});
