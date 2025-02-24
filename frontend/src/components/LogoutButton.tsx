"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleLogout = () => {
    signOut();
    router.push("/auth/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-[#961313] text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Cerrar Sesión
    </button>
  );
}
