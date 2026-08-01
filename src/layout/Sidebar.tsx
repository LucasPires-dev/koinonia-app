import { useState, type ComponentType } from "react";
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Calendar,
  CalendarClock,
  MessageCircle,
  Plug,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/auth-context";

interface LinkItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

interface GroupItem {
  label: string;
  icon: ComponentType<{ className?: string }>;
  children: Array<{ to: string; label: string; end?: boolean }>;
}

const NAV_ITEMS: Array<LinkItem | GroupItem> = [
  { to: "/", label: "Visão geral", icon: LayoutDashboard, end: true },
  { to: "/contatos", label: "Contatos WhatsApp", icon: Users },
  { to: "/mensagens", label: "Mensagens", icon: MessageSquare },
  { to: "/agenda", label: "Agenda", icon: Calendar },
  {
    label: "Agendamentos",
    icon: CalendarClock,
    children: [
      { to: "/agendamentos", label: "Visão geral", end: true },
      { to: "/agendamentos/calendario", label: "Calendário" },
    ],
  },
  { to: "/integracoes", label: "Integrações", icon: Plug },
];

function isGroupItem(item: LinkItem | GroupItem): item is GroupItem {
  return "children" in item;
}

const linkClasses = (isActive: boolean) =>
  `flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-accent-soft text-accent"
      : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
  }`;

function NavGroup({ item }: { item: GroupItem }) {
  const location = useLocation();
  const isChildActive = item.children.some((child) =>
    child.end ? location.pathname === child.to : location.pathname.startsWith(child.to)
  );
  const [expanded, setExpanded] = useState(isChildActive);

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors ${
          isChildActive && !expanded
            ? "text-accent"
            : "text-text-secondary hover:bg-surface-hover hover:text-text-primary"
        }`}
      >
        <item.icon className="h-4 w-4" />
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown className={`h-3.5 w-3.5 shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="mt-0.5 space-y-0.5 pl-4">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.end}
              className={({ isActive }) => `${linkClasses(isActive)} pl-4 text-[13px]`}
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-current opacity-60" />
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-white">
          <MessageCircle className="h-3.5 w-3.5" />
        </div>
        <span className="text-sm font-semibold text-text-primary">Koinonia</span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) =>
          isGroupItem(item) ? (
            <NavGroup key={item.label} item={item} />
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => linkClasses(isActive)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-md px-1 py-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
            {(user?.username ?? "?").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-xs font-medium text-text-primary">{user?.username}</p>
            <p className="truncate text-[11px] text-text-tertiary">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Sair"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-text-tertiary hover:bg-surface-hover"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
