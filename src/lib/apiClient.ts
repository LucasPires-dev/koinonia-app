const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";
const STORAGE_KEY = "koinonia:auth";

interface Tokens {
  access: string;
  refresh: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function setTokens(tokens: Tokens | null) {
  if (tokens) localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  else localStorage.removeItem(STORAGE_KEY);
}

async function refreshAccessToken(): Promise<string | null> {
  const tokens = getTokens();
  if (!tokens?.refresh) return null;

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: tokens.refresh }),
  });
  if (!res.ok) return null;

  const data = await res.json();
  setTokens({ access: data.access, refresh: tokens.refresh });
  return data.access as string;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const tokens = getTokens();
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (tokens?.access) headers.set("Authorization", `Bearer ${tokens.access}`);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401 && retry && tokens?.refresh) {
    const newAccess = await refreshAccessToken();
    if (newAccess) return apiFetch<T>(path, options, false);
    setTokens(null);
    window.location.assign("/login");
    throw new ApiError("Sessão expirada", 401);
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}) as Record<string, unknown>);
    const detail = typeof data.detail === "string" ? data.detail : "Erro na requisição";
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
