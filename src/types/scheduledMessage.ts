export type ScheduleStatus = "agendado" | "enviando" | "enviado" | "falhou" | "cancelado";

export type RecipientType = "contato" | "grupo";

export interface ScheduledRecipient {
  type: RecipientType;
  id: string;
  nome: string;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  previewUrl?: string;
}

export interface ScheduledMessage {
  id: string;
  content: string;
  attachments: MessageAttachment[];
  recipients: ScheduledRecipient[];
  scheduledFor: string;
  status: ScheduleStatus;
  failureReason?: string | null;
  sentAt?: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export type ScheduledMessageDraft = Omit<
  ScheduledMessage,
  "id" | "status" | "failureReason" | "sentAt" | "criadoEm" | "atualizadoEm"
>;

export const SCHEDULE_STATUS_LABEL: Record<ScheduleStatus, string> = {
  agendado: "Agendado",
  enviando: "Enviando",
  enviado: "Enviado",
  falhou: "Falhou",
  cancelado: "Cancelado",
};

export const SCHEDULE_STATUS_DOT: Record<ScheduleStatus, string> = {
  agendado: "bg-accent",
  enviando: "bg-warning",
  enviado: "bg-success",
  falhou: "bg-danger",
  cancelado: "bg-text-tertiary",
};
