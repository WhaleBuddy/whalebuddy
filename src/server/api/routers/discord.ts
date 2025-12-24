import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { discordConfigs } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";

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
  getBotInviteUrl: protectedProcedure.query(() => {
    const clientId = env.AUTH_DISCORD_ID;
    const permissions = "3072";
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot`;
  }),

  getGuild: protectedProcedure.query(async () => {
    if (!env.DISCORD_BOT_TOKEN) {
      throw new Error("Discord Bot Token not configured");
    }

    const response = await fetch(
      `${env.DISCORD_API_URL}/guilds/${env.DISCORD_GUILD_ID}`,
      {
        headers: {
          Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const guild = (await response.json()) as DiscordGuild;
    return {
      id: guild.id,
      name: guild.name,
    };
  }),

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

    const channelsRes = await fetch(
      `${env.DISCORD_API_URL}/guilds/${env.DISCORD_GUILD_ID}/channels`,
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

    const guildId = String(env.DISCORD_GUILD_ID);

    return channels
      .filter((c) => c.type === 0)
      .map((c) => ({
        id: c.id,
        name: c.name,
        guildId,
      }));
  }),

  saveChannel: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1),
        channelName: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!env.DISCORD_BOT_TOKEN) {
        throw new Error("Discord Bot Token not configured");
      }

      const response = await fetch(
        `${env.DISCORD_API_URL}/channels/${input.channelId}`,
        {
          headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Bot cannot access this channel or it does not exist.");
      }

      const channel = (await response.json()) as DiscordChannel;

      if (channel.guild_id !== env.DISCORD_GUILD_ID) {
        throw new Error("Channel does not belong to the configured guild.");
      }

      if (channel.type !== 0) {
        throw new Error("Selected channel is not a text channel.");
      }

      const existing = await ctx.db.query.discordConfigs.findFirst({
        where: eq(discordConfigs.userId, ctx.session.user.id),
      });

      if (existing) {
        const guildId = String(env.DISCORD_GUILD_ID);
        await ctx.db
          .update(discordConfigs)
          .set({
            guildId,
            channelId: input.channelId,
            channelName: input.channelName,
            status: "connected",
            updatedAt: new Date(),
          })
          .where(eq(discordConfigs.userId, ctx.session.user.id));
      } else {
        const guildId = String(env.DISCORD_GUILD_ID);
        await ctx.db.insert(discordConfigs).values({
          userId: ctx.session.user.id,
          guildId,
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
      `${env.DISCORD_API_URL}/channels/${config.channelId}/messages`,
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
