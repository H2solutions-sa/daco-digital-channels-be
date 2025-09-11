"use client";

import { useEffect, useRef, useState } from "react";

export function useShouldForceMobile(threshold = 980) {
  const ref = useRef<HTMLDivElement>(null);
  const [forceMobile, setForceMobile] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setForceMobile(el.clientWidth < threshold)
    );
    ro.observe(el);
    setForceMobile(el.clientWidth < threshold);
    return () => ro.disconnect();
  }, [threshold]);

  return { ref, forceMobile };
}