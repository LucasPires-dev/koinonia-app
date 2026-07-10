import type { ContactStatus, Priority } from "../../types/contact";

export const STATUS_TONE: Record<ContactStatus, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  novo: "accent",
  mensagem_enviada: "neutral",
  aguardando_resposta: "warning",
  respondeu: "success",
  encerrado: "neutral",
};

export const PRIORITY_TONE: Record<Priority, "neutral" | "accent" | "success" | "warning" | "danger"> = {
  alta: "danger",
  media: "warning",
  baixa: "neutral",
};
