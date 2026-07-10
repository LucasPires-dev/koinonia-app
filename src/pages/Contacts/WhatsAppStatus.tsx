import { CheckCircle2, HelpCircle, Loader2, XCircle } from "lucide-react";
import Badge from "../../components/ui/Badge";
import type { WhatsAppVerification } from "../../types/contact";

const CONFIG: Record<
  WhatsAppVerification,
  { label: string; tone: "success" | "danger" | "neutral" | "accent"; icon: React.ReactNode }
> = {
  verificado: { label: "WhatsApp verificado", tone: "success", icon: <CheckCircle2 className="h-3 w-3" /> },
  invalido: { label: "Não é WhatsApp", tone: "danger", icon: <XCircle className="h-3 w-3" /> },
  nao_verificado: { label: "Não verificado", tone: "neutral", icon: <HelpCircle className="h-3 w-3" /> },
  verificando: { label: "Verificando…", tone: "accent", icon: <Loader2 className="h-3 w-3 animate-spin" /> },
};

export default function WhatsAppStatus({ status }: { status: WhatsAppVerification }) {
  const config = CONFIG[status];
  return (
    <Badge tone={config.tone} icon={config.icon}>
      {config.label}
    </Badge>
  );
}
