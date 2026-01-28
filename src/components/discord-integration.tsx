"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export function DiscordIntegration() {
  const [selectedChannelId, setSelectedChannelId] = useState("");
  const { data: integration, refetch: refetchIntegration } =
    api.discord.getIntegration.useQuery();
  const { data: channels, isLoading: channelsLoading } =
    api.discord.listChannels.useQuery();
  const registerChannel = api.discord.registerChannel.useMutation({
    onSuccess: () => {
      void refetchIntegration();
      alert("Discord channel registered successfully!");
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });
  const handleRegisterChannel = () => {
    if (!selectedChannelId) {
      alert("Please select a channel");
      return;
    }
    const selectedChannel = channels?.find((ch) => ch.id === selectedChannelId);
    registerChannel.mutate({
      channelId: selectedChannelId,
      channelName: selectedChannel?.name,
    });
  };
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-2xl font-bold">Discord Integration</h2>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">Current Status</h3>
        {integration ? (
          <div className="rounded bg-gray-50 p-4">
            <p>
              <strong>Channel:</strong> {integration.channelName ?? "N/A"}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`font-semibold ${
                  integration.status === "completed"
                    ? "text-green-600"
                    : integration.status === "error"
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              >
                {integration.status}
              </span>
            </p>
            <p className="text-sm text-gray-500">
              Last updated: {integration.updatedAt?.toLocaleString() ?? "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">No integration configured yet</p>
        )}
      </div>
      <div className="mb-6">
        <h3 className="mb-2 text-lg font-semibold">
          {integration ? "Change Channel" : "Select Channel"}
        </h3>
        {channelsLoading ? (
          <p className="text-gray-500">Loading channels...</p>
        ) : (
          <select
            value={selectedChannelId}
            onChange={(e) => setSelectedChannelId(e.target.value)}
            className="w-full rounded border border-gray-300 p-2"
            disabled={registerChannel.isPending}
          >
            <option value="">-- Select a channel --</option>
            {channels?.map((channel) => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))}
          </select>
        )}
      </div>
      <button
        onClick={handleRegisterChannel}
        disabled={!selectedChannelId || registerChannel.isPending}
        className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {registerChannel.isPending
          ? "Registering..."
          : integration
            ? "Update Channel"
            : "Register Channel"}
      </button>
      <div className="mt-4 rounded bg-blue-50 p-4 text-sm text-blue-800">
        <p className="font-semibold">ℹ️ How it works:</p>
        <ul className="mt-2 ml-4 list-disc">
          <li>Select a Discord text channel from your server</li>
          <li>The bot will verify it has permission to send messages</li>
          <li>A test message will be sent to confirm the integration</li>
          <li>You can change the channel at any time</li>
        </ul>
      </div>
    </div>
  );
}
