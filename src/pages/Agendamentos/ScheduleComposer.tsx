import { useEffect, useState } from "react";
import { Ban, Trash2, X } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Input, Label, Textarea } from "../../components/ui/Field";
import {
  useCancelScheduledMessage,
  useCreateScheduledMessage,
  useDeleteScheduledMessage,
  useUpdateScheduledMessage,
} from "../../hooks/useScheduledMessages";
import type { ScheduledMessage, ScheduledMessageDraft } from "../../types/scheduledMessage";
import { SCHEDULE_STATUS_LABEL } from "../../types/scheduledMessage";
import { SCHEDULE_STATUS_TONE } from "./badgeTones";
import AttachmentPicker from "./AttachmentPicker";
import RecipientPicker from "./RecipientPicker";

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes()
  )}`;
}

function defaultDraft(defaultDate?: Date): ScheduledMessageDraft {
  const base = defaultDate ? new Date(defaultDate) : new Date(Date.now() + 60 * 60 * 1000);
  if (defaultDate) base.setHours(9, 0, 0, 0);
  return { content: "", attachments: [], recipients: [], scheduledFor: base.toISOString() };
}

export default function ScheduleComposer({
  schedule,
  defaultDate,
  onClose,
}: {
  schedule: ScheduledMessage | "new" | null;
  defaultDate?: Date;
  onClose: () => void;
}) {
  const isNew = schedule === "new";
  const existing = isNew ? null : schedule;

  const [draft, setDraft] = useState<ScheduledMessageDraft>(existing ?? defaultDraft(defaultDate));
  const [pendingFiles, setPendingFiles] = useState<Record<string, File>>({});
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const createMutation = useCreateScheduledMessage();
  const updateMutation = useUpdateScheduledMessage();
  const cancelMutation = useCancelScheduledMessage();
  const deleteMutation = useDeleteScheduledMessage();

  useEffect(() => {
    setDraft(existing ?? defaultDraft(defaultDate));
    setPendingFiles({});
    setConfirmingCancel(false);
    setConfirmingDelete(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing?.id, isNew]);

  if (!schedule) return null;

  const readOnly = existing !== null && existing.status !== "agendado";
  const scheduledDate = new Date(draft.scheduledFor);
  const canSave =
    !readOnly &&
    (draft.content.trim().length > 0 || draft.attachments.length > 0) &&
    draft.recipients.length > 0 &&
    !Number.isNaN(scheduledDate.getTime());
  const saving = createMutation.isPending || updateMutation.isPending;
  const canCancel = existing && existing.status === "agendado";

  async function handleSave() {
    if (!canSave) return;
    const files = draft.attachments.filter((a) => pendingFiles[a.id]).map((a) => pendingFiles[a.id]);
    if (isNew) {
      await createMutation.mutateAsync({ draft, files });
    } else if (existing) {
      const keepAttachmentIds = draft.attachments.filter((a) => !pendingFiles[a.id]).map((a) => a.id);
      await updateMutation.mutateAsync({ id: existing.id, patch: draft, files, keepAttachmentIds });
    }
    onClose();
  }

  async function handleCancelSchedule() {
    if (!existing) return;
    await cancelMutation.mutateAsync(existing.id);
    onClose();
  }

  async function handleDelete() {
    if (!existing) return;
    await deleteMutation.mutateAsync(existing.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button aria-label="Fechar" onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-border bg-canvas shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold text-text-primary">
              {isNew ? "Novo agendamento" : "Editar agendamento"}
            </h2>
            {existing && <Badge tone={SCHEDULE_STATUS_TONE[existing.status]}>{SCHEDULE_STATUS_LABEL[existing.status]}</Badge>}
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover hover:text-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {existing?.status === "falhou" && existing.failureReason && (
            <div className="rounded-md border border-danger/30 bg-danger-soft px-3 py-2.5 text-xs text-danger">
              {existing.failureReason}
            </div>
          )}

          {readOnly && (
            <div className="rounded-md border border-border bg-surface px-3 py-2.5 text-xs text-text-tertiary">
              Este agendamento já não está mais pendente, então não pode ser editado — apenas excluído.
            </div>
          )}

          <div>
            <Label required>Mensagem</Label>
            <Textarea
              rows={5}
              value={draft.content}
              onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Escreva a mensagem que será enviada…"
              disabled={readOnly}
            />
          </div>

          <AttachmentPicker
            value={draft.attachments}
            onChange={(attachments) => setDraft((prev) => ({ ...prev, attachments }))}
            onFilesAdded={(pairs) =>
              setPendingFiles((prev) => {
                const next = { ...prev };
                pairs.forEach(({ id, file }) => {
                  next[id] = file;
                });
                return next;
              })
            }
            disabled={readOnly}
          />

          <RecipientPicker
            value={draft.recipients}
            onChange={(recipients) => setDraft((prev) => ({ ...prev, recipients }))}
            disabled={readOnly}
          />

          <div>
            <Label required>Enviar em</Label>
            <Input
              type="datetime-local"
              value={toLocalInputValue(scheduledDate)}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  scheduledFor: e.target.value ? new Date(e.target.value).toISOString() : prev.scheduledFor,
                }))
              }
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          {existing ? (
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Excluir este agendamento?</span>
                <Button size="sm" variant="danger" onClick={handleDelete} loading={deleteMutation.isPending}>
                  Confirmar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                  Voltar
                </Button>
              </div>
            ) : confirmingCancel ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-tertiary">Cancelar este agendamento?</span>
                <Button size="sm" variant="danger" onClick={handleCancelSchedule} loading={cancelMutation.isPending}>
                  Confirmar
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmingCancel(false)}>
                  Voltar
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  icon={<Trash2 className="h-3.5 w-3.5" />}
                  onClick={() => setConfirmingDelete(true)}
                  className="text-danger hover:bg-danger-soft"
                >
                  Excluir
                </Button>
                {canCancel && (
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Ban className="h-3.5 w-3.5" />}
                    onClick={() => setConfirmingCancel(true)}
                  >
                    Cancelar agendamento
                  </Button>
                )}
              </div>
            )
          ) : (
            <span />
          )}

          {!readOnly && (
            <Button variant="primary" onClick={handleSave} disabled={!canSave} loading={saving}>
              {isNew ? "Agendar envio" : "Salvar alterações"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
