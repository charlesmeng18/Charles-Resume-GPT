import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}
const openai = new OpenAI({ apiKey });

export const generateFollowUps = action({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args): Promise<string[]> => {
    // Fetch recent chat history
    const chatHistory = await ctx.runQuery(api.chatHistory.getChatHistory, {
      userId: args.userId,
    });

    // Assuming the last entry in chatHistory contains the current question and answer
    const lastEntry = chatHistory[chatHistory.length - 1];
    const currentQuestion = lastEntry.question; // Adjust based on your data structure
    const currentAnswer = lastEntry.answer; // Adjust based on your data structure

    const winningTopics = `
    - Apple: If questions about Apple: 
        - Expertise with data intensive applications, data analysis at scale, search, 0-1, general Product Management experience 
        - General Product Management at scale and big tech
    - Moveworks: If questions about Moveworks:
        - 0 to 1 Product experience
        - Expertise with Search Relevance, LLMs, and RAG (Retrieval Augmented Generation)
    `
      ;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 2 brief follow-up questions about Charles Meng's background.
            Focus areas: ${winningTopics}
            
            Format: Return exactly 2 questions separated by |
            Example: "What was your role at Apple?" | "How did you improve search at Moveworks?"
            
            Keep questions under 10 words each.
            Build on chat context but explore new angles.`
        },
        {
          role: "user",
          content: `Previous Q: ${currentQuestion}
            Answer: ${currentAnswer}
            History: ${JSON.stringify(chatHistory.slice(-3))}`
        }
      ],
      temperature: 0.3, // Reduced for more focused outputs
      max_tokens: 50, // Reduced since we want shorter questions
    });

    if (!response.choices[0].message.content) {
      return [];
    }

    // Split the response into individual questions
    const questions = response.choices[0].message.content.split("|").map(q => q.trim());
    return questions;
  }
});