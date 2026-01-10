"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function DiscordIntegration() {
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const [selectedChannelName, setSelectedChannelName] = useState("");

  const { data: integration, refetch: refetchIntegration } =
    api.discord.getIntegration.useQuery();
  const { data: channels, isLoading: loadingChannels } =
    api.discord.listChannels.useQuery();

  const registerChannel = api.discord.registerChannel.useMutation({
    onSuccess: () => {
      void refetchIntegration();
      alert("Canal registrado com sucesso!");
    },
    onError: (error) => {
      alert(`Erro: ${error.message}`);
    },
  });

  const sendTestMessage = api.discord.sendTestMessage.useMutation({
    onSuccess: () => {
      alert("Mensagem de teste enviada!");
    },
    onError: (error) => {
      alert(`Erro: ${error.message}`);
    },
  });

  const disconnectIntegration = api.discord.disconnectIntegration.useMutation({
    onSuccess: () => {
      void refetchIntegration();
      alert("Integração desconectada!");
    },
    onError: (error) => {
      alert(`Erro: ${error.message}`);
    },
  });

  const handleRegisterChannel = () => {
    if (!selectedChannelId || !selectedChannelName) {
      alert("Selecione um canal primeiro");
      return;
    }

    registerChannel.mutate({
      channelId: selectedChannelId,
      channelName: selectedChannelName,
    });
  };

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Integração Discord
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Configure o canal do Discord para receber notificações do WhaleBuddy
        </p>
      </div>

      {integration?.isActive ? (
        <div className="rounded-lg bg-green-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-900">
                ✅ Integração Ativa
              </p>
              <p className="mt-1 text-sm text-green-700">
                Canal: #{integration.channelName}
              </p>
              <p className="text-xs text-green-600">
                Conectado em:{" "}
                {new Date(integration.connectedAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => sendTestMessage.mutate()}
                disabled={sendTestMessage.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {sendTestMessage.isPending
                  ? "Enviando..."
                  : "Enviar Teste"}
              </button>
              <button
                onClick={() => disconnectIntegration.mutate()}
                disabled={disconnectIntegration.isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {disconnectIntegration.isPending
                  ? "Desconectando..."
                  : "Desconectar"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="channel-select"
              className="block text-sm font-medium text-gray-700"
            >
              Selecione um Canal
            </label>
            <select
              id="channel-select"
              value={selectedChannelId}
              onChange={(e) => {
                setSelectedChannelId(e.target.value);
                const channel = channels?.find((c) => c.id === e.target.value);
                if (channel) {
                  setSelectedChannelName(channel.name);
                }
              }}
              disabled={loadingChannels}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                {loadingChannels ? "Carregando..." : "Selecione um canal"}
              </option>
              {channels?.map((channel) => (
                <option key={channel.id} value={channel.id}>
                  #{channel.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRegisterChannel}
            disabled={
              !selectedChannelId ||
              registerChannel.isPending ||
              loadingChannels
            }
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {registerChannel.isPending
              ? "Registrando..."
              : "Registrar Canal"}
          </button>
        </div>
      )}
    </div>
  );
}
