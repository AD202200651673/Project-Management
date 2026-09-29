import { LoginForm } from "@/features/auth";

export const metadata = {
  title: "Login | Project Management",
  description: "Sign in to your project management account",
};

export default function LoginPage() {
  return <LoginForm />;
}
