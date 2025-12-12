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
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
        isLoading
          ? "cursor-not-allowed bg-gray-400 text-gray-700"
          : "bg-white text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span>{isLoading ? "Loading..." : "Sign in with Google"}</span>
    </button>
  );
};
