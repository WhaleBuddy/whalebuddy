import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { discordConfigs } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";

const DISCORD_API_URL = "https://discord.com/api/v10";

type DiscordGuild = {
  id: string;
  name: string;
};

type DiscordChannel = {
  id: string;
  name: string;
  type: number;
  guild_id?: string;
};

export const discordRouter = createTRPCRouter({
  getStatus: protectedProcedure.query(async ({ ctx }) => {
    const config = await ctx.db.query.discordConfigs.findFirst({
      where: eq(discordConfigs.userId, ctx.session.user.id),
    });

    if (!config) {
      return { status: "disconnected" as const };
    }

    return {
      status: config.status as "connected" | "disconnected",
      guildId: config.guildId,
      channelId: config.channelId,
      channelName: config.channelName,
    };
  }),

  listChannels: protectedProcedure.query(async () => {
    if (!env.DISCORD_BOT_TOKEN) {
      throw new Error("Discord Bot Token not configured");
    }

    const guildsRes = await fetch(`${DISCORD_API_URL}/users/@me/guilds`, {
      headers: {
        Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      },
    });

    if (!guildsRes.ok) {
      console.error("Failed to fetch guilds", await guildsRes.text());
      throw new Error("Failed to fetch Discord guilds");
    }

    const guilds = (await guildsRes.json()) as DiscordGuild[];

    if (guilds.length === 0) {
      return [];
    }

    const guild = guilds[0];
    if (!guild) return [];

    const channelsRes = await fetch(
      `${DISCORD_API_URL}/guilds/${guild.id}/channels`,
      {
        headers: {
          Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    if (!channelsRes.ok) {
      console.error("Failed to fetch channels", await channelsRes.text());
      throw new Error("Failed to fetch Discord channels");
    }

    const channels = (await channelsRes.json()) as DiscordChannel[];

    return channels
      .filter((c) => c.type === 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        guildId: guild.id,
      }));
  }),

  saveChannel: protectedProcedure
    .input(
      z.object({
        guildId: z.string().min(1),
        channelId: z.string().min(1),
        channelName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.discordConfigs.findFirst({
        where: eq(discordConfigs.userId, ctx.session.user.id),
      });

      if (existing) {
        await ctx.db
          .update(discordConfigs)
          .set({
            guildId: input.guildId,
            channelId: input.channelId,
            channelName: input.channelName,
            status: "connected",
            updatedAt: new Date(),
          })
          .where(eq(discordConfigs.userId, ctx.session.user.id));
      } else {
        await ctx.db.insert(discordConfigs).values({
          userId: ctx.session.user.id,
          guildId: input.guildId,
          channelId: input.channelId,
          channelName: input.channelName,
          status: "connected",
        });
      }

      return { success: true };
    }),

  sendTestMessage: protectedProcedure.mutation(async ({ ctx }) => {
    const config = await ctx.db.query.discordConfigs.findFirst({
      where: eq(discordConfigs.userId, ctx.session.user.id),
    });

    if (config?.status !== "connected" || !config.channelId) {
      throw new Error("Integration not configured");
    }

    if (!env.DISCORD_BOT_TOKEN) {
      throw new Error("Discord Bot Token not configured");
    }

    const response = await fetch(
      `${DISCORD_API_URL}/channels/${config.channelId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `Hello from WhaleBuddy! This is a test message. (Sent by ${ctx.session.user.name ?? "User"})`,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Discord API Error:", errorText);
      throw new Error("Failed to send message to Discord: " + errorText);
    }

    return { success: true };
  }),
});
