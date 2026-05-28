"use client";

interface TelegramStatusSectionProps {
  token: string | undefined;
  connected: boolean;
  isLoading: boolean;
  error: string | null;
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="ml-2 h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function StatusIndicator({ connected }: { connected: boolean }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <div
        className={`h-2.5 w-2.5 rounded-full ${connected ? "bg-green-500" : "bg-gray-400"}`}
      />
      <span className="text-muted-foreground text-sm">
        {connected ? "Conectado" : "Aguardando conexão"}
      </span>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div
      role="status"
      className="flex items-center justify-center py-6"
      aria-label="Carregando"
    >
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
}

function TokenDisplay({ token }: { token: string }) {
  const copyToken = () => void navigator.clipboard.writeText(token);

  return (
    <div className="flex items-center gap-3 rounded-md border bg-gray-50 px-4 py-3 dark:bg-gray-800">
      <span className="flex-1 font-mono text-lg tracking-widest">{token}</span>
      <button
        type="button"
        onClick={copyToken}
        className="rounded p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Copiar token"
      >
        <CopyIcon />
      </button>
    </div>
  );
}

export function TelegramStatusSection({
  token,
  connected,
  isLoading,
  error,
}: TelegramStatusSectionProps) {
  if (error) {
    return (
      <section className="bg-card rounded-lg border p-6 shadow-sm">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="bg-card rounded-lg border p-6 shadow-sm">
        <LoadingSpinner />
      </section>
    );
  }

  return (
    <section className="bg-card rounded-lg border p-6 shadow-sm">
      <StatusIndicator connected={connected} />
      <h2 className="mb-4 text-xl font-semibold">Seu Token de Ativação</h2>
      {token && <TokenDisplay token={token} />}
      <button
        type="button"
        className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Abrir no Telegram
        <ExternalLinkIcon />
      </button>
    </section>
  );
}
