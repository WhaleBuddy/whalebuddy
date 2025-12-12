"use client"; // Required because 'signIn' is a client-side function from next-auth/react

import { signIn } from "next-auth/react";
import * as React from "react";
import { useState } from "react"; // Imported useState to manage the loading state

export const GoogleSignInButton = () => {
  // Added state to manage loading status and prevent double-clicks (Acceptance Criteria)
  const [isLoading, setIsLoading] = useState(false);

  // This is the handler function that calls the NextAuth 'signIn' function.
  const handleSignIn = () => {
    // Set loading state to true immediately upon click
    setIsLoading(true);

    try {
      // Calls the Google OAuth flow.
      // CHANGED: The 'callbackUrl' was changed from '/' to '/app'
      // to match your acceptance criteria: "cai em uma rota definida (ex.: /app)".
      void signIn("google", { callbackUrl: "/app" });
    } catch (error) {
      // In case of an immediate client-side error before redirection, reset the state
      setIsLoading(false);
      console.error("Error initiating Google sign-in:", error);
    }
    // Note: If the user cancels the login on Google's side,
    // the component will re-mount when returning to the app,
    // which automatically resets the 'isLoading' state to 'false'.
  };

  return (
    <button
      onClick={handleSignIn}
      // Added 'disabled' prop using the 'isLoading' state
      // to prevent multiple requests (Acceptance Criteria)
      disabled={isLoading}
      className={`flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium shadow-sm transition-colors focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none ${
        isLoading
          ? "cursor-not-allowed bg-gray-400 text-gray-700" // Style when disabled
          : "bg-white text-gray-700 hover:bg-gray-50" // Default style
      }`}
    >
      {/* Dynamic label showing loading status */}
      <span>{isLoading ? "Loading..." : "Sign in with Google"}</span>
    </button>
  );
};
