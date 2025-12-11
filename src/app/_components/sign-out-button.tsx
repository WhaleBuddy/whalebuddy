"use client"; // REQUIRED: This is a client-side function from next-auth/react

import { signOut } from "next-auth/react";
import * as React from "react";

export const SignOutButton = () => {
  // This is the function to handle the logout click event.
  const handleSignOut = () => {
    // The signOut function ends the user's session.
    // We pass an object to specify where the user should be redirected after logout.
    // CHANGED: callbackUrl is set to '/' to redirect the user back to the main page,
    // which will then show the LoginCard due to the conditional check in src/app/page.tsx.
    void signOut({ callbackUrl: "/" }); 
  };

  return (
    <button
      onClick={handleSignOut}
      // Basic styling for a sign-out button
      className="rounded-lg bg-red-600 px-8 py-2 font-semibold text-white no-underline transition hover:bg-red-700"
    >
      Sign Out
    </button>
  );
};