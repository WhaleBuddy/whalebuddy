import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import DiscordIntegrationClient from "./client-page";

export default async function DiscordIntegrationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return <DiscordIntegrationClient />;
}
