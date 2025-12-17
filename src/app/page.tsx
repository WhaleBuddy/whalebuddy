import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { LoginCard } from "~/components/layout/LoginCard";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
    redirect("/app");
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(210,100%,70%)]">Whalebuddy</span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <LoginCard />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
