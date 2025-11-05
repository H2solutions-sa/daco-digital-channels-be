"use client";

import Link from "next/link";
import React from "react";
import { Search, X, CornerDownLeft } from "lucide-react";
import {
  flights as NAV_FLIGHTS,
  parkingTransport,
  shopDine,
  facilitiesServices,
  guide,
} from "./NavData";

/* ─────────────────────────── Types ─────────────────────────── */

type SearchItem = {
  href: string; 
  label: string;
  section?: string;       // e.g., "Flights", "Facilities & Services"
  keywords?: string[];    // synonyms, tags
  priority?: number;      // higher shows earlier (default 0)
};

type AsyncSource = () => Promise<SearchItem[]>;

/* ───────────────────── Helper: Normalize Text ───────────────────── */

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
   // .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(s: string): string[] {
  return normalize(s).split(" ").filter(Boolean);
}

/* ────────────────────── Build Base Index (Static) ────────────────────── */
/** Flatten your existing app sections into SearchItem[] */
function mapNavBlock(
  section: string,
  items: Array<{ label: string; href: string }>
): SearchItem[] {
  return items.map((i) => ({
    href: i.href,
    label: i.label,
    section,
    keywords: [],
  }));
}

function buildStaticIndex(): SearchItem[] {
  const core: SearchItem[] = [
    ...mapNavBlock("Flights", NAV_FLIGHTS),
    ...mapNavBlock("Parking & Transport", parkingTransport),
    ...mapNavBlock("Shop & Dine", shopDine),
    ...mapNavBlock("Facilities & Services", facilitiesServices),
    ...mapNavBlock("Guide", guide),
    // Add any always-on pages here:
    { href: "/contact", label: "Contact Us", section: "General", keywords: ["support", "helpdesk"] },
    { href: "/airlines", label: "Airlines", section: "Flights", keywords: ["carriers", "operators"] },
  ];

  // Optional curated priorities (e.g., main entry points bubble up)
  for (const it of core) {
    if (/^\/flights(\/|$)/.test(it.href)) it.priority = 2;
    else if (/^\/facilities(\/|$)/.test(it.href)) it.priority = 1;
    else it.priority = 0;
  }
  return core;
}

/* ────────────────────── Dynamic Sources (Examples) ────────────────────── */
/**
 * Plug real data here (e.g., live flights, shops, facilities).
 * Keep them fast and small; we only need slim SearchItem[].
 *
 * Example ideas (uncomment & implement):
 *
 * const fetchLiveFlights: AsyncSource = async () => {
 *   const res = await fetch("/api/flights?q=" + encodeURIComponent(currentQuery));
 *   const data = await res.json(); // [{ flightNo, to, gate, href }, ...]
 *   return data.map((f: any) => ({
 *     href: f.href,
 *     label: `${f.flightNo} → ${f.to}`,
 *     section: "Live Flights",
 *     keywords: [f.gate, f.to, f.flightNo],
 *     priority: 3,
 *   }));
 * };
 *
 * const fetchFacilities: AsyncSource = async () => {
 *   const res = await fetch("/api/facilities");
 *   const data = await res.json(); // [{ name, type, href, tags }, ...]
 *   return data.map((x: any) => ({
 *     href: x.href,
 *     label: x.name,
 *     section: "Facilities & Services",
 *     keywords: [x.type, ...(x.tags || [])],
 *     priority: 1,
 *   }));
 * };
 */

const DYNAMIC_SOURCES: AsyncSource[] = [
  // fetchLiveFlights,
  // fetchFacilities,
  // fetchShopsAndDining,
];

/* ───────────────────────── Scoring (Weighted) ───────────────────────── */
/**
 * Score recipe:
 *  - Hard match boosts:
 *      starts-with in label >> contains in label >> contains in keywords >> contains in section
 *  - Token coverage boosts (more tokens matched == better)
 *  - Static/dynamic priority adds weight
 *  - Light fuzziness: if no direct contains, allow 1-edit for short tokens (optional)
 */
function lightEditDistance(a: string, b: string): number {
  // very tiny Levenshtein for short tokens (guard against perf issues)
  if (a.length > 16 || b.length > 16) return 99;
  const dp = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

function scoreItem(qTokens: string[], it: SearchItem): number {
  const label = normalize(it.label);
  const section = normalize(it.section || "");
  const keys = normalize((it.keywords || []).join(" "));

  let score = 0;
  let covered = 0;

  for (const t of qTokens) {
    let tokenHit = false;

    // Label starts-with / contains
    if (label.startsWith(t)) {
      score += 30;
      tokenHit = true;
    } else if (label.includes(t)) {
      score += 18;
      tokenHit = true;
    } else if (keys.includes(t)) {
      score += 10;
      tokenHit = true;
    } else if (section.includes(t)) {
      score += 6;
      tokenHit = true;
    } else {
      // light fuzziness on label only (edit distance 1 or 2)
      const parts = label.split(" ");
      let fuzzy = false;
      for (const p of parts) {
        const d = lightEditDistance(t, p);
        if (d === 1) {
          score += 8;
          fuzzy = true;
          break;
        } else if (d === 2) {
          score += 4;
          fuzzy = true;
          break;
        }
      }
      tokenHit = fuzzy;
    }

    if (tokenHit) covered++;
  }

  // token coverage bonus
  score += covered * 3;

  // priority
  score += (it.priority || 0) * 5;

  // tiny boost for shorter labels (usually cleaner results)
  score += Math.max(0, 8 - Math.floor(it.label.length / 10));

  return score;
}

/* ─────────────────────────── Component ─────────────────────────── */

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [baseIndex] = React.useState<SearchItem[]>(() => buildStaticIndex());
  const [dynamicItems, setDynamicItems] = React.useState<SearchItem[]>([]);

  // Debounce user input
  const [debouncedQ, setDebouncedQ] = React.useState("");
  React.useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(q), 120);
    return () => clearTimeout(id);
  }, [q]);

  // Load dynamic sources (optional). Re-run on query if your APIs support q.
  React.useEffect(() => {
    let cancelled = false;
    if (!open) return;

    (async () => {
      if (!DYNAMIC_SOURCES.length) return setDynamicItems([]);
      // If your sources support query, pass debouncedQ to them.
      const chunks = await Promise.allSettled(DYNAMIC_SOURCES.map((fn) => fn()));
      if (cancelled) return;
      const merged: SearchItem[] = [];
      for (const c of chunks) {
        if (c.status === "fulfilled" && Array.isArray(c.value)) merged.push(...c.value);
      }
      setDynamicItems(merged);
    })();

    return () => {
      cancelled = true;
    };
  }, [open /*, debouncedQ */]); // ← include debouncedQ if sources are query-aware

  const allIndex = React.useMemo<SearchItem[]>(
    () => [...dynamicItems, ...baseIndex],
    [dynamicItems, baseIndex]
  );

  const results = React.useMemo(() => {
    const trimmed = debouncedQ.trim();
    if (!trimmed) {
      // sensible defaults when empty: take top by priority then alpha
      return allIndex
        .slice()
        .sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.label.localeCompare(b.label))
        .slice(0, 10);
    }
    const tokens = tokenize(trimmed);
    const scored = allIndex
      .map((it) => ({ it, s: scoreItem(tokens, it) }))
      .filter(({ s }) => s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.it);
    return scored;
  }, [debouncedQ, allIndex]);

  // Keyboard interactions
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const target = results[active];
        if (target) window.location.href = target.href;
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, active, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="mx-auto mt-4 w-full max-w-[880px] px-4">
        {/* Bar */}
        <div className="flex items-center gap-3 h-[56px] rounded-xl border border-gray-200 bg-white px-3 shadow-sm">
          <Search className="w-[18px] h-[18px] text-slate-500" />
          <input
            type="text"
            placeholder="Search flights, services, facilities, shops, guides…"
            className="flex-1 text-[16px] outline-none border-none font-sans placeholder:text-slate-400"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100" aria-label="Close search">
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-2 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No results. Try another term.</div>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={`${r.href}-${i}`}>
                  <Link
                    href={r.href}
                    className={`flex items-center justify-between px-4 py-3 text-[15px] ${
                      i === active ? "bg-slate-50" : "bg-white"
                    } hover:bg-slate-50`}
                    onMouseEnter={() => setActive(i)}
                    onClick={onClose}
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-slate-800 truncate">{r.label}</div>
                      <div className="text-xs text-slate-500">
                        {r.section || "General"}
                      </div>
                    </div>
                    <CornerDownLeft className="w-4 h-4 text-slate-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          Tip: Use ↑ ↓ and Enter. Press Esc to close.
        </div>
      </div>
    </div>
  );
}