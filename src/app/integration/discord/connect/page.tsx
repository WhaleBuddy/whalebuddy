import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import DiscordConnectClient from "./client-page";
import { Suspense } from "react";

export default async function DiscordConnectPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/integration/discord/connect");
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-950 via-slate-900 to-black text-white">
          Loading...
        </div>
      }
    >
      <DiscordConnectClient />
    </Suspense>
  );
}
