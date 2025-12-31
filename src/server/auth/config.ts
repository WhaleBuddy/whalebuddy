import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/nodemailer";

import { env } from "~/env";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
    error: "/auth/error",
  },
  trustHost: true,
  providers: [
    DiscordProvider({
      checks: ["none"],
    }),
    ...(env.ENABLE_EMAIL_AUTH
      ? [
        EmailProvider({
          server: {
            host: env.EMAIL_SERVER_HOST,
            port: env.EMAIL_SERVER_PORT,
            secure: env.EMAIL_SERVER_PORT === 465,
            auth: {
              user: env.EMAIL_SERVER_USER,
              pass: env.EMAIL_SERVER_PASSWORD,
            },
            tls: {
              rejectUnauthorized: env.NODE_ENV === "production",
            },
          },
          from: env.EMAIL_FROM,
          maxAge: 60 * 60, // Magic link valid for 1 hour
        }),
      ]
      : []),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
      },
    }),
  },
  secret:
    process.env.AUTH_SECRET && process.env.AUTH_SECRET.length > 0
      ? process.env.AUTH_SECRET
      : "super-secret-fallback-dev-only",
  debug: env.NODE_ENV === "development",
} satisfies NextAuthConfig;
