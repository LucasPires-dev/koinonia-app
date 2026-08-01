export interface ContactGroup {
  id: string;
  nome: string;
  descricao?: string;
  contactIds: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export type ContactGroupDraft = Omit<ContactGroup, "id" | "criadoEm" | "atualizadoEm">;
