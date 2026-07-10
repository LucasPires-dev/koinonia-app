import { LayoutDashboard, MessageSquare, Users, Calendar, MessageCircle } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/contatos", label: "Contatos WhatsApp", icon: Users },
  { to: "/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/agenda", label: "Agenda", icon: Calendar },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white">
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold text-text-primary">Koinonia</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent-soft text-accent"
                  : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-1 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
            P
          </div>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-xs font-medium text-text-primary">Pastor João</p>
            <p className="truncate text-[11px] text-text-tertiary">Igreja Batista Central</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
