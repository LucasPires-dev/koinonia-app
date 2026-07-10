import { apiFetch } from "./api";
import type { Appointment } from "../types/appointment";

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export async function fetchAppointments(): Promise<Appointment[]> {
  const data = await apiFetch<Paginated<Appointment> | Appointment[]>("/agenda/");
  return Array.isArray(data) ? data : data.results;
}
