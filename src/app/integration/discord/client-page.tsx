"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function DiscordIntegrationClient() {
  const [selectedChannel, setSelectedChannel] = useState<{
    id: string;
    name: string;
    guildId?: string;
  } | null>(null);

  const { data: statusData, refetch: refetchStatus } =
    api.discord.getStatus.useQuery();
  const { data: channels, isLoading: isLoadingChannels } =
    api.discord.listChannels.useQuery();

  const saveChannelMutation = api.discord.saveChannel.useMutation({
    onSuccess: async () => {
      await refetchStatus();
    },
  });

  const sendTestMutation = api.discord.sendTestMessage.useMutation();

  const handleSaveChannel = () => {
    if (!selectedChannel) return;
    saveChannelMutation.mutate({
      guildId: selectedChannel.guildId ?? "unknown",
      channelId: selectedChannel.id,
      channelName: selectedChannel.name,
    });
  };

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <h1 className="mb-8 text-3xl font-bold">Integrar com Discord</h1>

      <div className="grid gap-8">
        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">
            1. Status da Integração
          </h2>
          <div className="flex items-center gap-2">
            <div
              className={`h-3 w-3 rounded-full ${
                statusData?.status === "connected"
                  ? "bg-green-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-lg">
              {statusData?.status === "connected"
                ? `Conectado ao canal #${statusData.channelName}`
                : "Nenhum canal configurado"}
            </span>
          </div>
        </section>

        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">2. Escolher Canal</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium">
                Selecione um canal
              </label>
              <select
                className="bg-background w-full rounded-md border p-2"
                value={selectedChannel?.id ?? ""}
                onChange={(e) => {
                  const channel = channels?.find(
                    (c) => c.id === e.target.value,
                  );
                  setSelectedChannel(channel ?? null);
                }}
                disabled={isLoadingChannels}
              >
                <option value="">Selecione...</option>
                {channels?.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    #{channel.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={handleSaveChannel}
              disabled={!selectedChannel || saveChannelMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 disabled:opacity-50"
            >
              {saveChannelMutation.isPending
                ? "Salvando..."
                : "Confirmar Canal"}
            </button>
          </div>
          {saveChannelMutation.isSuccess && (
            <p className="mt-2 text-sm text-green-600">
              Canal salvo com sucesso!
            </p>
          )}
        </section>

        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">3. Enviar Teste</h2>
          <p className="text-muted-foreground mb-4">
            Envie uma mensagem de teste para verificar se a integração está
            funcionando corretamente.
          </p>
          <button
            onClick={handleSendTest}
            disabled={
              statusData?.status !== "connected" || sendTestMutation.isPending
            }
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2 disabled:opacity-50"
          >
            {sendTestMutation.isPending
              ? "Enviando..."
              : "Enviar mensagem de teste"}
          </button>

          {sendTestMutation.isSuccess && (
            <div className="mt-4 rounded-md bg-green-50 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-300">
              Message sent successfully. Verify the channel on Discord.
            </div>
          )}
          {sendTestMutation.isError && (
            <div className="mt-4 rounded-md bg-red-50 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-300">
              Error while sending the message: {sendTestMutation.error.message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
