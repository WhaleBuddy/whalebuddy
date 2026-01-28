import { postRouter } from "~/server/api/routers/post";
import { discordRouter } from "~/server/api/routers/discord";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  discord: discordRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
