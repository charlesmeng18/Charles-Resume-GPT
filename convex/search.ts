// this document performs vector search on the chunks table
import { action, query } from "./_generated/server";
import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { OpenAI } from "openai";


export async function generateQueryEmbedding (question: string) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
    throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
    }

    const openai = new OpenAI({ apiKey });
        const response = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: question
        });
    const embedding = response.data[0].embedding;
    console.log(question, embedding )
    return embedding    
  }

export const getRelevantChunks = action({
    args: {
        question: v.string()
    },
    async handler(ctx, args) {
        const embedding = await generateQueryEmbedding(args.question);
        console.log(embedding)
        const results = await ctx.vectorSearch("chunks", "byEmbedding", {
            vector: embedding,
            limit: 10
        })
        return results;
    }
})    