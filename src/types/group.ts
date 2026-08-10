export interface WhatsAppGroup {
  id?: string;
  jid: string;
  nome: string;
  avatarUrl?: string;
  participantes: number;
  ultimaMensagem?: string;
  ultimaMensagemEm?: string;
  naoLidas?: number;
}
