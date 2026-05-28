import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { telegramConfigs } from "~/server/db/schema";
import { eq } from "drizzle-orm";

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
});
