import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Input, Label } from "../../components/ui/Field";
import { useAuth } from "../../contexts/auth-context";

export default function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch {
      setError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
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

        <h1 className="mb-1 text-lg font-semibold text-text-primary">Criar conta</h1>
        <p className="mb-5 text-sm text-text-tertiary">
          Cada conta tem seus próprios contatos e credenciais de integração.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label required>Usuário</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label required>Senha</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" loading={loading}>
            Criar conta
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-text-tertiary">
          Já tem conta?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
}
