import { useMemo, useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";
import Avatar from "../../components/ui/Avatar";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { useContacts } from "../../hooks/useContacts";
import { useContactGroups, useCreateContactGroup } from "../../hooks/useContactGroups";
import type { ScheduledRecipient } from "../../types/scheduledMessage";

export default function RecipientPicker({
  value,
  onChange,
  disabled,
}: {
  value: ScheduledRecipient[];
  onChange: (recipients: ScheduledRecipient[]) => void;
  disabled?: boolean;
}) {
  const { data: contacts } = useContacts();
  const { data: groups } = useContactGroups();
  const createGroup = useCreateContactGroup();

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupContactIds, setNewGroupContactIds] = useState<string[]>([]);

  const selectedContactIds = new Set(value.filter((r) => r.type === "contato").map((r) => r.id));
  const selectedGroupIds = new Set(value.filter((r) => r.type === "grupo").map((r) => r.id));

  const term = search.trim().toLowerCase();
  const contactResults = useMemo(
    () =>
      (contacts ?? []).filter(
        (c) => !selectedContactIds.has(c.id) && (!term || c.nome.toLowerCase().includes(term) || c.telefone.includes(term))
      ),
    [contacts, term, value]
  );
  const groupResults = useMemo(
    () => (groups ?? []).filter((g) => !selectedGroupIds.has(g.id) && (!term || g.nome.toLowerCase().includes(term))),
    [groups, term, value]
  );

  function addContact(id: string, nome: string) {
    onChange([...value, { type: "contato", id, nome }]);
    setSearch("");
  }

  function addGroup(id: string, nome: string) {
    onChange([...value, { type: "grupo", id, nome }]);
    setSearch("");
  }

  function remove(recipient: ScheduledRecipient) {
    onChange(value.filter((r) => !(r.type === recipient.type && r.id === recipient.id)));
  }

  function toggleNewGroupContact(id: string) {
    setNewGroupContactIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]));
  }

  async function saveNewGroup() {
    if (!newGroupName.trim() || newGroupContactIds.length === 0) return;
    const group = await createGroup.mutateAsync({ nome: newGroupName.trim(), contactIds: newGroupContactIds });
    onChange([...value, { type: "grupo", id: group.id, nome: group.nome }]);
    setNewGroupName("");
    setNewGroupContactIds([]);
    setCreatingGroup(false);
    setOpen(false);
  }

  return (
    <div>
      <Label required>Destinatários</Label>

      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((recipient) => (
            <Badge key={`${recipient.type}-${recipient.id}`} tone={recipient.type === "grupo" ? "accent" : "neutral"}>
              {recipient.type === "grupo" && <Users className="h-3 w-3" />}
              {recipient.nome}
              {!disabled && (
                <button
                  type="button"
                  aria-label={`Remover ${recipient.nome}`}
                  onClick={() => remove(recipient)}
                  className="ml-0.5 rounded-full hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {!disabled && (
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
        <Input
          value={search}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setOpen(true);
          }}
          placeholder="Buscar contato ou grupo…"
          className="relative z-10 pl-8"
        />

        {open && (
          <>
            <button aria-label="Fechar" className="fixed inset-0 z-0 cursor-default" onClick={() => setOpen(false)} />
            <div className="absolute inset-x-0 top-[calc(100%+4px)] z-10 flex max-h-72 flex-col overflow-hidden rounded-md border border-border bg-surface shadow-lg">
              {creatingGroup ? (
                <div className="flex max-h-72 flex-col">
                  <div className="border-b border-border p-2.5">
                    <Input
                      autoFocus
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="Nome do novo grupo…"
                    />
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    {(contacts ?? []).length === 0 ? (
                      <p className="p-4 text-center text-xs text-text-tertiary">Nenhum contato cadastrado.</p>
                    ) : (
                      <ul className="divide-y divide-border">
                        {(contacts ?? []).map((c) => (
                          <li key={c.id}>
                            <label className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left hover:bg-surface-hover">
                              <input
                                type="checkbox"
                                checked={newGroupContactIds.includes(c.id)}
                                onChange={() => toggleNewGroupContact(c.id)}
                                className="h-3.5 w-3.5 accent-accent"
                              />
                              <Avatar src={c.avatarUrl} name={c.nome} size="sm" />
                              <span className="min-w-0 flex-1 truncate text-sm text-text-primary">{c.nome}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 border-t border-border p-2.5">
                    <Button size="sm" variant="ghost" onClick={() => setCreatingGroup(false)}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={!newGroupName.trim() || newGroupContactIds.length === 0}
                      loading={createGroup.isPending}
                      onClick={saveNewGroup}
                    >
                      Criar e adicionar ({newGroupContactIds.length})
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto">
                  {groupResults.length === 0 && contactResults.length === 0 ? (
                    <p className="p-4 text-center text-xs text-text-tertiary">Nenhum resultado encontrado.</p>
                  ) : (
                    <>
                      {groupResults.length > 0 && (
                        <ul className="divide-y divide-border">
                          {groupResults.map((g) => (
                            <li key={g.id}>
                              <button
                                type="button"
                                onClick={() => addGroup(g.id, g.nome)}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-surface-hover"
                              >
                                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                                  <Users className="h-3.5 w-3.5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium text-text-primary">{g.nome}</span>
                                  <span className="block truncate text-xs text-text-tertiary">
                                    {g.contactIds.length} membro(s)
                                  </span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                      {contactResults.length > 0 && (
                        <ul className="divide-y divide-border">
                          {contactResults.map((c) => (
                            <li key={c.id}>
                              <button
                                type="button"
                                onClick={() => addContact(c.id, c.nome)}
                                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left hover:bg-surface-hover"
                              >
                                <Avatar src={c.avatarUrl} name={c.nome} size="sm" />
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate text-sm font-medium text-text-primary">{c.nome}</span>
                                  <span className="block truncate text-xs text-text-tertiary">{c.telefone}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setCreatingGroup(true)}
                    className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm font-medium text-accent hover:bg-accent-soft"
                  >
                    <Plus className="h-3.5 w-3.5" /> Criar novo grupo
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      )}
    </div>
  );
}
