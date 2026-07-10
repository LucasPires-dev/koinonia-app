import type { Appointment } from "../types/appointment";

const inDays = (days: number, hour: number, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
};

export const mockAppointments: Appointment[] = [
  {
    id: "a1",
    type: "visita",
    title: "Visita à família Rodrigues",
    person: "Carlos Rodrigues",
    address: "Rua das Flores, 123 - Centro",
    date: inDays(0, 14, 0),
    notes: "Família passando por dificuldades financeiras. Levar cesta básica.",
    priority: "alta",
    duration: 60,
    confirmed: true,
  },
  {
    id: "a2",
    type: "aconselhamento",
    title: "Aconselhamento matrimonial",
    person: "Casal Ferreira",
    address: "Igreja - Sala de Aconselhamento",
    date: inDays(1, 19, 30),
    notes: "Terceira sessão. Progresso positivo na comunicação.",
    priority: "media",
    duration: 90,
    confirmed: true,
  },
  {
    id: "a3",
    type: "reuniao",
    title: "Reunião com diretoria",
    person: "Conselho da Igreja",
    address: "Igreja - Sala de Reuniões",
    date: inDays(2, 10, 0),
    notes: "Discussão sobre projetos de expansão e orçamento anual.",
    priority: "alta",
    duration: 120,
    confirmed: false,
  },
  {
    id: "a4",
    type: "culto",
    title: "Culto dominical",
    person: "Congregação",
    address: "Igreja - Templo principal",
    date: inDays(3, 10, 0),
    priority: "media",
    duration: 90,
    confirmed: true,
  },
  {
    id: "a5",
    type: "visita",
    title: "Visita hospitalar",
    person: "Pedro Costa",
    address: "Hospital Central",
    date: inDays(0, 17, 0),
    notes: "Mãe do Pedro internada. Levar palavra de conforto.",
    priority: "alta",
    duration: 45,
    confirmed: true,
  },
];
