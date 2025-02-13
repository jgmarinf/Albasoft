export default function Sidebar({
  onSelectView,
}: {
  onSelectView: (view: "projects" | "users") => void;
}) {
  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        <button
          onClick={() => onSelectView("projects")}
          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded"
        >
          Proyectos
        </button>
        <button
          onClick={() => onSelectView("users")}
          className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded"
        >
          Usuarios
        </button>
      </nav>
    </div>
  );
}
