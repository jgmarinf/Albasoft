"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);

  // Contenido solo para usuarios autenticados
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Bienvenido a la página principal</h1>
      <p className="mt-4">Contenido protegido...</p>
    </div>
  );
}
