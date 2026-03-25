import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Empower Your Content with AI"
      subtitle="Create an account and get access to powerful AI tools that help you write, optimize, and generate video scripts in seconds."
      imageAlt="Register Illustration"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
