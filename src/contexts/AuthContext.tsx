import { useEffect, useState, type ReactNode } from "react";
import { apiFetch, getTokens, setTokens } from "../lib/apiClient";
import { AuthContext, type AuthContextValue, type AuthUser } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getTokens()) {
      setIsLoading(false);
      return;
    }
    apiFetch<AuthUser>("/auth/me/")
      .then(setUser)
      .catch(() => setTokens(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(username: string, password: string) {
    const tokens = await apiFetch<{ access: string; refresh: string }>("/auth/login/", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setTokens(tokens);
    setUser(await apiFetch<AuthUser>("/auth/me/"));
  }

  async function register(username: string, email: string, password: string) {
    await apiFetch("/auth/register/", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    });
    await login(username, password);
  }

  function logout() {
    setTokens(null);
    setUser(null);
  }

  const value: AuthContextValue = { user, isLoading, isAuthenticated: !!user, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
