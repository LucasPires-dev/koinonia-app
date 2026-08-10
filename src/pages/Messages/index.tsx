import { useMemo, useState } from "react";
import { MessageSquare, Plus, Search } from "lucide-react";
import { Input } from "../../components/ui/Field";
import IconButton from "../../components/ui/IconButton";
import EmptyState from "../../components/ui/EmptyState";
import Avatar from "../../components/ui/Avatar";
import WhatsAppStatus from "../Contacts/WhatsAppStatus";
import ChatThread from "../Contacts/ChatThread";
import { useContacts } from "../../hooks/useContacts";
import { useGroupThreads, useWhatsAppGroups } from "../../hooks/useGroups";
import { formatRelative } from "../../utils/formatRelative";
import type { Contact } from "../../types/contact";
import type { WhatsAppGroup } from "../../types/group";

type Selected = { kind: "contact"; contact: Contact } | { kind: "group"; group: WhatsAppGroup };

export default function MessagesPage() {
  const { data: contacts, isLoading: contactsLoading } = useContacts();
  const { data: groupThreads, isLoading: groupsLoading } = useGroupThreads();
  const { data: liveGroups } = useWhatsAppGroups();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Selected | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const conversations = useMemo(() => {
    const term = search.trim().toLowerCase();

    const contactItems = (contacts ?? [])
      .filter((c) => c.ultimaMensagemEm)
      .filter((c) => !term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term))
      .map((c) => ({ kind: "contact" as const, contact: c, lastAt: c.ultimaMensagemEm ?? c.atualizadoEm }));

    const groupItems = (groupThreads ?? [])
      .filter((g) => g.ultimaMensagemEm)
      .filter((g) => !term || g.nome.toLowerCase().includes(term))
      .map((g) => ({ kind: "group" as const, group: g, lastAt: g.ultimaMensagemEm as string }));

    return [...contactItems, ...groupItems].sort(
      (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    );
  }, [contacts, groupThreads, search]);

  const pickerContacts = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    return (contacts ?? []).filter(
      (c) => !term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term)
    );
  }, [contacts, pickerSearch]);

  const pickerGroups = useMemo(() => {
    const term = pickerSearch.trim().toLowerCase();
    return (liveGroups ?? []).filter((g) => !term || g.nome.toLowerCase().includes(term));
  }, [liveGroups, pickerSearch]);

  function startContactConversation(contact: Contact) {
    setSelected({ kind: "contact", contact });
    setPickerOpen(false);
    setPickerSearch("");
  }

  function startGroupConversation(group: WhatsAppGroup) {
    const tracked = groupThreads?.find((g) => g.jid === group.jid);
    setSelected({ kind: "group", group: tracked ?? group });
    setPickerOpen(false);
    setPickerSearch("");
  }

  const isLoading = contactsLoading || groupsLoading;

  return (
    <div className="flex h-full">
      <div className="relative flex w-80 shrink-0 flex-col border-r border-border">
        <div className="flex items-center gap-2 border-b border-border p-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, telefone ou grupo…"
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
                  placeholder="Buscar contato ou grupo…"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {pickerContacts.length === 0 && pickerGroups.length === 0 ? (
                  <p className="p-4 text-center text-xs text-text-tertiary">Nada encontrado.</p>
                ) : (
                  <>
                    {pickerContacts.length > 0 && (
                      <ul className="divide-y divide-border">
                        {pickerContacts.map((contact) => (
                          <li key={contact.id}>
                            <button
                              onClick={() => startContactConversation(contact)}
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
                    {pickerGroups.length > 0 && (
                      <ul className="divide-y divide-border">
                        {pickerGroups.map((group) => (
                          <li key={group.jid}>
                            <button
                              onClick={() => startGroupConversation(group)}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-surface-hover"
                            >
                              <Avatar src={group.avatarUrl} name={group.nome || "?"} size="sm" />
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-text-primary">
                                  {group.nome || group.jid}
                                </span>
                                <span className="block truncate text-xs text-text-tertiary">
                                  {group.participantes} participantes
                                </span>
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
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
              description={search ? undefined : "Clique em “+” para escolher um contato ou grupo e iniciar uma conversa."}
            />
          ) : (
            <ul className="divide-y divide-border">
              {conversations.map((item) => {
                const nome = item.kind === "contact" ? item.contact.nome : item.group.nome || item.group.jid;
                const avatarUrl = item.kind === "contact" ? item.contact.avatarUrl : item.group.avatarUrl;
                const ultimaMensagem = item.kind === "contact" ? item.contact.ultimaMensagem : item.group.ultimaMensagem;
                const ultimaMensagemEm =
                  item.kind === "contact" ? item.contact.ultimaMensagemEm : item.group.ultimaMensagemEm;
                const naoLidas = item.kind === "contact" ? item.contact.naoLidas : item.group.naoLidas ?? 0;
                const subtitle =
                  ultimaMensagem || (item.kind === "contact" ? item.contact.telefone : `${item.group.participantes} participantes`);
                const isSelected =
                  selected?.kind === item.kind &&
                  (item.kind === "contact" && selected.kind === "contact"
                    ? selected.contact.id === item.contact.id
                    : item.kind === "group" && selected.kind === "group"
                      ? selected.group.jid === item.group.jid
                      : false);

                return (
                  <li key={`${item.kind}:${item.kind === "contact" ? item.contact.id : item.group.jid}`}>
                    <button
                      onClick={() =>
                        item.kind === "contact"
                          ? setSelected({ kind: "contact", contact: item.contact })
                          : setSelected({ kind: "group", group: item.group })
                      }
                      className={`flex w-full items-center gap-2.5 px-4 py-3 text-left hover:bg-surface-hover ${
                        isSelected ? "bg-surface-hover" : ""
                      }`}
                    >
                      <Avatar src={avatarUrl} name={nome} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-text-primary">{nome}</span>
                          <span className="shrink-0 text-[11px] text-text-tertiary">
                            {formatRelative(ultimaMensagemEm)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {naoLidas > 0 && (
                            <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                              {naoLidas}
                            </span>
                          )}
                          <p className="truncate text-xs text-text-tertiary">{subtitle}</p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
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
              description="Escolha um contato ou grupo à esquerda para ver o chat."
            />
          </div>
        ) : selected.kind === "contact" ? (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar src={selected.contact.avatarUrl} name={selected.contact.nome} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">{selected.contact.nome}</p>
                  <p className="truncate text-xs text-text-tertiary">
                    {selected.contact.telefone}
                    {selected.contact.gruposComuns && selected.contact.gruposComuns.length > 0 && (
                      <> · {selected.contact.gruposComuns.slice(0, 2).join(", ")}</>
                    )}
                  </p>
                </div>
              </div>
              <WhatsAppStatus status={selected.contact.whatsappVerification} />
            </div>
            <div className="min-h-0 flex-1">
              <ChatThread key={`contact:${selected.contact.id}`} kind="contact" contactId={selected.contact.id} />
            </div>
          </>
        ) : (
          <>
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar src={selected.group.avatarUrl} name={selected.group.nome || "?"} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {selected.group.nome || selected.group.jid}
                  </p>
                  <p className="truncate text-xs text-text-tertiary">{selected.group.participantes} participantes</p>
                </div>
              </div>
            </div>
            <div className="min-h-0 flex-1">
              <ChatThread
                key={`group:${selected.group.jid}`}
                kind="group"
                groupId={selected.group.id}
                jid={selected.group.jid}
                nome={selected.group.nome}
                avatarUrl={selected.group.avatarUrl}
                participantes={selected.group.participantes}
                onGroupCreated={(group) => setSelected({ kind: "group", group })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
