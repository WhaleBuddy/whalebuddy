// This line is essential: it marks this file as a Client Component,
// allowing the use of the next-auth/react hooks (useSession and signIn).
"use client";

import { signIn, signOut } from "next-auth/react";
import { type Session } from "next-auth"; // We import the Session type for props

// This component takes the session data (fetched on the server) as a prop.
export function AuthShowcaseWithGoogle(props: { session: Session | null }) {
  // We do not use useSession() here because we are receiving the session as a prop,
  // which avoids another network request on the client.
  const session = props.session;

  // This function handles the click event for the "Sign In with Google" button.
  const handleGoogleSignIn = () => {
    // This is the key line for your task: it starts the Google OAuth flow.
    // We use "google" as the provider ID.
    // It uses the credentials configured in your config.ts file.
    void signIn("google");
  };

  // This function handles the click event for the "Sign Out" button.
  const handleSignOut = () => {
    // We ensure the sign-out process is started.
    void signOut();
  };

  // Conditional Rendering based on the session status
  if (session) {
    // If logged in, show the user name and a standard sign-out button.
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          Logged in as {session.user?.name}
        </p>
        <button
          onClick={handleSignOut}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        >
          Sign out
        </button>
      </div>
    );
  } else {
    // If NOT logged in, show the Google sign-in button.
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">Please Sign in</p>

        {/* This block is new: the Google Sign-In button for your task. */}
        <button
          onClick={handleGoogleSignIn}
          className="rounded-full bg-blue-600/90 px-10 py-3 font-semibold text-white no-underline transition hover:bg-blue-600/100"
          style={{
            // Adding custom style for Google color consistency with Tailwind
            backgroundColor: "#4285F4",
          }}
        >
          Sign in with Google
        </button>
      </div>
    );
  }
}
