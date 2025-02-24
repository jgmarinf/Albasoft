"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-[#132d60] min-h-screen p-4">
      <nav className="space-y-2">
        <Link
          href="/dashboard/projects"
          className={`block w-full text-left px-4 py-2 rounded transition-colors ${
            pathname === "/dashboard/projects"
              ? "bg-[#2f4777] text-white border-l-[3px] border-[#5e9ce2]"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Proyectos
        </Link>
        <Link
          href="/dashboard/users"
          className={`block w-full text-left px-4 py-2 rounded transition-colors ${
            pathname === "/dashboard/users"
              ? "bg-[#2f4777] text-white border-l-[3px] border-[#5e9ce2]"
              : "text-gray-300 hover:bg-gray-700"
          }`}
        >
          Usuarios
        </Link>
      </nav>
    </div>
  );
}
