import { useEffect, useState } from "react";
import { RefreshCw, Trash2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import { Input, Label, Select, Textarea } from "../../components/ui/Field";
import WhatsAppStatus from "./WhatsAppStatus";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type Contact,
  type ContactCategory,
  type ContactDraft,
  type ContactStatus,
  type Priority,
} from "../../types/contact";
import {
  useCreateContact,
  useDeleteContact,
  useUpdateContact,
  useVerifyContact,
} from "../../hooks/useContacts";

const EMPTY_DRAFT: ContactDraft = {
  nome: "",
  telefone: "",
  categoria: "geral",
  status: "novo",
  prioridade: "media",
  bairro: "",
  aniversario: "",
  observacoes: "",
};

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export default function ContactDrawer({
  contact,
  onClose,
}: {
  contact: Contact | null | "new";
  onClose: () => void;
}) {
  const isNew = contact === "new";
  const existing = isNew ? null : contact;
  const [draft, setDraft] = useState<ContactDraft>(existing ?? EMPTY_DRAFT);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const verifyContact = useVerifyContact();

  useEffect(() => {
    setDraft(existing ?? EMPTY_DRAFT);
    setConfirmingDelete(false);
  }, [existing]);

  if (!contact) return null;

  const update = <K extends keyof ContactDraft>(key: K, value: ContactDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    if (!draft.nome.trim() || !draft.telefone.trim()) return;
    if (isNew) {
      await createContact.mutateAsync(draft);
    } else if (existing) {
      await updateContact.mutateAsync({ id: existing.id, patch: draft });
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!existing) return;
    await deleteContact.mutateAsync(existing.id);
    onClose();
  };

  const saving = createContact.isPending || updateContact.isPending;
  const canSave = draft.nome.trim().length > 0 && draft.telefone.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px]"
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-canvas shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            {existing && <Avatar src={existing.avatarUrl} name={existing.nome} />}
            <h2 className="text-sm font-semibold text-text-primary">
              {isNew ? "Novo contato" : existing?.nome}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {existing && (
            <div className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5">
              <WhatsAppStatus status={existing.whatsappVerification} />
              <Button
                size="sm"
                variant="ghost"
                icon={<RefreshCw className={`h-3.5 w-3.5 ${verifyContact.isPending ? "animate-spin" : ""}`} />}
                disabled={verifyContact.isPending}
                onClick={() => verifyContact.mutate(existing.id)}
              >
                Verificar
              </Button>
            </div>
          )}

          {existing && (existing.waName || (existing.gruposComuns && existing.gruposComuns.length > 0)) && (
            <div className="space-y-1.5 rounded-md border border-border bg-surface px-3 py-2.5 text-xs">
              {existing.waName && existing.waName !== existing.nome && (
                <p className="text-text-secondary">
                  Nome no WhatsApp: <span className="font-medium text-text-primary">{existing.waName}</span>
                </p>
              )}
              {existing.gruposComuns && existing.gruposComuns.length > 0 && (
                <div>
                  <p className="mb-1 text-text-tertiary">Grupos em comum</p>
                  <div className="flex flex-wrap gap-1">
                    {existing.gruposComuns.map((grupo) => (
                      <Badge key={grupo} tone="neutral">
                        {grupo}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label required>Nome</Label>
              <Input value={draft.nome} onChange={(e) => update("nome", e.target.value)} placeholder="Nome completo" />
            </div>
            <div className="col-span-2">
              <Label required>Telefone (WhatsApp)</Label>
              <Input
                value={draft.telefone}
                onChange={(e) => update("telefone", e.target.value)}
                placeholder="+55 21 90000-0000"
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <Select
                value={draft.categoria}
                onChange={(e) => update("categoria", e.target.value as ContactCategory)}
              >
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Prioridade</Label>
              <Select value={draft.prioridade} onChange={(e) => update("prioridade", e.target.value as Priority)}>
                {Object.entries(PRIORITY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={draft.status} onChange={(e) => update("status", e.target.value as ContactStatus)}>
                {Object.entries(STATUS_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label>Bairro</Label>
              <Input value={draft.bairro ?? ""} onChange={(e) => update("bairro", e.target.value)} />
            </div>

            <div className="col-span-2">
              <Label>Observações</Label>
              <Textarea
                rows={4}
                value={draft.observacoes ?? ""}
                onChange={(e) => update("observacoes", e.target.value)}
                placeholder="Notas pastorais sobre este contato…"
              />
            </div>
          </div>

          {existing && (
            <div className="grid grid-cols-2 gap-2 text-xs text-text-tertiary">
              <span>Criado em {formatDateTime(existing.criadoEm)}</span>
              <span>Atualizado em {formatDateTime(existing.atualizadoEm)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          {existing ? (
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Excluir contato?</span>
                <Button size="sm" variant="danger" onClick={handleDelete} loading={deleteContact.isPending}>
                  Confirmar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  Cancelar
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                icon={<Trash2 className="h-3.5 w-3.5" />}
                onClick={() => setConfirmingDelete(true)}
                className="text-danger hover:bg-danger-soft"
              >
                Excluir
              </Button>
            )
          ) : (
            <span />
          )}

          <Button variant="primary" onClick={handleSave} disabled={!canSave} loading={saving}>
            {isNew ? "Criar contato" : "Salvar alterações"}
          </Button>
        </div>
      </div>
    </div>
  );
}
