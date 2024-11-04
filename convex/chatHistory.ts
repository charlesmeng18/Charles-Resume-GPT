// convex/functions/chatHistory.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getChatHistory = query(async (ctx, { userId }: { userId: string }) => {
  // Fetch chat history entries for the given sessionId
  const history = await ctx.db
    .query("chatHistory")
    .filter((q) => q.eq(q.field("userId"), userId))
    .order("asc") // Ensure messages are ordered chronologically
    .collect();

  // Return the chat history
  return history.map((entry) => ({
    question: entry.question,
    answer: entry.answer,
    timestamp: entry.timestamp,
  }));
});

export const addChatHistory = mutation({
  args: {
    sessionId: v.string(),
    userId: v.string(),
    question: v.string(),
    answer: v.string(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatHistory", args);
  },
});
