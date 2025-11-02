"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AirlineLogos } from "./logos";

export type AirlineLogoProps = {
  flightNo: string;
  airlineLogo?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function AirlineLogo({
  flightNo,
  airlineLogo,
  className,
  priority,
  sizes = "92px",
}: AirlineLogoProps) {
  const candidates = useMemo(
    () => AirlineLogos.candidates({ flightNo, airlineLogo }),
    [flightNo, airlineLogo]
  );
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];
  if (!src) return null;

  const isSvg = /\.svg$/i.test(src);
  const advance = () => setIdx((i) => (i + 1 < candidates.length ? i + 1 : i));

  return (
    <span
      className={[
        // ✅ block + mx-auto ensures true centering inside any container
        "relative block mx-auto h-6 w-[90px] sm:h-6 sm:w-[90px] md:h-7 md:w-[100px]",
        className ?? "",
      ].join(" ")}
    >
      {isSvg ? (
        <img
          src={src}
          alt={`${flightNo} airline logo`}
          className="block h-full w-full object-contain"
          width={100}
          height={28}
          loading={priority ? "eager" : "lazy"}
          onError={advance}
        />
      ) : (
        <Image
          src={src}
          alt={`${flightNo} airline logo`}
          fill
          sizes={sizes}
          className="object-contain"
          priority={priority}
          unoptimized
          onError={advance}
        />
      )}
    </span>
  );
}