/* =================================================================== */
/* DesktopDropdown.tsx                                                 */
/* =================================================================== */
"use client";
import { ChevronDown } from "lucide-react";
import type { MenuItem } from "./types";
import React from "react";

/** Detect hoverable (desktop/tablets with pointer) vs coarse touch (phones). */
function useHoverable() {
  const [hoverable, setHoverable] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setHoverable(!!mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return hoverable;
}

export function DesktopDropdown({
  title,
  items,
  isOpen,
  onToggle,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
  containerRef,
}: {
  title: string;
  items: MenuItem[];
  isOpen: boolean;
  onToggle: () => void;
  onItemClick: (href: string, e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const hoverable = useHoverable();

  const Label = (
    <button
      type="button"
      onClick={hoverable ? (e) => e.preventDefault() : onToggle}
      className="group inline-flex items-center gap-1 px-2 py-1.5 xl:px-3 xl:py-2 rounded-md whitespace-nowrap touch-manipulation"
      aria-haspopup="menu"
      aria-expanded={isOpen}
    >
      {/* Text with underline + purple hover */}
      <span className="relative transition-colors group-hover:text-[color:var(--kfia-lavender)]">
        {title}
        <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[color:var(--kfia-lavender)] scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
      </span>

      {/* Arrow stays outside */}
      <ChevronDown
        className={`w-4 h-4 translate-y-[1px] text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );

  return (
    <div
      className="relative flex items-center flex-none"
      ref={containerRef}
      onMouseEnter={hoverable ? onMouseEnter : undefined}
      onMouseLeave={hoverable ? onMouseLeave : undefined}
    >
      {Label}

      {isOpen && (
        <div className="absolute top-full left-0 pt-2 z-40">
          <ul
            className="w-[300px] xl:w-[320px] rounded-md border border-slate-200 bg-white shadow-md overflow-hidden font-sans font-normal"
            role="menu"
          >
            {items.map((it) => (
              <li key={it.href} role="none">
                <a
                  href={it.href}
                  role="menuitem"
                  onClick={(e) => onItemClick(it.href, e)}
                  className="block px-4 py-2.5 xl:py-3 text-[15px] whitespace-nowrap transition-all duration-200 hover:bg-slate-50 hover:text-[color:var(--kfia-lavender)] hover:font-semibold hover:border-l-4 hover:border-[color:var(--kfia-lavender)]"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}