import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }

  return (
    <nav className="bg-[#132d60] p-4 flex justify-between items-center">
      <p className="text-white">
        Bienvenido {session.user.name || session.user.email}
      </p>
      <LogoutButton />
    </nav>
  );
}
