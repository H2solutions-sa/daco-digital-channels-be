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
  { label: "Driving Directions", href: "/Parking-Transport#Driving%20Directions" },
  { label: "Parking",            href: "/Parking-Transport#Pickup%20and%20Drop%20off" },
  { label: "By Bus",             href: "/Parking-Transport#Shuttle%20Bus" },
  { label: "Taxi/Car Service",   href: "/Parking-Transport#Taxi%20Car%20Service" }, 
  { label: "Car Rental",         href: "/Parking-Transport#Rentals" },
  { label: "Valet",              href: "/Parking-Transport#Parking%20and%20Valet" },
  { label: "Pickup & Drop Off",  href: "/Parking-Transport#Pickup%20and%20Drop%20off" },
];

export const shopDine: MenuItem[] = [
  { label: "Shops",              href: "/shop-dine/shops" },
  { label: "Restaurants & café", href: "/shop-dine/Restaurant-Cafe" },
  { label: "Duty Free",          href: "/shop-dine/duty-free" },
];

export const facilitiesServices: MenuItem[] = [
  { label: "ATMs/Banks/Exchange", href: "/facilities/Banking" },
  { label: "Disability Support",  href: "/facilities/Disability-support" },
  { label: "Toilet & Prayer Rooms", href: "/facilities/Amenities" },
  { label: "Medical Support",     href: "/facilities/Medical-Support" },
  { label: "Luggage Services",    href: "/Facilities/Luggage" },
  { label: "Lounges/Meet & Greet", href: "/Facilities/Lounges" },
];

export const guide: MenuItem[] = [
  { label: "Passenger Guide",        href: "/guide/passenger" },
  { label: "Security",               href: "/guide/security" },
  { label: "Customs Info",           href: "/guide/passenger/customs" },
  { label: "Visa Regulation",        href: "/guide/passenger/visa-regulation" },
  { label: "Airport Map",            href: "/guide/passenger/airport-map" },
  { label: "Corporate Info",         href: "/guide/corporate-info" },
  { label: "About Eastern Province", href: "/guide/Eastern-Province" },
];