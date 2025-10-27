"use client";

import { BRAND_PURPLE, LAVENDER, SECONDARY_BLUE } from "./destinations.data";

export default function MapLegend() {
  return (
    <div className="absolute left-3 top-3 z-[10]">
      <div className="rounded-xl border border-slate-200 bg-white/90 backdrop-blur px-3 py-2 text-[13px] text-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex h-2.5 w-2.5 rounded-full"
            style={{ background: BRAND_PURPLE }}
          />
          <span>KFIA (DMM)</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-block h-[10px] w-6 rounded-sm"
            style={{ background: LAVENDER }}
          />
          <span>Routes</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className="inline-flex h-2.5 w-2.5 rounded-full"
            style={{ background: SECONDARY_BLUE }}
          />
          <span>Destinations</span>
        </div>
      </div>
    </div>
  );
}