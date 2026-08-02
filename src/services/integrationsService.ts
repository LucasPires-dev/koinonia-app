import { apiFetch } from "../lib/apiClient";
import type { IntegrationDraft, IntegrationSettings, WhatsAppStatus } from "../types/integration";
import type { ShepherdsToolkitEvent, ShepherdsToolkitWriting } from "../types/shepherdsToolkit";

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

export async function fetchShepherdsToolkitAuthUrl(): Promise<{ url: string }> {
  return apiFetch("/integrations/shepherds-toolkit/connect/");
}

export async function disconnectShepherdsToolkit(): Promise<void> {
  await apiFetch("/integrations/shepherds-toolkit/disconnect/", { method: "POST" });
}

export async function fetchShepherdsToolkitCalendar(): Promise<ShepherdsToolkitEvent[]> {
  return apiFetch("/integrations/shepherds-toolkit/calendar/");
}

export async function fetchShepherdsToolkitWritings(): Promise<ShepherdsToolkitWriting[]> {
  return apiFetch("/integrations/shepherds-toolkit/writings/");
}
