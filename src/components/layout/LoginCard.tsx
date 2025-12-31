"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "~/app/_components/GoogleSignInButton";
import { EmailSignInForm } from "~/app/_components/EmailSignInForm";
import { SignOutButton } from "~/app/_components/SignOutButton";

function LoginCardContent() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const authError = searchParams.get("error");

  const getErrorMessage = (error: string) => {
    switch (error) {
      case "Configuration":
        return "Authentication error: Configuration is incorrect. Please contact support.";
      case "AccessDenied":
      case "Verification":
        return "Authentication failed. Access denied or verification link expired. Try again.";
      case "OAuthAccountNotLinked":
        return "This email is already associated with another provider. Try signing in with a different method.";
      case "Callback":
        return "Login canceled by the user or an unknown error occurred. Please try signing in again.";
      default:
        return "An unexpected error occurred during login. Please try again.";
    }
  };

  if (status === "authenticated") {
    return (
      <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-white/10">
        <h2 className="mb-2 text-2xl font-bold text-white">Welcome!</h2>
        <p className="mb-8 text-sm text-slate-400">
          You are logged in as{" "}
          <span className="font-semibold text-white">
            {session.user?.email}
          </span>
        </p>
        <div className="w-full">
          <SignOutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all">
      <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-white">
        Access your account
      </h2>

      {status === "loading" ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        </div>
      ) : (
        <>
          {authError && (
            <div className="mb-4 w-full rounded-md border border-red-500/50 bg-red-500/10 p-3 text-sm text-red-200">
              <p className="font-medium">Sign-in Error:</p>
              <p>{getErrorMessage(authError)}</p>
            </div>
          )}

          <div className="w-full">
            <GoogleSignInButton />
            <EmailSignInForm />
          </div>

          <p className="mt-4 text-xs text-white/70">
            By signing in, you agree to our terms and conditions.
          </p>
        </>
      )}
    </div>
  );
}

function LoginCardFallback() {
  return (
    <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
      </div>
    </div>
  );
}

export const LoginCard = () => {
  return (
    <Suspense fallback={<LoginCardFallback />}>
      <LoginCardContent />
    </Suspense>
  );
};
