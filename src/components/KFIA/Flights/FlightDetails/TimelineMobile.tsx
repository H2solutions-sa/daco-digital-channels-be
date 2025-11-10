"use client";

import { ChevronDown, ChevronUp, Clock, Footprints } from "lucide-react";
import TimeChip from "./TimeChip";
import StepIcon from "./StepIcon";
import { ArrivalBadgeKind, JourneyStep } from "./types";

export default function TimelineMobile({
  BORDER,
  TILE,
  presentedSteps,
  isArrival,
  open,
  setOpen,
  toggleAll,
  allOpen,
}: {
  BORDER: string;
  TILE: string;
  presentedSteps: Array<
    JourneyStep & { __badgeKind?: ArrivalBadgeKind; __badgeValue?: string; __timeLabel?: string }
  >;
  isArrival: boolean;
  open: Record<string, boolean>;
  setOpen: (fn: (p: Record<string, boolean>) => Record<string, boolean>) => void;
  toggleAll: () => void;
  allOpen: boolean;
}) {
  return (
    <div className="kfia-content px-3 max-w-[1100px] mx-auto mt-8 md:hidden">
      <div className={`${TILE}`}>
        {/* Top bar — mirrors desktop */}
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          {isArrival ? (
            <div className="flex items-center gap-2 text-[12px] text-neutral-500">
              <Footprints className="h-4 w-4" />
              <span>5 minutes walk</span>
            </div>
          ) : <span />}
          {presentedSteps.some((s) => s.expandable !== false) && (
            <button
              type="button"
              onClick={toggleAll}
              className={`inline-flex items-center gap-1 text-[12px] font-semibold text-neutral-700 hover:text-neutral-900 rounded-lg border ${BORDER} px-3 py-1.5`}
            >
              {allOpen ? <>Collapse All <ChevronUp className="h-4 w-4" /></>
                       : <>Expand All <ChevronDown className="h-4 w-4" /></>}
            </button>
          )}
        </div>

        {/* Same structure & spacing as desktop */}
        <ol className="relative px-6 pb-6">
          <div className="pointer-events-none absolute left-[calc(1.5rem+1.25rem)] top-0 bottom-0 w-[2px] bg-[#D6D9E8]" />
          {presentedSteps.map((step) => {
            const isWalk =
              step.id === "walk-to-security" ||
              step.id === "walk-to-gate" ||
              step.id === "arrival-walk";
            const isExpandable = step.expandable !== false && !isWalk;
            const isOpen = !!open[step.id];

            const badgeKind = step.__badgeKind as ArrivalBadgeKind | undefined;
            const badgeValue = step.__badgeValue as string | undefined;

            const arrivalChip = isArrival && badgeKind && badgeKind !== "none" ? (
              <TimeChip tone={badgeKind === "waiting" ? "amber" : "blue"}>
                {badgeKind === "time" && (<><Clock className="mr-1 h-3.5 w-3.5" />{badgeValue}</>)}
                {badgeKind === "starts" && <>Starts at {badgeValue}</>}
                {badgeKind === "expected" && <>Expected At {badgeValue}</>}
                {badgeKind === "waiting" && <>Waiting Time: {badgeValue}</>}
              </TimeChip>
            ) : null;

            const departureChip = !isArrival && step.__timeLabel ? (
              <TimeChip>
                <Clock className="mr-1 h-3.5 w-3.5" />
                {step.__timeLabel}
              </TimeChip>
            ) : null;

            return (
              <li key={step.id} className="relative flex items-center gap-3 py-3">
                <div className="shrink-0"><StepIcon id={step.id} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[16px] font-semibold text-neutral-900">{step.title}</p>
                      {isWalk && step.details && (
                        <p className="mt-1 text-[13px] text-neutral-500">{step.details}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {arrivalChip || departureChip}
                      {isExpandable && (
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpen((p) => ({ ...p, [step.id]: !p[step.id] }))}
                          className={`grid h-8 w-8 place-items-center rounded-md border ${BORDER} text-neutral-700 hover:bg-neutral-50`}
                        >
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpandable && isOpen && step.details && !isWalk && (
                    <div className="mt-3 text-[15px] leading-6 text-neutral-700">{step.details}</div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}