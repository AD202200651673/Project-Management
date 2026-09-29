import { UsersView } from "@/features/users";

export const metadata = {
  title: "Users | Project Management",
  description: "Directory of all workspace members and team affiliations",
};

export default function UsersPage() {
  return <UsersView />;
}
