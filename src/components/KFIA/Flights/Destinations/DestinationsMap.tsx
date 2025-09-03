"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

/* -------------------------------- Types ---------------------------------- */

export type Destination = {
  code: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  airlines: string[];
};

type Props = {
  destinations?: Destination[];
  className?: string;
  height?: number;             // default 700
  anchorId?: string;           // default "destinations" (for smooth scroll)
};

/* ---------------------------- KFIA anchor (DMM) --------------------------- */

const DMM = { lat: 26.4711, lng: 49.7979 };

/* ---------------------- Light/Dark basemap definitions -------------------- */

const LIGHT = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attr: '© OpenStreetMap © <a href="https://carto.com/attributions">CARTO</a>',
};
const DARK = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attr: '© OpenStreetMap © <a href="https://carto.com/attributions">CARTO</a>',
};

/* ------------------------------ Brand Colors ------------------------------ */
// Light blue for dots/markers (requested)
const SECONDARY_BLUE = "#4D9CD3";
// Lavender for lines (keeping brand feel)
const LAVENDER = "#7C6AA9";

/* ------------------------------ Destinations ------------------------------ */
/* Extend freely. These are common/likely routes around DMM; tweak as needed. */
export const ALL_DESTINATIONS: Destination[] = [
  // GCC + nearby
  { code: "DXB", city: "Dubai",          country: "UAE",            lat: 25.2528, lng: 55.3644, airlines: ["Emirates","flydubai","SAUDIA"] },
  { code: "AUH", city: "Abu Dhabi",      country: "UAE",            lat: 24.4330, lng: 54.6511, airlines: ["Etihad"] },
  { code: "SHJ", city: "Sharjah",        country: "UAE",            lat: 25.3286, lng: 55.5171, airlines: ["Air Arabia"] },
  { code: "DOH", city: "Doha",           country: "Qatar",          lat: 25.2736, lng: 51.6081, airlines: ["Qatar Airways"] },
  { code: "MCT", city: "Muscat",         country: "Oman",           lat: 23.5933, lng: 58.2844, airlines: ["Oman Air","SalamAir"] },
  { code: "KWI", city: "Kuwait City",    country: "Kuwait",         lat: 29.2266, lng: 47.9689, airlines: ["Kuwait Airways","Jazeera"] },
  { code: "BAH", city: "Manama",         country: "Bahrain",        lat: 26.2708, lng: 50.6336, airlines: ["Gulf Air","SAUDIA"] },

  // Saudi domestic
  { code: "RUH", city: "Riyadh",         country: "Saudi Arabia",   lat: 24.9576, lng: 46.6988, airlines: ["SAUDIA","flynas","flyadeal"] },
  { code: "JED", city: "Jeddah",         country: "Saudi Arabia",   lat: 21.6702, lng: 39.1528, airlines: ["SAUDIA","flyadeal","flynas"] },
  { code: "MED", city: "Madinah",        country: "Saudi Arabia",   lat: 24.5534, lng: 39.7051, airlines: ["SAUDIA","flynas"] },
  { code: "TUU", city: "Tabuk",          country: "Saudi Arabia",   lat: 28.3654, lng: 36.6189, airlines: ["SAUDIA","flynas"] },
  { code: "GIZ", city: "Jazan",          country: "Saudi Arabia",   lat: 16.9011, lng: 42.5858, airlines: ["SAUDIA","flynas"] },
  { code: "TIF", city: "Taif",           country: "Saudi Arabia",   lat: 21.4830, lng: 40.5443, airlines: ["SAUDIA","flynas"] },
  { code: "AHB", city: "Abha",           country: "Saudi Arabia",   lat: 18.2404, lng: 42.6566, airlines: ["SAUDIA","flynas"] },
  { code: "YNB", city: "Yanbu",          country: "Saudi Arabia",   lat: 24.1442, lng: 38.0634, airlines: ["SAUDIA"] },
  { code: "HOF", city: "Al-Ahsa",        country: "Saudi Arabia",   lat: 25.2853, lng: 49.4858, airlines: ["SAUDIA"] },

  // Middle East / Levant / Iraq / Iran
  { code: "AMM", city: "Amman",          country: "Jordan",         lat: 31.7226, lng: 35.9932, airlines: ["Royal Jordanian","flynas"] },
  { code: "BEY", city: "Beirut",         country: "Lebanon",        lat: 33.8209, lng: 35.4884, airlines: ["MEA"] },
  { code: "BGW", city: "Baghdad",        country: "Iraq",           lat: 33.2625, lng: 44.2346, airlines: ["Iraqi Airways","Fly Baghdad"] },
  { code: "NJF", city: "Najaf",          country: "Iraq",           lat: 31.9897, lng: 44.4043, airlines: ["Fly Baghdad","Iraqi Airways"] },
  { code: "EBL", city: "Erbil",          country: "Iraq",           lat: 36.2376, lng: 43.9632, airlines: ["Fly Baghdad","Iraqi Airways"] },
  { code: "IKA", city: "Tehran",         country: "Iran",           lat: 35.4161, lng: 51.1522, airlines: ["Mahan Air","Iran Air"] },
  { code: "MHD", city: "Mashhad",        country: "Iran",           lat: 36.2353, lng: 59.6409, airlines: ["Mahan Air"] },

  // Turkey / Azerbaijan / Caucasus
  { code: "IST", city: "Istanbul",       country: "Türkiye",        lat: 41.2753, lng: 28.7519, airlines: ["Turkish Airlines"] },
  { code: "SAW", city: "Istanbul SAW",   country: "Türkiye",        lat: 40.9050, lng: 29.3210, airlines: ["Pegasus"] },
  { code: "TZX", city: "Trabzon",        country: "Türkiye",        lat: 40.9966, lng: 39.7897, airlines: ["Pegasus"] },
  { code: "GYD", city: "Baku",           country: "Azerbaijan",     lat: 40.4675, lng: 50.0498, airlines: ["AZAL"] },
  { code: "TBS", city: "Tbilisi",        country: "Georgia",        lat: 41.6692, lng: 44.9547, airlines: ["Gulf Air (via)","others"] },

  // Egypt / North Africa
  { code: "CAI", city: "Cairo",          country: "Egypt",          lat: 30.1120, lng: 31.3990, airlines: ["EgyptAir","SAUDIA"] },
  { code: "HBE", city: "Alexandria Borg",country: "Egypt",          lat: 30.9177, lng: 29.6964, airlines: ["Air Arabia Egypt","SAUDIA"] },
  { code: "ATZ", city: "Assiut",         country: "Egypt",          lat: 27.0465, lng: 31.0117, airlines: ["Air Arabia Egypt"] },
  { code: "HMB", city: "Sohag",          country: "Egypt",          lat: 26.3430, lng: 31.7375, airlines: ["Air Arabia Egypt"] },
  { code: "SSH", city: "Sharm El-Sheikh",country: "Egypt",          lat: 27.9773, lng: 34.3949, airlines: ["EgyptAir"] },
  { code: "KRT", city: "Khartoum",       country: "Sudan",          lat: 15.5895, lng: 32.5532, airlines: ["Badr","Tarco"] },

  // Europe
  { code: "LHR", city: "London",         country: "United Kingdom", lat: 51.4700, lng: -0.4543, airlines: ["British Airways","SAUDIA"] },
  { code: "LGW", city: "London Gatwick", country: "United Kingdom", lat: 51.1537, lng: -0.1821, airlines: ["SAUDIA (seasonal)"] },
  { code: "FRA", city: "Frankfurt",      country: "Germany",        lat: 50.0379, lng: 8.5622,  airlines: ["Lufthansa","SAUDIA"] },
  { code: "MUC", city: "Munich",         country: "Germany",        lat: 48.3538, lng: 11.7861, airlines: ["Lufthansa"] },
  { code: "CDG", city: "Paris",          country: "France",         lat: 49.0097, lng: 2.5479,  airlines: ["Air France","SAUDIA"] },
  { code: "AMS", city: "Amsterdam",      country: "Netherlands",    lat: 52.3105, lng: 4.7683,  airlines: ["KLM"] },
  { code: "VIE", city: "Vienna",         country: "Austria",        lat: 48.1103, lng: 16.5697, airlines: ["Austrian"] },
  { code: "ZRH", city: "Zurich",         country: "Switzerland",    lat: 47.4647, lng: 8.5492,  airlines: ["Swiss"] },
  { code: "ATH", city: "Athens",         country: "Greece",         lat: 37.9364, lng: 23.9445, airlines: ["Aegean"] },

  // South Asia (some routes seasonal/connecting)
  { code: "DEL", city: "Delhi",          country: "India",          lat: 28.5562, lng: 77.1000, airlines: ["Indigo (via)","others"] },
  { code: "BOM", city: "Mumbai",         country: "India",          lat: 19.0896, lng: 72.8656, airlines: ["Indigo (via)","others"] },
  { code: "COK", city: "Kochi",          country: "India",          lat: 10.1518, lng: 76.4019, airlines: ["Indigo (via)"] },
  { code: "DAC", city: "Dhaka",          country: "Bangladesh",     lat: 23.8433, lng: 90.3978, airlines: ["Biman (via)"] },
];


/* -------------------------------- Component ------------------------------- */
export default function DestinationsMap({
  destinations,
  className = "",
  height = 700,
  anchorId = "destinations",
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [L, setL] = useState<any>(null); // store leaflet module
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const data = (destinations && destinations.length ? destinations : ALL_DESTINATIONS).slice();
  const tiles = useMemo(() => (theme === "dark" ? DARK : LIGHT), [theme]);

  // Import Leaflet only on the client
  useEffect(() => {
    (async () => {
      const leaflet = await import("leaflet");
      setL(leaflet);
    })();
  }, []);

  // Smooth scroll support
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === `#${anchorId}`) {
      requestAnimationFrame(() => {
        document.getElementById(anchorId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [anchorId]);

  // Map setup (runs only when Leaflet is loaded)
  useEffect(() => {
    if (!ref.current || !L) return;

    // Controls factory (moved inside to avoid L reference before load)
    function PanControl(opts: { onPan: (dx: number, dy: number) => void }) {
      return L.Control.extend({
        options: { position: "bottomright" as any },
        onAdd() {
          const wrap = L.DomUtil.create("div", "leaflet-bar kfia-pan-ctrl");
          wrap.style.display = "grid";
          wrap.style.gridTemplateColumns = "40px 40px 40px";
          wrap.style.gridTemplateRows = "40px 40px 40px";
          wrap.style.gap = "6px";

          const mkBtn = (label: string, title: string, onClick: () => void) => {
            const b = L.DomUtil.create("button", "kfia-ctrl-btn", wrap);
            b.type = "button";
            b.title = title;
            b.textContent = label;
            b.style.width = "40px";
            b.style.height = "40px";
            b.style.borderRadius = "9999px";
            b.style.background = "white";
            b.style.cursor = "pointer";
            L.DomEvent.on(b, "click", L.DomEvent.stop);
            L.DomEvent.on(b, "click", onClick);
            return b;
          };

          const empty = () => {
            const s = L.DomUtil.create("span", "", wrap);
            s.style.width = "40px";
            s.style.height = "40px";
            return s;
          };

          empty(); mkBtn("▲", "Pan up",   () => opts.onPan(0, -1)); empty();
          mkBtn("◀", "Pan left", () => opts.onPan(-1, 0)); empty();
          mkBtn("▶", "Pan right",() => opts.onPan( 1, 0)); empty();
          mkBtn("▼", "Pan down", () => opts.onPan(0,  1)); empty();
          return wrap;
        },
      });
    }

    function ToolsControl(opts: {
      theme: "light" | "dark";
      onToggleTheme: () => void;
      onFullscreen: () => void;
    }) {
      return L.Control.extend({
        options: { position: "bottomright" as any },
        onAdd() {
          const box = L.DomUtil.create("div", "leaflet-bar");
          box.style.display = "flex";
          box.style.flexDirection = "column";
          box.style.gap = "8px";
          const mk = (label: string, title: string, fn: () => void) => {
            const b = L.DomUtil.create("button", "kfia-ctrl-btn", box);
            b.type = "button";
            b.title = title;
            b.textContent = label;
            b.style.width = "40px";
            b.style.height = "40px";
            b.style.borderRadius = "9999px";
            b.style.background = "white";
            b.style.cursor = "pointer";
            L.DomEvent.on(b, "click", L.DomEvent.stop);
            L.DomEvent.on(b, "click", fn);
            return b;
          };
          mk(opts.theme === "dark" ? "🌙" : "☀️", "Toggle theme", opts.onToggleTheme);
          mk("⛶", "Fullscreen", opts.onFullscreen);
          return box;
        },
      });
    }

    // Init map
    const map = L.map(ref.current, { zoomControl: true }).setView([DMM.lat, DMM.lng], 5);
    (map.zoomControl as any).setPosition("topright");

    const tile = L.tileLayer(tiles.url, { attribution: tiles.attr, maxZoom: 18 }).addTo(map);

    // KFIA anchor marker
    const home = L.circleMarker([DMM.lat, DMM.lng], {
      radius: 6,
      color: "#5F488B",
      fillColor: "#5F488B",
      fillOpacity: 1,
      weight: 2,
    }).addTo(map);
    home.bindTooltip("KFIA (DMM)");

    const bounds = L.latLngBounds([DMM.lat, DMM.lng], [DMM.lat, DMM.lng]);
    const lines: any[] = [];

    data.forEach((d) => {
      const dest = L.latLng(d.lat, d.lng);
      bounds.extend(dest);

      const line = L.polyline([[DMM.lat, DMM.lng],[d.lat, d.lng]], {
        color: LAVENDER, weight: 1.6, opacity: 0.85,
      }).addTo(map);
      lines.push(line);

      const m = L.circleMarker(dest, {
        radius: 5, color: SECONDARY_BLUE, fillColor: SECONDARY_BLUE, fillOpacity: 0.95, weight: 1,
      }).addTo(map);

      const popup = `
        <div style="min-width:180px">
          <b>DMM → ${d.code}</b><br/>
          ${d.city}, ${d.country}<br/>
          <i>Airlines:</i> ${d.airlines.join(", ")}
        </div>
      `;
      m.bindPopup(popup);

      m.on("mouseover", () => { m.openPopup(); line.setStyle({ weight: 2.6 }); });
      m.on("mouseout", () => { m.closePopup(); line.setStyle({ weight: 1.6 }); });
    });

    map.fitBounds(bounds.pad(0.18));

    // Controls
    const Pan = PanControl({ onPan: (dx, dy) => map.panBy([dx * 120, dy * 120]) });
    map.addControl(new (Pan as any)());

    const Tools = ToolsControl({
      theme,
      onToggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      onFullscreen: () => {
        const el = ref.current!;
        if (!document.fullscreenElement) el.requestFullscreen?.();
        else document.exitFullscreen?.();
      },
    });
    map.addControl(new (Tools as any)());

    return () => { map.remove(); tile.remove(); lines.forEach((l) => l.remove()); };
  }, [L, tiles.url, tiles.attr, data, theme]);

  // ---- Totals footer ----
  const domesticCount = data.filter((d) => d.country === "Saudi Arabia").length;
  const internationalCount = data.length - domesticCount;
  const totalCount = data.length;

  return (
    <section className="scroll-mt-[96px] kfia-content kfia-section">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 md:px-7 py-4 border-b border-slate-200">
          <h2 className="text-[16px] md:text-[17px] font-semibold text-[color:var(--kfia-lavender)]">
            Destinations Map
          </h2>
        </div>

        <div className={className} id={anchorId}>
          <div ref={ref} style={{ height, width: "100%" }} />
          <div
            className="mt-3 md:mt-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm md:text-[15px] text-slate-800 flex flex-wrap items-center gap-x-4 gap-y-2"
            aria-live="polite"
          >
            <span className="font-semibold text-slate-900">Destinations</span>
            <span>Domestic: <b>{domesticCount}</b></span>
            <span>International: <b>{internationalCount}</b></span>
            <span className="text-slate-500">Total: <b>{totalCount}</b></span>
          </div>
        </div>
    </div>
    </section>
  );
}