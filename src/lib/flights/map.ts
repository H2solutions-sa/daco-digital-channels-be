import type { FlightApi, MiniRow } from "./types";

const two = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Convert ISO to "HH:mm" (local)
function hhmm(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${two(d.getHours())}:${two(d.getMinutes())}`;
}

function normStatus(apiStatus: string): MiniRow["status"] {
  const s = apiStatus?.toUpperCase();
  // Map the API vocabulary to your UI chip set
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("DELAY") || s.includes("LATE")) return "LATE";
  if (s.includes("DEPART") || s.includes("AIRBORNE") || s.includes("LANDED"))
    return "LANDED";
  return "ON TIME";
}

// (Adjust to your logos location. You also have AIRLINE_LOGO filenames)
function logoFor(airline: string, apiLogo?: string | null) {
  if (apiLogo) return `/airlines/api/${apiLogo}`;       // if you’ll host those
  return `/airlines/${airline.toLowerCase()}.png`;      // fallback by code
}

export function toMiniRow(f: FlightApi): MiniRow {
  const code = f.AIRLINE?.trim() ?? "";
  const num  = f.FL_NUMBER?.trim() ?? "";
  const iata = f.ROUTING ?? "";
  const city = (f.ROUTING_ENG || "").trim();

  return {
    flight: `${code} ${num}`,
    airlineLogo: logoFor(code, f.AIRLINE_LOGO ?? undefined),
    destination: `${title(city)} (${iata})`,
    sch: hhmm(f.SCH_TIME),
    status: normStatus(f.FL_STATUS_1 || f.PUB_RMK_ENG || ""),
    gate: f.GATE_1 || undefined,
    counter: f.CHECKIN_1 || undefined,
  };
}

function title(s: string) {
  // "RIYADH" -> "Riyadh"
  if (!s) return s;
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}