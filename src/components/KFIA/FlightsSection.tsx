import { JSX, useEffect } from 'react';
import { ComponentProps } from 'lib/component-props';
import { useState } from "react";
import SearchBar from "./common/SearchBar";
import Tabs from "./FlightSection/Tabs";
import MiniFlightsTable, { RowSmall } from "./FlightSection/MiniFlightsTable";
import AirlineQuickLook from "./FlightSection/AirlineQuickLook";
import Link from "next/link";
import { Field, ImageField } from '@sitecore-jss/sitecore-jss-nextjs';
import Image from 'next/image';

import { fetchFlights } from "../../lib/flights/api";
import type { FlightApi } from "../../lib/flights/types";
import { useI18n } from 'next-localization';



type FlightsSectionProps = ComponentProps & {
fields:{
 Title:Field<string>,
 SubTitle:Field<string>,
 Image:ImageField
}
}


/* ===== Small helpers ===== */
const two = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const hhmm = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${two(d.getHours())}:${two(d.getMinutes())}`;
};
const titleCase = (s?: string | null) =>
  !s ? "" : s[0].toUpperCase() + s.slice(1).toLowerCase();
const logoFor = (code: string, apiLogo?: string | null) =>
  apiLogo ? `/airlines/api/${apiLogo}` : `/airlines/${code.toLowerCase()}.png`;

/**
 * Map upstream statuses to the **mini-table** label set
 * (LANDED | DELAYED | CANCELLED | BOARDING | DEPARTED)
 */
function statusFromApiMini(f: FlightApi): RowSmall["status"] {
  const dir = (f.ARR_DEP || "").toUpperCase(); // A | D
  const raw = (f.FL_STATUS_1 || f.PUB_RMK_ENG || f.PUB_RMK || "").toUpperCase();

  if (raw.includes("CANCEL")) return "CANCELLED";
  if (raw.includes("DELAY")) return "DELAYED";

  if (dir === "D") {
    if (raw.includes("DEPART")) return "DEPARTED";
    if (raw.includes("GATE CLOSED") || raw.includes("FINAL")) return "DEPARTED";
    if (raw.includes("BOARD") || raw.includes("COUNTER OPEN")) return "BOARDING";
    if (raw.includes("GATE CHANGED")) return "DEPARTED";
    return "BOARDING";
  }

  // Arrivals
  if (raw.includes("LAND")) return "LANDED";
  if (raw.includes("CAROUSEL OPEN")) return "LANDED";
  if (raw.includes("CAROUSEL CLOSED")) return "LANDED";
  if (raw.includes("APPROACH") || raw.includes("EARLY")) return "LANDED";
  return "LANDED";
}

function toRowSmall(f: FlightApi): RowSmall {
  const code = (f.AIRLINE || "").trim();
  const num = (f.FL_NUMBER || "").trim();
  const iata = (f.ROUTING || "").trim();
  const city = titleCase(f.ROUTING_ENG);

  return {
    flight: `${code} ${num}`,
    airlineLogo: logoFor(code, f.AIRLINE_LOGO ?? undefined),
    destination: `${city} (${iata})`,
    sch: hhmm(f.SCH_TIME),
    status: statusFromApiMini(f),
    gate: f.GATE_1 || undefined,
    counter: f.CHECKIN_1 || undefined,
  };
}

// Normalize response to FlightApi[]
function toArray(raw: unknown): FlightApi[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as FlightApi[];
  if (Array.isArray((raw as any).FLIGHTS)) return (raw as any).FLIGHTS as FlightApi[];
  if (Array.isArray((raw as any).flights)) return (raw as any).flights as FlightApi[];
  if (Array.isArray((raw as any).results)) return (raw as any).results as FlightApi[];
  return [];
}

export const Default = (props: FlightsSectionProps): JSX.Element => {
  const [tab, setTab] = useState<"arrivals" | "departures">("arrivals");
  const [showQuickLook, setShowQuickLook] = useState(false);
  const [searchCode, setSearchCode] = useState("SV");

  const [rowsArr, setRowsArr] = useState<RowSmall[]>([]);
  const [rowsDep, setRowsDep] = useState<RowSmall[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Fetch top lists for both tabs (server filters by ARR/DEP)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const [rawArrivals, rawDepartures] = await Promise.all([
          fetchFlights({ tab: "arrivals", top: 50 }),
          fetchFlights({ tab: "departures", top: 50 }),
        ]);

        // Filter locally again to ensure correctness
        const arrivals = toArray(rawArrivals)
          .filter((f) => (f.ARR_DEP || "").toUpperCase() === "A")
          .sort((a, b) => (a.SCH_TIME || "").localeCompare(b.SCH_TIME || ""))
          .slice(0, 4)
          .map(toRowSmall);

        const departures = toArray(rawDepartures)
          .filter((f) => (f.ARR_DEP || "").toUpperCase() === "D")
          .sort((a, b) => (a.SCH_TIME || "").localeCompare(b.SCH_TIME || ""))
          .slice(0, 4)
          .map(toRowSmall);

        if (alive) {
          setRowsArr(arrivals);
          setRowsDep(departures);
        }
      } catch (e: any) {
        if (alive) setErr(e.message ?? "Failed to load flights");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);


  function handleSearch() {
    setShowQuickLook(true);
  }
  const {t} = useI18n();
  const seeAllHref =
    tab === "arrivals" ? "/Flights#arrivals" : "/Flights#departures";
  const seeAllLabel = tab === "arrivals" ? t("see-all-arrivals") : t("see-all-departures");
  const rows = tab === "arrivals" ? rowsArr : rowsDep;

  return (
    <section
      id="flights"
      className="w-full kfia-bg-muted scroll-mt-[96px] overflow-x-hidden"
    >
      <div className="mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-8 kfia-section">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_560px] gap-y-8 lg:gap-y-0 lg:gap-16 xl:gap-24 2xl:gap-28 lg:items-stretch">
          {/* Left Column */}
          <div className="flex flex-col justify-center max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h2 className=" font-semibold tracking-tight text-[color:var(--kfia-brand)] text-[24px] sm:text-[32px] md:text-[length:var(--heading2-size)]">
              {props.fields.Title?.value}
              <br className="hidden sm:block" /> 
            </h2>
            <p className="mt-3 sm:mt-5 md:mt-8 max-w-[60ch] text-[color:var(--kfia-subtitle)] leading-6 sm:leading-7 md:leading-8 text-[14px] sm:text-[15px] md:text-[length:var(--paragraph1-size)]">
              {props.fields.SubTitle?.value}
            </p>
            <div className="w-full max-w-none lg:max-w-[60ch] overflow-hidden rounded-2xl mt-2 sm:mt-3 md:mt-4">
              <div className="relative w-full h-[190px] sm:h-[230px] md:h-[280px] lg:h-[360px] xl:h-[400px] overflow-hidden rounded-2xl">
                {props.fields.Image.value?.src && 
                <Image
                  src={props.fields.Image.value.src}
                  alt="Terminal aerial"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60ch"
                />
                }
              </div>
            </div>
          </div>
          

          {/* Right Column */}
          <div className="flex flex-col w-full lg:w-[560px] lg:justify-self-end mt-8 lg:mt-0">
            {showQuickLook ? (
              <AirlineQuickLook
                code={searchCode}
                setCode={setSearchCode}
                onBack={() => setShowQuickLook(false)}
              />
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 md:p-6 shadow-sm">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="contents"
                >
                  <SearchBar
                    value={searchCode}
                    onChange={setSearchCode}
                    onSearch={handleSearch}
                  />
                </form>

                <Tabs tab={tab} setTab={setTab} />

                <MiniFlightsTable rows={rows} mode={tab} />

                <div className="mt-4 flex justify-end">
                  <Link
                    href={seeAllHref}
                    className="text-sm font-medium kfia-link"
                    aria-label={seeAllLabel}
                  >
                    {seeAllLabel}
                  </Link>
                </div>
              </div>   )}
          </div>
        </div>
      </div>
    </section>
  );
};
