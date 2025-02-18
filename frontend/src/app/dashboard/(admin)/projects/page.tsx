import { auth } from "@/auth";
import ListWrapper from "@/components/ListWrapper";
import ProjectCard from "@/components/ProjectCard";
import { redirect } from "next/navigation";

// NOTA: Si ya has configurado que el token se almacene en la sesión (por ej. en session.accessToken),
// asegúrate de que en tus callbacks de NextAuth.js lo estés retornando.

export default async function Projects() {
  const session = await auth();

  // Si no hay sesión activa, redirigimos a la página de login
  if (!session) {
    redirect("/auth/login");
  }

  // Ahora el token estará disponible correctamente
  const token = session.user.accessToken;

  // Realizar la petición al backend con el token en la cabecera Authorization
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/admin`,
    {
      cache: "no-store", // Evitar cacheo para datos frescos
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const projects = await res.json();

  return (
    <ListWrapper type="projects" role="admin">
      {projects.map((project: any) => (
        <ProjectCard key={project.id} project={project} role="admin" />
      ))}
    </ListWrapper>
  );
}
