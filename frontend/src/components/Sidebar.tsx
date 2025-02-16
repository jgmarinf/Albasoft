"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-800 min-h-screen p-4">
      <nav className="space-y-2">
        <Link
          href="/dashboard/projects"
          className={`block w-full text-left px-4 py-2 rounded transition-colors ${
            pathname === "/dashboard/projects"
              ? "bg-blue-600 text-white border-l-4 border-blue-400"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Proyectos
        </Link>
        <Link
          href="/dashboard/users"
          className={`block w-full text-left px-4 py-2 rounded transition-colors ${
            pathname === "/dashboard/users"
              ? "bg-blue-600 text-white border-l-4 border-blue-400"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Usuarios
        </Link>
      </nav>
    </div>
  );
}
