import { parseTimeToDate, addMinutes, fmt24 } from "./helpers";
import type { DepartureStepInfo } from "./departureDefaults";

/** Minutes before scheduled departure for each milestone */
const DEP_TIMING = {
  checkin: 180,   // 3h before
  security: 130,  // 2h10m before
  relax: 45,      // 45m before
  boarding: 30,   // 30m before
  departure: 0,   // at sched
};

export function buildDepartureJourney({
  sched,
  base,
}: {
  sched?: string;
  base: DepartureStepInfo[];
}) {
  const dep = parseTimeToDate(sched);
  if (!dep) return base;

  const timeFor = (minsBefore: number) => fmt24(addMinutes(dep, -minsBefore));

  const times: Record<string, string> = {
    checkin: timeFor(DEP_TIMING.checkin),
    security: timeFor(DEP_TIMING.security),
    relax: timeFor(DEP_TIMING.relax),
    boarding: timeFor(DEP_TIMING.boarding),
    departure: timeFor(DEP_TIMING.departure),
  };

  return base.map((s) => ({
    ...s,
    timeLabel: times[s.id] ?? s.timeLabel,
  }));
}