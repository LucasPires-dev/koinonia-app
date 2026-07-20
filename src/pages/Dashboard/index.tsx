import { AlertTriangle, ArrowRight, Calendar, MessageSquare, ShieldCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { useContacts } from "../../hooks/useContacts";
import { mockAppointments } from "../../mocks/appointments";
import { formatRelative } from "../../utils/formatRelative";
import { PRIORITY_TONE } from "../Contacts/badgeTones";

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Users;
  label: string;
  value: string | number;
  hint: string;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-2xl font-semibold text-text-primary">{value}</p>
      <p className="text-xs text-text-tertiary">{label}</p>
      <p className="mt-2 text-[11px] text-text-tertiary">{hint}</p>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: contacts } = useContacts();

  const total = contacts?.length ?? 0;
  const verified = contacts?.filter((c) => c.whatsappVerification === "verificado").length ?? 0;
  const unread = contacts?.reduce((sum, c) => sum + c.naoLidas, 0) ?? 0;
  const urgent = contacts?.filter((c) => c.prioridade === "alta" && c.naoLidas > 0) ?? [];
  const upcoming = [...mockAppointments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="p-5">
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          icon={Users}
          label="Total de contatos"
          value={total}
          hint={`${total > 0 ? Math.round((verified / total) * 100) : 0}% verificados no WhatsApp`}
        />
        <MetricCard icon={ShieldCheck} label="Verificados" value={verified} hint="Números confirmados no WhatsApp" />
        <MetricCard icon={MessageSquare} label="Mensagens não lidas" value={unread} hint="Aguardando sua resposta" />
        <MetricCard icon={Calendar} label="Compromissos hoje" value={mockAppointments.length} hint="Na agenda pastoral" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Prioridade alta com mensagens não lidas</h3>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </div>

          {urgent.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="Tudo em dia" description="Nenhum contato urgente pendente." />
          ) : (
            <div className="space-y-2">
              {urgent.slice(0, 4).map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border bg-surface px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary">{contact.nome}</p>
                    <p className="truncate text-xs text-text-tertiary">{contact.ultimaMensagem}</p>
                  </div>
                  <Badge tone={PRIORITY_TONE[contact.prioridade]}>{formatRelative(contact.ultimaMensagemEm)}</Badge>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/contatos"
            className="mt-4 flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Ver todos os contatos <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Próximos compromissos</h3>
            <Calendar className="h-4 w-4 text-accent" />
          </div>

          <div className="space-y-2">
            {upcoming.map((appointment) => (
              <div key={appointment.id} className="rounded-md border border-border bg-surface px-3 py-2.5">
                <p className="text-sm font-medium text-text-primary">{appointment.title}</p>
                <p className="text-xs text-text-tertiary">{appointment.person}</p>
                <p className="mt-1 text-[11px] text-text-tertiary">
                  {new Date(appointment.date).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  às{" "}
                  {new Date(appointment.date).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>

          <Link to="/agenda" className="mt-4 flex items-center gap-1 text-xs font-medium text-accent hover:underline">
            Ver agenda completa <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
