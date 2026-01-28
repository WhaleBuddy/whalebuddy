"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

export default function DiscordConnectClient() {
  const [selectedChannel, setSelectedChannel] = useState<string>("");

  const {
    data: statusData,
    refetch: refetchStatus,
    isLoading: isLoadingStatus,
  } = api.discord.getStatus.useQuery();

  const { data: guildData, isLoading: isLoadingGuild } =
    api.discord.getGuild.useQuery();

  const { data: channels, isLoading: isLoadingChannels } =
    api.discord.listChannels.useQuery();

  const { data: inviteUrl } = api.discord.getBotInviteUrl.useQuery();

  const saveChannelMutation = api.discord.saveChannel.useMutation({
    onSuccess: () => {
      void refetchStatus();
    },
  });

  const sendTestMutation = api.discord.sendTestMessage.useMutation();

  useEffect(() => {
    if (statusData?.channelId) {
      setSelectedChannel(statusData.channelId);
    }
  }, [statusData]);

  const handleSaveChannel = () => {
    if (!selectedChannel) return;
    const channel = channels?.find((c) => c.id === selectedChannel);
    if (!channel) return;

    saveChannelMutation.mutate({
      channelId: channel.id,
      channelName: channel.name,
    });
  };

  const handleSendTest = () => {
    sendTestMutation.mutate();
  };

  const isConnected = statusData?.status === "connected";
  const channelName =
    channels?.find((c) => c.id === selectedChannel)?.name ??
    statusData?.channelName ??
    "Unknown";

  if (isLoadingStatus) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p>Carregando status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-4 text-white">
      <div className="w-full max-w-2xl space-y-8 rounded-2xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Configuração do Discord
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Conecte o WhaleBuddy ao seu servidor para receber notificações.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 border-b border-white/10 pb-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${guildData ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-slate-400"}`}
            >
              1
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Conectar Servidor</h3>
              <p className="text-sm text-slate-400">
                {isLoadingGuild ? (
                  "Verificando acesso ao servidor..."
                ) : guildData ? (
                  <>
                    Bot conectado ao servidor:{" "}
                    <span className="font-medium text-indigo-400">
                      {guildData.name}
                    </span>
                  </>
                ) : (
                  "O bot não está no servidor configurado."
                )}
              </p>
            </div>
            {!guildData && inviteUrl && (
              <a
                href={inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#5865F2] px-4 py-2 text-sm font-semibold transition hover:bg-[#4752C4]"
              >
                Adicionar Bot
              </a>
            )}
          </div>

          <div
            className={`flex items-start gap-4 border-b border-white/10 pb-4 transition-opacity ${!guildData ? "pointer-events-none opacity-50" : ""}`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${isConnected ? "bg-green-500/20 text-green-400" : "bg-slate-700/50 text-slate-400"}`}
            >
              2
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-white">Escolher Canal</h3>
                <p className="text-sm text-slate-400">
                  Selecione o canal onde o bot enviará mensagens.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  disabled={isLoadingChannels}
                  className="flex-1 rounded-lg border border-white/10 bg-black/40 px-4 py-2 text-sm focus:border-[#5865F2] focus:ring-1 focus:ring-[#5865F2] focus:outline-none"
                >
                  <option value="">Selecione um canal...</option>
                  {channels?.map((channel) => (
                    <option key={channel.id} value={channel.id}>
                      #{channel.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSaveChannel}
                  disabled={
                    !selectedChannel ||
                    saveChannelMutation.isPending ||
                    (isConnected && selectedChannel === statusData?.channelId)
                  }
                  className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saveChannelMutation.isPending
                    ? "Salvando..."
                    : isConnected && selectedChannel === statusData?.channelId
                      ? "Salvo"
                      : "Confirmar"}
                </button>
              </div>

              {isConnected && (
                <p className="text-xs text-green-400">
                  ✓ Configurado para enviar no canal{" "}
                  <span className="font-bold">#{channelName}</span>
                </p>
              )}
            </div>
          </div>

          <div
            className={`flex items-center gap-4 transition-opacity ${!isConnected ? "pointer-events-none opacity-50" : ""}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700/50 font-bold text-slate-400">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Enviar Teste</h3>
              <p className="text-sm text-slate-400">
                Verifique se está tudo funcionando corretamente.
              </p>
            </div>
            <button
              onClick={handleSendTest}
              disabled={sendTestMutation.isPending || !isConnected}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {sendTestMutation.isPending
                ? "Enviando..."
                : "Enviar Mensagem de Teste"}
            </button>
          </div>

          <div className="pt-4">
            {sendTestMutation.isSuccess && (
              <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-center text-sm text-green-400">
                Mensagem de teste enviada com sucesso! Verifique o canal no
                Discord.
              </div>
            )}
            {sendTestMutation.isError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400">
                Erro ao enviar mensagem: {sendTestMutation.error.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
