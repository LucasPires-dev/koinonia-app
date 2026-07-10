import { Bell, Moon, Sun } from "lucide-react";
import { useLocation } from "react-router-dom";
import IconButton from "../components/ui/IconButton";
import { useTheme } from "../theme/theme-context";
import { useContacts } from "../hooks/useContacts";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Visão geral", subtitle: "Resumo da atividade pastoral" },
  "/contatos": { title: "Contatos WhatsApp", subtitle: "Verifique e gerencie sua base de contatos" },
  "/mensagens": { title: "Mensagens", subtitle: "Conversas recebidas pelo WhatsApp" },
  "/agenda": { title: "Agenda", subtitle: "Visitas, aconselhamentos e reuniões" },
  "/configuracoes": { title: "Configurações", subtitle: "Conexões e preferências da conta" },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { data: contacts } = useContacts();
  const unread = contacts?.reduce((sum, c) => sum + c.naoLidas, 0) ?? 0;
  const meta = TITLES[pathname] ?? TITLES["/"];

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5">
      <div>
        <h1 className="text-sm font-semibold text-text-primary">{meta.title}</h1>
        <p className="text-xs text-text-tertiary">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-1">
        <IconButton onClick={toggleTheme} aria-label="Alternar tema">
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconButton>
        <div className="relative">
          <IconButton aria-label="Notificações">
            <Bell className="h-4 w-4" />
          </IconButton>
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {unread}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
