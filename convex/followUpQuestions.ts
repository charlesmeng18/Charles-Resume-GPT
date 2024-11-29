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
        - Expertise with Search Relevance, LLMs, and RAG (Retrieval Augmented Generation)
        - General Product Management at scale and big tech
        - 0 to 1 Product experience
        - Expertise with data intensive applications, data analysis at scale, search, 0-1, general Product Management experience     `
      ;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 2 brief follow-up questions about Charles Meng's background.
            Focus areas: ${winningTopics}
            
            Format: Return exactly 2 questions separated by |
            Example: "What was Charles' role at Apple?" | "How did Charles lead Enterprise Search at Moveworks?"
            
            Keep the follow-up questions short, to under 20-30 words each.
            Build on chat context but explore new angles, particularly about his experiences at Moveworks and Enterprise Search as a Product Manager, experience at Apple, and domain expertiser with Search Relevance, LLMs, and RAG (Retrieval Augmented Generation).
            
            Generate the questions in a friendly tone, like a friend asking another friend about their resume.`
        },
        {
          role: "user",
          content: `Previous Q: ${currentQuestion}
            Answer: ${currentAnswer}
            History: ${JSON.stringify(chatHistory.slice(-3))}`
        }
      ],
      temperature: 0.3, // Reduced for more focused outputs
      max_tokens: 80, // Reduced since we want shorter questions
    });

    if (!response.choices[0].message.content) {
      return [];
    }

    // Split the response into individual questions
    const questions = response.choices[0].message.content.split("|").map(q => q.trim());
    return questions;
  }
});