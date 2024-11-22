import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  allowListedUsers: defineTable({
    userEmail: v.string(),
    allowlisted: v.boolean(), // Whether the user is allowed access
  }),
  sessions: defineTable({
    sessionId: v.string(),
    userId: v.string(),        // Reference to the user ID
    startTime: v.number(),      // Session start time in epoch
    expirationTime: v.number(), // Session expiration time in epoch
    active: v.boolean(),        // Flag to mark active or expired sessions
  }),
  chatHistory: defineTable({
    sessionId: v.string(),     // Reference to session ID
    userId: v.string(),         // Reference to user ID
    question: v.string(),       // User's question
    answer: v.string(),         // Model's answer
    timestamp: v.number(),      // Timestamp for each question-answer pair (in epoch)
    prompt: v.optional(v.string()), // Prompt for the question
  }),
  rateLimits: defineTable({
    sessionId: v.string(),      // Reference to session ID
    userId: v.string(),          // Reference to user ID
    questionCount: v.number(),   // Count of questions in current time window
    lastReset: v.number(),       // Timestamp of the last rate limit reset
  }),
  ...authTables,
  documents: defineTable({
    title: v.string(),
    text: v.string(),
    lastModifiedDate: v.optional(v.string()),
    summary: v.optional(v.string())
  }),
  chunks: defineTable({
    documentId: v.string(),
    text: v.string(),
    summary: v.optional(v.string()),
    embedding: v.array(v.float64())
  })
  .vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }),
  allowlist: defineTable({
    email: v.string(),
    isAllowed: v.boolean()
  })
});