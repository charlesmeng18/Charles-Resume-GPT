import { action } from "./_generated/server";
import { OpenAI } from "openai";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { internal } from "./_generated/api";


const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}
const openai = new OpenAI({ apiKey });

export const generateAnswer = action({
  args: {
    sessionId: v.string(),
    timestamp: v.number(),
    question: v.string(),
    userId: v.string()
  },
  handler: async(ctx, args) => {
    
    // Rewrite the query using the rewriting action
    const rewrittenQuery : string = await ctx.runAction(internal.queryRewrite.queryRewrite, {
      query: args.question,
      userId: args.userId
    });

    // Fetch the most relevant chunks for generation
    const results = await ctx.runAction(api.search.chunkEmbeddingsRetriever, {
      question: rewrittenQuery // retrieve using the question
    });
    const stringResults : string = JSON.stringify(results);


    // Create a prompt for the LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use "gpt-4" if you have access
      messages: [
        {
          role: 'system',
          content: `You are an AI assistant that provides accurate, concise answers about Charles Meng's professional background. 
            Focus on answering the user's question using only the provided source material.
            Sparingly use some headers and bullet points to structure your response.`,
        },
        {
          role: 'user',
          content: `Question: ${rewrittenQuery}`,
        },
        {
          role: 'system',
          content: `To answer the previous user's  question ${rewrittenQuery}, you can use these results: ${stringResults}. If the results do not answer the user's question, gracefully bow out.
          Do not make up information not provided in the sources.  
          Be succinct, your answer should be no more than a few concise paragraphs. 
          Cite your sources.`,
        },
      ], 
      temperature: 0,
      max_tokens: 300,
    });

    if (!response.choices.length) {
      throw new Error("No valid response received from OpenAI.");
    }
    // @ts-ignore: Object is possibly 'null'.
    const answer = response.choices[0].message.content.trim();

    console.log(answer)
    
    // Store the question and answer in chat history
    await ctx.runMutation(api.chatHistory.addChatHistory, {
      sessionId: args.sessionId,
      userId: args.userId,
      question: args.question,
      answer: answer,
      timestamp: args.timestamp,
    });

  return answer
  }
});


