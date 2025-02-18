import CreateButton from "./CreateButton";

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
  return (
    <div className="flex-1 p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {type === "projects" ? "Proyectos" : "Usuarios"}
        </h1>
        {role === "admin" && <CreateButton type={type} />}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </div>
  );
}
