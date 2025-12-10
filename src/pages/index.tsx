import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
.

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/login");
    } 
    
    else if (status === "authenticated") {
      void router.push("/app");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading session and redirecting...</p>
      </div>
    );
  }


  return (
    <div className="flex min-h-screen items-center justify-center">
        <p>Redirecting to dashboard...</p>
    </div>
  );
}