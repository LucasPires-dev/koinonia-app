import { apiFetch } from "./api";

export interface GoogleStatus {
  connected: boolean;
  calendar_id: string | null;
  connected_at: string | null;
}

export function getGoogleStatus(): Promise<GoogleStatus> {
  return apiFetch<GoogleStatus>("/integrations/google/status/");
}

export async function getGoogleAuthorizationUrl(): Promise<string> {
  const { authorization_url } = await apiFetch<{ authorization_url: string }>(
    "/integrations/google/connect/"
  );
  return authorization_url;
}

export function disconnectGoogle(): Promise<void> {
  return apiFetch<void>("/integrations/google/disconnect/", { method: "POST" });
}
