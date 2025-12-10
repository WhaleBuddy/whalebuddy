// src/components/GoogleSignInButton.tsx

import { signIn } from "next-auth/react";
import { useState } from "react";

/**
 * Reusable button to initiate the Google sign-in flow using NextAuth.
 */
export const GoogleSignInButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = () => {
    // 1. Set loading state to prevent double clicks
    setIsLoading(true);
    
    // 2. Call signIn: 'google' is the provider ID (from NextAuth config)
    //    callbackUrl: defines the post-login redirect path
    void signIn("google", { callbackUrl: "/app" });
    
    // NOTE: The loading state will naturally reset when the page redirects 
    // to Google or reloads upon return.
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`group relative flex w-full justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm transition-colors duration-150 ${
        isLoading
          ? "cursor-not-allowed bg-gray-400"
          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      }`}
    >
      {/* Conditional rendering for the loading state */}
      {isLoading ? "Loading..." : "Sign in with Google"}
    </button>
  );
};