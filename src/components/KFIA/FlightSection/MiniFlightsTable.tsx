"use client";
import Image from "next/image";

export type FlightStatusSmall = "LANDED" | "LATE" | "ON TIME" | "CANCELLED";
export type RowSmall = {
  flight: string;
  airlineLogo: string;
  destination: string;   // e.g., "Beirut (BEY)"
  sch: string;           // scheduled time string
  status: FlightStatusSmall;
  gate?: string;
  counter?: string;
};

// Updated chip classes already use brand colors defined in global CSS
const statusClass = (s: FlightStatusSmall) =>
  ({
    LANDED: "kfia-chip kfia-chip--landed",
    LATE: "kfia-chip kfia-chip--late",
    "ON TIME": "kfia-chip kfia-chip--on-time",
    CANCELLED: "kfia-chip kfia-chip--cancelled",
  }[s]);

export default function MiniFlightsTable({ rows }: { rows: RowSmall[] }) {
  return (
    <div className="mt-4">
      {/* ===== Mobile Table ===== */}
      <ul className="md:hidden divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
        {rows.map((r, i) => (
          <li key={`${r.flight}-${i}`} className="p-3">
            <div className="grid grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-3">
              {/* Flight */}
              <div className="text-[13px] font-semibold text-[color:var(--kfia-lavender)] whitespace-nowrap">
                {r.flight}
              </div>

              {/* Airline Logo */}
              <span className="relative block h-5 w-14">
                <Image
                  src={r.airlineLogo}
                  alt="Airline logo"
                  fill
                  sizes="56px"
                  className="object-contain"
                  priority={i < 2}
                />
              </span>

              {/* Destination */}
              <div className="text-[13px] text-slate-900 truncate">
                {r.destination}
              </div>

              {/* Scheduled Time */}
              <div className="text-[13px] tabular-nums text-slate-800 whitespace-nowrap">
                {r.sch}
              </div>

              {/* Status */}
              <div className="justify-self-end">
                <span
                  className={`${statusClass(r.status)} text-[11px] px-2 py-1`}
                >
                  {r.status}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* ===== Desktop Table ===== */}
      <div className="hidden md:block">
        <table className="w-full table-auto border-separate border-spacing-0 text-sm">
          <thead>
            <tr className="text-[color:var(--kfia-lavender)]">
              <th className="kfia-th">FLIGHT</th>
              <th className="kfia-th">AIRLINE</th>
              <th className="kfia-th">DESTINATION</th>
              <th className="kfia-th w-[90px]">SCH</th>
              <th className="kfia-th w-[120px]">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={`${r.flight}-${i}`}>
                <td className="kfia-td pr-4 whitespace-nowrap text-[color:var(--kfia-lavender)]">
                  {r.flight}
                </td>
                <td className="kfia-td pr-4">
                  <span className="relative block h-6 w-14 mx-auto">
                    <Image
                      src={r.airlineLogo}
                      alt="Airline logo"
                      fill
                      sizes="56px"
                      className="object-contain"
                      priority={i < 2}
                    />
                  </span>
                </td>
                <td className="kfia-td pr-4">{r.destination}</td>
                <td className="kfia-td pr-4 whitespace-nowrap">{r.sch}</td>
                <td className="kfia-td">
                  <span
                    className={`${statusClass(r.status)} text-[12px] px-2 py-1`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}