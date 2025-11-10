export const inferLogoFromFlight = (flightNo?: string) => {
  if (!flightNo) return "";
  const code = flightNo.trim().split(/\s+/)[0]?.toLowerCase();
  return code ? `/-/media/Project/Daco Digital Channels/KFIA/airlines/${code}.png` : "";
};

export const inferCheckinFromFlight = (flightNo?: string): string | undefined => {
  if (!flightNo) return;
  const c = flightNo.trim().split(/\s+/)[0]?.toUpperCase();
  if (c === "F3") return "C06 – C13";
  if (c === "SV") return "A01 – A12";
  if (c === "XY") return "B01 – B12";
  if (c === "QR") return "C14";
  return undefined;
};

export const getCityOnly = (s?: string) => (s ? s.replace(/\s*\(.*\)\s*$/, "") : "");

export function parseTimeToDate(v?: string): Date | undefined {
  if (!v) return;
  const m = v.match?.(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const [, hh, mm] = m;
    const d = new Date();
    d.setHours(parseInt(hh, 10), parseInt(mm, 10), 0, 0);
    return d;
  }
  const d = new Date(v || "");
  return isNaN(+d) ? undefined : d;
}

export function addMinutes(date: Date, mins: number) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() + mins);
  return d;
}

export function fmt24(date?: Date) {
  if (!date) return "—";
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** NEW: 24-hour formatter */
export function formatTime24(v?: string) {
  if (!v) return "—";
  const d = parseTimeToDate(v);
  if (!d) return "—";
  return fmt24(d);
}

export function formatTime12(v?: string) {
  if (!v) return "—";
  const d = parseTimeToDate(v);
  if (!d) return v;
  let h = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "pm" : "am";
  h = h % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
}