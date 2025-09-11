export type FlightsApiResponse = {
  CURRENT_TIME: string; // ISO
  FLIGHTS: FlightApi[];
};

// lib/flights/types.ts
export type FlightApi = {
  num: number;
  id: number;
  INT_DOM: "I" | "D";
  ARR_DEP: "A" | "D";
  FL_STATUS_1: string;
  AIRLINE: string;
  AIRLINE_DESCR: string;
  FL_NUMBER: string;
  SCH_TIME: string;
  EST_TIME: string | null;
  ROUTING: string;
  ROUTING_ENG: string;
  VIA?: string | null;
  GATE_1?: string | null;
  CHECKIN_1?: string | null;
  AIRLINE_LOGO?: string | null;

  // add these two (they’re in your sample JSON)
  PUB_RMK?: string | null;
  PUB_RMK_ENG?: string | null;
};

// Your homepage mini-table row
export type MiniRow = {
  flight: string;        // "SV 1141"
  airlineLogo: string;   // /airlines/sv.png or similar
  destination: string;   // "Riyadh (RUH)"
  sch: string;           // "11:00"
  status: "LANDED" | "LATE" | "ON TIME" | "CANCELLED";
  gate?: string;
  counter?: string;
};