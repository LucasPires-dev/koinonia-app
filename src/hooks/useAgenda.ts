import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as agendaService from "../services/agendaService";
import type { Appointment } from "../types/appointment";

export function useEvents(start: Date, end: Date, enabled = true) {
  const key = ["agenda-events", start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)] as const;
  return useQuery({
    queryKey: key,
    queryFn: () => agendaService.fetchEvents(start, end),
    enabled,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draft: Omit<Appointment, "id">) => agendaService.createEvent(draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda-events"] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, draft }: { id: string; draft: Omit<Appointment, "id"> }) =>
      agendaService.updateEvent(id, draft),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda-events"] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => agendaService.deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["agenda-events"] }),
  });
}
