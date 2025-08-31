// app/(shell)/useScrollOrNavigate.ts
"use client";
import { useRouter } from "next/navigation";

const HASH_TO_SUBPAGE: Record<string, string> = {
  "#directions":     "/parking-transport/directions",
  "#parking":        "/parking-transport/parking",
  "#bus":            "/parking-transport/bus",
  "#taxi-car-service": "/parking-transport/taxi-car-service",
  "#car-rental":     "/parking-transport/car-rental",
  "#valet":          "/parking-transport/valet",
  "#pickup-dropoff": "/parking-transport/pickup-dropoff",
};

function normalizeParkingHref(href: string) {
  const BASE = "/parking-transport";

  // Default → directions
  if (href === BASE) return `${BASE}/directions#pt-body`;

  // Handle hash (#parking, #valet, etc.)
  if (href.startsWith(`${BASE}#`)) {
    const hash = href.slice(BASE.length);
    const sub = HASH_TO_SUBPAGE[hash];
    return sub ? `${sub}#pt-body` : `${BASE}/directions#pt-body`;
  }

  // Subpages without # → add it
  if (href.startsWith(`${BASE}/`) && !href.includes("#")) {
    return `${href}#pt-body`;
  }

  return href;
}

export function useScrollOrNavigate() {
  const router = useRouter();

  function scrollOrNavigate(href: string) {
    // In-page hash → smooth scroll
    if (href.startsWith("#")) {
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    const target = normalizeParkingHref(href);
    router.push(target, { scroll: false });
  }

  return { scrollOrNavigate };
}