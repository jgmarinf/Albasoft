"use client";

import {
  createProjectSchema,
  createUserSchema,
  editProjectSchema,
  editUserSchema,
  type CreateProjectFormData,
  type CreateUserFormData,
  type EditProjectFormData,
  type EditUserFormData,
} from "@/lib/validations";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "project";
  isEdit?: boolean;
  initialData?: CreateUserFormData | CreateProjectFormData;
  onSubmit: (
    data:
      | CreateUserFormData
      | CreateProjectFormData
      | EditUserFormData
      | EditProjectFormData
  ) => void;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

export default function CreateModal({
  isOpen,
  onClose,
  type,
  isEdit = false,
  initialData = {
    name: "",
    email: "",
    password: "",
  },
  onSubmit,
}: CreateModalProps) {
  const { register, handleSubmit, reset } = useForm<
    | CreateUserFormData
    | CreateProjectFormData
    | EditUserFormData
    | EditProjectFormData
  >({
    resolver: zodResolver(
      isEdit
        ? type === "user"
          ? editUserSchema
          : editProjectSchema
        : type === "user"
        ? createUserSchema
        : createProjectSchema
    ),
    defaultValues: isEdit
      ? {
          ...initialData,
          password: "",
        }
      : undefined,
  });

  const [users, setUsers] = useState<UserOption[]>([]);

  useEffect(() => {
    if (isOpen && type === "project" && !isEdit) {
      // Datos mock de ejemplo
      const mockUsers = [
        { id: "1", name: "Usuario Ejemplo 1", email: "usuario1@ejemplo.com" },
        { id: "2", name: "Usuario Ejemplo 2", email: "usuario2@ejemplo.com" },
        { id: "3", name: "Usuario Ejemplo 3", email: "usuario3@ejemplo.com" },
      ];

      // Intenta cargar usuarios reales, si falla usa los mock
      fetch("/api/users")
        .then((res) => {
          if (!res.ok) throw new Error("Error al cargar usuarios");
          return res.json();
        })
        .then((data) => setUsers(data.length > 0 ? data : mockUsers))
        .catch((error) => {
          console.error(error);
          setUsers(mockUsers);
        });
    }
  }, [isOpen, type, isEdit]);

  const handleFormSubmit = (
    data:
      | CreateUserFormData
      | CreateProjectFormData
      | EditUserFormData
      | EditProjectFormData
  ) => {
    let formData;

    if (type === "project") {
      const projectData = data as CreateProjectFormData;
      formData = {
        name: projectData.name,
        description: projectData.description,
        assignedUsers: projectData.assignedUsers || [],
      };
    } else {
      const userData = data as CreateUserFormData;
      formData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      };
    }

    console.log("Datos enviados:", formData);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative z-50">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Editar" : "Crear"}{" "}
          {type === "user" ? "Usuario" : "Proyecto"}
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {type === "user" ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  {...register("name")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder={isEdit ? "Dejar vacío para no cambiar" : ""}
                  className="w-full p-2 border rounded"
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Nombre del proyecto
                </label>
                <input
                  {...register("name")}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded h-24"
                />
              </div>

              {type === "project" && !isEdit && (
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    Usuarios asignados
                  </label>

                  <Popover className="relative">
                    {({ open }) => (
                      <>
                        <PopoverButton className="w-full p-2 border rounded text-left flex justify-between items-center bg-white">
                          <span>Seleccionar usuarios</span>
                          <svg
                            className={`h-5 w-5 transform transition-transform ${
                              open ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </PopoverButton>

                        <PopoverPanel className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg max-h-60 overflow-auto">
                          <div className="p-2 space-y-1">
                            {users.map((user) => (
                              <label
                                key={user.id}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  value={user.id}
                                  {...register("assignedUsers")}
                                  className="form-checkbox h-4 w-4 text-blue-600"
                                />
                                <span>
                                  {user.name} ({user.email})
                                </span>
                              </label>
                            ))}
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </Popover>
                </div>
              )}
            </>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEdit ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
