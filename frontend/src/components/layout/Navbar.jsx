"use client";
import Link from "next/link";
import { useAuth } from "@/components/authProvider";
import BrandLink from "./BrandLink";
import NavLinks, { NonUserLinks } from "./NavLinks";
import AccountDropdown from "./AccountDropdown";

export default function Navbar({ className }) {
  const auth = useAuth();
  const finalClass = className || "sticky top-0 flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6";

  return (
    <header className={finalClass}>
      <div className="flex items-center gap-6">
        <BrandLink />
        <nav className="hidden md:flex gap-4">
          {NavLinks.map((link) => {
            if (!auth.isAuthenticated && link.authRequired) return null;
            return (
              <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {auth.isAuthenticated ? (
          <AccountDropdown />
        ) : (
          NonUserLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          ))
        )}
      </div>
    </header>
  );
}
