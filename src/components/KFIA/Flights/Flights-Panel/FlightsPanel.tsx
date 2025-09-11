"use client";
import { useI18n } from "next-localization";

import { useEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Maximize2, X, Plus } from "lucide-react";

import SearchBar from "../../Common/SearchBar";
import FlightsTable, { type Row } from "./FlightsTable";

import { TabPills } from "./TabPills";
import { useShouldForceMobile } from "./useShouldForceMobile";
import {
  fmtKey,
  fmtHuman,
  startOfDay,
  TODAY,
  MIN_DATE,
  MIN_DATE_KEY,
  MAX_DATE,
  MAX_DATE_KEY,
} from "./date";

import { fetchFlights, filterByTab } from "../../../../lib/flights/api";
import type { FlightApi, FlightsApiResponse } from "../../../../lib/flights/types";

/* ======================= Helpers: mapping + filters ======================= */
const two = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function hhmm(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  return `${two(d.getHours())}:${two(d.getMinutes())}`;
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function titleCase(s?: string | null) {
  if (!s) return "";
  return s[0].toUpperCase() + s.slice(1).toLowerCase();
}

/** Map API statuses to the big-table status union (or undefined for upcoming). */
function normalizeBigStatus(s?: string | null): Row["status"] {
  const u = (s || "").toUpperCase();
  if (!u) return undefined;
  if (u.includes("CANCEL")) return "CANCELLED";
  if (u.includes("DELAY")) return "DELAYED";
  if (u.includes("BOARD")) return "BOARDING";
  if (u.includes("LANDED")) return "LANDED";
  if (u.includes("DEPART")) return "LANDED";
  return undefined;
}

/* -------------------- Counter extraction + formatting -------------------- */

const pad2 = (v: string | number) => `${v}`.padStart(2, "0");

function prettyCounter(raw?: string | number | null): string {
  if (raw === null || raw === undefined) return "—";
  let s = String(raw).trim();
  if (!s) return "—";

  const lower = s.toLowerCase();
  let state = "";
  if (/\bopen(ed)?\b/.test(lower)) state = "Open";
  else if (/\bclose(d)?\b/.test(lower)) state = "Closed";

  const nums = s.match(/\d{1,3}/g) || [];
  const a = nums[0], b = nums[1];

  if (a && b) {
    const range = `C${pad2(a)}–C${pad2(b)}`;
    return state ? `${range} • ${state}` : range;
  }
  if (a) {
    const single = `C${pad2(a)}`;
    return state ? `${single} • ${state}` : single;
  }
  const c = s.match(/c\s*?(\d{1,3})/i);
  if (c) {
    const single = `C${pad2(c[1])}`;
    return state ? `${single} • ${state}` : single;
  }
  return state || "—";
}

function extractCounter(rec: any): string {
  if (!rec || typeof rec !== "object") return "";

  const preferredKeys = [
    "CHECKIN_1",
    "CHECKIN",
    "COUNTER_1",
    "COUNTER",
    "CHECKIN_COUNTER",
    "CHECKIN_STATUS",
    "CHECKIN_OPEN_CLOSE",
    "COUNTER_STATUS",
    "COUNTER_OPEN_CLOSE",
  ];
  for (const k of preferredKeys) {
    const v = rec[k];
    if (v !== null && v !== undefined && String(v).trim()) return String(v).trim();
  }

  const nested = (rec.COUNTERS || rec.Checkin || rec.CheckIn || rec.Counters) as any;
  if (Array.isArray(nested) && nested.length) {
    const c0 = nested[0];
    if (c0) {
      const from = c0.from ?? c0.start ?? c0.FROM ?? c0.Start;
      const to = c0.to ?? c0.end ?? c0.TO ?? c0.End;
      const status = c0.status ?? c0.STATE ?? c0.State;
      const parts = [
        from != null && to != null ? `C${pad2(from)}–C${pad2(to)}` : from != null ? `C${pad2(from)}` : "",
        status ? String(status) : "",
      ].filter(Boolean);
      if (parts.length) return parts.join(" ");
    }
  }

  return "";
}

/** Prefer API logo filename if you host them; else fallback by code under /airlines/{code}.png */
function logoFor(code: string, apiLogo?: string | null) {
  if (apiLogo) return `/airlines/api/${apiLogo}`;
  return `/airlines/${code.toLowerCase()}.png`;
}

/** Convert one FlightApi item into the big-table Row shape (tab-aware for counter). */
function toBigRow(f: FlightApi, tab: "arrivals" | "departures"): Row {
  const code = f.AIRLINE?.trim() ?? "";
  const num = f.FL_NUMBER?.trim() ?? "";
  const scheduled = hhmm(f.SCH_TIME);
  const estimated = hhmm(f.EST_TIME);

  const counter = tab === "departures" ? prettyCounter(extractCounter(f as any)) : "—";

  return {
    scheduled,
    estimated,
    airlineLogo: logoFor(code, (f as any).AIRLINE_LOGO),
    flightNo: `${code} ${num}`,
    destination: `${titleCase((f as any).ROUTING_ENG)} (${(f as any).ROUTING})`,
    gate: (f as any).GATE_1 ?? "",
    counter,
    status: normalizeBigStatus((f as any).FL_STATUS_1),
  };
}

/** Filter flights by the selected calendar day (using SCH_TIME) */
function filterByDay(list: FlightApi[], day: Date) {
  return list.filter((f) => {
    const sch = (f as any).SCH_TIME ? new Date((f as any).SCH_TIME) : null;
    return sch ? sameDay(sch, day) : false;
  });
}

/** Free-text filter for the big table (flight no, city text, IATA) */
function makeSearchFilter(qRaw: string) {
  const q = qRaw.trim().toLowerCase();
  if (!q) return () => true;
  const compact = (s: string) => s.toLowerCase().replace(/\s+/g, "");
  return (r: Row) => {
    const iata = r.destination.match(/\(([A-Z]{3})\)/i)?.[1]?.toLowerCase() ?? "";
    return (
      compact(r.flightNo).includes(compact(q)) ||
      r.destination.toLowerCase().includes(q) ||
      (!!iata && iata.includes(q))
    );
  };
}

/* ================================= Component ============================== */

type Tab = "arrivals" | "departures";

export default function FlightsPanel({ initialTab }: { initialTab: Tab }) {
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(TODAY);
  const [didInitFromPayload, setDidInitFromPayload] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const hiddenDateInput = useRef<HTMLInputElement>(null);

  const PAGE_SIZE = 10;
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const data = (await fetchFlights()) as FlightsApiResponse;

        if (!didInitFromPayload && (data as any)?.CURRENT_TIME) {
          setSelectedDate(startOfDay(new Date((data as any).CURRENT_TIME)));
          setDidInitFromPayload(true);
        }

        const byTab = filterByTab((data as any).FLIGHTS, tab);
        const byDay = filterByDay(byTab, selectedDate);
        const mapped = byDay.map((f) => toBigRow(f, tab));
        mapped.sort((a, b) => a.scheduled.localeCompare(b.scheduled));

        if (alive) {
          setRows(mapped);
          setVisible(PAGE_SIZE);
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
  }, [tab, selectedDate, didInitFromPayload]);

  const filteredRows = useMemo(() => rows.filter(makeSearchFilter(query)), [rows, query]);

  const visibleRows = filteredRows.slice(0, visible);
  const canLoadMore = visible < filteredRows.length;

  const { ref: widthRef, forceMobile } = useShouldForceMobile(980);

  const openPicker = () => {
    const el = hiddenDateInput.current;
    if (!el) return;
    if ((el as any).showPicker) (el as any).showPicker();
    else el.focus();
  };

  const canPrev = selectedDate.getTime() > MIN_DATE().getTime();
  const canNext = selectedDate.getTime() < MAX_DATE().getTime();

  const panelRef = useRef<HTMLElement | null>(null);
  const scrollWithOffset = () => {
    const el = panelRef.current;
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top: y, behavior: "smooth" });
  };
  const { t } = useI18n();

  useEffect(() => {
    const handle = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "arrivals" || hash === "departures") {
        setTab(hash as Tab);
        requestAnimationFrame(scrollWithOffset);
      }
    };
    handle();
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);

  return (
    <>
      {/* anchor targets */}
      <div id="arrivals" className="h-0" aria-hidden />
      <div id="departures" className="h-0" aria-hidden />

      <section ref={panelRef} className="kfia-content py-8 sm:py-12 scroll-mt-[96px]">
        {/* hidden input powers native date popup */}
        <input
          ref={hiddenDateInput}
          type="date"
          className="sr-only"
          min={MIN_DATE_KEY()}
          max={MAX_DATE_KEY()}
          value={fmtKey(selectedDate)}
          onChange={(e) => {
            const [y, m, d] = e.target.value.split("-").map((n) => parseInt(n, 10));
            setSelectedDate(startOfDay(new Date(y, m - 1, d)));
          }}
        />

        {/* Purple search panel */}
        <div className="rounded-2xl bg-[#1E1B4F] text-white p-4 sm:p-6 mx-4 sm:mx-auto max-w-[1100px]">
          <div className="flex flex-col gap-4 items-stretch">
            <div className="flex justify-center">
              <TabPills
                value={tab}
                onChange={(t) => {
                  setTab(t);
                  history.replaceState(null, "", `#${t}`);
                  scrollWithOffset();
                }}
              />
            </div>
            <SearchBar
              value={query}
              onChange={setQuery}
              onSearch={() => {}}
              placeholder={t("Search-Flight-Placeholder")}
              buttonLabel={t("SearchFlight")}
            />
          </div>
        </div>

        {/* Date row */}
        <div className="mt-4 sm:mt-6 flex items-center justify-between px-4 sm:px-0 max-w-[1100px] mx-auto">
          <div className="inline-flex items-center gap-2 sm:gap-3 text:[12px] sm:text-[13px] text-neutral-800">
            <button
              type="button"
              aria-label="Previous day"
              disabled={!canPrev}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60 ${
                !canPrev ? "opacity-40 pointer-events-none" : ""
              }`}
              onClick={() =>
                setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))
              }
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {startOfDay(selectedDate).getTime() === TODAY().getTime() && (
              <span className="px-2 py-1 rounded-md bg-[color:var(--kfia-brand)]/10 text-[color:var(--kfia-brand)] font-medium">
                {t("today")}
              </span>
            )}

            <button
              type="button"
              aria-label="Choose date"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60"
              onClick={openPicker}
            >
              <Calendar className="w-5 h-5" />
            </button>

            <span className="font-semibold tracking-wide">{fmtHuman(selectedDate)}</span>

            <button
              type="button"
              aria-label="Next day"
              disabled={!canNext}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60 ${
                !canNext ? "opacity-40 pointer-events-none" : ""
              }`}
              onClick={() =>
                setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))
              }
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">{t("Fullscreen")}</span>
            <span className="sr-only sm:not-sr-only sm:hidden">{t("Fullscreen")}</span>
          </button>
        </div>

        {/* Main panel */}
        <div
          ref={widthRef}
          className="mt-3 sm:mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 shadow-sm max-w-[1100px] mx-4 sm:mx-auto"
        >
          {err ? (
            <p className="text-sm text-red-600">{t("No-Flights")} {err}</p>
          ) : loading ? (
            <p className="text-sm text-neutral-500">{t("loading")}</p>
          ) : visibleRows.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-neutral-600">
                {t("not-on-this-date")}{didInitFromPayload ? " (sample file likely has a single day)." : "."}
              </p>
            </div>
          ) : (
            <FlightsTable
              rows={visibleRows}
              forceMobile={forceMobile}
              showCounter={tab === "departures"}   // 👈 hide column on arrivals
            />
          )}

          {canLoadMore && !loading && !err && visibleRows.length > 0 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, filteredRows.length))}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[color:var(--kfia-brand)] text-white text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                {t("load-more-flights")}
              </button>
            </div>
          )}
        </div>

        {/* Fullscreen popup */}
        {fullscreen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[70] bg-black/50"
            onClick={() => setFullscreen(false)}
          >
            <div
              className="absolute inset-0 bg-white flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-neutral-200">
                <div className="inline-flex items-center gap-2 sm:gap-3 text-[13px] sm:text-[15px] text-neutral-800">
                  <button
                    type="button"
                    aria-label="Previous day"
                    disabled={!canPrev}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60 ${
                      !canPrev ? "opacity-40 pointer-events-none" : ""
                    }`}
                    onClick={() =>
                      setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1))
                    }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    aria-label="Choose date"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60"
                    onClick={openPicker}
                  >
                    <Calendar className="w-5 h-5" />
                  </button>

                  <span className="font-semibold tracking-wide">{fmtHuman(selectedDate)}</span>

                  <button
                    type="button"
                    aria-label="Next day"
                    disabled={!canNext}
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60 ${
                      !canNext ? "opacity-40 pointer-events-none" : ""
                    }`}
                    onClick={() =>
                      setSelectedDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1))
                    }
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Close fullscreen"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/70"
                  onClick={() => setFullscreen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto p-3 sm:p-6">
                <div className="max-w-[1400px] mx-auto">
                  {visibleRows.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-neutral-600">
                        {t("not-on-this-date")}{didInitFromPayload ? " (sample file likely has a single day)." : "."}
                      </p>
                    </div>
                  ) : (
                    <FlightsTable
                      rows={visibleRows}
                      forceMobile={false}
                      showCounter={tab === "departures"} // 👈 hide column on arrivals (fullscreen too)
                    />
                  )}
                  {canLoadMore && visibleRows.length > 0 && (
                    <div className="mt-6 flex justify-center">
                      <button
                        onClick={() =>
                          setVisible((v) => Math.min(v + PAGE_SIZE, filteredRows.length))
                        }
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[color:var(--kfia-brand)] text-white text-sm font-medium hover:opacity-90"
                      >
                        <Plus className="w-4 h-4" />
                        {t("load-more-flights")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}