"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Props = {
  /** Fallback id when there is no hash in the URL */
  defaultId?: string;         // e.g., "pt-body" or "guide-body"
  /** Pixels to offset for sticky headers (top bars) */
  offset?: number;            // e.g., 96
  /** Delay to wait for page content to render (ms) */
  delayMs?: number;           // default 50
};

export default function AutoHashScroll({
  defaultId = "",
  offset = 0,
  delayMs = 50,
}: Props) {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToId = (raw?: string | null) => {
      const id = raw && raw.startsWith("#") ? raw.slice(1) : raw;
      const targetId = id && id.length > 0 ? id : defaultId;
      if (!targetId) return;

      const el =
        document.getElementById(targetId) ||
        document.getElementById(decodeURIComponent(targetId));
      if (!el) return;

      // wait a tick for content to paint
      requestAnimationFrame(() => {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.pageYOffset - offset;

          // Move focus for a11y, but don't jump
          el.setAttribute("tabindex", "-1");
          (el as HTMLElement).focus({ preventScroll: true });

          window.scrollTo({ top, behavior: "smooth" });
        }, delayMs);
      });
    };

    // on route/path change
    scrollToId(window.location.hash);

    // on hash-only change (same page)
    const onHash = () => scrollToId(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [pathname, defaultId, offset, delayMs]);

  return null;
}