import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { OpenAI } from "openai";
import { api } from "./_generated/api";


const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

export const queryRewrite = internalAction({
    args: {
        query: v.string(),
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        try {
        // Fetch the chat history
        const chatHistory = await ctx.runQuery(api.chatHistory.getChatHistory, {
            userId: args.userId,
        });

        const context: string = JSON.stringify(chatHistory); // Assuming 'answer' is the relevant field

        const systemPrompt = `You are a query rewriting assistant for Charles Meng's Resume GPT. Your task is to improve search queries by making them more specific and effective to help ask questions about Charles, while maintaining their original intent. Consider the conversation context of ${context} when rewriting. Be concise and focused.`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: `Rewrite the following query per your instructions: ${args.query}`,
            },
            ],
            temperature: 0,
            max_tokens: 300,
        });

        if (!response.choices.length) {
            throw new Error("No valid response received from OpenAI.");
        }

        // @ts-ignore: Object is possibly 'null'.
        const rewrittenQuery = response.choices[0].message.content.trim();
        console.log(`The rewritten query is ${rewrittenQuery}`);

        // Return the rewritten query, falling back to original if something goes wrong
        return rewrittenQuery;
        } catch (error) {
        console.error("Error rewriting query:", error);
        return args.query; // Fall back to original query if rewriting fails
        }
    },
});