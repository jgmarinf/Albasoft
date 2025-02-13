import ProjectCard from "@/components/ProjectCard";

export default function UserDashboard() {
  // Datos quemados temporalmente
  const mockProjects = [
    {
      id: 1,
      name: "Mi Proyecto 1",
      description: "Descripción del proyecto personal 1",
    },
    {
      id: 2,
      name: "Mi Proyecto 2",
      description: "Descripción del proyecto personal 2",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Mis Proyectos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} role="user" />
        ))}
      </div>
    </div>
  );
}
