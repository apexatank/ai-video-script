"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout logic
    const timer = setTimeout(() => {
      router.push("/login");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <h1 className="text-xl font-bold tracking-tight">Signing you out...</h1>
      <p className="text-muted-foreground mt-2">Wait a moment while we clear your session.</p>
    </div>
  );
}
