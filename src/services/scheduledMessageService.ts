import { apiFetch } from "../lib/apiClient";
import type { ScheduledMessage, ScheduledMessageDraft } from "../types/scheduledMessage";

function buildFormData(
  fields: Partial<ScheduledMessageDraft>,
  files: File[],
  keepAttachmentIds?: string[]
): FormData {
  const formData = new FormData();
  if (fields.content !== undefined) formData.append("content", fields.content);
  if (fields.scheduledFor !== undefined) formData.append("scheduledFor", fields.scheduledFor);
  if (fields.recipients !== undefined) {
    formData.append(
      "recipients",
      JSON.stringify(fields.recipients.map((r) => ({ type: r.type, id: r.id })))
    );
  }
  if (keepAttachmentIds !== undefined) {
    formData.append("keepAttachmentIds", JSON.stringify(keepAttachmentIds));
  }
  files.forEach((file) => formData.append("attachments", file));
  return formData;
}

export async function fetchScheduledMessages(start: Date, end: Date): Promise<ScheduledMessage[]> {
  const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
  return apiFetch<ScheduledMessage[]>(`/scheduled-messages/?${params.toString()}`);
}

export async function createScheduledMessage(
  draft: ScheduledMessageDraft,
  files: File[]
): Promise<ScheduledMessage> {
  return apiFetch<ScheduledMessage>("/scheduled-messages/", {
    method: "POST",
    body: buildFormData(draft, files),
  });
}

export async function updateScheduledMessage(
  id: string,
  patch: Partial<ScheduledMessageDraft>,
  files: File[],
  keepAttachmentIds: string[]
): Promise<ScheduledMessage> {
  return apiFetch<ScheduledMessage>(`/scheduled-messages/${id}/`, {
    method: "PATCH",
    body: buildFormData(patch, files, keepAttachmentIds),
  });
}

export async function cancelScheduledMessage(id: string): Promise<ScheduledMessage> {
  return apiFetch<ScheduledMessage>(`/scheduled-messages/${id}/cancel/`, { method: "POST" });
}

export async function deleteScheduledMessage(id: string): Promise<void> {
  await apiFetch<void>(`/scheduled-messages/${id}/`, { method: "DELETE" });
}
