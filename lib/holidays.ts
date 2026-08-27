export type BlockedReason = 'weekend' | 'holiday' | 'past';

function toKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

// Algoritmo de Meeus/Jones/Butcher pra data da Páscoa (calendário gregoriano).
function calculateEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const FIXED_HOLIDAYS: { month: number; day: number }[] = [
  { month: 0, day: 1 }, // Confraternização Universal
  { month: 3, day: 21 }, // Tiradentes
  { month: 4, day: 1 }, // Dia do Trabalho
  { month: 8, day: 7 }, // Independência do Brasil
  { month: 9, day: 12 }, // Nossa Senhora Aparecida
  { month: 10, day: 2 }, // Finados
  { month: 10, day: 15 }, // Proclamação da República
  { month: 11, day: 25 }, // Natal
];

function getMovableHolidays(year: number): Date[] {
  const easter = calculateEaster(year);
  return [
    addDays(easter, -47), // Carnaval
    addDays(easter, -2), // Sexta-feira Santa
    addDays(easter, 60), // Corpus Christi
  ];
}

function buildHolidaySet(year: number): Set<string> {
  const dates: Date[] = [
    ...FIXED_HOLIDAYS.map(({ month, day }) => new Date(year, month, day)),
    ...getMovableHolidays(year),
  ];
  return new Set(dates.map(toKey));
}

const holidaySetCache = new Map<number, Set<string>>();

function getHolidaySet(year: number): Set<string> {
  if (!holidaySetCache.has(year)) {
    holidaySetCache.set(year, buildHolidaySet(year));
  }
  return holidaySetCache.get(year)!;
}

export function isHoliday(date: Date): boolean {
  return getHolidaySet(date.getFullYear()).has(toKey(date));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compare = new Date(date);
  compare.setHours(0, 0, 0, 0);
  return compare.getTime() < today.getTime();
}

export function getBlockedReason(date: Date): BlockedReason | null {
  if (isPast(date)) return 'past';
  if (isWeekend(date)) return 'weekend';
  if (isHoliday(date)) return 'holiday';
  return null;
}
