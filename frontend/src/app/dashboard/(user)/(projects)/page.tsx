import ProjectCard from "@/components/ProjectCard";
import ListWrapper from "../../../../components/ListWrapper";

// Estos datos vendrían de tu API o base de datos
const mockProjects = [
  { id: "1", name: "Proyecto 1", description: "Descripción del proyecto 1" },
  { id: "2", name: "Proyecto 2", description: "Descripción del proyecto 2" },
];

export default async function ProjectsPage() {
  return (
    <ListWrapper type="projects" role="user">
      {mockProjects.map((project) => (
        <ProjectCard key={project.id} project={project} role="user" />
      ))}
    </ListWrapper>
  );
}
