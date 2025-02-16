"use client";

import LogoutButton from "@/components/LogoutButton";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 flex justify-end">
      <LogoutButton />
    </nav>
  );
}
