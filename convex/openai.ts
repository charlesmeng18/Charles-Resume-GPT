import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { v } from "convex/values";
import { api } from "./_generated/api";
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
          content: 'You are an AI assistant that provides accurate answers based on the provided context and using provided sources. Use the sources to vouch for Charles Meng as a great product manager, in a format that resonates with recruiters and hiring managers. Make the response overall very concise, generally 1-2 paragaphs, with relatively shorter sentences, punchy, break apart paragraphs, easy to read. Make it more like how someone would interview.',
        },
        {
          role: 'user',
          content: `Question: ${args.question}`,
        },
        {
          role: 'system',
          content: `To answer the previous user question ${args.question}, use these results: ${stringResults}. Do not make up information not provided in the sources. Cite your sources.`,
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
    
    // Store the question and answer in chat history
    await ctx.runMutation(api.chatHistory.addChatHistory, {
      sessionId: args.sessionId,
      userId: args.userId,
      question: args.question,
      answer: answer,
      timestamp: args.timestamp,
    });

  return answer
  }
});
