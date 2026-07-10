const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const ACCESS_KEY = "koinonia:access";
const REFRESH_KEY = "koinonia:refresh";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!response.ok) return null;

  const data = await response.json();
  localStorage.setItem(ACCESS_KEY, data.access);
  return data.access as string;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const buildHeaders = (token: string | null): HeadersInit => ({
    "Content-Type": "application/json",
    ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  });

  let response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: buildHeaders(getAccessToken()),
  });

  if (response.status === 401 && auth) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      response = await fetch(`${API_URL}${path}`, {
        ...rest,
        headers: buildHeaders(newToken),
      });
    }
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.detail || body?.message || `Erro ${response.status}`;
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
