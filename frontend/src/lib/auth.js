// server-side cookie helpers (works in server actions/routes)
import { cookies } from "next/headers";

const ACCESS_TOKEN_AGE = 3600; // 1 hour
const REFRESH_TOKEN_AGE = 7 * 24 * 3600; // 7 days
const TOKEN_NAME = "auth-token";
const REFRESH_TOKEN_NAME = "auth-refresh-token";

// --------------------------
// Get tokens
// --------------------------
export function getAccessTokenServer() {
  const token = cookies().get(TOKEN_NAME);
  return token?.value || null;
}

export function getRefreshTokenServer() {
  const token = cookies().get(REFRESH_TOKEN_NAME);
  return token?.value || null;
}

// --------------------------
// Set tokens
// --------------------------
export function setAccessTokenServer(token) {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: ACCESS_TOKEN_AGE,
  });
}

export function setRefreshTokenServer(token) {
  cookies().set({
    name: REFRESH_TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: REFRESH_TOKEN_AGE,
  });
}

// --------------------------
// Delete tokens
// --------------------------
export function deleteTokensServer() {
  cookies().delete(TOKEN_NAME);
  cookies().delete(REFRESH_TOKEN_NAME);
}

// --------------------------
// Refresh access token (optional helper)
// --------------------------
export async function refreshAccessTokenServer() {
  const refreshToken = getRefreshTokenServer();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${process.env.DJANGO_API_ENDPOINT}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!res.ok) throw new Error("Failed to refresh token");

    const data = await res.json();
    setAccessTokenServer(data.access); // update access token in cookie
    return data.access;
  } catch (err) {
    deleteTokensServer();
    return null;
  }
}
