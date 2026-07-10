import type { ReactNode } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import AppShell from "./layout/AppShell";
import DashboardPage from "./pages/Dashboard";
import ContactsPage from "./pages/Contacts";
import MessagesPage from "./pages/Messages";
import AgendaPage from "./pages/Agenda";
import SettingsPage from "./pages/Settings";
import LoginPage from "./pages/Login";
import { useAuth } from "./hooks/auth-context";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="contatos" element={<ContactsPage />} />
        <Route path="mensagens" element={<MessagesPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="configuracoes" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
