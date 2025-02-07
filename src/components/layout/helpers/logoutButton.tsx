"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
interface LogoutButtonProps {
  callbackUrl?: string;
}

export default function LogoutButton({
  callbackUrl = "/login",
}: LogoutButtonProps) {
  const handleLogout = () => {
    signOut({ callbackUrl });
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-3 text-red-500 hover:bg-red-100 p-2 rounded-lg"
    >
      <LogOut className="w-5 h-5" />
      <span>Sair</span>
    </button>
  );
}
