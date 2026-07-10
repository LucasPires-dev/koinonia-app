import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { useAuth } from "../../hooks/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as { from?: string } | null)?.from ?? "/";

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-surface-raised p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
            <MessageCircle className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-text-primary">Koinonia</span>
        </div>

        <h1 className="mb-1 text-lg font-semibold text-text-primary">Entrar</h1>
        <p className="mb-5 text-sm text-text-tertiary">Acesse sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label>Usuário</Label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <Label>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
