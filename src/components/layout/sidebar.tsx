"use client";

import {
  Book,
  BookCheck,
  BookType,
  Calendar,
  GraduationCap,
  Library,
  Settings,
  Sigma,
  User,
} from "lucide-react";
import { useUserSession } from "@/hooks/useUserSession";
import Link from "next/link";
import Tip from "../ui/tooltip";
import ActiveLink from "./helpers/activeLink";
import LogoutButton from "./helpers/logoutButton";
import UserDropdown from "./helpers/userDropdown";

export default function Sidebar() {
  const { userData } = useUserSession();

  return (
    <div className="w-64 bg-white">
      <div className="flex flex-col items-center py-4">
        <div className="flex items-center text-purple-900 mb-4 ml-4 mr-auto">
          <Link href="/">
            <Tip
              icon={() => <GraduationCap className="w-20 h-20" />}
              content={"Início"}
              placement="right"
            />
          </Link>
          <span className="ml-12 text-lg text-black text-end">
            Olá, <br /> {userData?.name}
          </span>
        </div>
        <nav className="flex flex-col space-y-2 w-full px-4">
          <ActiveLink href="/student">
            <User className="w-5 h-5" />
            <span>Alunos</span>
          </ActiveLink>
          <UserDropdown />
          <ActiveLink href="/turmas">
            <Book className="w-5 h-5" />
            <span>Turmas</span>
          </ActiveLink>
          <ActiveLink href="/etapa-escolar">
            <BookType className="w-5 h-5" />
            <span>Etapa Escolar</span>
          </ActiveLink>
          <ActiveLink href="/disciplinas">
            <Library className="w-5 h-5" />
            <span>Disciplinas</span>
          </ActiveLink>
          <ActiveLink href="/calendario">
            <Calendar className="w-5 h-5" />
            <span>Calendário</span>
          </ActiveLink>
          <ActiveLink href="/materiais-pedagogicos">
            <BookCheck className="w-5 h-5" />
            <span>Materiais Pedagógicos</span>
          </ActiveLink>
          <ActiveLink href="/media">
            <Sigma className="w-5 h-5" />
            <span>Média</span>
          </ActiveLink>
          <ActiveLink href="/configuracoes">
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </ActiveLink>
          <LogoutButton />
        </nav>
      </div>
      <div className="fixed top-0 left-64 h-screen w-[1px] bg-gray-400"></div>
    </div>
  );
}
