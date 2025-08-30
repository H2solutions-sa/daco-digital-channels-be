"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

type BaseProps = {
  /** Header text shown in the summary row */
  title: React.ReactNode;
  /** Panel contents */
  children: React.ReactNode;
  /** Start open? (uncontrolled) */
  defaultOpen?: boolean;
  /** Controlled state (if you want to manage it yourself) */
  open?: boolean;
  /** Called when toggled (works for controlled/uncontrolled) */
  onToggle?: (open: boolean) => void;
  /** Extra classes for outer wrapper */
  className?: string;
};

/**
 * Single accordion with consistent KFIA styling.
 * - Uncontrolled by default (uses `defaultOpen`)
 * - Can be controlled by passing `open` and `onToggle`
 */
export default function Accordion({
  title,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
  className = "",
}: BaseProps) {
  const internalId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(v);
    onToggle?.(v);
  };

  return (
    <div className={`border border-slate-200 rounded-lg bg-white ${className}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`acc-panel-${internalId}`}
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#4D9CD3]" aria-hidden />
          <span className="font-medium text-slate-900">{title}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id={`acc-panel-${internalId}`}
          className="px-5 pb-4 pt-1 text-[15px] leading-7 text-slate-700"
        >
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Optional helper: render a list of items with one-liner config            */
/* ------------------------------------------------------------------------ */

export type AccordionItem = {
  title: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
};

export function AccordionGroup({
  items,
  className = "",
  allowMultiple = true,
}: {
  items: AccordionItem[];
  className?: string;
  /** If false, only one item stays open at a time */
  allowMultiple?: boolean;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((it, i) => {
        const controlled = !allowMultiple;
        const isOpen = controlled ? openIndex === i : undefined;

        return (
          <Accordion
            key={i}
            title={it.title}
            defaultOpen={it.defaultOpen && allowMultiple}
            open={controlled ? isOpen : undefined}
            onToggle={(v) => {
              if (!allowMultiple) setOpenIndex(v ? i : null);
            }}
          >
            {it.content}
          </Accordion>
        );
      })}
    </div>
  );
}