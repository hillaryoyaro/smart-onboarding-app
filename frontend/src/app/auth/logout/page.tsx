"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authProvider";

export default function LogoutPage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh");

        // 🔹 Try backend logout (optional)
        await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            endpoint: "/api/auth/logout/",
            refresh: refreshToken,
          }),
        }).catch(() => console.warn("Backend logout not reachable"));
      } catch (err) {
        console.error("Logout failed:", err);
      } finally {
        // 🔹 Clear tokens and user info
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        // 🔹 Update auth context
        auth.logout();

        // 🔹 Redirect to login
        router.replace("/auth/login");
      }
    };

    logoutUser();
  }, [auth, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-t-transparent border-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-lg">
          Logging you out...
        </p>
      </div>
    </div>
  );
}
