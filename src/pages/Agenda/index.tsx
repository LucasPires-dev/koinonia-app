import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, CalendarOff, CheckCircle2, ChevronLeft, ChevronRight, MapPin, User } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useEvents } from "../../hooks/useAgenda";
import { useIntegration } from "../../hooks/useIntegration";
import { APPOINTMENT_TYPE_DOT, APPOINTMENT_TYPE_LABEL } from "../../types/appointment";
import { PRIORITY_TONE } from "../Contacts/badgeTones";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function isSameDay(a: Date, b: Date) {
  return a.toDateString() === b.toDateString();
}

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: integration } = useIntegration();
  const googleConfigured = integration?.googleConfigured ?? false;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay();

  const monthRangeStart = new Date(year, month, 1 - startOffset);
  const monthRangeEnd = new Date(year, month + 1, 1);

  const { data: appointments, isLoading } = useEvents(monthRangeStart, monthRangeEnd, googleConfigured);

  const appointmentsByDay = useMemo(() => {
    const map = new Map<string, NonNullable<typeof appointments>>();
    for (const appointment of appointments ?? []) {
      const key = new Date(appointment.date).toDateString();
      map.set(key, [...(map.get(key) ?? []), appointment]);
    }
    return map;
  }, [appointments]);

  const cells: Array<{ date: Date } | null> = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ date: new Date(year, month, i + 1) })),
  ];

  const dayAppointments = (appointmentsByDay.get(selectedDate.toDateString()) ?? []).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
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
              const dayEvents = appointmentsByDay.get(cell.date.toDateString()) ?? [];
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
                        className={`h-1 w-1 rounded-full ${isSelected ? "bg-white" : APPOINTMENT_TYPE_DOT[event.type]}`}
                      />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-1.5 border-t border-border pt-4">
            {Object.entries(APPOINTMENT_TYPE_LABEL).map(([type, label]) => (
              <div key={type} className="flex items-center gap-2 text-xs text-text-secondary">
                <span className={`h-2 w-2 rounded-full ${APPOINTMENT_TYPE_DOT[type as keyof typeof APPOINTMENT_TYPE_DOT]}`} />
                {label}
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Card className="mb-4 p-4">
            <h3 className="text-sm font-semibold text-text-primary">
              {selectedDate.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
            </h3>
            <p className="text-xs text-text-tertiary">
              {dayAppointments.length > 0
                ? `${dayAppointments.length} compromisso(s) agendado(s)`
                : "Nenhum compromisso para este dia"}
            </p>
          </Card>

          {!googleConfigured ? (
            <EmptyState
              icon={CalendarOff}
              title="Google Agenda não conectada"
              description="Conecte sua conta do Google em Integrações para ver e criar compromissos aqui."
              action={
                <Link to="/integracoes">
                  <Button size="sm" variant="primary">
                    Ir para Integrações
                  </Button>
                </Link>
              }
            />
          ) : isLoading ? (
            <p className="p-4 text-sm text-text-tertiary">Carregando compromissos…</p>
          ) : dayAppointments.length === 0 ? (
            <EmptyState icon={CalendarClock} title="Nada por aqui" description="Nenhum compromisso agendado para esta data." />
          ) : (
            <div className="space-y-3">
              {dayAppointments.map((appointment) => (
                <Card key={appointment.id} className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-text-primary">{appointment.title}</h4>
                    <Badge tone={PRIORITY_TONE[appointment.priority]}>{appointment.priority}</Badge>
                    {appointment.confirmed && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-xs text-text-secondary sm:grid-cols-2">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-text-tertiary" /> {appointment.person}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-text-tertiary" /> {appointment.address}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CalendarClock className="h-3.5 w-3.5 text-text-tertiary" />
                      {new Date(appointment.date).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} ·{" "}
                      {appointment.duration} min
                    </span>
                  </div>
                  {appointment.notes && (
                    <p className="mt-3 rounded-md bg-surface p-2.5 text-xs text-text-secondary">{appointment.notes}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
