"use client";
import { useAuth } from "@/components/authProvider";
import Link from "next/link";

export default function AccountDropdown() {
  const auth = useAuth();
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Hi, {auth.username || "User"}</span>
      <Link href="/auth/logout" className="text-sm text-red-600">Logout</Link>
    </div>
  );
}
