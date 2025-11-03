"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useI18n } from "next-localization";
import AirlineLogo from "../Airlines/AirlineLogo";

export type FlightStatus =
  | "LANDED"
  | "DELAYED"
  | "CANCELLED"
  | "BOARDING"
  | "DEPARTED";

export type Row = {
  scheduled: string;
  estimated: string;
  airlineLogo: string;
  flightNo: string;
  destination: string;
  gate: string;
  counter: string | number;
  /** For future dates, leave undefined to render a dash (—) */
  status?: FlightStatus;
};

const statusClass = (s?: FlightStatus) =>
  s
    ? {
        LANDED: "kfia-chip kfia-chip--landed",
        DELAYED: "kfia-chip kfia-chip--late",
        CANCELLED: "kfia-chip kfia-chip--cancelled",
        BOARDING: "kfia-chip kfia-chip--boarding",
        DEPARTED: "kfia-chip kfia-chip--departed",
      }[s]
    : "";


/* -------- helpers -------- */
const toSlug = (x: string) => encodeURIComponent(x.trim().replace(/\s+/g, "-"));

function DashBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-neutral-200 text-neutral-600 px-2 py-0.5 text-[11px] sm:text-[12px]">
      —
    </span>
  );
}

/* -------- mobile card -------- */
function MobileCard({
  r,
  onOpen,
  showCounter,
}: {
  r: Row;
  onOpen: () => void;
  showCounter: boolean;
}) {
  const gridCols = showCounter ? "grid-cols-3" : "grid-cols-2";
const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left rounded-2xl border border-neutral-200 p-3 sm:p-4 mb-3 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-[color:var(--kfia-brand)]/30"
    >
      {/* top row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-md bg-neutral-100 tabular-nums text-[13px] sm:text-[14px] font-semibold">
            {r.scheduled}
          </span>
          <span className="relative h-5 w-16 sm:h-6 sm:w-20">
                 <AirlineLogo
                      flightNo={r.flightNo}
                      airlineLogo={r.airlineLogo}
                      sizes="80px"
                      className="h-5 w-20 sm:h-6 sm:w-[88px] object-contain"
                    />
          </span>
        </div>

        <div className="flex items-center gap-2">
          {r.status ? (
            <span className={`${statusClass(r.status)} text-[11px] sm:text-[12px]`}>{r.status}</span>
          ) : (
            <DashBadge />
          )}
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500"
            aria-hidden="true"
          >
            <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* body */}
      <div className="mt-3 text-[13px] sm:text-[14px] text-neutral-700">
        <div className="font-semibold text-neutral-900 text-[16px] sm:text-[17px]">
          {r.destination}
        </div>
        <div className={`mt-2 grid ${gridCols} gap-2`}>
          <div>
            <div className="text-[11px] text-neutral-500">{t("Flight")}</div>
            <div className="font-medium">{r.flightNo}</div>
          </div>
          <div>
            <div className="text-[11px] text-neutral-500">{t("Gate")}</div>
            <div className="font-medium">{r.gate}</div>
          </div>
          {showCounter && (
            <div>
              <div className="text-[11px] text-neutral-500">{t("Counter")}</div>
              <div className="font-medium">{r.counter}</div>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

/* -------- main component -------- */
export default function FlightsTable({
  rows,
  forceMobile = false,
  showCounter = true, // 👈 new prop (arrivals will pass false)
}: {
  rows: Row[];
  forceMobile?: boolean;
  showCounter?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Measure the available width in a wrapper that is always present
  const measureRef = useRef<HTMLDivElement | null>(null);

  // IMPORTANT: start TRUE so SSR and the first client paint match (mobile first).
  const [shouldForceMobileFromWidth, setShouldForceMobileFromWidth] = useState<boolean>(true);

  // Min width where the full table is comfortable (tuned to your columns).
  const TABLE_COMFORT_MIN = 980; // px

  useEffect(() => {
    const el = measureRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    // Update once immediately and then on resize
    const update = () => {
      setShouldForceMobileFromWidth(el.clientWidth < TABLE_COMFORT_MIN);
    };
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // If any reason says "use mobile", we use mobile.
  const useMobile = useMemo(
    () => forceMobile || shouldForceMobileFromWidth,
    [forceMobile, shouldForceMobileFromWidth]
  );
  const { t } = useI18n();

  const th =
    "px-3 py-3 md:py-4 text-[10px] md:text-[11px] font-semibold tracking-wider uppercase text-left whitespace-nowrap";
  const cell = "px-3 py-4 md:py-5 align-middle whitespace-nowrap";
  const time =
    "tabular-nums font-extrabold text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] leading-none";
  const num = "tabular-nums font-semibold text-neutral-900";

  return (
    <div ref={measureRef}>
      {useMobile ? (
        // Mobile list
        <div>
          {rows.map((r, i) => {
            const href = `${pathname}?flight=${toSlug(r.flightNo)}#journey`;
            return (
              <MobileCard
                key={r.flightNo + i}
                r={r}
                onOpen={() => router.push(href)}
                showCounter={showCounter}
              />
            );
          })}
        </div>
      ) : (
        // Desktop table (only when width is comfortable)
        <div>
          <table className="w-full table-auto border-collapse rounded-xl overflow-hidden" aria-label="Live flights">
            <thead>
              <tr className="bg-[#1E1B4F] text-white">
                <th className={`${th} text-center`}>{t("Scheduled")}</th>
                <th className={`${th} text-center`}>{t("Estimated")}</th>
                <th className={`${th} text-center`}>{t("FlightAirline")}</th>
                <th className={th}>{t("FlightNo")}</th>
                <th className={th}>{t("Destination")}</th>
                <th className={`${th} text-center`}>{t("Gate")}</th>
                {showCounter && <th className={`${th} text-center`}>{t("Counter")}</th>}
                <th className={`${th} text-right pr-4`}>{t("Status")}</th>
                <th className={`${th} text-center w-10`}></th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const href = `${pathname}?flight=${toSlug(r.flightNo)}#journey`;
                return (
                  <tr
                    key={r.flightNo + i}
                    className="odd:bg-white even:bg-neutral-100/70 border-b border-neutral-200 hover:bg-neutral-200/60 transition-colors cursor-pointer"
                    onClick={() => router.push(href)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") router.push(href);
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open journey for ${r.flightNo}`}
                  >
                    <td className={`${cell} text-center`}>
                      <span className={time}>{r.scheduled}</span>
                    </td>
                    <td className={`${cell} text-center`}>
                      <span className={time}>{r.estimated}</span>
                    </td>
                    <td className={`${cell} text-center`}>
                      <span className="relative inline-block h-6 w-[80px] md:w-[92px]">
                        <AirlineLogo
                        flightNo={r.flightNo}
                        airlineLogo={r.airlineLogo}
                        priority={i < 2}
                        sizes="92px"
                        className="mx-auto h-6 w-[90px] object-contain"
                        />
                      </span>
                    </td>
                    <td className={`${cell} text-neutral-900`}>
                      <span className="font-semibold">{r.flightNo}</span>
                    </td>
                    <td className={`${cell}`}>
                      <span className="block truncate font-semibold text-neutral-900 max-w-[220px]">
                        {r.destination}
                      </span>
                    </td>
                    <td className={`${cell} text-center`}>
                      <span className={num}>{r.gate}</span>
                    </td>
                    {showCounter && (
                      <td className={`${cell} text-center`}>
                        <span className={num}>{r.counter}</span>
                      </td>
                    )}
                    <td className={`${cell} text-right pr-4`}>
                      {r.status ? (
                        <span className={`${statusClass(r.status)} text-[12px]`}>{r.status}</span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className={`${cell} text-center w-10`} onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={href}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-700 hover:bg-neutral-300/60"
                        aria-label={`Go to ${r.flightNo}`}
                      >
                        <ChevronRight size={18} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}