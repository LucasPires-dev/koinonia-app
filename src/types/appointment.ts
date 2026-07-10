export type AppointmentType = "visita" | "aconselhamento" | "reuniao" | "culto";

export interface Appointment {
  id: string;
  type: AppointmentType;
  title: string;
  person: string;
  address: string;
  date: string;
  notes?: string;
  priority: "alta" | "media" | "baixa";
  duration: number;
  confirmed: boolean;
}

export const APPOINTMENT_TYPE_LABEL: Record<AppointmentType, string> = {
  visita: "Visita",
  aconselhamento: "Aconselhamento",
  reuniao: "Reunião",
  culto: "Culto",
};

export const APPOINTMENT_TYPE_DOT: Record<AppointmentType, string> = {
  visita: "bg-orange-400",
  aconselhamento: "bg-purple-400",
  reuniao: "bg-blue-400",
  culto: "bg-green-400",
};
