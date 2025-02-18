"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import CreateModal from "./CreateModal";

export default function CreateButton({ type }: { type: "projects" | "users" }) {
  const [isOpen, setIsOpen] = useState(false);

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
        onSubmit={(data) => {
          // Lógica de envío aquí
          console.log(data);
          setIsOpen(false);
        }}
      />
    </>
  );
}
