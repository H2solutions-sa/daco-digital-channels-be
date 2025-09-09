"use client";

import { useEffect, useRef, useState } from "react";


export function useAutoMobile(minTableWidth = 1000, deps: unknown[] = []) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [forceMobile, setForceMobile] = useState<boolean>(false); // mobile-first to avoid SSR mismatch

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const compute = () => {
      const containerWidth = el.clientWidth;
      // Tablet requirement: show mobile for tablets too (commonly <1024).
      // Using minTableWidth as the single threshold covers both.
      setForceMobile(containerWidth < minTableWidth);
    };

    // Initial + observe
    compute();

    const ro = new ResizeObserver(compute);
    ro.observe(el);

    // Fallback in case something outside RO changes layout
    window.addEventListener("resize", compute);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minTableWidth, ...deps]);

  return { wrapperRef, forceMobile };
}