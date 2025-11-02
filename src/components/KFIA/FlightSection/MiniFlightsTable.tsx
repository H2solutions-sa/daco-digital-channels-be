// app/components/flightSection/MiniFlightsTable.tsx
"use client";

import AirlineLogo from "../Flights/Airlines/AirlineLogo";

export type FlightStatusSmall =
  | "LANDED"
  | "DELAYED"
  | "CANCELLED"
  | "BOARDING"
  | "DEPARTED";

export type RowSmall = {
  flight: string;
  airlineLogo?: string;
  destination: string;
  sch: string;
  status: FlightStatusSmall | "LATE" | "ON TIME";
  gate?: string;
  counter?: string;
};

type Mode = "arrivals" | "departures";

/* Convert neutral/legacy labels into our canonical chips */
function normalizeStatus(s: RowSmall["status"], mode: Mode): FlightStatusSmall {
  if (s === "LATE") return "DELAYED";
  if (s === "ON TIME") return mode === "departures" ? "BOARDING" : "LANDED";
  return s as FlightStatusSmall;
}

const statusClass = (s: FlightStatusSmall) =>
  ({
    LANDED: "kfia-chip kfia-chip--landed",
    DEPARTED: "kfia-chip kfia-chip--departed",
    BOARDING: "kfia-chip kfia-chip--boarding",
    DELAYED: "kfia-chip kfia-chip--late",
    CANCELLED: "kfia-chip kfia-chip--cancelled",
  }[s]);

function CardRow({ r, mode }: { r: RowSmall; mode: Mode }) {
  const st = normalizeStatus(r.status, mode);
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3 md:p-4 mb-2.5 md:mb-3">
      {/* Row 1 */}
      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-[color:var(--kfia-brand)] font-semibold text-[13px] md:text-[14px]">{r.flight}</span>
        <AirlineLogo
          flightNo={r.flight}
          airlineLogo={r.airlineLogo}
          sizes="96px"
          className="h-4 w-[56px] md:h-[18px] md:w-[72px] object-contain"
        />
        <div className="min-w-0 text-[13px] md:text-[14px] text-slate-900 font-medium">
          <span className="block truncate" title={r.destination}>{r.destination}</span>
        </div>
      </div>

      {/* Row 2 */}
      <div className="mt-3 flex items-center justify-end gap-2">
        <span className="tabular-nums text-[13px] md:text-[14px] font-semibold text-slate-900">{r.sch}</span>
        <span className={`${statusClass(st)} inline-flex items-center justify-center rounded-full leading-none whitespace-nowrap text-[10px] md:text-[11px] px-2 py-[4px] md:py-[5px] min-w-[72px] md:min-w-[84px]`}>
          {st}
        </span>
      </div>
    </li>
  );
}

export default function MiniFlightsTable({ rows, mode }: { rows: RowSmall[]; mode: Mode }) {
  return (
    <div className="mt-4">
      <ul className="lg:hidden">
        {rows.map((r, i) => (<CardRow key={`${r.flight}-${i}`} r={r} mode={mode} />))}
      </ul>

      <div className="hidden lg:block">
        <table className="w-full table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" /><col className="w-1/5" />
          </colgroup>
          <thead>
            <tr className="text-[color:var(--kfia-brand)]">
              <th className="kfia-th text-[15px] font-semibold pl-2"><div className="flex justify-start">FLIGHT</div></th>
              <th className="kfia-th text-[15px] font-semibold px-2"><div className="flex justify-center">AIRLINE</div></th>
              <th className="kfia-th text-[15px] font-semibold pl-2"><div className="flex justify-start">DESTINATION</div></th>
              <th className="kfia-th text-[15px] font-semibold px-2"><div className="flex justify-center">SCH</div></th>
              <th className="kfia-th text-[15px] font-semibold pl-2"><div className="flex justify-start">STATUS</div></th>
            </tr>
          </thead>
          <tbody className="text-[14px]">
            {rows.map((r, i) => {
              const st = normalizeStatus(r.status, mode);
              return (
                <tr key={`${r.flight}-${i}`}>
                  <td className="kfia-td pl-2 whitespace-nowrap text-[color:var(--kfia-brand)]">{r.flight}</td>
                  <td className="kfia-td px-2">
                    <div className="flex justify-center">
                      <AirlineLogo flightNo={r.flight} airlineLogo={r.airlineLogo} sizes="72px" priority={i < 2} className="h-5 w-[72px] object-contain" />
                    </div>
                  </td>
                  <td className="kfia-td pl-2">{r.destination}</td>
                  <td className="kfia-td px-2"><div className="text-center tabular-nums">{r.sch}</div></td>
                  <td className="kfia-td pl-2">
                    <span className={`${statusClass(st)} text-[12px] px-2 py-1 min-w-[84px] inline-flex items-center justify-center rounded-full leading-none whitespace-nowrap`}>{st}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}