export type JourneyStep = {
  id: string;
  title: string;
  subtitle?: string;
  startsAtLabel?: string;
  details?: string;
  /** If false, the step won’t be expandable/collapsible */
  expandable?: boolean;
};

export type JourneyTimelineProps = {
  flight?: {
    sched?: string; // "HH:mm" or ISO-like string
    from?: string;
    to?: string;
    airlineLogo?: string;
    flightNo?: string;
    destinationLabel?: string; // city (for destination)
    gate?: string;
    date?: string;
    checkin?: string;
    status?: string;
    updated?: string;

    /** Explicitly force which journey mode to render */
    tab?: "arrivals" | "departures";
  };
  steps: JourneyStep[]; // used for Departures
  defaultOpen?: boolean;
};

export type ArrivalBadgeKind = "none" | "time" | "starts" | "expected" | "waiting";