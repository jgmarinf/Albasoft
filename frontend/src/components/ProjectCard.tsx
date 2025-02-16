import { FiEdit, FiTrash } from "react-icons/fi";

export default function ProjectCard({
  project,
  role,
  onEdit,
  onDelete,
}: {
  project: { id: number; name: string; description: string };
  role: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
      {role === "admin" && (
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <FiTrash size={18} />
          </button>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
      <p className="text-gray-600">{project.description}</p>
    </div>
  );
}
