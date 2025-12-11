// src/app/page.tsx

import Link from "next/link";
import { redirect } from "next/navigation"; 
import { LatestPost } from "~/app/_components/post";
import { AuthShowcaseWithGoogle } from "~/app/_components/auth-showcase-google";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { LoginCard } from "~/components/layout/login-card";

export default async function Home() {
  const hello = await api.post.hello({ text: "" });
  const session = await auth(); 

  if (session?.user) {
    void api.post.getLatest.prefetch();
    redirect("/app"); 
  }

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          {/* ... Header and Links ... */}
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
            
            {/* The LoginCard is rendered here. It is centered due to the parent's items-center class. */}
            <LoginCard /> 
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}