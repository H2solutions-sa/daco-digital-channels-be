// app/components/header/NavData.ts
"use client";
import type { MenuItem } from "./types";

export const flights: MenuItem[] = [
  { label: "Arrivals",     href: "/flights/arrivals#arrivals" },
  { label: "Departures",   href: "/flights/departures#departures" },
  { label: "Airlines",     href: "/flights/airlines#airlines" },
  { label: "Destinations", href: "/flights/destinations#destinations" },
];

export const parkingTransport: MenuItem[] = [
  { label: "Driving Directions", href: "/parking-transport/directions" },
  { label: "Parking",            href: "/parking-transport/parking" },
  { label: "By Bus",             href: "/parking-transport/bus" },
  { label: "Taxi/Car Service",   href: "/parking-transport/taxi-car-service" }, 
  { label: "Car Rental",         href: "/parking-transport/car-rental" },
  { label: "Valet",              href: "/parking-transport/valet" },
  { label: "Pickup & Drop Off",  href: "/parking-transport/pickup-dropoff" },
];

export const shopDine: MenuItem[] = [
  { label: "Shops",              href: "/shop-dine/shops" },
  { label: "Restaurants & café", href: "/shop-dine/restaurants" },
  { label: "Duty Free",          href: "/shop-dine/duty-free" },
];

export const facilitiesServices: MenuItem[] = [
  { label: "ATMs/Banks/Exchange", href: "/facilities/atms-banks-exchange" },
  { label: "Disability Support",  href: "/facilities/disability-support" },
  { label: "Toilet & Prayer Rooms", href: "/facilities/toilet-prayer-rooms" },
  { label: "Medical Support",     href: "/facilities/medical-support" },
  { label: "Luggage Services",    href: "/facilities/luggage-services" },
  { label: "Lounges/Meet & Greet", href: "/facilities/lounges-meet-greet" },
];

export const guide: MenuItem[] = [
  { label: "Passenger Guide",        href: "/guide/passenger" },
  { label: "Security",               href: "/guide/security" },
  { label: "Customs Info",           href: "/guide/passenger/customs" },
  { label: "Visa Regulation",        href: "/guide/passenger/visa-regulation" },
  { label: "Airport Map",            href: "/guide/passenger/airport-map" },
  { label: "Corporate Info",         href: "/guide/corporate-info" },
  { label: "About Eastern Province", href: "/guide/about-eastern-province" },
];