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
    "px-4 py-2 rounded-xl font-semibold text-sm transition text-center min-w-[120px]";
  const active = "bg-[color:var(--kfia-brand)] text-white";
  const idle =
    "bg-white text-[color:var(--kfia-brand)] border border-[color:var(--kfia-brand)]/20 hover:bg-[color:var(--kfia-brand)]/10";

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