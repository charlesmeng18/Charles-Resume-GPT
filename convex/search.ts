// this document performs vector search on the chunks table
import { action, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

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
    // console.log(question, embedding )
    return embedding    
  }

export const fetchResults = internalQuery({
    args: { ids: v.array(v.id("chunks")) },
    handler: async (ctx, args) => {
      const results = [];
      for (const id of args.ids) {
        const doc = await ctx.db.get(id);
        if (doc === null) {
          continue;
        }
        results.push(doc);
      }
    //   console.log(results)
      return results;
    },
  });

// Main embeddingRetriever function
export const chunkEmbeddingsRetriever = action({
    args: {
        question: v.string()
    },
    async handler(ctx, args) {
        const embedding = await generateQueryEmbedding(args.question);        // perform vector search on the chunks table
        const results = await ctx.vectorSearch("chunks", "byEmbedding", {
            vector: embedding,
            limit: 20
        });
        // fetch the document data for each result
        const chunks : Array<Doc<"chunks">> = await ctx.runQuery(
            internal.search.fetchResults,
            { ids: results.map((chunk) => chunk._id)} 
        );
        const filteredChunks = chunks.map((chunk, index) => ({
            text: chunk.text,
            score: results[index]._score // Assuming results and chunks are in the same order
        }));
        return filteredChunks; // return the filtered chunks with scores
    }
})   



