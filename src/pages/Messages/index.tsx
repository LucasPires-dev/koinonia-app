import { useMemo, useState } from "react";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Input } from "../../components/ui/Field";
import IconButton from "../../components/ui/IconButton";
import EmptyState from "../../components/ui/EmptyState";
import Avatar from "../../components/ui/Avatar";
import WhatsAppStatus from "../Contacts/WhatsAppStatus";
import ChatThread from "../Contacts/ChatThread";
import { useContacts } from "../../hooks/useContacts";
import { formatRelative } from "../../utils/formatRelative";

export default function MessagesPage() {
  const { data: contacts, isLoading } = useContacts();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const conversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (contacts ?? [])
      .filter((c) => c.ultimaMensagemEm)
      .filter((c) => !term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term))
      .sort(
        (a, b) =>
          new Date(b.ultimaMensagemEm ?? b.atualizadoEm).getTime() -
          new Date(a.ultimaMensagemEm ?? a.atualizadoEm).getTime()
      );
  }, [contacts, search]);

  const pickerResults = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    return (contacts ?? []).filter(
      (c) => !term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term)
    );
  }, [contacts, pickerSearch]);

  const selected = (contacts ?? []).find((c) => c.id === selectedId) ?? null;

  function startConversation(contactId: string) {
    setSelectedId(contactId);
    setPickerOpen(false);
    setPickerSearch("");
  }

  return (
    <div className="flex h-full">
      <div className="relative flex w-80 shrink-0 flex-col border-r border-border">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou telefone…"
              className="pl-8"
            />
          </div>
          <IconButton aria-label="Nova conversa" onClick={() => setPickerOpen((v) => !v)}>
            <Plus className="h-4 w-4" />
          </IconButton>
        </div>

        {pickerOpen && (
          <>
            <button
              aria-label="Fechar"
              className="fixed inset-0 z-0 cursor-default"
              onClick={() => setPickerOpen(false)}
            />
            <div className="absolute inset-x-0 top-[52px] z-10 flex max-h-96 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-lg">
              <div className="border-b border-border p-2">
                <Input
                  autoFocus
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setPickerOpen(false)}
                  placeholder="Buscar contato para iniciar conversa…"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {pickerResults.length === 0 ? (
                  <p className="p-4 text-center text-xs text-text-tertiary">Nenhum contato encontrado.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {pickerResults.map((contact) => (
                      <li key={contact.id}>
                        <button
                          onClick={() => startConversation(contact.id)}
                          className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-surface-hover"
                        >
                          <Avatar src={contact.avatarUrl} name={contact.nome} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-medium text-text-primary">
                              {contact.nome}
                            </span>
                            <span className="block truncate text-xs text-text-tertiary">{contact.telefone}</span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-sm text-text-tertiary">Carregando…</p>
          ) : conversations.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title={search ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
              description={search ? undefined : "Clique em “+” para escolher um contato e iniciar uma conversa."}
            />
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((contact) => (
                <li key={contact.id}>
                  <button
                    onClick={() => setSelectedId(contact.id)}
                    className={`flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-surface-hover ${
                      selectedId === contact.id ? "bg-surface-hover" : ""
                    }`}
                  >
                    <Avatar src={contact.avatarUrl} name={contact.nome} size="sm" />
                    <div className="min-w-0 flex-1">
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
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar src={selected.avatarUrl} name={selected.nome} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{selected.nome}</p>
                  <p className="truncate text-xs text-text-tertiary">
                    {selected.telefone}
                    {selected.gruposComuns && selected.gruposComuns.length > 0 && (
                      <> · {selected.gruposComuns.slice(0, 2).join(", ")}</>
                    )}
                  </p>
                </div>
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
