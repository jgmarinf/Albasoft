"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function getUsersByAdminId() {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      redirect("/auth/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en getUsers:", error);
    throw error;
  }
}

/* import { cookies } from "next/headers";

export async function getProjectsAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("next-auth.session-token");

    if (!token) {
      console.error("Token no encontrado - Redirigir a login");
      return [];
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/admin`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      console.error("Token inválido/expirado - Limpiar cookies");
      return [];
    }

    if (!response.ok) {
      console.error("Error en la respuesta del servidor");
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error en la solicitud:", error);
    return [];
  }
}
 */
