"use client";

import { ReactNode, useMemo, useRef, useState } from "react";
import { Calendar, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "./SearchBar";

type Props = {
  id: string;
  title: ReactNode;            // ← was string
  subtitle?: ReactNode;        // ← was string
  headerTabs?: ReactNode;
  query: string;
  onQueryChange: (v: string) => void;
  onSearch?: () => void;
  searchPlaceholder?: string;
  searchButtonLabel?: string;
  showSubheader?: boolean;
  children: ReactNode;

  // date control
  selectedDate: Date;
  onDateChange: (d: Date) => void;
};

function fmt(d: Date) {
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const isToday = (d: Date) => startOfDay(d).getTime() === startOfDay(new Date()).getTime();

export default function PanelShell({
  id, title, subtitle, headerTabs,
  query, onQueryChange, onSearch,
  searchPlaceholder = "Search",
  searchButtonLabel = "Search",
  showSubheader = true,
  children,
  selectedDate,
  onDateChange,
}: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [calOpen, setCalOpen] = useState(false);
  const calBtnRef = useRef<HTMLButtonElement | null>(null);

  const dateLabel = useMemo(() => fmt(selectedDate), [selectedDate]);

  const step = (days: number) =>
    onDateChange(new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate() + days
    ));

  const disableNext = isToday(selectedDate); // cannot go to tomorrow via arrows

  return (
    <section id={id} className="kfia-content py-8 sm:py-12 scroll-mt-[96px]">
      {/* Heading */}
      <div className="text-center px-4">
        <h2 className="text-2xl sm:text-[34px] font-semibold">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search panel */}
      <div className="mt-6 sm:mt-8 rounded-2xl bg-[#1E1B4F] text-white p-3 sm:p-6 mx-4 sm:mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-4 items-stretch">
          {headerTabs && (
            <div className="flex justify-center">
              <div className="rounded-xl bg-white/10 p-1">{headerTabs}</div>
            </div>
          )}
          <div className="px-1 sm:px-0">
            <SearchBar
              value={query}
              onChange={onQueryChange}
              onSearch={onSearch}
              placeholder={searchPlaceholder}
              buttonLabel={searchButtonLabel}
            />
          </div>
        </div>
      </div>

      {/* Subheader row (date + arrows + fullscreen) */}
      {showSubheader && (
        <div className="mt-4 sm:mt-6 flex items-center justify-between px-4 sm:px-0 max-w-[1100px] mx-auto relative">
          <div className="inline-flex items-center gap-2 sm:gap-3 text-[12px] sm:text-[13px] text-neutral-800">
            <button
              type="button"
              aria-label="Previous day"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60"
              onClick={() => step(-1)}
            >
              <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
            </button>

            <span className="px-2 py-1 rounded-md bg-[color:var(--kfia-brand)]/10 text-[color:var(--kfia-brand)] font-medium">
              {isToday(selectedDate) ? "TODAY" : ""}
            </span>

            <button
              ref={calBtnRef}
              type="button"
              className="inline-flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-200/60"
              onClick={() => setCalOpen(v => !v)}
              aria-haspopup="dialog"
              aria-expanded={calOpen}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold tracking-wide">{dateLabel}</span>
            </button>

            <button
              type="button"
              aria-label="Next day"
              disabled={disableNext}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${disableNext ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-200/60"}`}
              onClick={() => step(+1)}
            >
              <ChevronRight className="w-5 h-5 rtl:rotate-180" />
            </button>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
            onClick={() => setFullscreen(true)}
          >
            <Maximize2 className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Fullscreen</span>
            <span className="sr-only sm:not-sr-only sm:hidden">Fullscreen</span>
          </button>

          {/* Calendar popup */}
          {calOpen && (
            <div
              role="dialog"
              className="absolute z-50 mt-2 bg-white border border-neutral-200 rounded-lg shadow-md p-3"
              style={{ top: "100%", left: 0 }}
            >
              <input
                type="date"
                className="border rounded-md px-2 py-1 text-sm"
                value={selectedDate.toISOString().slice(0,10)}
                onChange={(e) => {
                  const v = e.target.value; // yyyy-mm-dd
                  const [y,m,d] = v.split("-").map(Number);
                  onDateChange(new Date(y, (m ?? 1) - 1, d ?? 1));
                  setCalOpen(false);
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* Main panel */}
      <div className="mt-3 sm:mt-4 rounded-2xl border border-neutral-200 bg-white p-3 sm:p-6 shadow-sm max-w-[1100px] mx-4 sm:mx-auto">
        {children}
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
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-neutral-200/60"
                  onClick={() =>
                    onDateChange(new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate() - 1
                    ))
                  }
                >
                  <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                </button>

                <span className="px-2 py-1 rounded-md bg-[color:var(--kfia-brand)]/10 text-[color:var(--kfia-brand)] font-semibold">
                  {isToday(selectedDate) ? "TODAY" : ""}
                </span>
                <Calendar className="w-5 h-5" />
                <span className="font-semibold tracking-wide">{dateLabel}</span>

                <button
                  type="button"
                  aria-label="Next day"
                  disabled={isToday(selectedDate)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-md ${isToday(selectedDate) ? "opacity-40 cursor-not-allowed" : "hover:bg-neutral-200/60"}`}
                  onClick={() =>
                    onDateChange(new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth(),
                      selectedDate.getDate() + 1
                    ))
                  }
                >
                  <ChevronRight className="w-5 h-5 rtl:rotate-180" />
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
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}