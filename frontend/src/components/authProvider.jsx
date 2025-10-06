"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const AuthContext = createContext(null);

const LOCAL_ACCESS_KEY = "access";
const LOCAL_REFRESH_KEY = "refresh";
const LOCAL_USER_KEY = "user";

export function AuthProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Restore session on page reload
  useEffect(() => {
    const access = localStorage.getItem(LOCAL_ACCESS_KEY);
    const userData = localStorage.getItem(LOCAL_USER_KEY);

    if (access && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        logout();
      }
    }
  }, []);

  // ✅ Login handler
  function login(username, role) {
    const storedUser = {
      username,
      role,
    };
    setUser(storedUser);
    setIsAuthenticated(true);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(storedUser));

    const next = searchParams.get("next");
    if (next && next.startsWith("/") && !["/auth/login", "/auth/logout"].includes(next)) {
      router.replace(next);
      return;
    }

    // Redirect based on role
    if (role === "admin") {
      router.replace("/dashboard/admin");
    } else if (role === "staff") {
      router.replace("/dashboard/staff");
    } else {
      router.replace("/dashboard");
    }
  }

  // ✅ Logout handler
  function logout() {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem(LOCAL_ACCESS_KEY);
    localStorage.removeItem(LOCAL_REFRESH_KEY);
    localStorage.removeItem(LOCAL_USER_KEY);
    router.replace("/auth/login");
  }

  // ✅ Token storage helper (called after login API success)
  function storeTokens(access, refresh, userData) {
    localStorage.setItem(LOCAL_ACCESS_KEY, access);
    localStorage.setItem(LOCAL_REFRESH_KEY, refresh);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  }

  // ✅ Redirect to login if unauthorized
  function loginRequiredRedirect() {
    setIsAuthenticated(false);
    router.replace(`/auth/login?next=${pathname}`);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        storeTokens,
        loginRequiredRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
