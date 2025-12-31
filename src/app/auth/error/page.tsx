"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "Configuration Error",
    description:
      "There is a problem with the server configuration. Please contact support.",
  },
  AccessDenied: {
    title: "Access Denied",
    description: "You do not have permission to access this resource.",
  },
  Verification: {
    title: "Expired or Invalid Link",
    description:
      "The verification link has expired or has already been used. Please request a new link.",
  },
  OAuthAccountNotLinked: {
    title: "Account already linked",
    description:
      "This email is already associated with another login method. Try signing in with a different method.",
  },
  Default: {
    title: "Authentication Error",
    description: "An unexpected error occurred. Please try again.",
  },
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? "Default";

  const { title, description } = errorMessages[error] ?? errorMessages.Default!;

  return (
    <>
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
        <svg
          className="h-8 w-8 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="mb-2 text-2xl font-bold">{title}</h1>

      <p className="mb-6 text-center text-white/70">{description}</p>

      <Link
        href="/"
        className="w-full rounded-lg bg-white/20 px-6 py-3 text-center font-medium transition hover:bg-white/30"
      >
        Try again
      </Link>

      <p className="mt-4 text-xs text-white/40">Error code: {error}</p>
    </>
  );
}

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex w-full max-w-md flex-col items-center justify-center rounded-xl bg-white/10 p-8 shadow-2xl backdrop-blur-md">
        <Suspense fallback={<div className="text-white/50">Loading...</div>}>
          <AuthErrorContent />
        </Suspense>
      </div>
    </main>
  );
}
