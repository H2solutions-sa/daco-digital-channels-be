import type { FlightsApiResponse, FlightApi } from "./types";

const ENDPOINT =
  `${process.env.PUBLIC_URL}/flights/flights.json` || "/flights/flights.json"; // default if env missing

export async function fetchFlights(): Promise<FlightsApiResponse> {
  const res = await fetch(ENDPOINT, { cache: "no-store" });
  if (!res.ok) throw new Error(`Flights API ${res.status}`);
  return res.json();
}

export type Filter = { tab: "arrivals" | "departures" };

export function filterByTab(list: FlightApi[], tab: Filter["tab"]) {
  return list.filter((f) => f.ARR_DEP === (tab === "arrivals" ? "A" : "D"));
}