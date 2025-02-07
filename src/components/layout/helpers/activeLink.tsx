"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface ActiveLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function ActiveLink({
  href,
  children,
  className = "",
}: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);

  const activeClass = isActive ? "bg-purple-100" : "hover:bg-purple-100";

  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 text-gray-900 p-2 rounded-lg ${activeClass} ${className}`}
    >
      {children}
    </Link>
  );
}
