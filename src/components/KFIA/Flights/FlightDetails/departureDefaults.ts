export type DepartureStepInfo = {
  id: string;
  title: string;
  details?: string;
  expandable?: boolean;
  timeLabel?: string; // optional; dynamic value will overwrite this
};

export const DEPARTURE_DEFAULTS: DepartureStepInfo[] = [
  {
    id: "ready",
    title: "Get ready to journey",
    details:
      "Have your passport, ticket/booking, and any required visas ready. Allow extra time during peak periods.",
    expandable: true,
  },
  {
    id: "transport",
    title: "Transport & parking",
    details:
      "Choose from short-term/long-term parking, taxis, ride-hail, or public transport to reach the terminal.",
    expandable: true,
  },
  {
    id: "presec",
    title: "Pre-Security Zone Amenities",
    details:
      "Before security you’ll find ticketing, information desks, ATMs, telecom services, and select dining/retail.",
    expandable: true,
  },
  {
    id: "checkin",
    title: "Check-in and baggage",
    details:
      "Check in at your airline counter or kiosk, tag your bags, and verify travel documents.",
    expandable: true,
  },
  {
    id: "walk-to-security",
    title: "Walk to Security",
    details: "5 minutes walk",
    expandable: false,
  },
  {
    id: "security",
    title: "Security",
    details:
      "Proceed through security screening. Remove large electronics and follow staff instructions.",
    expandable: true,
  },
  {
    id: "walk-to-gate",
    title: "Walk to Gate",
    details: "15 minutes walk to your gate",
    expandable: false,
  },
  {
    id: "relax",
    title: "Commercial & Relax zones",
    details:
      "Use lounges, prayer rooms, dining, and shops near your gate. Monitor the screens for updates.",
    expandable: true,
  },
  {
    id: "boarding",
    title: "Boarding",
    details:
      "Arrive at the gate on time. Boarding typically closes 20 minutes before departure.",
    expandable: true,
  },
  {
    id: "departure",
    title: "Departure",
    details:
      "Have your boarding pass and ID ready for final checks. Bon voyage!",
    expandable: true,
  },
];