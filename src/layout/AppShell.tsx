import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSyncWhatsAppContacts } from "../hooks/useContacts";

export default function AppShell() {
  const syncWhatsAppContacts = useSyncWhatsAppContacts();
  const { mutate: sync } = syncWhatsAppContacts;

  useEffect(() => {
    sync();
  }, [sync]);

  return (
    <div className="flex h-screen bg-canvas text-text-primary">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
