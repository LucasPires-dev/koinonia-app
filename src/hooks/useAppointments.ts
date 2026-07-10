import { useQuery } from "@tanstack/react-query";
import { fetchAppointments } from "../services/agendaService";

export function useAppointments() {
  return useQuery({ queryKey: ["appointments"], queryFn: fetchAppointments });
}
