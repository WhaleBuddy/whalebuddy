import { postRouter } from "~/server/api/routers/post";
import { discordRouter } from "~/server/api/routers/discord";
import { telegramRouter } from "~/server/api/routers/telegram";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  discord: discordRouter,
  telegram: telegramRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
