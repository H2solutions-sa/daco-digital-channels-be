// app/components/flights/DestinationsSearch.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plane, Search as SearchIcon } from "lucide-react";
import type { Destination } from "./destinations.data";

type Props = {
  data: Destination[];
  onSelect: (d: Destination) => void;
  className?: string;
};

export default function DestinationsSearch({ data, onSelect, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputBoxRef = useRef<HTMLDivElement | null>(null); // anchor for dropdown
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // dropdown position relative to input only
  const [pos, setPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const calcPosition = () => {
    const box = inputBoxRef.current;
    const parent = containerRef.current;
    if (!box || !parent) return;
    setPos({
      top: box.offsetTop + box.offsetHeight + 8,
      left: box.offsetLeft,
      width: box.offsetWidth,
    });
  };

  useEffect(() => {
    calcPosition();
    const roBox = new ResizeObserver(calcPosition);
    const roParent = new ResizeObserver(calcPosition);
    inputBoxRef.current && roBox.observe(inputBoxRef.current);
    containerRef.current && roParent.observe(containerRef.current);
    window.addEventListener("resize", calcPosition);
    return () => {
      roBox.disconnect();
      roParent.disconnect();
      window.removeEventListener("resize", calcPosition);
    };
  }, []);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as Node;
      if (!dropRef.current?.contains(t) && !inputRef.current?.contains(t)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data.slice(0, 12);
    return data
      .filter(
        (d) =>
          d.code.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query, data]);

  const choose = (d: Destination) => {
    setQuery(`${d.city} (${d.code})`);
    setOpen(false);
    onSelect(d);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[activeIndex] ?? suggestions[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const openAndFocus = () => {
    setOpen(true);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Mobile: stacked | Desktop: original look */}
      <div className="flex flex-col gap-2 sm:gap-3 md:flex-row md:items-stretch md:gap-6">
        {/* Input (anchor) */}
        <div ref={inputBoxRef} className="relative md:flex-1">
          <input
            ref={inputRef}
            id="destinations-search"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search Destinations..."
            className="
              w-full
              h-11 sm:h-12 md:h-12
              rounded-[12px]
              bg-[#F3F3F4] border border-transparent
              pl-10 pr-3 sm:pl-11 sm:pr-4
              text-[14px] sm:text-[15px] md:text-[15.5px]
              text-slate-800 placeholder:text-[#8A8A8A]
              outline-none focus:ring-0
            "
          />
          <SearchIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[18px] md:h-[18px] text-[#8A8A8A]"
            aria-hidden
          />
        </div>

        {/* CTA (Find Destinations button) */}
        <button
          type="button"
          onClick={openAndFocus}
          className="
            inline-flex items-center justify-center gap-2
            h-11 sm:h-12 md:h-12
            px-4 sm:px-6 md:px-6
            rounded-[12px]
            bg-[color:var(--kfia-brand)] text-white
            text-[16px]
            font-medium shadow-sm hover:opacity-95
            w-full md:w-auto
          "
        >
          <Plane
            className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]"
            aria-hidden
          />
          Find Destinations
        </button>
      </div>

      {/* Suggestions — aligned to input only */}
      {open && suggestions.length > 0 && (
        <div
          ref={dropRef}
          className="absolute z-[2000] px-0"
          style={{ top: pos.top, left: pos.left, width: pos.width }}
        >
          <div
            className="rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
            role="listbox"
            aria-labelledby="destinations-search"
          >
            <div
              className="max-h-[60vh] overflow-y-auto overscroll-contain"
              style={{ WebkitOverflowScrolling: "touch" as any }}
            >
              <div className="px-4 py-2 text-[12px] font-semibold text-slate-600 bg-slate-50 sticky top-0 flex items-center gap-2">
                <Plane className="w-4 h-4 text-[color:var(--kfia-brand)]" />
                Choose a destination
              </div>

              {suggestions.map((d, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={`${d.code}-${idx}`}
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => choose(d)}
                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3
                      ${isActive ? "bg-[color:var(--kfia-brand)]/7" : "bg-white"}
                      hover:bg-[color:var(--kfia-brand)]/7`}
                  >
                    <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#4D9CD3]" />
                    <span className="font-medium text-slate-900">{d.city}</span>
                    <span className="text-slate-500">({d.code})</span>
                    <span className="ml-auto text-slate-500 text-xs">{d.country}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}