import GitHub from "@auth/core/providers/github";
import Resend from "@auth/core/providers/resend";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [GitHub, Resend],
  callbacks: {
    async redirect({redirectTo}) {
      // check if redirectTo is valid
      if (!redirectTo) {
        throw new Error("Invalid redirect URL");
      }
      return process.env.SITE_URL || "";
    }
  }
});
