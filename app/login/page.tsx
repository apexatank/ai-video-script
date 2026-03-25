import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Turn Ideas into Professional Scripts"
      subtitle="The ultimate AI-powered script generator for YouTube, TikTok, and more. Log in to continue your creative journey."
      imageAlt="Login Illustration"
    >
      <LoginForm />
    </AuthLayout>
  );
}
