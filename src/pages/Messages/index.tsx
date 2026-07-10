import { useMemo, useState } from "react";
import { MessageSquare, Search } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Input } from "../../components/ui/Field";
import EmptyState from "../../components/ui/EmptyState";
import ContactDrawer from "../Contacts/ContactDrawer";
import WhatsAppStatus from "../Contacts/WhatsAppStatus";
import { PRIORITY_TONE } from "../Contacts/badgeTones";
import { useContacts } from "../../hooks/useContacts";
import { CATEGORY_LABEL, type Contact } from "../../types/contact";
import { formatRelative } from "../../utils/formatRelative";

export default function MessagesPage() {
  const { data: contacts, isLoading } = useContacts();
  const [search, setSearch] = useState("");
  const [activeContact, setActiveContact] = useState<Contact | null>(null);

  const conversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (contacts ?? [])
      .filter((c) => c.ultimaMensagem)
      .filter((c) => !term || c.nome.toLowerCase().includes(term) || c.ultimaMensagem?.toLowerCase().includes(term))
      .sort((a, b) => new Date(b.ultimaMensagemEm ?? 0).getTime() - new Date(a.ultimaMensagemEm ?? 0).getTime());
  }, [contacts, search]);

  return (
    <div className="p-5">
      <div className="relative mb-4 w-80">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou mensagem…"
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-text-tertiary">Carregando conversas…</p>
      ) : conversations.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Nenhuma conversa encontrada" />
      ) : (
        <div className="space-y-2">
          {conversations.map((contact) => (
            <Card
              key={contact.id}
              onClick={() => setActiveContact(contact)}
              className="cursor-pointer p-4 transition-colors hover:bg-surface-hover"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-text-primary">{contact.nome}</span>
                    <Badge tone={PRIORITY_TONE[contact.prioridade]}>{CATEGORY_LABEL[contact.categoria]}</Badge>
                    {contact.naoLidas > 0 && (
                      <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                        {contact.naoLidas}
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-text-secondary">{contact.ultimaMensagem}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <span className="text-xs text-text-tertiary">{formatRelative(contact.ultimaMensagemEm)}</span>
                  <WhatsAppStatus status={contact.whatsappVerification} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ContactDrawer contact={activeContact} onClose={() => setActiveContact(null)} />
    </div>
  );
}
