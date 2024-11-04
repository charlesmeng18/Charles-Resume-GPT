// convex/functions/chatHistory.ts
import { query } from "./_generated/server";

export const getChatHistory = query(async (ctx, { sessionId }: { sessionId: string }) => {
  // Fetch chat history entries for the given sessionId
  const history = await ctx.db
    .query("chatHistory")
    .filter((q) => q.eq(q.field("sessionId"), sessionId))
    .order("asc") // Ensure messages are ordered chronologically
    .collect();

  // Return the chat history
  return history.map((entry) => ({
    question: entry.question,
    answer: entry.answer,
    timestamp: entry.timestamp,
  }));
});
