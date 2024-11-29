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

    // Fetch the most relevant chunks using hybridSearch
    const results = await ctx.runAction(api.search.hybridSearch, {
      query: rewrittenQuery // retrieve using the rewritten query
    });
    const stringResults : string = JSON.stringify(results);


    // Create a prompt for the LLM
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are a concise AI assistant focused on Charles Meng's professional background. 
            Provide brief, direct answers using only the provided source material, focused on answering the user's question.
            Speak simply, without fluff or too formally. Limit responses to 1-2 short paragraphs.`,
        },
        {
          role: 'user',
          content: `Question: ${rewrittenQuery}`,
        },
        {
          role: 'system',
          content: `Context for answering: ${stringResults}

          Guidelines:
          - If the context doesn't answer the question, simply state that you don't have enough information
          - Keep your response under 300 words
          - Only use information from the provided context
          - If helpful, output your response in markdown and line breaks for readability
          - End with a brief source reference to a summary of the chunk that most helped answer the question`,
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


