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
    console.log(rewrittenQuery)

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
            Format your responses in Markdown with clear headings and structure.`,
        },
        {
          role: 'user',
          content: `Question: ${rewrittenQuery}`,
        },
        {
          role: 'system',
          content: `To answer the previous user question, User: ${rewrittenQuery}, use these results: ${stringResults}. 
          Do not make up information not provided in the sources. 
          Return your response in Markdown format, with various headings, e.g. H2s, H3s, and boldfaced to make the response more readable. 
          Be succinct, your answer should be no more than a few concise paragraphs. 
          Cite your sources.`,
        },
      ], 
      temperature: 0,
      max_tokens: 400,
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


