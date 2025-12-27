import Link from "next/link";

export default function VerifyRequestPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
            <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-white/10 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                    <svg
                        className="h-8 w-8 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                    </svg>
                </div>

                <h1 className="mb-2 text-2xl font-bold">Verifique seu email</h1>

                <p className="mb-6 text-center text-white/70">
                    Um link de login foi enviado para seu email. Clique no link para
                    continuar.
                </p>

                <div className="w-full rounded-lg bg-white/5 p-4 text-sm text-white/60">
                    <p className="mb-2">💡 <strong>Dicas:</strong></p>
                    <ul className="list-inside list-disc space-y-1">
                        <li>Verifique sua pasta de spam</li>
                        <li>O link expira em 1 hora</li>
                        <li>Não compartilhe o link com ninguém</li>
                    </ul>
                </div>

                <Link
                    href="/"
                    className="mt-6 text-sm text-white/50 underline hover:text-white/80"
                >
                    ← Voltar para o login
                </Link>
            </div>
        </main>
    );
}
