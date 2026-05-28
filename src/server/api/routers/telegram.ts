import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { env } from "~/env.js";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { telegramConfigs } from "~/server/db/schema";

function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8).toUpperCase();
}

export const telegramRouter = createTRPCRouter({
  getToken: protectedProcedure.query(async ({ ctx }) => {
    const existing = await ctx.db.query.telegramConfigs.findFirst({
      where: eq(telegramConfigs.userId, ctx.session.user.id),
    });

    if (existing) {
      return { token: existing.token };
    }

    const token = generateToken();
    await ctx.db.insert(telegramConfigs).values({
      userId: ctx.session.user.id,
      token,
    });

    return { token };
  }),

  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const config = await ctx.db.query.telegramConfigs.findFirst({
      where: eq(telegramConfigs.userId, ctx.session.user.id),
    });

    return { connected: !!config?.chatId };
  }),

  sendTestMessage: protectedProcedure.mutation(async ({ ctx }) => {
    const config = await ctx.db.query.telegramConfigs.findFirst({
      where: eq(telegramConfigs.userId, ctx.session.user.id),
    });

    if (!config?.chatId) {
      throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Not connected" });
    }

    if (!env.TELEGRAM_BOT_TOKEN) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Bot not configured" });
    }

    const response = await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: "Mensagem de teste do WhaleBuddy! Sua integração está funcionando corretamente.",
        }),
      },
    );

    if (!response.ok) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to send message" });
    }

    return { success: true };
  }),
});
