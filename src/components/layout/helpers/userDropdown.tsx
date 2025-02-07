"use client";

import { useState } from "react";
import { Users, BookOpenText, BookOpenCheck } from "lucide-react";
import ActiveLink from "./activeLink";

const UserDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div>
      <div
        onClick={toggleDropdown}
        className="flex items-center space-x-3 text-gray-900 hover:bg-purple-100 p-2 rounded-lg cursor-pointer"
      >
        <Users className="w-5 h-5" />
        <span>Usuários</span>
      </div>
      {isDropdownOpen && (
        <div className="pl-6">
          <ActiveLink href="/teachers">
            <BookOpenText className="w-5 h-5" />
            <span>Professores</span>
          </ActiveLink>
          <ActiveLink href="/secretaria">
            <BookOpenCheck className="w-5 h-5" />
            <span>Secretaria</span>
          </ActiveLink>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
