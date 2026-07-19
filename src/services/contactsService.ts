import { apiFetch } from "../lib/apiClient";
import type { Contact, ContactDraft } from "../types/contact";

export async function fetchContacts(): Promise<Contact[]> {
  return apiFetch<Contact[]>("/contacts/");
}

export async function verifyContact(id: string): Promise<Contact> {
  return apiFetch<Contact>(`/contacts/${id}/verify/`, { method: "POST" });
}

export async function verifyContacts(ids: string[]): Promise<Contact[]> {
  const results: Contact[] = [];
  for (const id of ids) {
    results.push(await verifyContact(id));
  }
  return results;
}

export async function createContact(draft: ContactDraft): Promise<Contact> {
  return apiFetch<Contact>("/contacts/", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export async function updateContact(id: string, patch: Partial<ContactDraft>): Promise<Contact> {
  return apiFetch<Contact>(`/contacts/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteContact(id: string): Promise<void> {
  await apiFetch<void>(`/contacts/${id}/`, { method: "DELETE" });
}

export async function syncWhatsAppContacts(): Promise<{ created: number }> {
  return apiFetch<{ created: number }>("/contacts/sync-whatsapp/", { method: "POST" });
}
