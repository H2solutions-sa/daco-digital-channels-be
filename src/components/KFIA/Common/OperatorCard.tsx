"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

type Props = {
  logoSrc: string;
  alt: string;
  phone: string;
  level?: string;
  /** You can override these if needed elsewhere */
  minHeightClass?: string;
  imageHeightClass?: string;
  className?: string;
};

export default function OperatorCard({
  logoSrc,
  alt,
  phone,
  level = "Arrival Level",
  // Mobile-first: smaller min height on xs; grows up
  minHeightClass = "min-h-[280px] sm:min-h-[340px] md:min-h-[380px]",
  imageHeightClass = "h-[130px] sm:h-[160px] md:h-[190px]",
  className = "",
}: Props) {
  return (
    <article
      className={[
        "flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50",
        "p-4 sm:p-5 md:p-6",
        minHeightClass,
        className,
      ].join(" ")}
    >
      {/* Logo */}
      <div className={`relative mx-auto w-full ${imageHeightClass}`}>
        <Image src={logoSrc} alt={alt} fill className="object-contain" />
      </div>

      {/* Meta */}
      <dl
        className={[
          "mt-4 sm:mt-5 md:mt-6",
          "space-y-4 sm:space-y-5 md:space-y-6",
          "text-[14px] sm:text-[15px] leading-6",
        ].join(" ")}
      >
        {/* Phone — allow wrapping + safe breaking */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-x-3 text-slate-900">
          <span className="text-slate-500 pr-0.5 sm:pr-1">Phone:</span>
          <a
            href={`tel:${phone}`}
            className="font-medium hover:underline break-all"
          >
            {phone}
          </a>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-900">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[color:var(--kfia-brand)]" />
          <span className="font-medium">{level}</span>
        </div>
      </dl>
    </article>
  );
}