import { useEffect, useState, type ReactNode } from "react";
import * as authService from "../services/authService";
import { getAccessToken } from "../services/api";
import { AuthContext, type AuthContextValue } from "./auth-context";
import type { AuthUser } from "../types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      setUser(await authService.getMe());
    } catch {
      authService.logout();
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    setUser(await authService.login(username, password));
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextValue = { user, loading, login, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
