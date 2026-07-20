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

export async function sendAudioMessage(contactId: string, blob: Blob): Promise<Message> {
  const form = new FormData();
  form.append("file", blob, "audio.webm");
  return apiFetch<Message>(`/contacts/${contactId}/messages/audio/`, {
    method: "POST",
    body: form,
  });
}
