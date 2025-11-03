import React, { JSX, useEffect, useState } from "react";
import { MapPin, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Field } from "@sitecore-jss/sitecore-jss-nextjs";

/* --------------------------- Types --------------------------- */
type PriceItem = {
  fields: {
    name: Field<string>;
    price: Field<number>;
  };
};

type PriceList = {
  fields: {
    items: PriceItem[];
  };
    open: boolean;               // whether the modal is open
  onClose: () => void;
};

/* --------------------------- Pagination Bar --------------------------- */
function PaginationBar({
  index,
  total,
  onSelect,
  onPrev,
  onNext,
}: {
  index: number;
  total: number;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (total <= 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2 sm:gap-3">
      {/* Prev */}
      <button
        onClick={onPrev}
        aria-label="Previous page"
        disabled={index === 0}
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 grid place-items-center"
      >
        <ChevronLeft className="h-5 w-5 text-slate-700" />
      </button>

      {/* Page buttons */}
      <div className="flex items-center gap-1 rounded-full bg-slate-100 px-1.5 py-1 sm:px-2 sm:py-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const active = i === index;
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={[
                "px-3 h-9 sm:px-4 sm:h-10 rounded-xl text-[14px] sm:text-[15px] font-semibold transition",
                active
                  ? "bg-[color:var(--kfia-brand,#60498C)] text-white"
                  : "text-slate-600 hover:text-slate-800",
              ].join(" ")}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={onNext}
        aria-label="Next page"
        disabled={index === total - 1}
        className="h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-white shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 disabled:opacity-50 grid place-items-center"
      >
        <ChevronRight className="h-5 w-5 text-slate-700" />
      </button>
    </div>
  );
}

/* --------------------------- Modal --------------------------- */
export const Default = (props: PriceList): JSX.Element => {
  const [open, setOpen] = useState(false);
  const items = props.fields.items ?? [];
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  // Derived pagination values
  const pageCount = Math.max(1, Math.ceil(items.length / itemsPerPage));
  const paginatedItems = items.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage
  );

  const next = () => setPage((p) => Math.min(p + 1, pageCount - 1));
  const prev = () => setPage((p) => Math.max(p - 1, 0));

   useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-taxi-pricing", handler);
    return () => window.removeEventListener("open-taxi-pricing", handler);
  }, []);
  if (!open) return <></>;

  return (
    <div className="fixed inset-0 z-50">
      <button onClick={() => setOpen(false)} aria-label="Close" className="absolute inset-0 bg-black/50" />

      <div className="absolute inset-0 grid place-items-center p-[max(12px,env(safe-area-inset-top))] sm:p-5">
        <div
          className={[
            "relative bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col",
            "w-[min(92vw,700px)]",
            "max-h-[92vh] supports-[height:100dvh]:max-h-[calc(100dvh-24px)]",
          ].join(" ")}
        >
          {/* Header */}
          <div className="relative px-4 sm:px-5 py-4 sm:py-5 text-center text-white bg-[color:var(--kfia-brand,#60498C)]">
            <h3 className="text-[18px] sm:text-[20px] md:text-[22px] font-semibold leading-tight">
              King Fahd International Airport
            </h3>
            <p className="mt-1 text-[12px] sm:text-[13px] tracking-wide opacity-90">
              AIRPORT TAXI PRICE LIST
            </p>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-2.5 top-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div
            className="flex-1 overflow-auto px-4 sm:px-5 py-4 sm:py-5"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {paginatedItems.length === 0 ? (
              <p className="text-center text-slate-500 text-sm">
                No price data found.
              </p>
            ) : (
              <ul className="grid gap-2 sm:gap-2.5">
                {paginatedItems.map((row, i) => (
                  <li
                    key={i}
                    className="flex items-start sm:items-center justify-between gap-3 rounded-xl border border-slate-200 px-3 py-2.5 sm:px-4"
                  >
                    <div className="flex-1 min-w-0 flex items-start sm:items-center gap-2 sm:gap-3 text-[13px] sm:text-[14px] text-slate-900">
                      <MapPin className="h-[16px] w-[16px] sm:h-[18px] sm:w-[18px] text-slate-500 shrink-0" />
                      <span className="leading-tight break-words hyphens-auto">
                        {row.fields.name?.value}
                      </span>
                    </div>
                    <div className="shrink-0 text-right text-[12px] sm:text-[13px] text-slate-700 leading-tight">
                      <span className="font-semibold text-slate-900">
                        {row.fields.price?.value}
                      </span>{" "}
                      <span className="uppercase text-slate-500">SR</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer Pagination */}
          <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-white">
            <PaginationBar
              index={page}
              total={pageCount}
              onSelect={setPage}
              onPrev={prev}
              onNext={next}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
