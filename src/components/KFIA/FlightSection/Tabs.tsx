"use client";
import { PlaneLanding, PlaneTakeoff } from "lucide-react";
import { useI18n } from "next-localization";

type Tab = "arrivals" | "departures";
export default function Tabs({
  tab,
  setTab,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
}) {
const {t} = useI18n();

  return (
    <div role="tablist" aria-label="Arrivals and departures" className="kfia-tabs mt-6">
      <button
        role="tab"
        aria-selected={tab === "arrivals"}
        onClick={() => setTab("arrivals")}
        className="kfia-tab"
      >
        <PlaneLanding className="w-[18px] h-[18px]" aria-hidden="true" />
        {t("arrivals-tab")}
      </button>
      <button
        role="tab"
        aria-selected={tab === "departures"}
        onClick={() => setTab("departures")}
        className="kfia-tab"
      >
        <PlaneTakeoff className="w-[18px] h-[18px]" aria-hidden="true" />
        {t("departures-tab")}
      </button>
    </div>
  );
}