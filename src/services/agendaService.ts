import { apiFetch } from "../lib/apiClient";
import type { Appointment } from "../types/appointment";

export async function fetchEvents(start: Date, end: Date): Promise<Appointment[]> {
  const params = new URLSearchParams({ start: start.toISOString(), end: end.toISOString() });
  return apiFetch<Appointment[]>(`/agenda/events/?${params.toString()}`);
}

export async function createEvent(draft: Omit<Appointment, "id">): Promise<Appointment> {
  return apiFetch<Appointment>("/agenda/events/", {
    method: "POST",
    body: JSON.stringify(draft),
  });
}

export async function updateEvent(id: string, draft: Omit<Appointment, "id">): Promise<Appointment> {
  return apiFetch<Appointment>(`/agenda/events/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(draft),
  });
}

export async function deleteEvent(id: string): Promise<void> {
  await apiFetch<void>(`/agenda/events/${id}/`, { method: "DELETE" });
}
