"use client";

type Tab = "arrivals" | "departures";

export function TabPills({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (t: Tab) => void;
}) {
  const base =
    "px-4 sm:px-5 py-2.5 rounded-xl font-semibold transition text-center min-w-[120px] sm:min-w-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--kfia-brand)]/40 text-[14px] sm:text-[16px] md:text-[18px] text-[color:var(--kfia-brand)] border border-[color:var(--kfia-brand)]/20 hover:bg-neutral-50";
  const active = "bg-[color:var(--kfia-brand)] text-white hover:bg-neutral-50 hover:text-[color:var(--kfia-brand)]";
  const idle =
    "bg-white text-[color:var(--kfia-brand)] border border-[color:var(--kfia-brand)]/20 hover:bg-neutral-50";

  return (
    <div className="inline-flex items-center gap-2 rounded-xl">
      <button
        className={`${base} ${value === "arrivals" ? active : idle}`}
        onClick={() => onChange("arrivals")}
      >
        ARRIVALS
      </button>
      <button
        className={`${base} ${value === "departures" ? active : idle}`}
        onClick={() => onChange("departures")}
      >
        DEPARTURES
      </button>
    </div>
  );
}