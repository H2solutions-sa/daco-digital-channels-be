export type FlightApi = {
  num: number;
  id: number;
  INT_DOM: "I" | "D";
  ARR_DEP: "A" | "D";                 // A = Arrivals, D = Departures
  FL_STATUS_1: string;                // upstream status text
  AIRLINE: string;
  AIRLINE_DESCR: string;
  FL_NUMBER: string;
  SCH_TIME: string;                   // ISO
  EST_TIME: string | null;            // ISO or null
  ROUTING: string;                    // IATA
  ROUTING_ENG: string;                // City name
  VIA?: string | null;

  /** Departures */
  GATE_1?: string | null;
  CHECKIN_1?: string | null;

  /** Arrivals */
  BAGGAGE_1?: string | null;          // ⟵ carousel/belt number from AODB

  AIRLINE_LOGO?: string | null;
  PUB_RMK?: string | null;
  PUB_RMK_ENG?: string | null;
};

// Envelope from the flights endpoint
export type FlightsApiResponse = {
  CURRENT_TIME: string; // ISO
  FLIGHTS: FlightApi[];
};

// Row shape used by the homepage mini table
export type MiniRow = {
  flight: string;                     // "SV 1141"
  airlineLogo?: string;               // /airlines/sv.png or /airlines/api/xxx
  destination: string;                // "Riyadh (RUH)"
  sch: string;                        // "11:00"
  status: "LANDED" | "LATE" | "ON TIME" | "CANCELLED";
  gate?: string;                      // For arrivals this will contain the carousel number
  counter?: string;
};