"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/ingredients", label: "Ingredients" },
    { href: "/recipes", label: "Recipes" },
    { href: "/production", label: "Production" },
    { href: "/slides", label: "Slides" },
  ];

  return (
    <nav className="flex flex-row justify-center">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`px-4 py-2 font-semibold tracking-widest ${
            pathname === link.href ? "text-green-600" : "text-gray-500/67"
          }`}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
