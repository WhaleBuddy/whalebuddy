"use client";

import { signOut } from "next-auth/react";
import * as React from "react";

export const SignOutButton = () => {
  const handleSignOut = () => {
    void signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleSignOut}
      className="w-full rounded-xl border border-red-500/20 bg-red-500/10 px-8 py-3 font-semibold text-red-500 no-underline transition-all hover:bg-red-500 hover:text-white"
    >
      Sign out
    </button>
  );
};
