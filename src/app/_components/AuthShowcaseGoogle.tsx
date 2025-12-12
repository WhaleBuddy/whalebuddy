"use client";

import { signIn, signOut } from "next-auth/react";
import { type Session } from "next-auth";

export const AuthShowcaseWithGoogle = (props: { session: Session | null }) => {
  const session = props.session;

  const handleGoogleSignIn = () => {
    void signIn("google");
  };

  const handleSignOut = () => {
    void signOut();
  };

  if (session) {
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
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">Please Sign in</p>
        <button
          onClick={handleGoogleSignIn}
          className="rounded-full bg-[#4285F4] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[#3367D6]"
        >
          Sign in with Google
        </button>
      </div>
    );
  }
};
