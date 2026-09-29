import { RegisterForm } from "@/features/auth";

export const metadata = {
  title: "Register | Project Management",
  description: "Create a new project management account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
