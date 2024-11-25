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
    currentQuestion: v.string(),
    currentAnswer: v.string(),
  },
  handler: async (ctx, args): Promise<string[]> => {
    // Fetch recent chat history
    const chatHistory = await ctx.runQuery(api.chatHistory.getChatHistory, {
      userId: args.userId,
    });

    const winningTopics = `
    - Apple: If questions about Apple: 
        - Expertise and experience with data intensive applications, data analysis at scale, search, 0-1, general Product Management experience 
        - General Product Management experience and learnings
    - Moveworks: If questions about Moveworks:
        - 0 to 1 Product ownership and experience as Lead of Enteprise Search
        - Expertise and experience with Search Relevance, LLMs, and RAG (Retrieval Augmented Generation)
    - Other: If questions about other topics:
        - General Product Management experience and learnings
        - Expertise and experience with data intensive applications, data analysis at scale, search, 0-1, general Product Management experience
    `
      ;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Generate 3 natural follow-up questions based on the user's current question and the chat history. 
            Prioritize questions about these key topics: ${winningTopics}
            Make the questions you generate very very concise. 
            Make questions you generate very casual. 
            Return only the questions, separated by |.
            Questions should build on previous context but also explore new relevant areas.`
        },
        {
          role: "user",
          content: `Current question: ${args.currentQuestion}
            Current answer: ${args.currentAnswer}
            Recent chat history: ${JSON.stringify(chatHistory.slice(-3))}
            Generate 3 follow-up questions.`
        }
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    if (!response.choices[0].message.content) {
      return [];
    }

    // Split the response into individual questions
    const questions = response.choices[0].message.content.split("|").map(q => q.trim());
    return questions;
  }
});