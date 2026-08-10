import { apiFetch } from "../lib/apiClient";
import type { WhatsAppGroup } from "../types/group";
import type { Message } from "../types/message";

export async function fetchWhatsAppGroups(): Promise<WhatsAppGroup[]> {
  return apiFetch<WhatsAppGroup[]>("/integrations/whatsapp/groups/");
}

export async function fetchGroupThreads(): Promise<WhatsAppGroup[]> {
  return apiFetch<WhatsAppGroup[]>("/whatsapp/groups/");
}

export async function fetchGroupMessages(groupId: string): Promise<Message[]> {
  return apiFetch<Message[]>(`/whatsapp/groups/${groupId}/messages/`);
}

export async function sendGroupMessage(params: {
  jid: string;
  content: string;
  nome?: string;
  avatarUrl?: string;
  participantes?: number;
}): Promise<{ group: WhatsAppGroup; message: Message }> {
  return apiFetch<{ group: WhatsAppGroup; message: Message }>("/whatsapp/groups/send/", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
