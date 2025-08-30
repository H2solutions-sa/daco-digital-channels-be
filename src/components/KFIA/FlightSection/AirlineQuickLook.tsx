"use client";
import { useState } from "react";
import { Calendar, ChevronDown, ArrowUpRight, ArrowLeft } from "lucide-react";
import SearchBar from "../Common/SearchBar";

export default function AirlineQuickLook({
  code,
  setCode,
  onBack,
}: {
  code: string;
  setCode: (v: string) => void;
  onBack: () => void;
}) {
  const [showDeps, setShowDeps] = useState(true);
  const [showArrs, setShowArrs] = useState(false);
  const [dateLabel] = useState("Today, Jul 4");

  const quickFlights = [
    { t: "19:55", city: "Damascus (DAM)", code: "SV 389" },
    { t: "19:55", city: "Jazan (GIZ)", code: "SV 043" },
    { t: "19:55", city: "Jeddah (JED)", code: "SV 1047" },
  ];

  const allTo = ["Beirut (BEY)", "Muscat (MCT)", "Doha (DOH)"];
  const allWith = ["MIDDLE EAST AIRLINES (ME)", "OMAN AIR (WY)", "QATAR AIRWAYS (QR)"];

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      {/* Header row: Back + shared SearchBar */}
      <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-neutral-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 max-w-[560px]">
          <SearchBar id="quick-airline-search" value={code} onChange={setCode} />
        </div>
      </div>

      {/* Controls row */}
      <div className="px-6 pt-4">
        <div className="flex items-center gap-6 flex-wrap">
          <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              className="accent-[color:var(--kfia-brand)]"
              checked={showDeps}
              onChange={(e) => setShowDeps(e.target.checked)}
            />
            <span className="font-medium">Departures</span>
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
            <input
              type="checkbox"
              className="accent-[color:var(--kfia-brand)]"
              checked={showArrs}
              onChange={(e) => setShowArrs(e.target.checked)}
            />
            <span className="font-medium">Arrivals</span>
          </label>
          <button
            type="button"
            className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-neutral-800 hover:text-neutral-900"
            aria-haspopup="listbox"
            aria-expanded="false"
          >
            <Calendar className="w-4 h-4" />
            {dateLabel}
            <ChevronDown className="w-4 h-4 opacity-80" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <ul className="divide-y divide-neutral-200 border-b">
          {quickFlights.map((f) => (
            <li key={f.code} className="flex items-center justify-between py-2.5">
              <div className="text-[13px] text-neutral-500 w-16">{f.t}</div>
              <div className="flex-1 text-sm text-neutral-800">{f.city}</div>
              <div className="flex items-center gap-2 text-[13px] text-[color:var(--kfia-brand)] font-medium">
                {f.code}
                <ArrowUpRight className="w-4 h-4" aria-hidden />
              </div>
            </li>
          ))}
        </ul>

        <section className="pt-3">
          <h4 className="text-[10px] font-semibold tracking-wider text-neutral-400">ALL FLIGHTS TO</h4>
          <ul className="mt-2 space-y-1.5">
            {allTo.map((d) => (
              <li key={d} className="text-[13px] text-neutral-800">{d}</li>
            ))}
          </ul>
        </section>

        <section className="pt-4">
          <h4 className="text-[10px] font-semibold tracking-wider text-neutral-400">ALL FLIGHTS WITH</h4>
          <ul className="mt-2 space-y-1.5">
            {allWith.map((a) => (
              <li key={a} className="text-[13px] text-neutral-800">{a}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}