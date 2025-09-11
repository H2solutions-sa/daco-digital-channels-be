import { NextResponse } from "next/server";

// Option 1: Import the file at build time (fast & simple)
import flightsData from "./flights.json" assert { type: "json" };
// If your JSON isn’t in /public, you can read it with fs in a Route Handler instead.

export async function GET() {
  return NextResponse.json(flightsData, { status: 200 });
}