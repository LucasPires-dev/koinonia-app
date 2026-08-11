import { useMemo, useState, type FormEvent } from "react";
import { MessageCircle, RefreshCw, Search, Send, Users, X } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input } from "../../components/ui/Field";
import EmptyState from "../../components/ui/EmptyState";
import Avatar from "../../components/ui/Avatar";
import { useWhatsAppGroups, useSendGroupMessage } from "../../hooks/useGroups";
import type { WhatsAppGroup } from "../../types/group";

function SendMessageRow({ group, onClose }: { group: WhatsAppGroup; onClose: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const sendGroupMessage = useSendGroupMessage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const content = text.trim();
    if (!content) return;
    setError(null);
    try {
      await sendGroupMessage.mutateAsync({
        jid: group.jid,
        content,
        nome: group.nome,
        avatarUrl: group.avatarUrl,
        participantes: group.participantes,
      });
      setText("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar a mensagem.");
    }
  }

  return (
    <div className="px-4 pb-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          placeholder={`Mensagem para ${group.nome || "o grupo"}…`}
          className="flex-1"
        />
        <Button
          type="submit"
          size="sm"
          variant="primary"
          icon={<Send className="h-3.5 w-3.5" />}
          loading={sendGroupMessage.isPending}
          disabled={!text.trim()}
          aria-label="Enviar"
        />
        <Button type="button" size="sm" variant="ghost" icon={<X className="h-3.5 w-3.5" />} onClick={onClose} aria-label="Cancelar" />
      </form>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}

export default function GroupsPage() {
  const { data: groups, isLoading, isError } = useWhatsAppGroups();
  const [search, setSearch] = useState("");
  const [composingJid, setComposingJid] = useState<string | null>(null);

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
          <ul className="divide-y divide-border">
            {filtered.map((group) => (
              <li key={group.jid}>
                <div className="flex items-center gap-2.5 px-4 py-2.5">
                  <Avatar src={group.avatarUrl} name={group.nome || "?"} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-primary">{group.nome || group.jid}</p>
                    <p className="truncate text-xs text-text-tertiary">{group.participantes} participantes</p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={<MessageCircle className="h-3.5 w-3.5" />}
                    onClick={() => setComposingJid((current) => (current === group.jid ? null : group.jid))}
                  >
                    Enviar mensagem
                  </Button>
                </div>
                {composingJid === group.jid && (
                  <SendMessageRow group={group} onClose={() => setComposingJid(null)} />
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
