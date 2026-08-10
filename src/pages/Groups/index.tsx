import { useMemo, useState } from "react";
import { RefreshCw, Search, Users } from "lucide-react";
import Card from "../../components/ui/Card";
import { Input } from "../../components/ui/Field";
import EmptyState from "../../components/ui/EmptyState";
import Avatar from "../../components/ui/Avatar";
import { useWhatsAppGroups } from "../../hooks/useGroups";

export default function GroupsPage() {
  const { data: groups, isLoading, isError } = useWhatsAppGroups();
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!groups) return [];
    const term = search.trim().toLowerCase();
    if (!term) return groups;
    return groups.filter((g) => g.nome.toLowerCase().includes(term));
  }, [groups, search]);

  return (
    <div className="p-5">
      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Total de grupos</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{groups?.length ?? 0}</p>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome do grupo…"
            className="pl-8"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-tertiary">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando grupos…
          </div>
        ) : isError ? (
          <EmptyState
            icon={Users}
            title="Não foi possível carregar os grupos"
            description="Confira se as credenciais uazapi estão configuradas em Integrações."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum grupo encontrado"
            description="Os grupos do WhatsApp conectado aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border text-xs text-text-tertiary">
                  <th className="px-4 py-2.5 font-medium">Grupo</th>
                  <th className="px-4 py-2.5 font-medium">Participantes</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((group) => (
                  <tr key={group.jid} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={group.avatarUrl} name={group.nome || "?"} size="sm" />
                        <span className="text-sm font-medium text-text-primary">{group.nome || group.jid}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-text-secondary">{group.participantes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
