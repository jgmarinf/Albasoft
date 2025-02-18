import { auth } from "@/auth";
import ListWrapper from "@/components/ListWrapper";
import UserCard from "@/components/UserCard";
import { User } from "@/types/dashboard";
import { redirect } from "next/navigation";

export default async function Projects() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const token = session.user.accessToken;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/`, {
    cache: "no-store", // Evitar cacheo para datos frescos
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const users = await res.json();

  return (
    <ListWrapper type="users" role="admin">
      {users.map((user: User) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ListWrapper>
  );
}
