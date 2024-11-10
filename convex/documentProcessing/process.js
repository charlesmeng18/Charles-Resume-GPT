import { v } from "convex/values";
import { query, internalMutation } from "../_generated/server";



// This function takes the embeddings generated offline and loads them into the Chunks table
export const loadChunks = internalMutation({
    args: {
      documentId: v.string(),
      text: v.string(),
      embedding: v.array(v.float64())
    },
    // 
    handler: async (ctx, args) => {
        const chunks = await ctx.db.insert("chunks", 
            {documentId: args.documentId, text: args.text, summary: "", embedding: args.embedding});
        return chunks;
    }
  });


  // This function loads the document's title, summary, and text into the Documents table
  export const loadDocument = internalMutation({
    args: {
      title: v.string(),
      text: v.string(),
    },
    handler: async (ctx, args) => { 
        return "hello"  ;                  
    }
});