import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "./auth.config";
import { getUserById } from "./modules/auth/action";

// We have removed the old environment variable fallbacks.
// Auth.js v5 will automatically use your AUTH_URL and AUTH_SECRET.

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    //
    // --- THIS IS THE MOST IMPORTANT CHANGE ---
    // We REMOVED the entire `signIn` callback.
    // The `PrismaAdapter` (which you have correctly configured below)
    // automatically handles all the logic for finding a user, creating a new user,
    // and linking the account.
    // Having a manual `signIn` callback conflicts with the adapter.
    //

    async jwt({ token }) {
      // This logic is correct and important for custom roles.
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      // Add custom properties to the JWT token
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      // This logic is also correct. It passes the custom properties
      // from the JWT token to the client-side session.
      if (token && token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role; // Make the role available in useSession()
      }
      return session;
    },
  },
  // Auth.js v5 will infer AUTH_SECRET, but setting it explicitly is fine.
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" }, // Use JWTs for session strategy
  ...authConfig,
});
