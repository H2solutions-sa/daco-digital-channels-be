"use client";

import Image from "next/image";
//import { Share2 } from "lucide-react";
import type { Airline } from "./types";
//import { shareAirline } from "./share";

export default function MobileAirlineCard({ a }: { a: Airline }) {
  const siteLabel = a.fields.website?.value.href.replace(/^https?:\/\//, "");
  return (
    <div className="relative w-full rounded-2xl border border-neutral-200 bg-white p-3 sm:p-4 shadow-sm">
      {/* <button
        type="button"
        aria-label={`Share ${a.fields.name.value}`}
        onClick={() => shareAirline(a)}
        className="absolute right-2 top-2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
      >
        <Share2 className="h-4 w-4" />
      </button> */}

      <div className="flex items-center justify-between gap-3">
         <h3 className="text-[15px] sm:text-lg font-semibold text-neutral-900 line-clamp-2">
          {a.fields.name.value}
        </h3>
        <span className="relative inline-block h-5 w-[140px] sm:h-6 sm:w-[180px]">
          {a.fields.logo?.value?.src && (
          <Image src={a.fields.logo?.value.src} alt={`${a.fields.name.value} logo`} fill sizes="180px" className="object-contain" />
          )}
          </span>
       
      </div>

      <dl className="mt-2.5 sm:mt-3 space-y-1.5 sm:space-y-2 text-[13px] sm:text-[15px]">
        {a.fields.website?.value && (
          <div>
            <span className="text-neutral-500">Website: </span>
            <a className="font-medium underline-offset-2 hover:underline break-all" href={a.fields.website.value.href} target="_blank" rel="noopener noreferrer">
              {siteLabel}
            </a>
          </div>
        )}
        {a.fields.phone?.value && (
          <div>
            <span className="text-neutral-500">Phone: </span>
            <a className="font-medium tabular-nums" href={`tel:${a.fields.phone?.value}`}>{a.fields.phone?.value}</a>
          </div>
        )}
        {a.fields.email?.value && (
          <div>
            <span className="text-neutral-500">Email: </span>
            <a className="font-medium break-all" href={`mailto:${a.fields.email?.value}`}>{a.fields.email?.value}</a>
          </div>
        )}
      </dl>
    </div>
  );
}