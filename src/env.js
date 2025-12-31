import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    AUTH_DISCORD_ID: z.string(),
    AUTH_DISCORD_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),

    DISCORD_BOT_TOKEN: z.string().optional(),
    DISCORD_API_URL: z.string().url(),
    DISCORD_GUILD_ID: z.string().min(1),

    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    // Email Provider (Magic Link)
    ENABLE_EMAIL_AUTH: z
      .enum(["true", "false"])
      .default("false")
      .transform((v) => v === "true"),
    EMAIL_SERVER_HOST:
      process.env.ENABLE_EMAIL_AUTH === "true"
        ? z.string().min(1)
        : z.string().optional(),
    EMAIL_SERVER_PORT:
      process.env.ENABLE_EMAIL_AUTH === "true"
        ? z.coerce.number()
        : z.coerce.number().optional(),
    EMAIL_SERVER_USER:
      process.env.ENABLE_EMAIL_AUTH === "true"
        ? z.string().min(1)
        : z.string().optional(),
    EMAIL_SERVER_PASSWORD:
      process.env.ENABLE_EMAIL_AUTH === "true"
        ? z.string().min(1)
        : z.string().optional(),
    EMAIL_FROM:
      process.env.ENABLE_EMAIL_AUTH === "true"
        ? z.string().email()
        : z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID,
    AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_API_URL: process.env.DISCORD_API_URL,
    DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    ENABLE_EMAIL_AUTH: process.env.ENABLE_EMAIL_AUTH,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
