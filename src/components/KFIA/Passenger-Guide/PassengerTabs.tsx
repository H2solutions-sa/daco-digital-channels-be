import { JSX, useEffect, useState} from 'react';
import { ComponentParams, ComponentRendering, Placeholder } from '@sitecore-jss/sitecore-jss-nextjs';
import { useI18n } from 'next-localization';
interface PassengerTabsProps {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
}

export const Default = (props: PassengerTabsProps): JSX.Element => {
 
  const [mode, setMode] = useState<"arriving" | "departing">("arriving");
  const {t} = useI18n();
  useEffect(() => {
    const el = document.getElementById("guide-mode-live");
    if (el) el.textContent = `Showing ${mode} topics`;
  }, [mode]);



  return (
  <div className="kfia-content kfia-section pt-6 md:pt-10">
        <div
        role="tablist"
        aria-label="Passenger guide mode"
        className="flex items-center justify-center gap-2 sm:gap-3 mb-7 md:mb-8"
      >
        <button
          role="tab"
          aria-selected={mode === "arriving"}
          tabIndex={0}
          onClick={() => setMode("arriving")}
          onKeyDown={(e) => (e.key === "ArrowRight" ? setMode("departing") : undefined)}
          className={`px-4 py-2 rounded-full border text-sm font-semibold focus:outline-none focus-visible:ring-2
            ${mode === "arriving" 
              ? "bg-[color:var(--kfia-brand)] text-white border-transparent"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
        >
           {t("Arriving-Kfia")}
        </button>

        <button
          role="tab"
          aria-selected={mode === "departing"}
          tabIndex={0}
          onClick={() => setMode("departing")}
          onKeyDown={(e) => (e.key === "ArrowLeft" ? setMode("arriving") : undefined)}
          className={`px-4 py-2 rounded-full border text-sm font-semibold focus:outline-none focus-visible:ring-2
            ${mode === "departing"
              ? "bg-[color:var(--kfia-brand)] text-white border-transparent"
              : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50"}`}
        >
          {t("Departing-Kfia")}
        </button>
      </div>

      <section
        aria-label={mode === "arriving" ? "Arriving topics" : "Departing topics"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
      >
          {mode === "arriving" && (
            <Placeholder name="jss-kfia-arriving" rendering={props.rendering} />
          )}
          {mode === "departing" && (
            <Placeholder name="jss-kfia-departing" rendering={props.rendering} />
          )}

      </section>
    </div>
  );
};
