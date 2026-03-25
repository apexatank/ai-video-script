import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Never lose your creative momentum."
      subtitle="Recover your account and get back to generating world-class scripts in seconds."
      imageAlt="Forgot Password Illustration"
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
