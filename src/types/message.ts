export type MessageDirection = "in" | "out";

export interface Message {
  id: string;
  direction: MessageDirection;
  content: string;
  externalId: string;
  criadoEm: string;
}
