import { z } from "zod";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { discordIntegrations } from "~/server/db/schema";
import { env } from "~/env";

const DISCORD_API_BASE = "https://discord.com/api/v10";

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guild_id: string;
  permissions?: string;
}

interface DiscordError {
  message: string;
  code?: number;
}

export const discordRouter = createTRPCRouter({
  registerChannel: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1, "Channel ID is required"),
        channelName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { channelId, channelName } = input;
      const userId = ctx.session.user.id;

      try {
        // Validate that the channel exists in Discord
        const channelResponse = await fetch(
          `${DISCORD_API_BASE}/channels/${channelId}`,
          {
            headers: {
              Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
            },
          },
        );

        if (!channelResponse.ok) {
          const error = (await channelResponse.json()) as DiscordError;
          throw new Error(
            `Channel not found or bot doesn't have access: ${error.message}`,
          );
        }

        const channel = (await channelResponse.json()) as DiscordChannel;

        // Validate that the channel belongs to the expected guild
        if (channel.guild_id !== env.DISCORD_GUILD_ID) {
          throw new Error(
            "Channel does not belong to the configured Discord server",
          );
        }

        // Validate that it's a text channel (type 0 = GUILD_TEXT)
        if (channel.type !== 0) {
          throw new Error(
            "Selected channel must be a text channel. Please select a text channel.",
          );
        }

        // Check bot permissions for the channel
        const botPermissionsResponse = await fetch(
          `${DISCORD_API_BASE}/guilds/${env.DISCORD_GUILD_ID}/members/@me`,
          {
            headers: {
              Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
            },
          },
        );

        if (!botPermissionsResponse.ok) {
          throw new Error("Failed to verify bot permissions");
        }

        // Try to send a test message to verify send permissions
        const testMessageResponse = await fetch(
          `${DISCORD_API_BASE}/channels/${channelId}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              content: "✅ Whalebuddy integration configured successfully!",
            }),
          },
        );

        if (!testMessageResponse.ok) {
          const error = (await testMessageResponse.json()) as DiscordError;
          throw new Error(
            `Bot doesn't have permission to send messages in this channel: ${error.message}`,
          );
        }

        // Check if user already has an integration
        const existingIntegration =
          await ctx.db.query.discordIntegrations.findFirst({
            where: eq(discordIntegrations.userId, userId),
          });

        if (existingIntegration) {
          // Update existing integration (no duplication)
          await ctx.db
            .update(discordIntegrations)
            .set({
              channelId,
              channelName: channelName ?? channel.name,
              guildId: channel.guild_id,
              status: "completed",
              updatedAt: new Date(),
            })
            .where(eq(discordIntegrations.userId, userId));

          return {
            success: true,
            message: "Discord channel updated successfully",
            integration: {
              channelId,
              channelName: channelName ?? channel.name,
              status: "completed",
            },
          };
        } else {
          // Create new integration
          await ctx.db.insert(discordIntegrations).values({
            userId,
            channelId,
            channelName: channelName ?? channel.name,
            guildId: channel.guild_id,
            status: "completed",
          });

          return {
            success: true,
            message: "Discord channel registered successfully",
            integration: {
              channelId,
              channelName: channelName ?? channel.name,
              status: "completed",
            },
          };
        }
      } catch (error) {
        // Update or create integration with error status
        const existingIntegration =
          await ctx.db.query.discordIntegrations.findFirst({
            where: eq(discordIntegrations.userId, userId),
          });

        if (existingIntegration) {
          await ctx.db
            .update(discordIntegrations)
            .set({
              status: "error",
              updatedAt: new Date(),
            })
            .where(eq(discordIntegrations.userId, userId));
        }

        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to register Discord channel",
        );
      }
    }),

  getIntegration: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const integration = await ctx.db.query.discordIntegrations.findFirst({
      where: eq(discordIntegrations.userId, userId),
    });

    return integration;
  }),

  listChannels: protectedProcedure.query(async () => {
    try {
      const response = await fetch(
        `${DISCORD_API_BASE}/guilds/${env.DISCORD_GUILD_ID}/channels`,
        {
          headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Discord channels");
      }

      const channels = (await response.json()) as DiscordChannel[];

      // Filter to only text channels (type 0)
      const textChannels = channels
        .filter((channel) => channel.type === 0)
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
        }));

      return textChannels;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to list Discord channels",
      );
    }
  }),
});
