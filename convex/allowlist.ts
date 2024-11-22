import { mutation } from "./_generated/server";
import { v } from "convex/values";

/// Query to check if a user is in the allowlist
export const checkAllowlistStatus = mutation({
    args: {
      email: v.string(),
    },
    handler: async (ctx, args) => {
      const allowlistedUser = await ctx.db
        .query("allowlist")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
  
      return allowlistedUser ? allowlistedUser.isAllowed : false;
    },
  });

// Adds a new user to the allowList
  export const addToAllowlist = mutation({
    args: {
      email: v.string(),
    },
    handler: async (ctx, args) => {
      const existingUser = await ctx.db
        .query("allowlist")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
  
      if (existingUser) {
        throw new Error("User is already in the allowlist.");
      }
  
      await ctx.db.insert("allowlist", {
        email: args.email,
        isAllowed: true,
      });
    },
  });

  // This function toggles the isAllowed status for an existing user in the allowlist.
  export const updateAllowlistStatus = mutation({
    args: {
      email: v.string(),
      isAllowed: v.boolean(),
    },
    handler: async (ctx, args) => {
      const allowlistedUser = await ctx.db
        .query("allowlist")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
  
      if (!allowlistedUser) {
        throw new Error("User not found in the allowlist.");
      }
  
      await ctx.db.patch(allowlistedUser._id, {
        isAllowed: args.isAllowed,
      });
    },
  });

  // This function removes a user from the allowlist.
  export const removeFromAllowlist = mutation({
    args: {
      email: v.string(),
    },
    handler: async (ctx, args) => {
      const allowlistedUser = await ctx.db
        .query("allowlist")
        .filter((q) => q.eq(q.field("email"), args.email))
        .first();
  
      if (!allowlistedUser) {
        throw new Error("User not found in the allowlist.");
      }
  
      await ctx.db.delete(allowlistedUser._id);
    },
  });
  