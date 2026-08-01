import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import DashboardPage from "./pages/Dashboard";
import ContactsPage from "./pages/Contacts";
import MessagesPage from "./pages/Messages";
import AgendaPage from "./pages/Agenda";
import AgendamentosOverviewPage from "./pages/Agendamentos/Overview";
import AgendamentosCalendarPage from "./pages/Agendamentos/Calendar";
import IntegrationsPage from "./pages/Integrations";
import LoginPage from "./pages/Auth/Login";
import RegisterPage from "./pages/Auth/Register";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registrar" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="contatos" element={<ContactsPage />} />
        <Route path="mensagens" element={<MessagesPage />} />
        <Route path="agenda" element={<AgendaPage />} />
        <Route path="agendamentos" element={<AgendamentosOverviewPage />} />
        <Route path="agendamentos/calendario" element={<AgendamentosCalendarPage />} />
        <Route path="integracoes" element={<IntegrationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
