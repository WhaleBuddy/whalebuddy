import { HydrateClient } from "~/trpc/server";
import { LoginCard } from "~/components/layout/LoginCard";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black text-white selection:bg-indigo-500/30">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              Whale<span className="text-[hsl(280,100%,70%)]">Buddy</span>
            </h1>
            <LoginCard />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
