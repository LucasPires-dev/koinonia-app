import { seedContacts } from "../mocks/contacts";
import type { Contact, ContactDraft, WhatsAppVerification } from "../types/contact";

const STORAGE_KEY = "koinonia:contacts";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function load(): Contact[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedContacts));
    return seedContacts;
  }
  try {
    return JSON.parse(raw) as Contact[];
  } catch {
    return seedContacts;
  }
}

function persist(contacts: Contact[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function makeId() {
  return `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Simula a checagem "essa número existe no WhatsApp?": determinístico por
 * telefone (mesmo número sempre dá o mesmo resultado), sem bater em API real.
 */
function simulateVerification(telefone: string): WhatsAppVerification {
  const digits = telefone.replace(/\D/g, "");
  const isLandlinePattern = /^55\d{2}(2|3)\d{3}/.test(digits) || digits.length <= 12;
  if (isLandlinePattern) return "invalido";

  let hash = 0;
  for (const char of digits) hash = (hash * 31 + char.charCodeAt(0)) % 97;
  return hash % 10 === 0 ? "invalido" : "verificado";
}

export async function fetchContacts(): Promise<Contact[]> {
  await wait(350);
  return [...load()].sort(
    (a, b) => new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime()
  );
}

export async function verifyContact(id: string): Promise<Contact> {
  const contacts = load();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Contato não encontrado");

  await wait(700 + Math.random() * 500);

  const result = simulateVerification(contacts[index].telefone);
  const updated: Contact = {
    ...contacts[index],
    whatsappVerification: result,
    ultimaVerificacaoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
  };
  contacts[index] = updated;
  persist(contacts);
  return updated;
}

export async function verifyContacts(ids: string[]): Promise<Contact[]> {
  const results: Contact[] = [];
  for (const id of ids) {
    results.push(await verifyContact(id));
  }
  return results;
}

export async function createContact(draft: ContactDraft): Promise<Contact> {
  await wait(300);
  const now = new Date().toISOString();
  const contact: Contact = {
    ...draft,
    id: makeId(),
    whatsappVerification: "nao_verificado",
    naoLidas: 0,
    criadoEm: now,
    atualizadoEm: now,
  };
  const contacts = load();
  contacts.unshift(contact);
  persist(contacts);
  return contact;
}

export async function updateContact(id: string, patch: Partial<ContactDraft>): Promise<Contact> {
  await wait(300);
  const contacts = load();
  const index = contacts.findIndex((c) => c.id === id);
  if (index === -1) throw new Error("Contato não encontrado");

  const updated: Contact = {
    ...contacts[index],
    ...patch,
    atualizadoEm: new Date().toISOString(),
  };
  contacts[index] = updated;
  persist(contacts);
  return updated;
}

export async function deleteContact(id: string): Promise<void> {
  await wait(250);
  persist(load().filter((c) => c.id !== id));
}

export async function resetToSeed(): Promise<Contact[]> {
  await wait(200);
  persist(seedContacts);
  return seedContacts;
}
