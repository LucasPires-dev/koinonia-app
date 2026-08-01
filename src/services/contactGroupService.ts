import { apiFetch } from "../lib/apiClient";
import type { ContactGroup, ContactGroupDraft } from "../types/contactGroup";

export async function fetchContactGroups(): Promise<ContactGroup[]> {
  return apiFetch<ContactGroup[]>("/contact-groups/");
}

export async function createContactGroup(draft: ContactGroupDraft): Promise<ContactGroup> {
  return apiFetch<ContactGroup>("/contact-groups/", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export async function updateContactGroup(id: string, patch: Partial<ContactGroupDraft>): Promise<ContactGroup> {
  return apiFetch<ContactGroup>(`/contact-groups/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteContactGroup(id: string): Promise<void> {
  await apiFetch<void>(`/contact-groups/${id}/`, { method: "DELETE" });
}
