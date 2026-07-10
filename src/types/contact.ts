export type ContactStatus =
  | "novo"
  | "mensagem_enviada"
  | "aguardando_resposta"
  | "respondeu"
  | "encerrado";

export type Priority = "alta" | "media" | "baixa";

export type WhatsAppVerification = "verificado" | "invalido" | "nao_verificado" | "verificando";

export type ContactCategory =
  | "urgente"
  | "relacionamentos"
  | "vida_espiritual"
  | "duvidas_biblicas"
  | "crescimento"
  | "familia"
  | "profissional"
  | "geral";

export interface Contact {
  id: string;
  nome: string;
  telefone: string;
  categoria: ContactCategory;
  status: ContactStatus;
  prioridade: Priority;
  whatsappVerification: WhatsAppVerification;
  ultimaVerificacaoEm?: string;
  ultimaMensagem?: string;
  ultimaMensagemEm?: string;
  naoLidas: number;
  observacoes?: string;
  bairro?: string;
  aniversario?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export type ContactDraft = Omit<
  Contact,
  "id" | "whatsappVerification" | "ultimaVerificacaoEm" | "criadoEm" | "atualizadoEm" | "naoLidas"
>;

export const CATEGORY_LABEL: Record<ContactCategory, string> = {
  urgente: "Urgente",
  relacionamentos: "Relacionamentos",
  vida_espiritual: "Vida Espiritual",
  duvidas_biblicas: "Dúvidas Bíblicas",
  crescimento: "Crescimento Pessoal",
  familia: "Família",
  profissional: "Profissional",
  geral: "Geral",
};

export const STATUS_LABEL: Record<ContactStatus, string> = {
  novo: "Novo",
  mensagem_enviada: "Mensagem enviada",
  aguardando_resposta: "Aguardando resposta",
  respondeu: "Respondeu",
  encerrado: "Encerrado",
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  alta: "Alta",
  media: "Média",
  baixa: "Baixa",
};
