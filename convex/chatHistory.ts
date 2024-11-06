// convex/functions/chatHistory.ts
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

export const getChatHistory = query( {  
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const history = await ctx.db
      .query("chatHistory")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("asc") // Ensure messages are ordered chronologically
      .collect();
  
    // Return the chat history
    return history.map((entry : any) => ({
      question: entry.question,
      answer: entry.answer,
      timestamp: entry.timestamp,
    }))
  }
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

export const clearChatHistory = mutation({
  args: {
    userId: v.string()
  },
  handler: async (ctx, args) => {
    // Get all chat history entries for this user
    const chatEntries = await ctx.db
      .query("chatHistory")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .collect();
    console.log(chatEntries)
    // Delete each entry
    for (const entry of chatEntries) {
      console.log(entry)
      await ctx.db.delete(entry._id);
    }
  }
})
