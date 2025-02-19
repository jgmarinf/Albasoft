"use client";

import { FiEdit, FiTrash } from "react-icons/fi";

export default function ProjectCard({
  project,
  role,
}: {
  project: { id: string; name: string; description: string };
  role: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
      {role === "admin" && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={() => {}}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={() => {}}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiTrash size={18} />
          </button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
        <p className="text-gray-600 break-words line-clamp-3 overflow-hidden text-ellipsis">
          {project.description}
        </p>
      </div>
    </div>
  );
}
