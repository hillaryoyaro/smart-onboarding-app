// ApiProxy - client-side wrapper to call backend. Uses Authorization header from localStorage (if present) and also sends cookies.
import { DJANGO_API_ENDPOINT } from "@/config/defaults";

function getTokenClient() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

export default class ApiProxy {
  static async getHeaders(requireAuth = false, isJson = true) {
    const headers = {};
    if (isJson) {
      headers["Content-Type"] = "application/json";
      headers["Accept"] = "application/json";
    }
    const t = getTokenClient();
    if (t && requireAuth) {
      headers["Authorization"] = `Bearer ${t}`;
    }
    return headers;
  }

  static async handleFetch(endpoint, opts) {
    try {
      const res = await fetch(endpoint, { credentials: "include", ...opts });
      const status = res.status;
      const data = status === 204 ? null : await res.json().catch(() => null);
      return { data, status };
    } catch (err) {
      return { data: { message: "Cannot reach API server", error: err.message }, status: 500 };
    }
  }

  static async get(path, requireAuth = false) {
    const headers = await ApiProxy.getHeaders(requireAuth, true);
    return ApiProxy.handleFetch(`${DJANGO_API_ENDPOINT}${path}`, { method: "GET", headers });
  }

  static async post(path, body, requireAuth = false, isMultipart = false) {
    const headers = await ApiProxy.getHeaders(requireAuth, !isMultipart);
    const options = { method: "POST", headers, body: isMultipart ? body : JSON.stringify(body) };
    if (isMultipart) delete options.headers["Content-Type"];
    return ApiProxy.handleFetch(`${DJANGO_API_ENDPOINT}${path}`, options);
  }

  static async put(path, body, requireAuth = false) {
    const headers = await ApiProxy.getHeaders(requireAuth, true);
    return ApiProxy.handleFetch(`${DJANGO_API_ENDPOINT}${path}`, { method: "PUT", headers, body: JSON.stringify(body) });
  }

  static async delete(path, requireAuth = false) {
    const headers = await ApiProxy.getHeaders(requireAuth, true);
    return ApiProxy.handleFetch(`${DJANGO_API_ENDPOINT}${path}`, { method: "DELETE", headers });
  }
}
