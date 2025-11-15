
export type FetchFlightsOpts = {
  tab?: "arrivals" | "departures";
  top?: number;
};

const INTERNAL_FLIGHTS_PATH = "https://uat.dammamairports.sa/AODPAPI/api/v1/flights";

export async function fetchFlights(opts: FetchFlightsOpts = {}) {
  const params = new URLSearchParams();
  if (opts.tab) params.set("arr_dep", opts.tab === "arrivals" ? "A" : "D");
  if (opts.top) params.set("top", String(opts.top));

  const url = `${INTERNAL_FLIGHTS_PATH}${params.size ? `?${params.toString()}` : ""}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      // swallow upstream body/details from surfacing to UI
      const detail = await res.text().catch(() => "");
      console.debug("Flights upstream error:", res.status, res.statusText, detail);
      throw new Error("Failed to load flights");
    }
    return res.json();
  } catch (err: any) {
    console.debug("Flights fetch failed:", err?.message || err);
    throw new Error("Failed to load flights");
  }
}

export async function fetchSingleFlight(airline: string, number: string) {
  const url = `https://uat.dammamairports.sa/AODPAPI/api/v1/flight/${encodeURIComponent(airline)}/${encodeURIComponent(number)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.debug("Flight upstream error:", res.status, res.statusText, detail);
      throw new Error("Failed to load flight");
    }
    return res.json();
  } catch (err: any) {
    console.debug("Flight fetch failed:", err?.message || err);
    throw new Error("Failed to load flight");
  }
}