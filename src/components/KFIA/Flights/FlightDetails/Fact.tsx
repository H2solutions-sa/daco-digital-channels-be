"use client";
import { TILE } from "./design";

export default function Fact({
  label,
  value,
  icon,
  strong,
}: {
  label: React.ReactNode;          // allow rich labels
  value?: React.ReactNode;         // allow rich values
  icon: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className={`${TILE} flex items-center gap-3 px-5 py-4`}>
      <span className="text-neutral-500">{icon}</span>
      <div>
        {/* Title: 16px */}
        <p className="text-[16px] leading-tight text-neutral-600">
          {label}
        </p>

        {/* Data: 20px */}
        <p
          className={`text-[20px] ${strong ? "font-extrabold" : "font-semibold"} text-neutral-900`}
        >
          {value ?? "—"}
        </p>
      </div>
    </div>
  );
}