import { useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "../../components/ui/Field";
import EmptyState from "../../components/ui/EmptyState";
import WhatsAppStatus from "../Contacts/WhatsAppStatus";
import ChatThread from "../Contacts/ChatThread";
import { useContacts } from "../../hooks/useContacts";
import { formatRelative } from "../../utils/formatRelative";

export default function MessagesPage() {
  const { data: contacts, isLoading } = useContacts();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const conversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (contacts ?? [])
      .filter((c) => !term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term))
      .sort(
        (a, b) =>
          new Date(b.ultimaMensagemEm ?? b.atualizadoEm).getTime() -
          new Date(a.ultimaMensagemEm ?? a.atualizadoEm).getTime()
      );
  }, [contacts, search]);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-full">
      <div className="flex w-80 shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou telefone…"
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-text-tertiary">Carregando…</p>
          ) : conversations.length === 0 ? (
            <EmptyState icon={MessageSquare} title="Nenhum contato encontrado" />
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((contact) => (
                <li key={contact.id}>
                  <button
                    onClick={() => setSelectedId(contact.id)}
                    className={`flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-surface-hover ${
                      selectedId === contact.id ? "bg-surface-hover" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-sm font-medium text-text-primary">{contact.nome}</span>
                      <span className="shrink-0 text-[11px] text-text-tertiary">
                        {formatRelative(contact.ultimaMensagemEm)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {contact.naoLidas > 0 && (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                          {contact.naoLidas}
                        </span>
                      )}
                      <p className="truncate text-xs text-text-tertiary">
                        {contact.ultimaMensagem || contact.telefone}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {!selected ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessageSquare}
              title="Selecione uma conversa"
              description="Escolha um contato à esquerda para ver o chat."
            />
          </div>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{selected.nome}</p>
                <p className="truncate text-xs text-text-tertiary">{selected.telefone}</p>
              </div>
              <WhatsAppStatus status={selected.whatsappVerification} />
            </div>
            <div className="min-h-0 flex-1">
              <ChatThread contactId={selected.id} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
