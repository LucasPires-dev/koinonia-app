import { apiFetch, clearTokens, setTokens } from "./api";
import type { AuthTokens, AuthUser } from "../types/auth";

export async function login(username: string, password: string): Promise<AuthUser> {
  const tokens = await apiFetch<AuthTokens>("/auth/token/", {
    method: "POST",
    auth: false,
    body: JSON.stringify({ username, password }),
  });
  setTokens(tokens.access, tokens.refresh);
  return getMe();
}

export async function register(input: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  await apiFetch("/auth/register/", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
  return login(input.username, input.password);
}

export function getMe(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me/");
}

export function logout() {
  clearTokens();
}
