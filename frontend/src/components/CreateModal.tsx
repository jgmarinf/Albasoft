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
import { useForm } from "react-hook-form";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "user" | "project";
  isEdit?: boolean;
  initialData?: any;
  onSubmit: (data: any) => void;
}

export default function CreateModal({
  isOpen,
  onClose,
  type,
  isEdit = false,
  initialData = {},
  onSubmit,
}: CreateModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEdit ? "Editar" : "Crear"}{" "}
          {type === "user" ? "Usuario" : "Proyecto"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {type === "user" ? (
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
