
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  MapPin,
  Info,
  Calendar,
  DoorOpen,
  BellRing,
  RefreshCw,
  Luggage,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import AirlineLogo from "../Airlines/AirlineLogo";
import { fetchSingleFlight } from "../../../../lib/flights/api";

import { JourneyStep, JourneyTimelineProps } from "./types";
import { BORDER, TILE } from "./design";
import {
  inferLogoFromFlight,
  inferCheckinFromFlight,
  getCityOnly,
  formatTime24,
} from "./helpers";
import MetaCell from "./MetaCell";
import Fact from "./Fact";
import TimelineDesktop from "./TimelineDesktop";
import TimelineMobile from "./TimelineMobile";
import { buildArrivalJourney } from "./arrivalJourney";
import { DEPARTURE_DEFAULTS, DepartureStepInfo } from "./departureDefaults";
import { buildDepartureJourney } from "./departureJourney";
import Link from "next/link";

/* ---------- helpers ---------- */
function decodePathFlight(pathname?: string | null): string | undefined {
  if (!pathname) return undefined;
  const segs = pathname.split("/").filter(Boolean);
  const last = segs[segs.length - 1];
  if (!last) return undefined;
  try {
    const raw = decodeURIComponent(last);
    return raw.replace(/-/g, " ").trim();
  } catch {
    return last.replace(/-/g, " ").trim();
  }
}

type Seed = {
  flightNo: string;
  sched?: string;
  from?: string;
  to?: string;
  destinationLabel?: string;
  gate?: string;
  status?: string;
  tab?: "arrivals" | "departures";
};

function loadSeedFor(flightNo?: string): Seed | undefined {
  if (typeof window === "undefined" || !flightNo) return undefined;
  try {
    const raw = localStorage.getItem("kfia:journeySeed");
    if (!raw) return undefined;
    const arr = JSON.parse(raw) as Seed[];
    const fn = (s: string) => s.replace(/\s+/g, "").toUpperCase();
    return arr.find((x) => fn(x.flightNo) === fn(flightNo));
  } catch {
    return undefined;
  }
}

export default function JourneyTimeline({
  flight = {},
  steps,
  defaultOpen = false,
}: JourneyTimelineProps) {
  const router = useRouter();
  const search = useSearchParams();
  const pathname = usePathname();

  const [fetchedFlight, setFetchedFlight] = useState<any>(null);

  useEffect(() => {
    const flightParam = search?.get("flight");
    if (!flightParam) return;

    const [airline, number] = flightParam.split("-");
    if (!airline || !number) return;

    (async () => {
      try {
        const res = await fetchSingleFlight(airline, number);
            console.log(res.FLIGHT);
        const mapped = {
          flightNo: `${res.FLIGHT.AIRLINE}-${res.FLIGHT.FL_NUMBER}`,
          sched: res.FLIGHT.SCH_TIME,
          status: res.FLIGHT.FL_STATUS_1,
          gate: res.FLIGHT.GATE_1,
          checkin:inferCheckinFromFlight(`${res.FLIGHT.AIRLINE}`),
          destinationLabel: res.FLIGHT.ROUTING_ENG,
          to: res.FLIGHT.ROUTING,
          updated: res.CURRENT_TIME,
          tab: res.FLIGHT.ARR_DEP === "D" ? "departures" : "arrivals",
        };
          console.log(mapped);
        setFetchedFlight(mapped);
      } catch (err) {
        console.error("Flight fetch failed:", err);
      }
    })();
  }, [search]);

  const mergedFlight = fetchedFlight || flight;

  const urlFlight = useMemo(() => {
    if (!search) return {};
    const g = (k: string) => {
      const v = search.get(k);
      return v && v.trim() ? v : undefined;
    };
    return {
      sched: g("sched"),
      from: g("from"),
      to: g("to"),
      airlineLogo: g("airlineLogo"),
      flightNo: g("flightNo"),
      destinationLabel: g("destinationLabel"),
      destination: g("destination"),
      gate: g("gate"),
      date: g("date"),
      checkin: g("checkin"),
      status: g("status"),
      updated: g("updated"),
      tab: g("tab") as "arrivals" | "departures" | undefined,
      arr: g("arr"),
      dep: g("dep"),
    } as Partial<JourneyTimelineProps["flight"]> & {
      destination?: string;
      tab?: "arrivals" | "departures";
      arr?: string;
      dep?: string;
    };
  }, [search]);

  const pathFlightNo = useMemo(() => decodePathFlight(pathname), [pathname]);
  const seed = useMemo(() => {
    const prefer = (urlFlight as any)?.flightNo as string | undefined;
    return loadSeedFor(prefer || pathFlightNo);
  }, [urlFlight, pathFlightNo]);

  const [dateLabel, setDateLabel] = useState("");
  useEffect(() => {
    let d =
      urlFlight?.date ??
      (mergedFlight as any)?.date ??
      (typeof window !== "undefined"
        ? localStorage.getItem("kfia:selectedDatePretty") || ""
        : "");
    if (!d && typeof window !== "undefined") {
      const iso = localStorage.getItem("kfia:selectedDateISO");
      if (iso)
        d = new Intl.DateTimeFormat(undefined, {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(new Date(iso));
    }
    setDateLabel(d || "");
  }, [urlFlight?.date, (mergedFlight as any)?.date]);

  const destinationFull = useMemo(() => {
    const fromUrl = (urlFlight as any)?.destination as string | undefined;
    if (fromUrl) return fromUrl;
    const city =
      urlFlight?.destinationLabel ??
      (mergedFlight as any)?.destinationLabel ??
      seed?.destinationLabel;
    const toCode = (
      (urlFlight?.to ?? (mergedFlight as any)?.to ?? seed?.to ?? "")
        .toString()
        .toUpperCase()
    );
    if (city && toCode) return `${city} (${toCode})`;
    if (city) return city;
    return toCode || "";
  }, [urlFlight, mergedFlight, seed]);

  const statusFromStorage = useMemo(() => {
    if (typeof window === "undefined") return undefined;
    try {
      const mapRaw = localStorage.getItem("kfia:statusMap");
      if (!mapRaw) return undefined;
      const map = JSON.parse(mapRaw) as Record<string, string | undefined>;
      const fn =
        (urlFlight?.flightNo ??
          (mergedFlight as any)?.flightNo ??
          seed?.flightNo ??
          "") || "";
      return map[fn];
    } catch {
      return undefined;
    }
  }, [urlFlight?.flightNo, (mergedFlight as any)?.flightNo, seed?.flightNo]);

  const f = useMemo(() => {
      const mergedFlightNo =
      urlFlight?.flightNo ?? (flight as any)?.flightNo ?? seed?.flightNo ?? "";

    const airlineLogo =
      urlFlight?.airlineLogo ??
      (mergedFlight as any)?.airlineLogo ??
      inferLogoFromFlight(mergedFlightNo);

    const checkin =
      urlFlight?.checkin ??
      (mergedFlight as any)?.checkin ??
      inferCheckinFromFlight(mergedFlightNo);

    const status =
      urlFlight?.status ??
      (mergedFlight as any)?.status ??
      seed?.status ??
      statusFromStorage;

    const from =
      (urlFlight?.from ?? (mergedFlight as any)?.from ?? seed?.from ?? "")
        .toString()
        .toUpperCase();

    const to =
      (urlFlight?.to ?? (mergedFlight as any)?.to ?? seed?.to ?? "")
        .toString()
        .toUpperCase();

    return {
      sched:
        urlFlight?.sched ?? (mergedFlight as any)?.sched ?? seed?.sched ?? "",
      from,
      to,
      airlineLogo,
      flightNo: mergedFlightNo,
      destinationLabel:
        urlFlight?.destinationLabel ??
        (mergedFlight as any)?.destinationLabel ??
        seed?.destinationLabel,
      gate: urlFlight?.gate ?? (mergedFlight as any)?.gate ?? seed?.gate,
      date: dateLabel,
      checkin,
      status,
      updated: urlFlight?.updated ?? (mergedFlight as any)?.updated,
      destinationFull,
      tab:
        (urlFlight as any)?.tab ??
        (mergedFlight as any)?.tab ??
        (seed?.tab as "arrivals" | "departures" | undefined),
    };
  }, [mergedFlight, urlFlight, destinationFull, dateLabel, statusFromStorage, seed]);

  const isArrival = useMemo(() => {
    const p = (pathname || "").toLowerCase();
    if (p.includes("/Flights/arrivalDetails")) return true;
    if (p.includes("/Flights/departureDetails")) return false;

    const tabLS =
      typeof window !== "undefined"
        ? localStorage.getItem("kfia:tab")?.toLowerCase()
        : undefined;
    const tabExplicit =
      (urlFlight as any)?.tab?.toLowerCase?.() ||
      (f as any)?.tab?.toLowerCase?.() ||
      seed?.tab?.toLowerCase?.() ||
      tabLS;

    if (tabExplicit === "arrivals") return true;
    if (tabExplicit === "departures") return false;
    if ((urlFlight as any)?.arr === "1") return true;
    if ((urlFlight as any)?.dep === "1") return false;

    return (f.to || "").toUpperCase() === "DMM";
  }, [urlFlight, f, seed?.tab, pathname]);

  const heroCity = isArrival
    ? getCityOnly(f.destinationLabel) || getCityOnly(f.destinationFull)
    : getCityOnly(f.destinationFull);

  const HOME_LABEL = "Dammam (DMM)";
  const destLabel =
    f.destinationFull ||
    (f.destinationLabel && f.to
      ? `${getCityOnly(f.destinationLabel)} (${(f.to || "").toUpperCase()})`
      : f.to || "—");

  const routeFrom = isArrival ? destLabel : HOME_LABEL;
  const routeTo = isArrival ? HOME_LABEL : destLabel;

  function mergeWithDepartureDefaults(
    provided: DepartureStepInfo[] | undefined
  ): DepartureStepInfo[] {
    if (!provided?.length) return DEPARTURE_DEFAULTS;
    const byId = new Map<string, DepartureStepInfo>(
      provided.map((s) => [s.id, s])
    );
    const mergedInDefaultOrder: DepartureStepInfo[] = DEPARTURE_DEFAULTS.map(
      (def): DepartureStepInfo => {
        const got = byId.get(def.id);
        return {
          id: def.id,
          title: got?.title ?? def.title,
          details: got?.details ?? def.details,
          expandable:
            def.id === "walk-to-security" || def.id === "walk-to-gate"
              ? false
              : got?.expandable ?? def.expandable,
          timeLabel: got?.timeLabel ?? def.timeLabel,
        };
      }
    );
    const extras: DepartureStepInfo[] = provided.filter(
      (p) => !DEPARTURE_DEFAULTS.find((d) => d.id === p.id)
    );
    return [...mergedInDefaultOrder, ...extras];
  }

  const arrivalCity = heroCity;
  const arrivalIata = (f.to || "").toUpperCase();

  const presentedSteps = useMemo(() => {
    if (isArrival) {
      const built = buildArrivalJourney({
        arrivalISOorHHMM: f.sched,
        destCity: arrivalCity,
        destIata: arrivalIata,
      });
      return built.map((a) => ({
        id: a.id,
        title: a.title,
        details: a.details,
        expandable: a.expandable !== false,
        __badgeKind: a.badgeKind ?? "none",
        __badgeValue: a.badgeValue,
      }));
    }
    const mergedBase = mergeWithDepartureDefaults(steps as any);
    const computed = buildDepartureJourney({ sched: f.sched, base: mergedBase });
    return computed.map((s: any) => ({
      id: s.id,
      title: s.title,
      details: s.details,
      expandable:
        s.id === "walk-to-security" || s.id === "walk-to-gate"
          ? false
          : s.expandable !== false,
      __timeLabel: s.timeLabel,
    }));
  }, [isArrival, steps, f.sched, arrivalCity, arrivalIata]);

  const [open, setOpen] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const defaultForDepartures = !isArrival ? true : defaultOpen;
    const initial = Object.fromEntries(
      presentedSteps.map((s: JourneyStep) => [
        s.id,
        s.expandable !== false ? defaultForDepartures : false,
      ])
    );
    setOpen(initial);
  }, [presentedSteps, isArrival, defaultOpen]);

  const expandables = useMemo(
    () =>
      presentedSteps
        .filter((s: JourneyStep) => s.expandable !== false)
        .map((s: JourneyStep) => s.id),
    [presentedSteps]
  );
  const allOpen = useMemo(
    () => !expandables.length || expandables.every((id) => !!open[id]),
    [expandables, open]
  );
  const toggleAll = () => {
    const v = !allOpen;
    setOpen(() =>
      Object.fromEntries(
        presentedSteps.map((s: JourneyStep) => [
          s.id,
          s.expandable === false ? false : v,
        ])
      )
    );
  };

  function statusChipClass(raw?: string, arrival?: boolean): string | null {
    if (!raw) return null;
    const s = raw.toUpperCase();
    if (s.includes("CANCEL")) return "kfia-chip kfia-chip--cancelled";
    if (s.includes("DELAY") || s.includes("LATE")) return "kfia-chip kfia-chip--late";
    if (!arrival) {
      if (s.includes("BOARD")) return "kfia-chip kfia-chip--boarding";
      if (s.includes("COUNTER OPEN")) return "kfia-chip kfia-chip--counter-open";
      if (s.includes("COUNTER CLOSE") || s.includes("FINAL CALL") || s.includes("GATE CLOSED"))
        return "kfia-chip kfia-chip--final-call";
      if (s.includes("DEPART")) return "kfia-chip kfia-chip--departed";
      if (s.includes("GATE CHANGE")) return "kfia-chip kfia-chip--gate-changed";
      return "kfia-chip kfia-chip--boarding";
    }
    if (arrival) {
      if (s.includes("APPROACH") || s.includes("INBOUND")) return "kfia-chip kfia-chip--approach";
      if (s.includes("LAND")) return "kfia-chip kfia-chip--landed";
      if (s.includes("CAROUSEL OPEN")) return "kfia-chip kfia-chip--carousel-open";
      if (s.includes("CAROUSEL CLOSED")) return "kfia-chip kfia-chip--carousel-closed";
      if (s.includes("EARLY")) return "kfia-chip kfia-chip--early-land";
      return "kfia-chip kfia-chip--landed";
    }
    return null;
  }

  const chipClass = statusChipClass(f.status, isArrival);

  return (
    <section className="relative pb-12">
      {/* HERO — fixed logo size across breakpoints */}
      <div className="relative h-[360px] overflow-hidden">
        <Image
          src="/-/media/Project/Daco Digital Channels/KFIA/airplane-flying.jpg"
          alt="Aircraft wing above the clouds"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(25,21,80,0.35)_0%,rgba(25,21,80,0.22)_55%,rgba(25,21,80,0.45)_100%)]" />
        <div className="relative z-10 h-full flex flex-col justify-center kfia-content px-3 max-w-[1100px] mx-auto">
          <Link
            href='/Flights'
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-[16px] font-medium mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Flights
          </Link>

          <p className="text-[18px] text-white/85">
            {isArrival ? "From" : "To"}
          </p>
          <h1 className="text-white font-extrabold text-[64px] leading-[1.05] mt-1">
            {getCityOnly(isArrival ? f.destinationLabel ?? f.destinationFull : f.destinationFull) || "—"}{" "}
            {(f.to || "").toUpperCase() ? (
              <span className="text-white/85 text-[20px] font-semibold align-middle">
                ({(f.to || "").toUpperCase()})
              </span>
            ) : null}
          </h1>

          {/* 160x56 pill; inner logo 140x28 — identical web & mobile */}
          <div className={`${TILE} mt-6 inline-flex w-[160px] h-[56px] items-center justify-center rounded-[14px] border-[#D9DCE8] bg-white/95 backdrop-blur-[2px]`}>
            <AirlineLogo
              flightNo={f.flightNo || ""}
              airlineLogo={f.airlineLogo || inferLogoFromFlight(f.flightNo || "")}
              priority
              className="kfia-fixed-logo"
            />
          </div>
        </div>
      </div>

      {/* META — status font locked to 18px across breakpoints */}
      <div className="relative z-20 kfia-content px-3 max-w-[1100px] mx-auto -mt-14">
        <div className={`${TILE} overflow-hidden border-[#D9DCE8] shadow-[0_2px_12px_rgba(28,21,80,0.05)]`}>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 md:divide-x ${BORDER} divide-[#D9DCE8]`}>
            <MetaCell
              icon={isArrival ? <PlaneLanding className="h-5 w-5" /> : <PlaneTakeoff className="h-5 w-5" />}
              label={<span className="text-[16px]">{isArrival ? "Arrival Time" : "Departure Time"}</span>}
            >
              <span className="text-[18px] font-semibold text-neutral-900">{formatTime24(f.sched)}</span>
            </MetaCell>

            <MetaCell icon={<MapPin className="h-5 w-5" />} label={<span className="text-[16px]">Route</span>}>
              <p className="mt-0.5">
                <span className="text-[16px] text-neutral-600">From:&nbsp;</span>
                <span className="text-[18px] font-semibold text-neutral-800">{routeFrom}</span>
              </p>
              <p className="mt-0.5">
                <span className="text-[16px] text-neutral-600">To:&nbsp;&nbsp;&nbsp;&nbsp;</span>
                <span className="text-[18px] font-semibold text-neutral-800">{routeTo}</span>
              </p>
            </MetaCell>

            <MetaCell icon={<Info className="h-5 w-5" />} label={<span className="text-[16px]">Flight No</span>}>
              <span className="inline-flex items-center rounded-full border border-[#CBBEF9] bg-[#EFE9FF] px-3 py-1 text-[18px] font-semibold text-[#5B4BB7]">
                {f.flightNo || "—"}
              </span>
            </MetaCell>

            <MetaCell icon={<Info className="h-5 w-5" />} label={<span className="text-[16px]">Status</span>}>
              {f.status ? (
                <span className={`${chipClass ?? ""} !text-[18px] !leading-tight`}>{f.status}</span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[18px] font-semibold bg-neutral-200 text-neutral-800">—</span>
              )}
            </MetaCell>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-1 mt-2 text-[13px] font-medium text-[#5B4BB7]">
          <span className="inline-flex items-center gap-1">
            <BellRing className="h-3.5 w-3.5" /> Updated:&nbsp; {f.updated || "—"}
          </span>
          <RefreshCw className="h-4 w-4 opacity-80" />
        </div>
      </div>

      {/* FACTS */}
      <div className="kfia-content px-3 max-w-[1100px] mx-auto mt-8">
        <div className={`${TILE} p-5 border-[#D9DCE8]`}>
          <div className={`grid gap-4 ${isArrival ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-3"}`}>
            <Fact
              label={<span className="text-[16px]">DATE</span>}
              value={<span className="text-[20px]">{f.date}</span>}
              icon={<Calendar className="h-5 w-5" />}
            />
            {!isArrival ? (
              <Fact
                label={<span className="text-[16px]">CHECK-IN</span>}
                value={<span className="text-[20px]">{f.checkin && f.checkin.trim() ? f.checkin : "—"}</span>}
                icon={<Luggage className="h-5 w-5" />}
              />
            ) : null}
            <Fact
              label={<span className="text-[16px]">{isArrival ? "CAROUSEL" : "GATE"}</span>}
              value={<span className="text-[20px] font-semibold">{f.gate || "—"}</span>}
              icon={isArrival ? <Luggage className="h-5 w-5" /> : <DoorOpen className="h-5 w-5" />}
              strong
            />
          </div>
        </div>
      </div>

      {/* TIMELINES */}
      <TimelineDesktop
        BORDER={BORDER}
        TILE={TILE}
        presentedSteps={presentedSteps as any}
        isArrival={isArrival}
        open={open}
        setOpen={setOpen}
        toggleAll={toggleAll}
        allOpen={allOpen}
      />
      <TimelineMobile
        BORDER={BORDER}
        TILE={TILE}
        presentedSteps={presentedSteps as any}
        isArrival={isArrival}
        open={open}
        setOpen={setOpen}
        toggleAll={toggleAll}
        allOpen={allOpen}
      />
    </section>
  );
}