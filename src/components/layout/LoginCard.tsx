"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { GoogleSignInButton } from "~/app/_components/GoogleSignInButton";

export const LoginCard = () => {
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

  return (
    <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-xl bg-white/10 p-6 shadow-2xl backdrop-blur-md">
      <h2 className="mb-6 text-3xl font-semibold text-white">
        Welcome to WhaleBuddy
      </h2>

      {authError && (
        <div className="mb-4 w-full rounded-md border border-red-500 bg-red-100 p-3 text-sm text-red-800">
          <p className="font-medium">Sign-in Error:</p>
          <p>{getErrorMessage(authError)}</p>
        </div>
      )}

      <div className="w-full">
        <GoogleSignInButton />
      </div>

      <p className="mt-4 text-xs text-white/70">
        By signing in, you agree to our terms and conditions.
      </p>
    </div>
  );
};
