import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  CheckCheck,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import { Input, Select } from "../../components/ui/Field";
import EmptyState from "../../components/ui/EmptyState";
import WhatsAppStatus from "./WhatsAppStatus";
import ContactDrawer from "./ContactDrawer";
import { STATUS_TONE, PRIORITY_TONE } from "./badgeTones";
import { formatRelative } from "../../utils/formatRelative";
import { useContacts, useVerifyContact, useVerifyContacts } from "../../hooks/useContacts";
import {
  CATEGORY_LABEL,
  PRIORITY_LABEL,
  STATUS_LABEL,
  type Contact,
  type ContactCategory,
  type ContactStatus,
  type WhatsAppVerification,
} from "../../types/contact";

const columnHelper = createColumnHelper<Contact>();

export default function ContactsPage() {
  const { data: contacts, isLoading } = useContacts();
  const verifyOne = useVerifyContact();
  const verifyMany = useVerifyContacts();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "todos">("todos");
  const [categoryFilter, setCategoryFilter] = useState<ContactCategory | "todos">("todos");
  const [verificationFilter, setVerificationFilter] = useState<WhatsAppVerification | "todos">("todos");
  const [sorting, setSorting] = useState<SortingState>([{ id: "atualizadoEm", desc: true }]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [activeContact, setActiveContact] = useState<Contact | "new" | null>(null);

  const filtered = useMemo(() => {
    if (!contacts) return [];
    const term = search.trim().toLowerCase();
    return contacts.filter((c) => {
      if (statusFilter !== "todos" && c.status !== statusFilter) return false;
      if (categoryFilter !== "todos" && c.categoria !== categoryFilter) return false;
      if (verificationFilter !== "todos" && c.whatsappVerification !== verificationFilter) return false;
      if (term && !c.nome.toLowerCase().includes(term) && !c.telefone.includes(term)) return false;
      return true;
    });
  }, [contacts, search, statusFilter, categoryFilter, verificationFilter]);

  const hasActiveFilters =
    search !== "" || statusFilter !== "todos" || categoryFilter !== "todos" || verificationFilter !== "todos";

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="accent-accent"
            checked={table.getIsAllRowsSelected()}
            ref={(el) => {
              if (el) el.indeterminate = table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="accent-accent"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
            onClick={(e) => e.stopPropagation()}
          />
        ),
      }),
      columnHelper.accessor("nome", {
        header: "Contato",
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-text-primary">{row.original.nome}</span>
              {row.original.naoLidas > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-white">
                  {row.original.naoLidas}
                </span>
              )}
            </div>
            <span className="text-xs text-text-tertiary">{row.original.telefone}</span>
          </div>
        ),
      }),
      columnHelper.accessor("categoria", {
        header: "Categoria",
        cell: (info) => <Badge tone="neutral">{CATEGORY_LABEL[info.getValue()]}</Badge>,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <Badge tone={STATUS_TONE[info.getValue()]}>{STATUS_LABEL[info.getValue()]}</Badge>,
      }),
      columnHelper.accessor("prioridade", {
        header: "Prioridade",
        cell: (info) => <Badge tone={PRIORITY_TONE[info.getValue()]}>{PRIORITY_LABEL[info.getValue()]}</Badge>,
      }),
      columnHelper.accessor("whatsappVerification", {
        header: "WhatsApp",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <WhatsAppStatus status={row.original.whatsappVerification} />
            {row.original.whatsappVerification !== "verificando" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  verifyOne.mutate(row.original.id);
                }}
                className="text-text-tertiary transition-colors hover:text-accent"
                title="Verificar novamente"
              >
                <RefreshCw className="h-3 w-3" />
              </button>
            )}
          </div>
        ),
      }),
      columnHelper.accessor("atualizadoEm", {
        header: "Última mensagem",
        cell: ({ row }) => (
          <div className="max-w-[220px]">
            <p className="truncate text-xs text-text-secondary">{row.original.ultimaMensagem ?? "Sem mensagens"}</p>
            <span className="text-[11px] text-text-tertiary">{formatRelative(row.original.ultimaMensagemEm)}</span>
          </div>
        ),
      }),
    ],
    [verifyOne]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const selectedIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);
  const total = contacts?.length ?? 0;
  const verifiedCount = contacts?.filter((c) => c.whatsappVerification === "verificado").length ?? 0;
  const pendingCount =
    contacts?.filter((c) => c.whatsappVerification === "nao_verificado" || c.whatsappVerification === "invalido")
      .length ?? 0;
  const unreadCount = contacts?.reduce((sum, c) => sum + c.naoLidas, 0) ?? 0;

  return (
    <div className="p-5">
      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Total de contatos</p>
          <p className="mt-1 text-2xl font-semibold text-text-primary">{total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Verificados no WhatsApp</p>
          <p className="mt-1 text-2xl font-semibold text-success">{verifiedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Pendentes de verificação</p>
          <p className="mt-1 text-2xl font-semibold text-warning">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-text-tertiary">Mensagens não lidas</p>
          <p className="mt-1 text-2xl font-semibold text-accent">{unreadCount}</p>
        </Card>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-tertiary" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone…"
            className="pl-8"
          />
        </div>

        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ContactStatus | "todos")} className="w-auto">
          <option value="todos">Todos os status</option>
          {Object.entries(STATUS_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as ContactCategory | "todos")}
          className="w-auto"
        >
          <option value="todos">Todas as categorias</option>
          {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value as WhatsAppVerification | "todos")}
          className="w-auto"
        >
          <option value="todos">Toda verificação</option>
          <option value="verificado">Verificado</option>
          <option value="nao_verificado">Não verificado</option>
          <option value="invalido">Não é WhatsApp</option>
        </Select>

        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            icon={<X className="h-3.5 w-3.5" />}
            onClick={() => {
              setSearch("");
              setStatusFilter("todos");
              setCategoryFilter("todos");
              setVerificationFilter("todos");
            }}
          >
            Limpar filtros
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
              loading={verifyMany.isPending}
              onClick={() => {
                verifyMany.mutate(selectedIds);
                setRowSelection({});
              }}
            >
              Verificar {selectedIds.length} selecionado{selectedIds.length > 1 ? "s" : ""}
            </Button>
          )}
          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setActiveContact("new")}
          >
            Novo contato
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-tertiary">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Carregando contatos…
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Nenhum contato encontrado"
            description="Ajuste os filtros ou cadastre um novo contato para começar."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="border-b border-border bg-surface">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-2.5 text-xs font-medium text-text-tertiary">
                        {header.isPlaceholder ? null : (
                          <button
                            className={`flex items-center gap-1 ${
                              header.column.getCanSort() ? "cursor-pointer select-none hover:text-text-secondary" : ""
                            }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && <ArrowUpDown className="h-3 w-3" />}
                          </button>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setActiveContact(row.original)}
                    className="cursor-pointer border-b border-border last:border-0 hover:bg-surface-hover"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-top">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {!isLoading && filtered.length > 0 && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-tertiary">
          <CheckCheck className="h-3.5 w-3.5" />
          Mostrando {filtered.length} de {total} contatos
        </p>
      )}

      <ContactDrawer contact={activeContact} onClose={() => setActiveContact(null)} />
    </div>
  );
}
