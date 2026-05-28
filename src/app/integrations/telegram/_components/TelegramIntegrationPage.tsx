"use client";

import { api } from "~/trpc/react";
import { TelegramStatusSection } from "./telegram-status-section";

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

function deriveError(
  tokenError: { message: string } | null,
  statusError: { message: string } | null,
): string | null {
  if (tokenError ?? statusError) {
    return "Não foi possível carregar a integração. Tente novamente.";
  }
  return null;
}

export function TelegramIntegrationPage() {
  const {
    data: tokenData,
    isLoading: isLoadingToken,
    error: tokenError,
  } = api.telegram.getToken.useQuery();

  const {
    data: statusData,
    isLoading: isLoadingStatus,
    error: statusError,
  } = api.telegram.getStatus.useQuery();

  const isLoading = isLoadingToken || isLoadingStatus;
  const error = deriveError(tokenError, statusError);

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

        <TelegramStatusSection
          token={tokenData?.token}
          connected={statusData?.connected ?? false}
          isLoading={isLoading}
          error={error}
        />

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
