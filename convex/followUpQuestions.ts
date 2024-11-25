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
          content: `Generate 2 complete, natural follow-up questions based on the user's current question and the chat history. 
            Prioritize questions about these key topics: ${winningTopics}.
            Here are principles you are expected to follow:
            The follow-up questions should be very concise. Short sentences only, such as: 
                "What does Moveworks do?" 
                "What are Charles' best skills?"
                "What are Charles' key challenges overcome"
            Return only the questions, separated by |.
            Questions should build on previous context but also explore new relevant areas.`
        },
        {
          role: "user",
          content: `Current question: ${currentQuestion}
            Current answer: ${currentAnswer}
            Recent chat history: ${JSON.stringify(chatHistory.slice(-3))}
            Generate 2 follow-up questions.`
        }
      ],
      temperature: 0.5,
      max_tokens: 50,
    });

    if (!response.choices[0].message.content) {
      return [];
    }

    // Split the response into individual questions
    const questions = response.choices[0].message.content.split("|").map(q => q.trim());
    return questions;
  }
});