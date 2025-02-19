"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
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

export async function createProjects(formData: {
  name: string;
  description: string;
  usersIds: string[];
}) {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      redirect("/auth/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          usersIds: formData.usersIds,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el proyecto");
    }

    revalidatePath("/dashboard/projects");

    return await response.json();
  } catch (error) {
    console.error("Error en createProjects:", error);
    throw error;
  }
}

export async function createUsers(formData: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      redirect("/auth/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }

    revalidatePath("/dashboard/users");

    return await response.json();
  } catch (error) {
    console.error("Error en createUsers:", error);
    throw error;
  }
}

export async function editProject(
  projectId: string,
  formData: {
    name?: string;
    description?: string;
    usersIds?: string[];
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      redirect("/auth/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/${projectId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          usersIds: formData.usersIds,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el proyecto");
    }

    revalidatePath("/dashboard/projects");
    return await response.json();
  } catch (error) {
    console.error("Error en editProject:", error);
    throw error;
  }
}

export async function editUser(
  userId: string,
  formData: {
    name?: string;
    email?: string;
    password?: string;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.accessToken) {
      redirect("/auth/login");
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.user.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }

    revalidatePath("/dashboard/users");
    return await response.json();
  } catch (error) {
    console.error("Error en editUser:", error);
    throw error;
  }
}
