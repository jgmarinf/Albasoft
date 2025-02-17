"use server";

// Registro para administradores
export async function registerAdmin(formData: {
  name: string;
  email: string;
  password: string;
  claveSecreta: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/admin`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          claveSecreta: formData.claveSecreta,
        }),
      }
    );

    if (!res.ok) throw new Error(await res.text());

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Registro para usuarios normales
export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  adminEmail: string;
}) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register/user`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          adminEmail: formData.adminEmail,
        }),
      }
    );

    if (!res.ok) throw new Error(await res.text());

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
