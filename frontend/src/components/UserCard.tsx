"use client";

import { deleteUser, editUser } from "@/lib/actions";
import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import CreateModal from "./CreateModal";

export default function UserCard({
  user,
}: {
  user: { id: string; name: string; email: string; role: string };
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={async () => {
              if (confirm("¿Está seguro de eliminar este usuario?")) {
                try {
                  await deleteUser(user.id);
                } catch (error) {
                  console.error("Error al eliminar usuario:", error);
                }
              }
            }}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiTrash size={18} />
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
        <p className="text-gray-600">{user.email}</p>
        <span className="inline-block mt-2 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
          {user.role}
        </span>
      </div>

      <CreateModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        type="user"
        users={[]}
        isEdit={true}
        initialData={{
          name: user.name,
          email: user.email,
          password: "", // No mostrar contraseña actual
        }}
        onSubmit={async (data) => {
          try {
            await editUser(user.id, data);
            setIsEditModalOpen(false);
          } catch (error) {
            console.error("Error al actualizar usuario:", error);
          }
        }}
      />
    </>
  );
}
