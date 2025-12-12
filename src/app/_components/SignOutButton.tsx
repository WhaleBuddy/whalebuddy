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
      className="rounded-lg bg-red-600 px-8 py-2 font-semibold text-white no-underline transition hover:bg-red-700"
    >
      Sign Out
    </button>
  );
};
