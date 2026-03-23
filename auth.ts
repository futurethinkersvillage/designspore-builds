import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);
        if (!parsed.success) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, parsed.data.email));

        if (!user || !user.passwordHash) return null;
        if (!user.isActive) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );
        return valid ? user : null;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.businessName = (user as any).businessName;
        token.subscriptionTier = (user as any).subscriptionTier;
        token.monthlyBudget = (user as any).monthlyBudget;
        token.isActive = (user as any).isActive;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).businessName = token.businessName;
        (session.user as any).subscriptionTier = token.subscriptionTier;
        (session.user as any).monthlyBudget = token.monthlyBudget;
        (session.user as any).isActive = token.isActive;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
