import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { TelegramIntegrationPage } from "./_components/TelegramIntegrationPage";

export default async function Page() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  return <TelegramIntegrationPage />;
}
