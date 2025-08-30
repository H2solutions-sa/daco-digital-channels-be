// app/components/common/TabStrip.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export type Tab = { label: string; href: string };

export default function TabStrip({
  tabs,
  className = "",
}: {
  tabs: Tab[];
  className?: string;
}) {
  const pathname = usePathname();

  // Avoid SSR/CSR mismatches for "active" state
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const isActive = (href: string) => (mounted ? pathname?.startsWith(href) : false);

  return (
    <div className={className}>
      {/* Content-aligned wrapper: stable on SSR/CSR */}
      <div className="kfia-content">
        <nav aria-label="Section tabs" className="relative">
          {/* Left-aligned, scrollable on narrow screens */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
            {tabs.map((t) => {
              const active = isActive(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={[
                    "inline-flex whitespace-nowrap rounded-full px-4 sm:px-5 py-2 text-sm font-medium ring-1 ring-slate-300/60",
                    active
                      ? "bg-[color:var(--kfia-lavender)] text-white ring-transparent shadow-sm"
                      : "bg-white text-slate-800 hover:bg-slate-50",
                  ].join(" ")}
                >
                  {t.label}
                </Link>
              );
            })}
          </div>

          {/* Baseline divider that matches page content width */}
          <div className="h-px bg-slate-200/70" />
        </nav>
      </div>
    </div>
  );
}