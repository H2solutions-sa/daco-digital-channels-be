// date helpers shared by FlightsPanel

export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
export const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const fmtKey = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const fmtHuman = (d: Date) =>
  d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export const FUTURE_DAYS = 14;

// ✅ replace frozen constants with functions
export const TODAY = () => startOfDay(new Date());
export const TODAY_KEY = () => fmtKey(TODAY());

// bounds: min = Aug 15 of current year, max = today + FUTURE_DAYS
export const MIN_DATE = () => new Date(TODAY().getFullYear(), 7, 15);
export const MIN_DATE_KEY = () => fmtKey(MIN_DATE());

export const MAX_DATE = () => {
  const n = new Date(TODAY());
  n.setDate(n.getDate() + FUTURE_DAYS);
  return startOfDay(n);
};
export const MAX_DATE_KEY = () => fmtKey(MAX_DATE());
