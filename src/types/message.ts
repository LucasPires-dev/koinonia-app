export type MessageDirection = "in" | "out";

export interface Message {
  id: string;
  direction: MessageDirection;
  content: string;
  externalId: string;
  messageType: string;
  mediaUrl: string | null;
  fileName: string;
  enviadoEm: string | null;
  criadoEm: string;
}
