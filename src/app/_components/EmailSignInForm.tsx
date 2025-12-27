"use client";

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export const EmailSignInForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');


  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get('callbackUrl') ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await signIn('nodemailer', {
        email: email,
        redirect: false,
        callbackUrl: callbackUrl,
      });

      setLoading(false);

      if (result?.error) {
        setMessage(`Erro no servidor: ${result.error}`);
        console.error('NextAuth Error:', result.error);
      } else {
        setMessage('Magic Link enviado! Verifique seu email para concluir o login.');
        setEmail('');
      }
    } catch (error) {
      setLoading(false);
      setMessage('Ocorreu um erro inesperado.');
      console.error(error);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-white/10"></div>
        <span className="mx-4 flex-shrink text-xs font-semibold uppercase tracking-wider text-slate-500">
          ou use e-mail
        </span>
        <div className="flex-grow border-t border-white/10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
            className="block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-500/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Digite seu e-mail"
          />
        </div>

        <button
          type="submit"
          disabled={loading || email.length === 0}
          className={`relative flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-2 focus:ring-offset-slate-950 ${loading || email.length === 0
              ? "cursor-not-allowed bg-indigo-500/20 text-indigo-300/40"
              : "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-[0.98]"
            }`}
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              <span>Enviando...</span>
            </div>
          ) : (
            "Enviar Magic Link"
          )}
        </button>

        {message && (
          <div
            className={`rounded-xl p-4 text-xs font-semibold backdrop-blur-sm transition-all animate-slide-in ${message.includes("enviado")
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                : "border border-red-500/20 bg-red-500/10 text-red-400"
              }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};