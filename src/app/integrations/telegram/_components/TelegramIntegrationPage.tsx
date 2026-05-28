"use client";

const TOKEN_PLACEHOLDER = "AGUARDANDO";
const STATUS_PLACEHOLDER = "Aguardando conexão";

const STEPS = [
  {
    number: 1,
    title: "Abra o Telegram",
    description: "Acesse o Telegram no seu celular ou computador.",
  },
  {
    number: 2,
    title: "Inicie o bot com seu token",
    description:
      "Clique em 'Abrir no Telegram' e envie o token de ativação para o bot.",
  },
  {
    number: 3,
    title: "Aguarde a confirmação",
    description:
      "Após enviar o token, o bot confirmará a conexão com sua conta.",
  },
];

export function TelegramIntegrationPage() {
  return (
    <div className="container mx-auto max-w-3xl py-10">
      <h1 className="mb-2 text-3xl font-bold">Conecte seu Telegram</h1>
      <p className="text-muted-foreground mb-8">
        Receba alertas e notificações diretamente no seu Telegram.
      </p>

      <div className="grid gap-6">
        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-700 dark:bg-yellow-900/20">
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ Ambiente de teste — esta integração está em fase experimental.
          </p>
        </div>

        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <div className="mb-1 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-gray-400" />
            <span className="text-muted-foreground text-sm">{STATUS_PLACEHOLDER}</span>
          </div>

          <h2 className="mb-4 text-xl font-semibold">Seu Token de Ativação</h2>

          <div className="flex items-center gap-3 rounded-md border bg-gray-50 px-4 py-3 dark:bg-gray-800">
            <span className="flex-1 font-mono text-lg tracking-widest text-gray-500">
              {TOKEN_PLACEHOLDER}
            </span>
            <button
              type="button"
              disabled
              className="rounded p-1.5 text-gray-400 opacity-50 hover:bg-gray-100 disabled:cursor-not-allowed dark:hover:bg-gray-700"
              aria-label="Copiar token"
            >
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
            </button>
          </div>

          <button
            type="button"
            className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Abrir no Telegram
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
          </button>
        </section>

        <section className="bg-card rounded-lg border p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold">Próximos Passos</h2>
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <li key={step.number} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                  {step.number}
                </span>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
