"use client";

import CreateModal from "@/components/CreateModal";
import ProjectCard from "@/components/ProjectCard";
import Sidebar from "@/components/Sidebar";
import UserCard from "@/components/UserCard";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function AdminDashboard({ role }: { role: string }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<"projects" | "users">(
    "projects"
  );
  const [editingItem, setEditingItem] = useState<null | any>(null);
  const [isAddingUsers, setIsAddingUsers] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  // Datos quemados temporalmente
  const mockProjects = [
    { id: 1, name: "Proyecto 1", description: "Descripción del proyecto 1" },
    { id: 2, name: "Proyecto 2", description: "Descripción del proyecto 2" },
  ];

  const mockUsers = [
    {
      id: 1,
      name: "Usuario 1",
      email: "usuario1@ejemplo.com",
      role: "USER",
      password: "", // Campo temporal para el formulario
    },
    { id: 2, name: "Usuario 2", email: "usuario2@ejemplo.com", role: "ADMIN" },
  ];

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleSubmit = (data: any) => {
    console.log("Datos del formulario:", data);
    setShowCreateModal(false);
    setEditingItem(null);
    // Aquí conectar con la API
  };

  const handleAddUser = (projectId: number) => {
    setSelectedProject(projectId);
    setIsAddingUsers(true);
    setShowCreateModal(true);
  };

  return (
    <div className="flex">
      <Sidebar onSelectView={setCurrentView} />

      <div className="flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {currentView === "projects" ? "Proyectos" : "Usuarios"}
          </h1>
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FiPlus /> Crear{" "}
            {currentView === "projects" ? "proyecto" : "usuario"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentView === "projects"
            ? mockProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  role={role}
                  onEdit={() => handleEdit(project)}
                  onDelete={() => console.log("Eliminar proyecto", project.id)}
                  onAddUser={() => handleAddUser(project.id)}
                />
              ))
            : mockUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  role={role}
                  onEdit={() => handleEdit(user)}
                  onDelete={() => console.log("Eliminar usuario", user.id)}
                />
              ))}
        </div>
      </div>

      <CreateModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingItem(null);
          setIsAddingUsers(false);
        }}
        type={
          isAddingUsers
            ? "add-users"
            : currentView === "projects"
            ? "project"
            : "user"
        }
        isEdit={!!editingItem}
        initialData={editingItem}
        onSubmit={(data) => {
          if (isAddingUsers) {
            console.log(
              "Usuarios añadidos al proyecto:",
              selectedProject,
              data.users
            );
            // Lógica para asociar usuarios al proyecto
          } else {
            handleSubmit(data);
          }
        }}
        users={isAddingUsers ? mockUsers : undefined}
      />
    </div>
  );
}
