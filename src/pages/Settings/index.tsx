import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarCheck2, CalendarX2 } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/auth-context";
import * as googleService from "../../services/googleCalendarService";
import type { GoogleStatus } from "../../services/googleCalendarService";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<GoogleStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const googleParam = searchParams.get("google");

  useEffect(() => {
    googleService.getGoogleStatus().then(setStatus);
  }, []);

  useEffect(() => {
    if (!googleParam) return;

    googleService.getGoogleStatus().then(setStatus);
    refreshUser();

    const next = new URLSearchParams(searchParams);
    next.delete("google");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleParam]);

  async function handleConnect() {
    setLoading(true);
    try {
      const url = await googleService.getGoogleAuthorizationUrl();
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await googleService.disconnectGoogle();
      setStatus(await googleService.getGoogleStatus());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5">
      <Card className="max-w-xl p-5">
        <h3 className="text-sm font-semibold text-text-primary">Google Calendar</h3>
        <p className="mt-1 text-xs text-text-tertiary">
          Conecte sua conta do Google para que os compromissos da Agenda sejam
          sincronizados automaticamente com o seu Google Calendar.
        </p>

        {googleParam === "error" && (
          <p className="mt-3 text-xs text-danger">
            Não foi possível conectar ao Google Calendar. Tente novamente.
          </p>
        )}

        <div className="mt-4 flex items-center gap-3 rounded-md bg-surface p-3">
          {status?.connected ? (
            <CalendarCheck2 className="h-5 w-5 text-success" />
          ) : (
            <CalendarX2 className="h-5 w-5 text-text-tertiary" />
          )}
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              {status?.connected ? "Conectado" : "Não conectado"}
            </p>
            {status?.connected && (
              <p className="text-xs text-text-tertiary">Calendário: {status.calendar_id}</p>
            )}
          </div>
          {status?.connected ? (
            <Button variant="danger" size="sm" onClick={handleDisconnect} loading={loading}>
              Desconectar
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleConnect} loading={loading}>
              Conectar
            </Button>
          )}
        </div>

        {user && (
          <p className="mt-4 text-xs text-text-tertiary">
            Conectado como <strong>{user.username}</strong>
          </p>
        )}
      </Card>
    </div>
  );
}
