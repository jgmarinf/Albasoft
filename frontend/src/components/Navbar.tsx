"use client";

import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticación después de montar el componente
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
  }, []);

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-800 p-4 flex justify-end">
      <LogoutButton />
    </nav>
  );
}
