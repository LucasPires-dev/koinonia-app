import { useMemo, useState } from "react";
import { CalendarClock, ChevronLeft, ChevronRight, Paperclip, Plus } from "lucide-react";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { useScheduledMessages } from "../../hooks/useScheduledMessages";
import { SCHEDULE_STATUS_DOT, SCHEDULE_STATUS_LABEL, type ScheduledMessage } from "../../types/scheduledMessage";
import { SCHEDULE_STATUS_TONE } from "./badgeTones";
import ScheduleComposer from "./ScheduleComposer";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

function summarizeRecipients(message: ScheduledMessage) {
  const contatos = message.recipients.filter((r) => r.type === "contato").length;
  const grupos = message.recipients.filter((r) => r.type === "grupo").length;
  const parts: string[] = [];
  if (contatos > 0) parts.push(`${contatos} contato${contatos > 1 ? "s" : ""}`);
  if (grupos > 0) parts.push(`${grupos} grupo${grupos > 1 ? "s" : ""}`);
  return parts.join(", ") || "Sem destinatários";
}

export default function AgendamentosCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [composer, setComposer] = useState<ScheduledMessage | "new" | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();

  const monthRangeStart = new Date(year, month, 1 - startOffset);
  const monthRangeEnd = new Date(year, month + 1, 1);

  const { data: messages, isLoading } = useScheduledMessages(monthRangeStart, monthRangeEnd);

  const messagesByDay = useMemo(() => {
    const map = new Map<string, ScheduledMessage[]>();
    for (const message of messages ?? []) {
      const key = new Date(message.scheduledFor).toDateString();
      map.set(key, [...(map.get(key) ?? []), message]);
    }
    return map;
  }, [messages]);

  const cells: Array<{ date: Date } | null> = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ date: new Date(year, month, i + 1) })),
  ];

  const dayMessages = (messagesByDay.get(selectedDate.toDateString()) ?? []).sort(
    (a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime()
  );

  return (
    <div className="p-5">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">
              {MONTHS[month]} {year}
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setCurrentDate(new Date());
                  setSelectedDate(new Date());
                }}
                className="rounded-md px-2 py-1 text-xs font-medium text-accent hover:bg-accent-soft"
              >
                Hoje
              </button>
              <button
                onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-text-tertiary">
            {WEEKDAYS.map((day) => (
              <span key={day} className="py-1">
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, index) => {
              if (!cell) return <div key={`empty-${index}`} />;
              const dayEvents = messagesByDay.get(cell.date.toDateString()) ?? [];
              const isToday = isSameDay(cell.date, new Date());
              const isSelected = isSameDay(cell.date, selectedDate);

              return (
                <button
                  key={cell.date.toISOString()}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`flex flex-col items-center gap-0.5 rounded-md py-1.5 text-xs transition-colors ${
                    isSelected
                      ? "bg-accent text-white"
                      : isToday
                        ? "bg-accent-soft text-accent font-semibold"
                        : "text-text-secondary hover:bg-surface-hover"
                  }`}
                >
                  {cell.date.getDate()}
                  <span className="flex gap-0.5">
                    {dayEvents.slice(0, 3).map((event, i) => (
                      <span
                        key={i}
                        className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : SCHEDULE_STATUS_DOT[event.status]}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-1.5 border-t border-border pt-4">
            {Object.entries(SCHEDULE_STATUS_LABEL).map(([status, label]) => (
              <div key={status} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className={`h-2 w-2 rounded-full ${SCHEDULE_STATUS_DOT[status as keyof typeof SCHEDULE_STATUS_DOT]}`} />
                {label}
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="mb-4 flex items-center justify-between p-4">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">
                {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </h3>
              <p className="text-xs text-text-tertiary">
                {dayMessages.length > 0
                  ? `${dayMessages.length} agendamento(s) para este dia`
                  : "Nenhum agendamento para este dia"}
              </p>
            </div>
            <Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={() => setComposer("new")}>
              Novo
            </Button>
          </Card>

          {isLoading ? (
            <p className="p-4 text-sm text-text-tertiary">Carregando…</p>
          ) : dayMessages.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nada por aqui" description="Nenhuma mensagem agendada para esta data." />
          ) : (
            <div className="space-y-3">
              {dayMessages.map((message) => (
                <button key={message.id} onClick={() => setComposer(message)} className="block w-full text-left">
                  <Card className="p-4 transition-colors hover:bg-surface-hover">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h4 className="line-clamp-1 text-sm font-semibold text-text-primary">
                        {message.content || "(sem texto — apenas anexos)"}
                      </h4>
                      <Badge tone={SCHEDULE_STATUS_TONE[message.status]}>{SCHEDULE_STATUS_LABEL[message.status]}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5 text-text-tertiary" />
                        {new Date(message.scheduledFor).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
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
        </div>
      </div>

      {composer && (
        <ScheduleComposer schedule={composer} defaultDate={selectedDate} onClose={() => setComposer(null)} />
      )}
    </div>
  );
}
