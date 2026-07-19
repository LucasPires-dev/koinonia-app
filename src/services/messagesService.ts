import { apiFetch } from "../lib/apiClient";
import type { Message } from "../types/message";

export async function fetchMessages(contactId: string): Promise<Message[]> {
  return apiFetch<Message[]>(`/contacts/${contactId}/messages/`);
}

export async function sendMessage(contactId: string, content: string): Promise<Message> {
  return apiFetch<Message>(`/contacts/${contactId}/messages/`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
