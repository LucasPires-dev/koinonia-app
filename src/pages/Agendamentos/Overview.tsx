import { useMemo, useState } from "react";
import { CalendarClock, Paperclip, Plus, Send, XCircle } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import MetricCard from "../../components/ui/MetricCard";
import { useScheduledMessages } from "../../hooks/useScheduledMessages";
import { SCHEDULE_STATUS_LABEL, type ScheduledMessage } from "../../types/scheduledMessage";
import { SCHEDULE_STATUS_TONE } from "./badgeTones";
import ScheduleComposer from "./ScheduleComposer";

function summarizeRecipients(message: ScheduledMessage) {
  const contatos = message.recipients.filter((r) => r.type === "contato").length;
  const grupos = message.recipients.filter((r) => r.type === "grupo").length;
  const parts: string[] = [];
  if (contatos > 0) parts.push(`${contatos} contato${contatos > 1 ? "s" : ""}`);
  if (grupos > 0) parts.push(`${grupos} grupo${grupos > 1 ? "s" : ""}`);
  return parts.join(", ") || "Sem destinatários";
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

export default function AgendamentosOverviewPage() {
  const rangeStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 14);
    return d;
  }, []);
  const rangeEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 90);
    return d;
  }, []);

  const { data: messages, isLoading } = useScheduledMessages(rangeStart, rangeEnd);
  const [composer, setComposer] = useState<ScheduledMessage | "new" | null>(null);

  const upcoming = (messages ?? [])
    .filter((m) => m.status === "agendado" || m.status === "enviando")
    .sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());

  const sentLast7 = (messages ?? []).filter((m) => m.status === "enviado").length;
  const failed = (messages ?? []).filter((m) => m.status === "falhou").length;
  const next = upcoming[0];

  return (
    <div className="p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Agendamentos de mensagens</h1>
          <p className="text-sm text-text-tertiary">Programe envios de texto e arquivos para contatos e grupos.</p>
        </div>
        <Button variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setComposer("new")}>
          Novo agendamento
        </Button>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard icon={CalendarClock} label="Agendados" value={upcoming.length} hint="Envios ainda não realizados" />
        <MetricCard icon={Send} label="Enviados" value={sentLast7} hint="No período consultado" />
        <MetricCard icon={XCircle} label="Falharam" value={failed} hint="Precisam de atenção" />
        <MetricCard
          icon={CalendarClock}
          label="Próximo envio"
          value={next ? formatDateTime(next.scheduledFor) : "—"}
          hint={next ? summarizeRecipients(next) : "Nenhum agendamento pendente"}
        />
      </div>

      <Card className="p-5">
        <h3 className="mb-4 text-sm font-semibold text-text-primary">Próximos agendamentos</h3>

        {isLoading ? (
          <p className="text-sm text-text-tertiary">Carregando…</p>
        ) : upcoming.length === 0 ? (
          <EmptyState
            icon={CalendarClock}
            title="Nenhum agendamento pendente"
            description="Clique em “Novo agendamento” para programar um envio."
          />
        ) : (
          <div className="space-y-3">
            {upcoming.map((message) => (
              <button key={message.id} onClick={() => setComposer(message)} className="block w-full text-left">
                <Card className="p-4 transition-colors hover:bg-surface-hover">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-sm font-medium text-text-primary">
                      {message.content || "(sem texto — apenas anexos)"}
                    </p>
                    <Badge tone={SCHEDULE_STATUS_TONE[message.status]}>{SCHEDULE_STATUS_LABEL[message.status]}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-text-tertiary" />
                      {formatDateTime(message.scheduledFor)}
                    </span>
                    <span>{summarizeRecipients(message)}</span>
                    {message.attachments.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5 text-text-tertiary" />
                        {message.attachments.length}
                      </span>
                    )}
                  </div>
                </Card>
              </button>
            ))}
          </div>
        )}
      </Card>

      {composer && <ScheduleComposer schedule={composer} onClose={() => setComposer(null)} />}
    </div>
  );
}
