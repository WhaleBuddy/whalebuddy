import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { discordIntegrations } from "~/server/db/schema";
import { env } from "~/env";

interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  guild_id?: string;
}

interface DiscordGuild {
  id: string;
  name: string;
}

interface DiscordPermissions {
  permissions: string;
}

async function fetchFromDiscord<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${env.DISCORD_API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Discord API error: ${response.status} - ${errorText}`,
    });
  }

  return response.json() as Promise<T>;
}

async function validateChannelPermissions(channelId: string): Promise<boolean> {
  try {
    const channel = await fetchFromDiscord<DiscordChannel>(
      `/channels/${channelId}`,
    );

    if (channel.type !== 0) {
      return false;
    }

    const permissions = await fetchFromDiscord<DiscordPermissions>(
      `/channels/${channelId}/permissions/@me`,
    );

    const SEND_MESSAGES = 0x0000000000000800;
    const VIEW_CHANNEL = 0x0000000000000400;

    const requiredPermissions = SEND_MESSAGES | VIEW_CHANNEL;
    const hasPermissions =
      (BigInt(permissions.permissions) & BigInt(requiredPermissions)) ===
      BigInt(requiredPermissions);

    return hasPermissions;
  } catch (error) {
    console.error("Error validating channel permissions:", error);
    return false;
  }
}

export const discordRouter = createTRPCRouter({
  getIntegration: protectedProcedure.query(async ({ ctx }) => {
    const integration = await ctx.db.query.discordIntegrations.findFirst({
      where: eq(discordIntegrations.userId, ctx.session.user.id),
    });

    return integration ?? null;
  }),

  listChannels: protectedProcedure.query(async () => {
    try {
      const guild = await fetchFromDiscord<DiscordGuild>(
        `/guilds/${env.DISCORD_GUILD_ID}`,
      );

      const channels = await fetchFromDiscord<DiscordChannel[]>(
        `/guilds/${env.DISCORD_GUILD_ID}/channels`,
      );

      const textChannels = channels
        .filter((channel) => channel.type === 0)
        .map((channel) => ({
          id: channel.id,
          name: channel.name,
          guildId: guild.id,
          guildName: guild.name,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return textChannels;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch Discord channels",
      });
    }
  }),

  registerChannel: protectedProcedure
    .input(
      z.object({
        channelId: z.string().min(1, "Channel ID is required"),
        channelName: z.string().min(1, "Channel name is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const channel = await fetchFromDiscord<DiscordChannel>(
          `/channels/${input.channelId}`,
        );

        if (!channel) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Canal não encontrado no Discord",
          });
        }

        if (channel.guild_id !== env.DISCORD_GUILD_ID) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Este canal não pertence ao servidor esperado",
          });
        }

        if (channel.type !== 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Apenas canais de texto são suportados",
          });
        }

        const hasPermissions = await validateChannelPermissions(
          input.channelId,
        );
        if (!hasPermissions) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message:
              "O bot não tem permissão para enviar mensagens neste canal. Verifique as permissões do bot.",
          });
        }

        const existingIntegration =
          await ctx.db.query.discordIntegrations.findFirst({
            where: eq(discordIntegrations.userId, ctx.session.user.id),
          });

        if (existingIntegration) {
          await ctx.db
            .update(discordIntegrations)
            .set({
              channelId: input.channelId,
              channelName: input.channelName,
              guildId: env.DISCORD_GUILD_ID,
              isActive: true,
              updatedAt: new Date(),
            })
            .where(eq(discordIntegrations.userId, ctx.session.user.id));
        } else {
          await ctx.db.insert(discordIntegrations).values({
            userId: ctx.session.user.id,
            channelId: input.channelId,
            channelName: input.channelName,
            guildId: env.DISCORD_GUILD_ID,
            isActive: true,
          });
        }

        return {
          success: true,
          message: "Canal registrado com sucesso!",
          channelId: input.channelId,
          channelName: input.channelName,
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            error instanceof Error
              ? error.message
              : "Erro ao registrar canal no Discord",
        });
      }
    }),

  sendTestMessage: protectedProcedure.mutation(async ({ ctx }) => {
    const integration = await ctx.db.query.discordIntegrations.findFirst({
      where: eq(discordIntegrations.userId, ctx.session.user.id),
    });

    if (!integration) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Nenhuma integração encontrada. Configure um canal primeiro.",
      });
    }

    try {
      const response = await fetch(
        `${env.DISCORD_API_URL}/channels/${integration.channelId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bot ${env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `🐋 **WhaleBuddy Test Message**\n\nOlá! Esta é uma mensagem de teste do WhaleBuddy.\nSua integração está funcionando corretamente! ✅`,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Falha ao enviar mensagem: ${response.status} - ${errorText}`,
        });
      }

      return {
        success: true,
        message: "Mensagem de teste enviada com sucesso!",
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Erro ao enviar mensagem de teste",
      });
    }
  }),

  disconnectIntegration: protectedProcedure.mutation(async ({ ctx }) => {
    const integration = await ctx.db.query.discordIntegrations.findFirst({
      where: eq(discordIntegrations.userId, ctx.session.user.id),
    });

    if (!integration) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Nenhuma integração encontrada",
      });
    }

    await ctx.db
      .update(discordIntegrations)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(discordIntegrations.userId, ctx.session.user.id));

    return {
      success: true,
      message: "Integração desconectada com sucesso",
    };
  }),
});
