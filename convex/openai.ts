import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { v } from "convex/values";
import { internal, api } from "./_generated/api";
import { useQuery } from "convex/react";
import { getAuthUserId } from "@convex-dev/auth/server";
import { getAuthSessionId } from "@convex-dev/auth/server";



const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}
const openai = new OpenAI({ apiKey });

export const generateAnswer = action({
  args: {
    sessionId: v.string(),
    timestamp: v.number(),
    question: v.string(),
    userId: v.string()
  },
  handler: async(ctx, args) => {

    // Fetch the chat history
    const chatHistory = await ctx.runQuery(api.chatHistory.getChatHistory, {
      userId: args.userId
    });
    const context: string = JSON.stringify(chatHistory); // Assuming 'answer' is the relevant field
    console.log(context)

    // Fetch the most relevant chunks for generation
    const results = await ctx.runAction(api.search.chunkEmbeddingsRetriever, {
      question: args.question // retrieve using the question
    });
    const stringResults : string = JSON.stringify(results);


    // Create a prompt for the LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use "gpt-4" if you have access
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that provides accurate answers based on the provided context.',
        },
        {
          role: 'user',
          content: `Question: ${args.question}`,
        },
        {
          role: 'system',
          content: `To answer the previous user question ${args.question}, use these results: ${stringResults}. Do not provide information. Cite your sources.`,
        },
      ], 
      temperature: 0,
      max_tokens: 600,
    });

    if (!response.choices.length) {
      throw new Error("No valid response received from OpenAI.");
    }
    // @ts-ignore: Object is possibly 'null'.
    const answer = response.choices[0].message.content.trim();

    console.log(answer)

    const sessionId = await getAuthSessionId(ctx);
    const userId = await getAuthUserId(ctx);
    
    // Store the question and answer in chat history
    const data = await ctx.runMutation(api.chatHistory.addChatHistory, {
      sessionId: args.sessionId,
      userId: args.userId,
      question: args.question,
      answer: answer,
      timestamp: args.timestamp,
    });

  return answer
  }
});
