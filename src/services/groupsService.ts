import { apiFetch } from "../lib/apiClient";
import type { WhatsAppGroup } from "../types/group";

export async function fetchWhatsAppGroups(): Promise<WhatsAppGroup[]> {
  return apiFetch<WhatsAppGroup[]>("/integrations/whatsapp/groups/");
}
