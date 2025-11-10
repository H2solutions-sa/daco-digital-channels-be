'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import JourneyTimeline from './JourneyTimeline';
import { fetchSingleFlight } from '../../../../lib/flights/api'; // adjust path if needed


type FlightData = {
  flightNo: string;
  airline: string;
  route?: string;
  status?: string;
  statusColor?: string;
  schedTime?: string;
  estTime?: string;
  gate?: string;
  checkIn?: string[];
  terminal?: string;
  remarks?: string;
  logo?: string;
  lastUpdated?: string;
};

function parseFlightParam(param?: string): { airline: string; number: string } | null {
  if (!param) return null;
  const cleaned = param.trim().replace(/\s+/g, '');
  const parts = cleaned.split('-');
  if (parts.length !== 2) return null;
  return { airline: parts[0].toUpperCase(), number: parts[1] };
}

const JourneyTimelineComponent = () => {
  const searchParams = useSearchParams();
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const flightParam = searchParams.get('flight') || "";
  const parsed = parseFlightParam(flightParam);

  useEffect(() => {
    if (!parsed) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchSingleFlight(parsed.airline, parsed.number);
        setFlightData(data);
      } catch (err: any) {
        console.error('Error fetching flight:', err);
        setError('Failed to load flight data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [flightParam]);

  const fallbackFlightNo = parsed ? `${parsed.airline}-${parsed.number}` : 'Unknown';

  if (loading) return <div className="text-gray-500 p-4">Loading flight information...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <JourneyTimeline
      steps={[]}
      flight={{
        flightNo: flightData?.flightNo || fallbackFlightNo,
      }}
    />
  );
};

export default JourneyTimelineComponent;
