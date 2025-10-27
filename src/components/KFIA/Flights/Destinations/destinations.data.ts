// app/components/destinations/destinations.data.ts
export type Destination = {
  code: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  airlines: string[];
};

export const DMM = { lat: 26.4711, lng: 49.7979 };

export const LIGHT = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attr: '© OpenStreetMap © <a href="https://carto.com/attributions">CARTO</a>',
};

export const BRAND_PURPLE = "#5F488B";
export const SECONDARY_BLUE = "#4D9CD3";
export const LAVENDER = "#7C6AA9";

/** Full list you had (unchanged) */
export const ALL_DESTINATIONS: Destination[] = [
  // GCC + nearby
  { code: "DXB", city: "Dubai",          country: "UAE",            lat: 25.2528, lng: 55.3644, airlines: ["Emirates","flydubai","SAUDIA"] },
  { code: "AUH", city: "Abu Dhabi",      country: "UAE",            lat: 24.4330, lng: 54.6511, airlines: ["Etihad"] },
  { code: "SHJ", city: "Sharjah",        country: "UAE",            lat: 25.3286, lng: 55.5171, airlines: ["Air Arabia"] },
  { code: "DOH", city: "Doha",           country: "Qatar",          lat: 25.2736, lng: 51.6081, airlines: ["Qatar Airways"] },
  { code: "MCT", city: "Muscat",         country: "Oman",           lat: 23.5933, lng: 58.2844, airlines: ["Oman Air","SalamAir"] },
  { code: "KWI", city: "Kuwait City",    country: "Kuwait",         lat: 29.2266, lng: 47.9689, airlines: ["Kuwait Airways","Jazeera"] },
  { code: "BAH", city: "Manama",         country: "Bahrain",        lat: 26.2708, lng: 50.6336, airlines: ["Gulf Air","SAUDIA"] },

  // Saudi domestic
  { code: "RUH", city: "Riyadh",         country: "Saudi Arabia",   lat: 24.9576, lng: 46.6988, airlines: ["SAUDIA","flynas","flyadeal"] },
  { code: "JED", city: "Jeddah",         country: "Saudi Arabia",   lat: 21.6702, lng: 39.1528, airlines: ["SAUDIA","flyadeal","flynas"] },
  { code: "MED", city: "Madinah",        country: "Saudi Arabia",   lat: 24.5534, lng: 39.7051, airlines: ["SAUDIA","flynas"] },
  { code: "TUU", city: "Tabuk",          country: "Saudi Arabia",   lat: 28.3654, lng: 36.6189, airlines: ["SAUDIA","flynas"] },
  { code: "GIZ", city: "Jazan",          country: "Saudi Arabia",   lat: 16.9011, lng: 42.5858, airlines: ["SAUDIA","flynas"] },
  { code: "TIF", city: "Taif",           country: "Saudi Arabia",   lat: 21.4830, lng: 40.5443, airlines: ["SAUDIA","flynas"] },
  { code: "AHB", city: "Abha",           country: "Saudi Arabia",   lat: 18.2404, lng: 42.6566, airlines: ["SAUDIA","flynas"] },
  { code: "YNB", city: "Yanbu",          country: "Saudi Arabia",   lat: 24.1442, lng: 38.0634, airlines: ["SAUDIA"] },
  { code: "HOF", city: "Al-Ahsa",        country: "Saudi Arabia",   lat: 25.2853, lng: 49.4858, airlines: ["SAUDIA"] },

  // Middle East / Levant / Iraq / Iran
  { code: "AMM", city: "Amman",          country: "Jordan",         lat: 31.7226, lng: 35.9932, airlines: ["Royal Jordanian","flynas"] },
  { code: "BEY", city: "Beirut",         country: "Lebanon",        lat: 33.8209, lng: 35.4884, airlines: ["MEA"] },
  { code: "BGW", city: "Baghdad",        country: "Iraq",           lat: 33.2625, lng: 44.2346, airlines: ["Iraqi Airways","Fly Baghdad"] },
  { code: "NJF", city: "Najaf",          country: "Iraq",           lat: 31.9897, lng: 44.4043, airlines: ["Fly Baghdad","Iraqi Airways"] },
  { code: "EBL", city: "Erbil",          country: "Iraq",           lat: 36.2376, lng: 43.9632, airlines: ["Fly Baghdad","Iraqi Airways"] },
  { code: "IKA", city: "Tehran",         country: "Iran",           lat: 35.4161, lng: 51.1522, airlines: ["Mahan Air","Iran Air"] },
  { code: "MHD", city: "Mashhad",        country: "Iran",           lat: 36.2353, lng: 59.6409, airlines: ["Mahan Air"] },

  // Turkey / Azerbaijan / Caucasus
  { code: "IST", city: "Istanbul",       country: "Türkiye",        lat: 41.2753, lng: 28.7519, airlines: ["Turkish Airlines"] },
  { code: "SAW", city: "Istanbul SAW",   country: "Türkiye",        lat: 40.9050, lng: 29.3210, airlines: ["Pegasus"] },
  { code: "TZX", city: "Trabzon",        country: "Türkiye",        lat: 40.9966, lng: 39.7897, airlines: ["Pegasus"] },
  { code: "GYD", city: "Baku",           country: "Azerbaijan",     lat: 40.4675, lng: 50.0498, airlines: ["AZAL"] },
  { code: "TBS", city: "Tbilisi",        country: "Georgia",        lat: 41.6692, lng: 44.9547, airlines: ["Gulf Air (via)","others"] },

  // Egypt / North Africa
  { code: "CAI", city: "Cairo",          country: "Egypt",          lat: 30.1120, lng: 31.3990, airlines: ["EgyptAir","SAUDIA"] },
  { code: "HBE", city: "Alexandria Borg",country: "Egypt",          lat: 30.9177, lng: 29.6964, airlines: ["Air Arabia Egypt","SAUDIA"] },
  { code: "ATZ", city: "Assiut",         country: "Egypt",          lat: 27.0465, lng: 31.0117, airlines: ["Air Arabia Egypt"] },
  { code: "HMB", city: "Sohag",          country: "Egypt",          lat: 26.3430, lng: 31.7375, airlines: ["Air Arabia Egypt"] },
  { code: "SSH", city: "Sharm El-Sheikh",country: "Egypt",          lat: 27.9773, lng: 34.3949, airlines: ["EgyptAir"] },
  { code: "KRT", city: "Khartoum",       country: "Sudan",          lat: 15.5895, lng: 32.5532, airlines: ["Badr","Tarco"] },

  // Europe
  { code: "LHR", city: "London",         country: "United Kingdom", lat: 51.4700, lng: -0.4543, airlines: ["British Airways","SAUDIA"] },
  { code: "LGW", city: "London Gatwick", country: "United Kingdom", lat: 51.1537, lng: -0.1821, airlines: ["SAUDIA (seasonal)"] },
  { code: "FRA", city: "Frankfurt",      country: "Germany",        lat: 50.0379, lng: 8.5622,  airlines: ["Lufthansa","SAUDIA"] },
  { code: "MUC", city: "Munich",         country: "Germany",        lat: 48.3538, lng: 11.7861, airlines: ["Lufthansa"] },
  { code: "CDG", city: "Paris",          country: "France",         lat: 49.0097, lng: 2.5479,  airlines: ["Air France","SAUDIA"] },
  { code: "AMS", city: "Amsterdam",      country: "Netherlands",    lat: 52.3105, lng: 4.7683,  airlines: ["KLM"] },
  { code: "VIE", city: "Vienna",         country: "Austria",        lat: 48.1103, lng: 16.5697, airlines: ["Austrian"] },
  { code: "ZRH", city: "Zurich",         country: "Switzerland",    lat: 47.4647, lng: 8.5492,  airlines: ["Swiss"] },
  { code: "ATH", city: "Athens",         country: "Greece",         lat: 37.9364, lng: 23.9445, airlines: ["Aegean"] },

  // South Asia
  { code: "DEL", city: "Delhi",          country: "India",          lat: 28.5562, lng: 77.1000, airlines: ["Indigo (via)","others"] },
  { code: "BOM", city: "Mumbai",         country: "India",          lat: 19.0896, lng: 72.8656, airlines: ["Indigo (via)","others"] },
  { code: "COK", city: "Kochi",          country: "India",          lat: 10.1518, lng: 76.4019, airlines: ["Indigo (via)"] },
  { code: "DAC", city: "Dhaka",          country: "Bangladesh",     lat: 23.8433, lng: 90.3978, airlines: ["Biman (via)"] },
];