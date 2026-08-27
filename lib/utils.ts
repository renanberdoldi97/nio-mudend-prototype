import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

const MESES_PT = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

const DIAS_SEMANA_PT = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

function parseIsoDate(iso: string): Date {
  return new Date(`${iso}T00:00:00`);
}

/** Ex: "14 de outubro, quinta-feira" */
export function formatDataComDiaSemana(iso: string): string {
  const date = parseIsoDate(iso);
  return `${date.getDate()} de ${MESES_PT[date.getMonth()]}, ${DIAS_SEMANA_PT[date.getDay()]}`;
}

/** Ex: "12 de Fevereiro de 2025" */
export function formatDataExtenso(iso: string): string {
  const date = parseIsoDate(iso);
  const mes = MESES_PT[date.getMonth()];
  const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
  return `${date.getDate()} de ${mesCapitalizado} de ${date.getFullYear()}`;
}
