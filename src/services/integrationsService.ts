import { apiFetch } from "../lib/apiClient";
import type { IntegrationDraft, IntegrationSettings, WhatsAppStatus } from "../types/integration";

export async function fetchIntegration(): Promise<IntegrationSettings> {
  return apiFetch<IntegrationSettings>("/integrations/");
}

export async function saveIntegration(draft: IntegrationDraft): Promise<IntegrationSettings> {
  return apiFetch<IntegrationSettings>("/integrations/", {
    method: "PUT",
    body: JSON.stringify(draft),
  });
}

export async function fetchWhatsAppStatus(): Promise<WhatsAppStatus> {
  return apiFetch<WhatsAppStatus>("/integrations/whatsapp/status/");
}

export async function connectWhatsApp(): Promise<{ qrCode: string; status: string }> {
  return apiFetch("/integrations/whatsapp/connect/", { method: "POST" });
}

export async function fetchGoogleAuthUrl(): Promise<{ url: string }> {
  return apiFetch("/integrations/google/connect/");
}

export async function disconnectGoogle(): Promise<void> {
  await apiFetch("/integrations/google/disconnect/", { method: "POST" });
}
