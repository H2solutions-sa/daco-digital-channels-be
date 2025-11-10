import { ArrivalBadgeKind } from "./types";
import { addMinutes, fmt24, parseTimeToDate } from "./helpers";

export type ArrivalStepInfo = {
  id: string;
  title: string;
  details?: string;
  expandable?: boolean;
  badgeKind?: ArrivalBadgeKind;
  badgeValue?: string; // e.g., "18:07", "45 min"
};

/** Timing config (relative to scheduled arrival) */
export const ARR_TIMING = {
  securityStartsAfterMin: 18,
  baggageExpectedAfterMin: 25,
  immigrationWaitingMin: 45,
};

export function buildArrivalJourney({
  arrivalISOorHHMM,
  destCity,
  destIata,
}: {
  arrivalISOorHHMM?: string;
  destCity?: string;
  destIata?: string;
}): ArrivalStepInfo[] {
  const base = parseTimeToDate(arrivalISOorHHMM);
  const arrivalTime = fmt24(base);
  const securityStart = fmt24(base ? addMinutes(base, ARR_TIMING.securityStartsAfterMin) : undefined);
  const baggageExpected = fmt24(base ? addMinutes(base, ARR_TIMING.baggageExpectedAfterMin) : undefined);

  const cityText = [destCity, destIata].filter(Boolean).join(" ");

  return [
    {
      id: "security",
      title: "Security",
      details:
        "Exit the aircraft and follow signs to the arrivals corridor. Security may perform random screening before immigration. Keep your travel documents handy.",
      badgeKind: securityStart ? "starts" : "none",
      badgeValue: securityStart,
      expandable: true,
    },
    {
      id: "ready",
      title: "Get ready to journey",
      details:
        "Switch on your phone if needed, gather your carry-ons, and confirm your onward plans (hotel pickup, ride-hail, public transit, or meeting point).",
      expandable: true,
    },
    {
      id: "arrival",
      title: `Arrival at Dammam (DMM)`,
      details:
        "Follow the “Arrivals/Immigration” signage. If you need assistance, ask airport staff or ambassadors in the concourse.",
      badgeKind: arrivalTime ? "time" : "none",
      badgeValue: arrivalTime,
      expandable: true,
    },
    {
      id: "immigration",
      title: "Immigration & passport control",
      details:
        "Join the appropriate queue (citizens, residents, or visitors). Have your passport, completed arrival form if required, and any visas ready. Biometric capture may be required.",
      badgeKind: "waiting",
      badgeValue: `${ARR_TIMING.immigrationWaitingMin} min`,
      expandable: true,
    },
    {
      id: "baggage",
      title: "Baggage pick-up",
      details:
        "Check the carousel screens for your flight. Use luggage trolleys where available. Report issues to the airline’s baggage service desk or lost & found near the belts.",
      badgeKind: baggageExpected ? "expected" : "none",
      badgeValue: baggageExpected,
      expandable: true,
    },
    {
      id: "customs",
      title: "Customs",
      details:
        "Proceed through the Green or Red channel according to your declarations. Be prepared for possible inspections and comply with rules on restricted items.",
      expandable: true,
    },
    {
      id: "arrival-amenities",
      title: "Arrival & service floor amenities",
      details:
        "Find information desks, ATMs, currency exchange, telecom SIM providers, car rentals, restrooms, prayer/quiet rooms, dining, and retail.",
      expandable: true,
    },
    {
      id: "welcome",
      title: "Welcome to arrivals hall",
      details:
        "Family, friends, and meet-and-assist services usually wait in the public arrivals hall. Look for your representative or signboard if arranged.",
      expandable: true,
    },
    {
      id: "onward",
      title: "Onward traveling",
      details:
        "Options typically include airport taxis, ride-hail, hotel shuttles, public transport, and private transfers. Confirm destination and fare before departing the curb.",
      expandable: true,
    },
  ];
}