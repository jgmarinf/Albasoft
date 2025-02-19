import { auth } from "@/auth";
import ListWrapper from "@/components/ListWrapper";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types/dashboard";
import { redirect } from "next/navigation";

export default async function Projects() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const token = session.user.accessToken;
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
    <ListWrapper type="projects" role={session.user.role}>
      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No tienes proyectos asociados</p>
        </div>
      ) : (
        projects.map((project: Project) => (
          <ProjectCard
            key={project.id}
            project={project}
            role={session.user.role}
          />
        ))
      )}
    </ListWrapper>
  );
}
