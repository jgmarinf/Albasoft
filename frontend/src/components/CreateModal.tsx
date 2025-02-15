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
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiCheck } from "react-icons/fi";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "project" | "add-users";
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: any) => void;
  users?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
}

export default function CreateModal({
  isOpen,
  onClose,
  type,
  isEdit = false,
  initialData = {},
  onSubmit,
  users = [],
}: CreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<
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

  const [isOpenDropdown, setIsOpen] = useState(false);
  const selectedUsers = watch("users") || [];

  const handleUserSelect = (userId: number) => {
    if (selectedUsers.includes(userId.toString())) {
      setValue(
        "users",
        selectedUsers.filter((id) => id !== userId.toString())
      );
    } else {
      setValue("users", [...selectedUsers, userId.toString()]);
    }
  };

  const handleSubmitForm = (data: any) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Editar" : "Crear"}{" "}
          {type === "user"
            ? "Usuario"
            : type === "project"
            ? "Proyecto"
            : "Usuarios al proyecto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {type === "add-users" ? (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Seleccionar usuarios
              </label>
              <div className="relative">
                <div
                  className="border rounded p-2 cursor-pointer"
                  onClick={() => setIsOpen(!isOpenDropdown)}
                >
                  {selectedUsers.length > 0
                    ? `${selectedUsers.length} usuarios seleccionados`
                    : "Haz clic para seleccionar usuarios"}
                </div>

                {isOpenDropdown && (
                  <div className="absolute z-10 w-3/2 mt-1 bg-white border rounded shadow-lg max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <label
                        key={user.id}
                        className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={user.id}
                          {...register("users")}
                          className="hidden"
                        />
                        <div className="w-5 h-5 border rounded mr-2 flex items-center justify-center">
                          {selectedUsers.includes(user.id.toString()) && (
                            <FiCheck className="text-blue-600" />
                          )}
                        </div>
                        <span>
                          {user.name} ({user.email})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {errors.users && (
                <p className="text-red-500 text-sm mt-1">
                  {(errors as any).users.message}
                </p>
              )}
            </div>
          ) : type === "user" ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  {...register("name")}
                  className="w-full p-2 border rounded"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-2 border rounded"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).email.message}
                  </p>
                )}
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
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).password.message}
                  </p>
                )}
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
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  className="w-full p-2 border rounded h-24"
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {(errors as any).description.message}
                  </p>
                )}
              </div>
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
