"use client";
import { ChevronDown, Phone, X } from "lucide-react";
import type { MenuItem } from "./types";
import React from "react";

export function MobileDrawer({
  open,
  onClose,
  sections,
  onNavigate,
  emergencyHref,
}: {
  open: boolean;
  onClose: () => void;
  sections: { label: string; items: MenuItem[] }[];
  onNavigate: (href: string) => void;
  emergencyHref?: string;
}) {
  const [openIdx, setOpenIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    const body = document.body;
    const prev = body.style.overflow;
    if (open) body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className={`xl:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`absolute right-0 top-0 h-full w-[88%] sm:w-[80%] max-w-[420px] bg-white shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-slate-200">
          <span className="font-semibold">Menu</span>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 hover:bg-slate-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="p-2 overflow-y-auto h-[calc(100%-44px)]">
          <ul className="space-y-1">
            {sections.map((sec, i) => {
              const isOpen = openIdx === i;
              return (
                <li key={sec.label}>
                  <div className="flex items-center justify-between px-2.5 py-2.5 rounded-lg hover:bg-slate-50">
                    <span className="text-[15px] font-semibold">{sec.label}</span>
                    <button
                      type="button"
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 hover:bg-slate-100"
                    >
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Submenu */}
                  {isOpen && (
                    <ul className="mt-1 ml-2 border-l border-slate-200">
                      {sec.items.map((it) => (
                        <li key={it.href}>
                          <a
                            href={it.href}
                            onClick={(e) => {
                              e.preventDefault();
                              onClose();
                              onNavigate(it.href);
                            }}
                            className="
                              block px-4 py-2 text-[15px] transition-all duration-200
                              hover:text-[color:var(--kfia-lavender)]
                              hover:font-semibold
                              hover:border-l-4 hover:border-[color:var(--kfia-lavender)]
                              hover:bg-slate-50
                            "
                          >
                            {it.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}

            {/* Emergency button */}
            {emergencyHref && (
              <li className="pt-2">
                <a
                  href={emergencyHref}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[color:var(--kfia-brand)] text-white text-base font-semibold hover:opacity-90"
                >
                  <Phone className="w-[18px] h-[18px]" /> <span>Emergency</span>
                </a>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
}