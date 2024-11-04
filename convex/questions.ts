import { mutation } from "./_generated/server";
import { OpenAI } from "openai"; 

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  throw new Error("The OPENAI_API_KEY environment variable is missing or empty.");
}
const openai = new OpenAI({ apiKey });

export const submitQuestion = mutation(async (ctx, { sessionId, question }: { sessionId: string; question: string }) => {
  // Check if session is active
  const session = await ctx.db
    .query("sessions")
    .filter((q) => q.eq(q.field("sessionId"), sessionId))
    .first();
  if (!session || !session.active) throw new Error("Session expired");

  // Retrieve relevant embeddings from Pinecone
//   const embeddings = await getRelevantEmbeddings(question);
const embeddings = "this is a relevant document";

  // Generate a response using OpenAI
  const response = await openai.completions.create({
    model: "gpt-4o-mini",
    prompt: `Based on the following information: ${embeddings}, answer the question: ${question}`,
    max_tokens: 150,
  });

  const answer = response.choices[0].text.trim();

  // Store the question and answer in chat history
  await ctx.db.insert("chatHistory", {
    sessionId,
    userId: session.userId,
    question,
    answer,
    timestamp: Date.now(),
  });

  return { answer };
});