// this document performs vector search on the chunks table
import { action, internalAction, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { OpenAI } from "openai";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { CohereClient } from "cohere-ai";

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
export const chunkEmbeddingsRetriever = internalAction({
    args: {
        question: v.string()
    },
    async handler(ctx, args) {
        const embedding = await generateQueryEmbedding(args.question);
        const results = await ctx.vectorSearch("chunks", "byEmbedding", {
            vector: embedding,
            limit: 50
        });
        // fetch the document data for each result
        const chunks : Array<Doc<"chunks">> = await ctx.runQuery(
            internal.search.fetchResults,
            { ids: results.map((chunk) => chunk._id)} 
        );
        return chunks.map((chunk, index) => ({
            text: chunk.text,
            id: chunk._id,
            score: results[index]._score
        }));
    }
});

export const rerankAction = internalAction({
    args: {
        query: v.string(),
        documents: v.array(v.object({
            text: v.string(),
            id: v.id("chunks"),
            score: v.number()
        }))
    },
    async handler(_, args) {
        const apiKey = process.env.COHERE_API_KEY;
        if (!apiKey) {
            throw new Error("The COHERE_API_KEY environment variable is missing or empty.");
        }

        const cohere = new CohereClient({
            token: apiKey,
        });

        const response = await cohere.rerank({
            model: 'rerank-english-v3.0',
            query: args.query,
            documents: args.documents.map(doc => doc.text),
            topN: 10,
        });

        const rerankedResults = response.results.map((rank) => ({
            text: args.documents[rank.index].text,
            id: args.documents[rank.index].id,
            score: rank.relevanceScore
        }))
        return rerankedResults;
      }
    }
  )
  export const hybridSearch = action({
    args: {
        query: v.string()
    },
    async handler(ctx, args) {
        // Get vector search results
        const vectorResults = await ctx.runAction(internal.search.chunkEmbeddingsRetriever, {
            question: args.query
        });

        // TODO: Add your keyword search here and combine results
        // const keywordResults = await ...
        // const combinedResults = combineResults(vectorResults, keywordResults);

        // Rerank the combined results
        const rerankedResults: Array<{ text: string; id: Id<"chunks">; score: number }> = await ctx.runAction(internal.search.rerankAction, {
            query: args.query,
            documents: vectorResults // or combinedResults once implemented
        });

        return rerankedResults;
    }
});







