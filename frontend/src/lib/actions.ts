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
