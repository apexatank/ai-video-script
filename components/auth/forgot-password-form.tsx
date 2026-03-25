"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6 text-center"
      >
        <div className="flex justify-center">
           <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
              <CheckCircle2 size={40} />
           </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Check Your Email</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
            We've sent a password reset link to <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>.
          </p>
        </div>
        <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setIsSuccess(false)}>
           Use another email
        </Button>
        <Link 
          href="/login" 
          className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="space-y-2 text-center lg:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Forgot Password?</h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Enter your email and we'll send you a link to reset your password.
        </p>
      </div>

      <Card className="border border-zinc-200 dark:border-zinc-800 shadow-xl bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xl">
        <CardContent className="grid gap-6 pt-6">
          <form onSubmit={onSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                    className="pl-10 h-12 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-primary/50 transition-all"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {error && (
                <p className="text-sm font-medium text-red-500 dark:text-red-400 animate-in fade-in slide-in-from-top-1">
                  {error}
                </p>
              )}
              <Button disabled={isLoading} className="h-12 text-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all group shadow-lg shadow-primary/20">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-center pb-8 border-t border-zinc-100 dark:border-zinc-800/50 pt-4">
          <Link
            href="/login"
            className="flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
