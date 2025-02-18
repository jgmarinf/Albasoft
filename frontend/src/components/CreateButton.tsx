"use client";

import { getUsersByAdminId } from "@/lib/actions";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import CreateModal from "./CreateModal";

export default function CreateButton({ type }: { type: "projects" | "users" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen && type === "projects") {
      const fetchUsers = async () => {
        try {
          const data = await getUsersByAdminId();
          setUsers(data);
        } catch (error) {
          console.error("Error cargando usuarios:", error);
        }
      };
      fetchUsers();
    }
  }, [isOpen, type]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <FiPlus /> Crear {type === "projects" ? "proyecto" : "usuario"}
      </button>

      <CreateModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        type={type === "projects" ? "project" : "user"}
        users={users}
        onSubmit={(data) => {
          console.log("Datos enviados:", data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
