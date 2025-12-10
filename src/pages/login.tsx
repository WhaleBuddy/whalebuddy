// src/pages/login.tsx 

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";
// Import from the new, standard components directory
import { GoogleSignInButton } from "../components/GoogleSignInButton"; 

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  
  // Hook to handle redirection if the user is already logged in
  useEffect(() => {
    if (status === "authenticated") {
      // Redirects to the protected application route
      void router.push("/app");
    }
  }, [status, router]);

  // Show a loading screen while NextAuth checks the session status
  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Verifying session...</p>
      </div>
    );
  }

  // Render the login form for unauthenticated users
  return (
    <>
      <Head>
        <title>Login | WhaleBuddy</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign into your account
          </h2>
          <div className="mt-8">
            {/* Using the encapsulated sign-in component */}
            <GoogleSignInButton />
            
            {/* Simple error handling (e.g., if user cancels Google login) */}
            {router.query.error && (
              <p className="mt-4 text-center text-sm font-medium text-red-600">
                Login cancelled or failed. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}