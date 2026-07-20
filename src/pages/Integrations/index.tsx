import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Calendar, Check, Loader2, RefreshCw } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import Badge from "../../components/ui/Badge";
import {
  useConnectGoogle,
  useConnectWhatsApp,
  useDisconnectGoogle,
  useIntegration,
  useSaveIntegration,
  useWhatsAppStatus,
} from "../../hooks/useIntegration";

function StatusBadge({ status }: { status?: string }) {
  if (status === "connected") {
    return (
      <Badge tone="success" icon={<Check className="h-3 w-3" />}>
        Conectado
      </Badge>
    );
  }
  if (status === "connecting") {
    return (
      <Badge tone="accent" icon={<Loader2 className="h-3 w-3 animate-spin" />}>
        Conectando…
      </Badge>
    );
  }
  return <Badge tone="neutral">Desconectado</Badge>;
}

export default function IntegrationsPage() {
  const { data: integration, isLoading } = useIntegration();
  const saveIntegration = useSaveIntegration();
  const connectWhatsApp = useConnectWhatsApp();
  const connectGoogle = useConnectGoogle();
  const disconnectGoogle = useDisconnectGoogle();
  const [searchParams, setSearchParams] = useSearchParams();
  const googleRedirect = searchParams.get("google");

  const [baseUrl, setBaseUrl] = useState("");
  const [uazToken, setUazToken] = useState("");
  const [openaiKey, setOpenaiKey] = useState("");
  const [qrCode, setQrCode] = useState<string | null>(null);

  const whatsappConfigured = integration?.uazapiConfigured ?? false;
  const { data: status } = useWhatsAppStatus(whatsappConfigured);

  useEffect(() => {
    setBaseUrl(integration?.uazapiBaseUrl ?? "");
  }, [integration?.uazapiBaseUrl]);

  useEffect(() => {
    if (!googleRedirect) return;
    const timer = setTimeout(() => {
      searchParams.delete("google");
      setSearchParams(searchParams, { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [googleRedirect, searchParams, setSearchParams]);

  async function handleSaveWhatsApp() {
    await saveIntegration.mutateAsync({ uazapiBaseUrl: baseUrl, uazapiToken: uazToken || undefined });
    setUazToken("");
  }

  async function handleConnect() {
    const res = await connectWhatsApp.mutateAsync();
    setQrCode(res.qrCode);
  }

  async function handleSaveOpenAI() {
    await saveIntegration.mutateAsync({ openaiApiKey: openaiKey });
    setOpenaiKey("");
  }

  if (isLoading) return <p className="p-5 text-sm text-text-tertiary">Carregando…</p>;

  const qrSrc = qrCode?.startsWith("data:") ? qrCode : `data:image/png;base64,${qrCode}`;

  return (
    <div className="max-w-2xl space-y-5 p-5">
      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">WhatsApp (uazapi)</h2>
          <StatusBadge status={status?.status} />
        </div>

        <div className="space-y-3">
          <div>
            <Label>URL da instância uazapi</Label>
            <Input
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://sua-instancia.uazapi.com"
            />
          </div>
          <div>
            <Label>{whatsappConfigured ? "Novo token (opcional)" : "Token da instância"}</Label>
            <Input
              type="password"
              value={uazToken}
              onChange={(e) => setUazToken(e.target.value)}
              placeholder={whatsappConfigured ? "•••••••• (já configurado)" : "Token gerado no uazapi"}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveWhatsApp}
              loading={saveIntegration.isPending}
              disabled={!baseUrl.trim()}
            >
              Salvar credenciais
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw className={`h-3.5 w-3.5 ${connectWhatsApp.isPending ? "animate-spin" : ""}`} />}
              onClick={handleConnect}
              disabled={!whatsappConfigured || connectWhatsApp.isPending}
            >
              Conectar / novo QR Code
            </Button>
          </div>

          {qrCode && status?.status !== "connected" && (
            <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-surface p-4">
              <img src={qrSrc} alt="QR Code do WhatsApp" className="h-48 w-48" />
              <p className="text-xs text-text-tertiary">
                Escaneie com o WhatsApp do número que vai atender pelo app.
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Google Agenda</h2>
          {integration?.googleConfigured ? (
            <Badge tone="success" icon={<Check className="h-3 w-3" />}>
              Conectado
            </Badge>
          ) : (
            <Badge tone="neutral">Desconectado</Badge>
          )}
        </div>

        {googleRedirect === "connected" && (
          <p className="mb-3 rounded-md bg-success-soft px-3 py-2 text-xs text-success">
            Google Agenda conectada com sucesso!
          </p>
        )}
        {googleRedirect === "error" && (
          <p className="mb-3 rounded-md bg-danger-soft px-3 py-2 text-xs text-danger">
            Não foi possível conectar com o Google. Tente novamente.
          </p>
        )}

        <div className="space-y-3">
          <p className="text-xs text-text-tertiary">
            Sincronize visitas, aconselhamentos e reuniões diretamente com a sua Google Agenda.
          </p>
          {integration?.googleConfigured && integration.googleEmail && (
            <p className="text-xs text-text-secondary">
              Conta conectada: <span className="font-medium text-text-primary">{integration.googleEmail}</span>
            </p>
          )}
          {integration?.googleConfigured ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => disconnectGoogle.mutate()}
              loading={disconnectGoogle.isPending}
            >
              Desconectar
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              icon={<Calendar className="h-3.5 w-3.5" />}
              onClick={() => connectGoogle.mutate()}
              loading={connectGoogle.isPending}
            >
              Conectar Google Agenda
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">OpenAI</h2>
          {integration?.openaiConfigured && <Badge tone="success">Configurada</Badge>}
        </div>

        <div className="space-y-3">
          <div>
            <Label>{integration?.openaiConfigured ? "Nova chave (opcional)" : "Chave da API"}</Label>
            <Input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder={integration?.openaiConfigured ? "sk-•••••••••• (já configurada)" : "sk-..."}
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveOpenAI}
            loading={saveIntegration.isPending}
            disabled={!openaiKey.trim()}
          >
            Salvar chave
          </Button>
        </div>
      </Card>
    </div>
  );
}
