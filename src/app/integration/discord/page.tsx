import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import DiscordIntegrationClient from "./client-page";

export default async function DiscordIntegrationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Suspense
      fallback={<div className="container mx-auto p-10">Loading...</div>}
    >
      <DiscordIntegrationClient />
    </Suspense>
  );
}
