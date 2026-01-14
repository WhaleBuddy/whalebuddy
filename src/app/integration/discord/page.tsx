import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { DiscordIntegration } from "~/components/discord-integration";

export default async function DiscordIntegrationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0f1419] to-[#000000] p-4">
      <div className="container max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">
            Discord Integration
          </h1>
          <p className="text-gray-400">
            Connect your Discord channel to receive notifications
          </p>
        </div>
        <DiscordIntegration />
      </div>
    </main>
  );
}
