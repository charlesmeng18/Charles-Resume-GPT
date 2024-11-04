// convex/functions/session.ts
import { mutation, query } from "./_generated/server";
import { v4 as uuidv4 } from "uuid";

// Function to start a session
export const startSession = mutation(async (ctx) => {
  // Retrieve the authenticated user's identity
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("User not authenticated");
  }

  const userId = identity.tokenIdentifier; // or identity.subject, based on your auth setup
  const sessionId = uuidv4();
  const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Insert the new session into the 'sessions' table
  await ctx.db.insert("sessions", {
    sessionId,
    userId,
    startTime: Date.now(),
    expirationTime,
    active: true,
  });

  return { sessionId, userId, expirationTime };
});

// Function to check if session is active
export const checkSession = query(async (ctx, { sessionId }: { sessionId: string }) => {
  const session = await ctx.db
    .query("sessions")
    .filter((q) => q.eq(q.field("sessionId"), sessionId))
    .first();
  return session && session.expirationTime > Date.now() && session.active;
});


// Function to end a session
export const endSession = mutation(async (ctx, { sessionId }: { sessionId: string }) => {
  const session = await ctx.db
    .query("sessions")
    .filter((q) => q.eq(q.field("sessionId"), sessionId))
    .first();

  if (!session) {
    throw new Error("Session not found");
  }

  await ctx.db.patch(session._id, { active: false });
  return { message: "Session ended" };
});
