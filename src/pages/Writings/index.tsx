import { Link } from "react-router-dom";
import { BookOpen, FileText } from "lucide-react";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { useIntegration, useShepherdsToolkitWritings } from "../../hooks/useIntegration";

export default function WritingsPage() {
  const { data: integration } = useIntegration();
  const shepherdsToolkitConfigured = integration?.shepherdsToolkitConfigured ?? false;
  const { data: writings, isLoading } = useShepherdsToolkitWritings(shepherdsToolkitConfigured);

  return (
    <div className="p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Escritos</h2>
          <p className="text-xs text-text-tertiary">Sermões, devocionais e esboços vindos do Shepherd's Toolkit.</p>
        </div>
        {shepherdsToolkitConfigured && <Badge tone="neutral">Somente leitura</Badge>}
      </div>

      {!shepherdsToolkitConfigured ? (
        <EmptyState
          icon={BookOpen}
          title="Shepherd's Toolkit não conectado"
          description="Conecte sua conta do Shepherd's Toolkit em Integrações para ver seus escritos aqui."
          action={
            <Link to="/integracoes">
              <Button size="sm" variant="primary">
                Ir para Integrações
              </Button>
            </Link>
          }
        />
      ) : isLoading ? (
        <p className="p-4 text-sm text-text-tertiary">Carregando escritos…</p>
      ) : !writings?.length ? (
        <EmptyState icon={FileText} title="Nada por aqui" description="Nenhum escrito recente no Shepherd's Toolkit." />
      ) : (
        <div className="space-y-3">
          {writings.map((writing) => (
            <Card key={writing.id} className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <h4 className="text-sm font-semibold text-text-primary">{writing.title}</h4>
                <Badge tone="neutral">{writing.type}</Badge>
                {writing.status === "completed" && <Badge tone="success">Concluído</Badge>}
              </div>
              {writing.baseText && <p className="text-xs text-text-secondary">{writing.baseText}</p>}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                {writing.theme && <span>{writing.theme}</span>}
                {writing.tagList?.map((tag) => (
                  <span key={tag} className="rounded-full bg-surface px-2 py-0.5">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
