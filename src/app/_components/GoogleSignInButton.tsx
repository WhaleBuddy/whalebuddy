"use client";

import { signIn } from "next-auth/react";
import * as React from "react";
import { useState } from "react";

export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);

    try {
      void signIn("google", { callbackUrl: "/app" });
    } catch (error) {
      setIsLoading(false);
      console.error("Error initiating Google sign-in:", error);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading}
      className={`group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
    >
      <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.172-1.228 1.228-3.14 2.56-6.832 2.56-5.94 0-10.656-4.8-10.656-10.74s4.716-10.74 10.656-10.74c3.224 0 5.504 1.304 7.224 2.992l2.304-2.304c-2.064-1.956-4.744-3.412-9.528-3.412-8.32 0-15.116 6.796-15.116 15.116s6.796 15.116 15.116 15.116c4.432 0 7.84-1.472 10.512-4.256 2.752-2.752 3.6-6.624 3.6-9.768 0-.936-.08-1.816-.232-2.608h-13.84z" />
      </svg>
      <span>{isLoading ? "Entrando..." : "Entrar com Google"}</span>
    </button>
  );
};
