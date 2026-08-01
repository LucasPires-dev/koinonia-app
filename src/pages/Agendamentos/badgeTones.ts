import type { ScheduleStatus } from "../../types/scheduledMessage";

export const SCHEDULE_STATUS_TONE: Record<ScheduleStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  agendado: "accent",
  enviando: "warning",
  enviado: "success",
  falhou: "danger",
  cancelado: "neutral",
};
