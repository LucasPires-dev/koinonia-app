import { Route, Routes } from "react-router-dom";
import AppShell from "./layout/AppShell";
import DashboardPage from "./pages/Dashboard";
import ContactsPage from "./pages/Contacts";
import MessagesPage from "./pages/Messages";
import AgendaPage from "./pages/Agenda";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="contatos" element={<ContactsPage />} />
        <Route path="mensagens" element={<MessagesPage />} />
        <Route path="agenda" element={<AgendaPage />} />
      </Route>
    </Routes>
  );
}
