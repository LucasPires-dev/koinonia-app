export interface IntegrationSettings {
  uazapiBaseUrl: string;
  uazapiConfigured: boolean;
  openaiConfigured: boolean;
  whatsappConnectedAt: string | null;
  googleConfigured: boolean;
  googleEmail: string;
  googleConnectedAt: string | null;
  shepherdsToolkitConfigured: boolean;
  shepherdsToolkitEmail: string;
  shepherdsToolkitConnectedAt: string | null;
}

export type WhatsAppConnectionStatus = "connected" | "connecting" | "disconnected";

export interface WhatsAppStatus {
  status: WhatsAppConnectionStatus;
  phone?: string;
}

export interface IntegrationDraft {
  uazapiBaseUrl?: string;
  uazapiToken?: string;
  openaiApiKey?: string;
}
