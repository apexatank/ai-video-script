import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Secure your account."
      subtitle="Set a strong, new password to ensure your creative assets stay safe and protected."
      imageAlt="Reset Password Illustration"
    >
      <Suspense fallback={<div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
