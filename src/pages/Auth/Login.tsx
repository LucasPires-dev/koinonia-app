import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { useAuth } from "../../contexts/auth-context";

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-white">
            <MessageCircle className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold text-text-primary">Koinonia</span>
        </div>

        <h1 className="mb-1 text-lg font-semibold text-text-primary">Entrar</h1>
        <p className="mb-5 text-sm text-text-tertiary">Acesse sua conta para gerenciar seus contatos.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Usuário</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div>
            <Label required>Senha</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Entrar
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-text-tertiary">
          Não tem conta?{" "}
          <Link to="/registrar" className="font-medium text-accent hover:underline">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
}
