"use client";

import { useEffect, useMemo, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";
import { useI18n } from "next-localization";
import DestinationsSearch from "./DestinationsSearch";
import MapLegend from "./MapLegend";
import {
  ALL_DESTINATIONS,
  BRAND_PURPLE,
  DMM,
  LAVENDER,
  LIGHT,
  SECONDARY_BLUE,
  type Destination,
} from "./destinations.data";

/* Small stat card */
function CardStat({
  iconSrc,
  value,
  label,
  tone = "brand",
}: {
  iconSrc: string;
  value: number;
  label: string;
  tone?: "brand" | "teal" | "sky";
}) {
  const toneMap: Record<string, string> = {
    brand: "text-[color:var(--kfia-brand)]",
    teal: "text-teal-600",
    sky: "text-sky-600",
  };

  return (
    <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm px-4 py-4 sm:px-5 sm:py-5 xl:px-6 xl:py-6 flex items-center gap-4 sm:gap-5">
      <div className="shrink-0 grid h-10 w-10 sm:h-12 sm:w-12 place-items-center">
        <img src={iconSrc} alt="" aria-hidden className="h-10 w-10 sm:h-12 sm:w-12" draggable={false} />
      </div>
      <div className="min-w-0">
        <div className={`leading-[1.05] font-semibold ${toneMap[tone]} text-[32px] sm:text-[38px] xl:text-[50px] tracking-tight`}>
          {value}
        </div>
        <div className="text-slate-700 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[length:var(--paragraph1-size)]">
          {label}
        </div>
      </div>
    </div>
  );
}

type Props = {
  destinations?: Destination[];
  className?: string;
  height?: number;
  anchorId?: string;
};

export default function DestinationsMap({
  destinations,
  className = "",
  height = 680,
  anchorId = "destinations",
}: Props) {
  const data = (destinations?.length ? destinations : ALL_DESTINATIONS).slice();
  const {t} = useI18n();
  const mapRef = useRef<any>(null);
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<Record<string, any>>({});

  const domesticCount = useMemo(
    () => data.filter((d) => d.country === "Saudi Arabia").length,
    [data]
  );
  const internationalCount = data.length - domesticCount;
  const totalCount = data.length;

  // ✅ Leaflet setup with safe dynamic import
  useEffect(() => {
    if (typeof window === "undefined") return;

    let map: any;
    let L: any;

    (async () => {
      const leaflet = await import("leaflet");
      L = leaflet;

      if (!mapElRef.current) return;

      map = L.map(mapElRef.current, { zoomControl: false }).setView([DMM.lat, DMM.lng], 5);
      mapRef.current = map;

      L.tileLayer(LIGHT.url, { attribution: LIGHT.attr, maxZoom: 18 }).addTo(map);

      const ctrl = mapElRef.current.querySelector(".leaflet-control-container") as HTMLElement | null;
      if (ctrl) ctrl.style.zIndex = "30";

      L.circleMarker([DMM.lat, DMM.lng], {
        radius: 7,
        color: BRAND_PURPLE,
        fillColor: BRAND_PURPLE,
        fillOpacity: 1,
        weight: 2,
      })
        .addTo(map)
        .bindTooltip("KFIA (DMM)");

      const store: Record<string, any> = {};
      const bounds = L.latLngBounds([DMM.lat, DMM.lng], [DMM.lat, DMM.lng]);

      data.forEach((d) => {
        const destLatLng = L.latLng(d.lat, d.lng);
        bounds.extend(destLatLng);

        const line = L.polyline(
          [
            [DMM.lat, DMM.lng],
            [d.lat, d.lng],
          ],
          { color: LAVENDER, weight: 1.8, opacity: 0.85 }
        ).addTo(map);

        const marker = L.circleMarker(destLatLng, {
          radius: 6,
          color: SECONDARY_BLUE,
          fillColor: SECONDARY_BLUE,
          fillOpacity: 0.95,
          weight: 1,
        }).addTo(map);

        const popupHtml = `<div style="min-width:190px">
            <b>DMM → ${d.code}</b><br/>
            ${d.city}, ${d.country}<br/>
            <i>Airlines:</i> ${d.airlines.join(", ")}
          </div>`;

        marker.on("mouseover", () => {
          marker.bindPopup(popupHtml, { autoPan: true });
          marker.openPopup();
          line.setStyle({ weight: 2.8 });
        });
        marker.on("mouseout", () => {
          marker.closePopup();
          line.setStyle({ weight: 1.8 });
        });

        store[d.code.toUpperCase()] = { marker, line, data: d };
      });

      markersRef.current = store;
      map.fitBounds(bounds.pad(0.18));
    })();

    // ✅ Proper cleanup to prevent `_leaflet_pos` errors
    return () => {
      try {
        if (mapRef.current) {
          mapRef.current.off();
          mapRef.current.stop();
          mapRef.current.remove();
        }
      } catch (err) {
        console.warn("Leaflet cleanup error:", err);
      } finally {
        mapRef.current = null;
      }
    };
  }, [data]);

  const goTo = (dest: Destination) => {
    const map = mapRef.current;
    if (!map || !map._loaded) return;

    const rec = markersRef.current[dest.code.toUpperCase()];
    if (!rec) return;

    map.flyTo([dest.lat, dest.lng], 6, { duration: 0.8 });
    map.once("moveend", () => {
      const L = mapRef.current?.constructor; // use existing Leaflet ref
      if (!L) return;
      const html = `<div style="min-width:190px">
          <b>DMM → ${dest.code}</b><br/>
          ${dest.city}, ${dest.country}<br/>
          <i>Airlines:</i> ${dest.airlines.join(", ")}
        </div>`;
      L.popup({ autoPan: true, closeButton: true })
        .setLatLng([dest.lat, dest.lng])
        .setContent(html)
        .openOn(map);
      rec.line.setStyle({ weight: 3 });
      setTimeout(() => rec.line.setStyle({ weight: 1.8 }), 1200);
    });
  };

  const zoomIn = () => mapRef.current?.zoomIn();
  const zoomOut = () => mapRef.current?.zoomOut();
  const refit = () => {
    const map = mapRef.current;
    if (!map || !map._loaded) return;
    const L = map.constructor;
    const b = L.latLngBounds([DMM.lat, DMM.lng], [DMM.lat, DMM.lng]);
    data.forEach((d) => b.extend([d.lat, d.lng]));
    map.fitBounds(b.pad(0.18));
  };

  return (
    <section id={anchorId} className={`${className} kfia-content kfia-section`}>
      <div className="pt-0 -mt-8 md:-mt-12">
        <div className="relative mx-auto max-w-[1200px] px-4 pt-10">
          <div className="text-center mb-10">
            <h1
              className="font-semibold tracking-tight text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px]"
              style={{ color: "var(--kfia-brand)", lineHeight: 1.1 }}
            >
              {t('flight-destinations')}
            </h1>
            <p className="kfia-subtitle mt-2 text-neutral-600 text-[14px] sm:text-[15px] md:text-[16px] lg:text-[length:var(--paragraph1-size)]">
             {t('destinations-subtitle')}
            </p>
          </div>

          <div className="mx-auto max-w-[1200px]">
            <div style={{ ["--button-size" as any]: "16px" }}>
              <DestinationsSearch
                data={data}
                onSelect={goTo}
                className="w-full [&_button]:text-[var(--button-size)] [&_button]:text-white"
              />
            </div>
            <div className="mt-2 mb-6 flex items-center gap-1 leading-none text-slate-600 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[length:var(--paragraph3-size)]">
              <MapPin className="h-3.5 w-3.5 opacity-70" />
              <span>{t('dest-search-hint')}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-[360px_minmax(0,1fr)] items-stretch">
            <aside className="flex flex-col h-full overflow-hidden rounded-2xl border border-slate-200 bg-[#F5F5F6] shadow-sm order-2 xl:order-1">
              <div className="flex items-center justify-center border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
                <h3
                  className="font-semibold text-center"
                  style={{ color: "var(--kfia-brand)", fontSize: "var(--heading6-size)" }}
                >
                  {t('destinations-overview')}
                </h3>
              </div>
              <div className="flex flex-col flex-1 gap-4 sm:gap-5 p-4 sm:p-6">
                <CardStat iconSrc="/-/media/Project/Daco-Digital-Channels/Icons/destinations/total-globe-pin.svg" value={totalCount} label={t('total-destinations')} tone="brand" />
                <CardStat iconSrc="/-/media/Project/Daco-Digital-Channels/Icons/destinations/saudi-outline-teal.svg" value={domesticCount} label={t('domestic')} tone="teal" />
                <CardStat iconSrc="/-/media/Project/Daco-Digital-Channels/Icons/destinations/earth-blue.svg" value={internationalCount} label={t('International')} tone="sky" />
              </div>
            </aside>

            <div className="flex flex-col gap-3 order-1 xl:order-2">
              <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-16 sm:h-20 xl:h-24 bg-gradient-to-b from-white/60 to-transparent" />
                <div className="w-full [--map-h:65vh] xl:[--map-h:680px]" ref={mapElRef} style={{ height: "var(--map-h)" }} />
                <MapLegend />

                <div className="pointer-events-auto absolute left-3 bottom-3 z-[2000] flex items-center gap-2 xl:left-4 xl:bottom-4">
                  <button
                    type="button"
                    onClick={zoomIn}
                    className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-[color:var(--kfia-brand)] shadow-sm hover:bg-slate-50"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={zoomOut}
                    className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-[color:var(--kfia-brand)] shadow-sm hover:bg-slate-50"
                    aria-label="Zoom out"
                  >
                    –
                  </button>
                  <button
                    type="button"
                    onClick={refit}
                    className="grid h-10 w-10 place-items-center rounded-xl bg-[color:var(--kfia-brand)] text-white shadow-sm hover:opacity-95"
                    aria-label="Recenter map"
                  >
                    <Navigation className="h-5 w-5" />
                  </button>
                </div>

                <div className="sr-only">Interactive destination map. Drag to pan, scroll to zoom.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
