"use client";

import type { Row } from "./FlightsTable";
import { fmtKey, startOfDay, TODAY } from "./date";

/* Demo airline presets */
const AIRLINES = [
  { logo: "/mea.png",      code: "ME", cities: ["BEIRUT (BEY)"] },
  { logo: "/flydubai.png", code: "FZ", cities: ["DUBAI (DXB)"] },
  { logo: "/saudia.png",   code: "SV", cities: ["JEDDAH (JED)", "RIYADH (RUH)", "ALQOUF (AJF)"] },
  { logo: "/flynas.png",   code: "XY", cities: ["RIYADH (RUH)", "JEDDAH (JED)"] },
  { logo: "/flyadeal.png", code: "F3", cities: ["MEDINA (MED)", "JEDDAH (JED)"] },
  { logo: "/qatar.png",    code: "QR", cities: ["DOHA (DOH)"] },
];

/* ---------------- Deterministic PRNG (seeded by date key) ---------------- */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seedFromKey(key: string) {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const two = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/* ----------------------- Deterministic day generator ---------------------- */
function genRowsForDay(day: Date): { arrivals: Row[]; departures: Row[] } {
  const key = fmtKey(day);
  const rnd = mulberry32(seedFromKey(key));
  const isFuture = startOfDay(day).getTime() > TODAY().getTime();

  const countA = 9 + Math.floor(rnd() * 5); // 9..13
  const countD = 9 + Math.floor(rnd() * 5);

  const mk = (i: number): Row => {
    const ai = Math.floor(rnd() * AIRLINES.length);
    const a = AIRLINES[ai];
    const ci = Math.floor(rnd() * a.cities.length);
    const city = a.cities[ci];

    const hour = 6 + ((i * 73) % 12);
    const min = (i * 17) % 60;
    const sch = `${two(hour)}:${two(min)}`;

    const shifts = [-20, -10, 0, 10, 20, 30];
    const estShift = shifts[Math.floor(rnd() * shifts.length)];
    const estH = Math.max(
      0,
      Math.min(23, hour + (min + estShift < 0 ? -1 : min + estShift >= 60 ? 1 : 0))
    );
    const estM = (min + estShift + 60) % 60;
    const est = `${two(estH)}:${two(estM)}`;

    const gate = `${10 + ((i * 5) % 20)}${["A", "B", "C"][i % 3]}`;
    const counter = 1 + ((i * 3) % 18);

    const statuses: NonNullable<Row["status"]>[] = ["LANDED", "DELAYED", "BOARDING", "CANCELLED"];
    const status = isFuture ? undefined : statuses[i % statuses.length];

    return {
      scheduled: sch,
      estimated: est,
      airlineLogo: a.logo,
      flightNo: `${a.code} ${100 + ((i * 37) % 900)}`,
      destination: city,
      gate,
      counter,
      status,
    };
  };

  return {
    arrivals: Array.from({ length: countA }, (_, i) => mk(i)),
    departures: Array.from({ length: countD }, (_, i) => mk(i + 3)),
  };
}

/* ----------------------------- Prebuilt window ---------------------------- */
const DATA: Record<string, { arrivals: Row[]; departures: Row[] }> = (() => {
  const out: Record<string, { arrivals: Row[]; departures: Row[] }> = {};
  for (let i = -3; i <= 14; i++) {
    const d = new Date(TODAY());
    d.setDate(d.getDate() + i);
    out[fmtKey(d)] = genRowsForDay(d);
  }
  return out;
})();

/* --------------------------------- API ------------------------------------ */
export function rowsFor(date: Date, tab: "arrivals" | "departures"): Row[] {
  const key = fmtKey(date);
  if (!DATA[key]) DATA[key] = genRowsForDay(date);
  return (DATA[key]?.[tab] ?? []).slice();
}