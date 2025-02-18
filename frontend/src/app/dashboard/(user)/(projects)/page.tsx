import { auth } from "@/auth";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types/dashboard";
import { redirect } from "next/navigation";
import ListWrapper from "../../../../components/ListWrapper";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const token = session.user.accessToken;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/projects/user`,
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
        <div className="text-center py-8 text-gray-500">
          No tienes proyectos asociados
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
