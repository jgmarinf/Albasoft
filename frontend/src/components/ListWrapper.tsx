"use client";

import { FiPlus } from "react-icons/fi";

interface ListWrapperProps {
  type: "projects" | "users";
  role: "admin" | "user";
  children: React.ReactNode;
}

export default function ListWrapper({
  type,
  role,
  children,
}: ListWrapperProps) {
  const handleCreate = () => {
    // Lógica para crear nuevo proyecto/usuario
    console.log(`Crear nuevo ${type}`);
    // Aquí podrías abrir un modal o redirigir a una página de creación
  };

  return (
    <>
      <div className="flex-1 p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {type === "projects" ? "Proyectos" : "Usuarios"}
          </h1>
          {role === "admin" && (
            <button
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FiPlus /> Crear {type === "projects" ? "proyecto" : "usuario"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      </div>
    </>
  );
}
