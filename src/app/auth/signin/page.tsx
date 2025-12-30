import { Suspense } from "react";
import { SignInButton } from "./signin-button";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-4 text-white">
      <div className="w-full max-w-lg rounded-2xl bg-white/5 p-8 shadow-2xl ring-1 ring-white/10 backdrop-blur-xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Conecte seu Discord
          </h1>
          <p className="mt-3 text-base text-slate-400">
            Siga os passos para configurar as notificações no seu canal.
          </p>
        </div>

        <div className="relative space-y-8">
          <div className="absolute top-4 bottom-4 left-[19px] w-0.5 bg-indigo-500/20" />

          <div className="relative flex gap-4">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500 font-bold text-white ring-4 ring-[#1a1b2e]">
              1
            </div>
            <div className="flex-1 space-y-4 pt-1">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Passo 1: Conecte sua conta
                </h3>
                <p className="text-sm text-indigo-200/70">
                  Primeiro, conecte sua conta do Discord para o WhaleBuddy saber
                  quem você é.
                </p>
              </div>

              <div className="pt-2">
                <Suspense
                  fallback={
                    <div className="h-14 w-full animate-pulse rounded-xl bg-indigo-500/20" />
                  }
                >
                  <SignInButton />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="relative flex gap-4 opacity-50 grayscale transition-all duration-500">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-slate-400 ring-4 ring-[#1a1b2e]">
              2
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-slate-300">
                Passo 2: Configurar Servidor
              </h3>
              <p className="text-sm text-slate-500">
                Adicione o bot ao seu servidor e escolha o canal de
                notificações.
              </p>
            </div>
          </div>

          <div className="relative flex gap-4 opacity-50 grayscale transition-all duration-500">
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-700 font-bold text-slate-400 ring-4 ring-[#1a1b2e]">
              3
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-semibold text-slate-300">
                Passo 3: Enviar Teste
              </h3>
              <p className="text-sm text-slate-500">
                Faça o teste final e veja a mágica acontecer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
