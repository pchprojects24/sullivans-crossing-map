// Sullivan's Crossing – Show information, cast, regions & fan itineraries
// Show facts verified against Wikipedia, Netflix Tudum, CTV, The CW and IMDb (2026).
// Regions and itineraries are derived from the confirmed filming-location dataset
// in ./locations.ts so there is a single source of truth for every place.

import { locations, type Location } from "./locations";

// ─── Show overview ──────────────────────────────────────────────────────────
export const show = {
  title: "Sullivan's Crossing",
  tagline: "Where the wilderness heals what the city broke.",
  premise:
    "When big-city neurosurgeon Maggie Sullivan's world falls apart, she retreats to the rugged Nova Scotia town where she grew up — reconnecting with her estranged father, Sully, at the lakeside campground that gives the show its name. What she finds is a drifter named Cal, a tight-knit community, and a second chance at the life she left behind.",
  basedOn:
    "Based on the best-selling novel series by Robyn Carr, the author behind Virgin River.",
  premiere: "March 19, 2023",
  seasons: 4,
  years: "2023 – 2026",
  filmedIn: "Filmed entirely across Nova Scotia, Canada.",
};

// ─── Where to watch ─────────────────────────────────────────────────────────
export const whereToWatch: {
  region: string;
  services: { name: string; note: string }[];
}[] = [
  {
    region: "Canada",
    services: [
      { name: "CTV", note: "Original broadcast home" },
      { name: "Crave", note: "Stream every season" },
    ],
  },
  {
    region: "United States",
    services: [
      { name: "The CW", note: "Free, ad-supported" },
      { name: "Netflix", note: "Binge all seasons" },
    ],
  },
];

// ─── Cast & characters ──────────────────────────────────────────────────────
export interface CastMember {
  character: string;
  actor: string;
  blurb?: string;
  lead?: boolean;
}

export const cast: CastMember[] = [
  {
    character: "Maggie Sullivan",
    actor: "Morgan Kohan",
    blurb:
      "A big-city neurosurgeon who returns to her rural Nova Scotia hometown — and her father's campground — to rebuild her life.",
    lead: true,
  },
  {
    character: "Cal Jones",
    actor: "Chad Michael Murray",
    blurb:
      "A charming, mysterious drifter who signs on as Sully's right hand at the campground and grows close to Maggie.",
    lead: true,
  },
  {
    character: "Harry “Sully” Sullivan",
    actor: "Scott Patterson",
    blurb:
      "Maggie's gruff but big-hearted father, who runs the beloved Sullivan's Crossing campground.",
    lead: true,
  },
  { character: "Frank Cranebear", actor: "Tom Jackson" },
  { character: "Edna Cranebear", actor: "Andrea Menard" },
  { character: "Rafe Vadas", actor: "Dakota Taylor" },
  { character: "Lola Gunderson", actor: "Amalia Williamson" },
  { character: "Sydney Shandon", actor: "Lindura" },
  { character: "Rob Shandon", actor: "Reid Price" },
];

// ─── Regions ────────────────────────────────────────────────────────────────
// Every location id appears in exactly one region.
export interface Region {
  id: string;
  name: string;
  tagline: string;
  blurb: string;
  emoji: string;
  color: string;
  locationIds: number[];
  center: { lat: number; lng: number };
  zoom: number;
}

export const regions: Region[] = [
  {
    id: "campground",
    name: "Sully's Campground Country",
    tagline: "The heart of the show",
    blurb:
      "The purpose-built Timberlake town set, Sully's lakefront house and the real campgrounds on Beaver Bank and Grand Lake where Sullivan's Crossing itself comes to life.",
    emoji: "⛺",
    color: "#2d7d7d",
    locationIds: [1, 2, 3, 22, 23],
    center: { lat: 44.86, lng: -63.64 },
    zoom: 10,
  },
  {
    id: "halifax",
    name: "Halifax",
    tagline: "The North End & downtown",
    blurb:
      "Shandon's Diner, Rafe's heritage home, the waterfront and the downtown streets and landmarks that stood in for Maggie's world on both sides of the harbour.",
    emoji: "⚓",
    color: "#1a2e3b",
    locationIds: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    center: { lat: 44.649, lng: -63.585 },
    zoom: 13,
  },
  {
    id: "dartmouth",
    name: "Dartmouth & the Eastern Shore",
    tagline: "Across the water",
    blurb:
      "Fisherman's Cove's painted boardwalk, Shubie Park, Dartmouth's main street, an axe-throwing hall and the rolling surf of Lawrencetown Beach.",
    emoji: "🌊",
    color: "#4a90a4",
    locationIds: [16, 17, 18, 19, 20, 21, 24],
    center: { lat: 44.66, lng: -63.5 },
    zoom: 11,
  },
  {
    id: "southshore",
    name: "The South Shore",
    tagline: "Postcard Nova Scotia",
    blurb:
      "Peggy's Cove in the opening credits, the three churches of Mahone Bay, UNESCO-listed Lunenburg, Terence Bay and a hidden waterfall — the show's most iconic scenery.",
    emoji: "🎬",
    color: "#7a3a5a",
    locationIds: [25, 26, 27, 28, 29],
    center: { lat: 44.44, lng: -64.1 },
    zoom: 9,
  },
  {
    id: "hubbards",
    name: "Hubbards & St. Margaret's Bay",
    tagline: "Sleep inside Season 3",
    blurb:
      "The Season 3 hub on St. Margaret's Bay — where Rob's house, Cal's cabin and the new Shandon's Diner are all rentable stays at Hubbards Beach Campground.",
    emoji: "🛏️",
    color: "#4a7c59",
    locationIds: [30, 31, 32, 33],
    center: { lat: 44.635, lng: -64.05 },
    zoom: 13,
  },
  {
    id: "hants",
    name: "Hants County & Production",
    tagline: "Farms, falls & the soundstage",
    blurb:
      "Hatfield Farm's rodeo party, the Mount Uniacke fire station, Ettinger Falls' cliff-side rescue and the brand-new soundstage where Season 4 was made.",
    emoji: "🏞️",
    color: "#8b6914",
    locationIds: [34, 35, 36, 37],
    center: { lat: 44.9, lng: -63.85 },
    zoom: 10,
  },
];

// ─── Curated fan itineraries ────────────────────────────────────────────────
export interface Itinerary {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  color: string;
  duration: string;
  difficulty: "Easy stroll" | "Half day" | "Full day" | "Weekend";
  description: string;
  stopIds: number[];
}

export const itineraries: Itinerary[] = [
  {
    id: "halifax-crawl",
    name: "The Halifax Fan Crawl",
    subtitle: "North End delis to the downtown waterfront",
    emoji: "🥪",
    color: "#c8860a",
    duration: "Half a day, mostly on foot",
    difficulty: "Half day",
    description:
      "Start with brunch in the booth where Maggie sat at Shandon's Diner, cross the street for a pint, wander past Rafe's heritage home, then work downtown to the gallery, the gala hotel and the harbour boardwalk.",
    stopIds: [4, 5, 12, 11, 8, 7, 6, 15],
  },
  {
    id: "south-shore-drive",
    name: "South Shore Scenic Drive",
    subtitle: "The show's most famous scenery",
    emoji: "🕊️",
    color: "#7a3a5a",
    duration: "One long, gorgeous day",
    difficulty: "Full day",
    description:
      "Chase the opening-credits coastline from Peggy's Cove lighthouse through Terence Bay, on to the three churches of Mahone Bay and the painted streets of Lunenburg, with a waterfall swim to finish.",
    stopIds: [25, 26, 27, 28, 29],
  },
  {
    id: "hubbards-stay",
    name: "Sleep Inside Season 3",
    subtitle: "Stay the night in Hubbards",
    emoji: "🛏️",
    color: "#4a7c59",
    duration: "An overnight escape",
    difficulty: "Weekend",
    description:
      "The ultimate fan pilgrimage: book Rob's house or Cal's cabin at Hubbards Beach Campground, dine where the new Shandon's Diner sits on the lake, and toast the bay at Tuna Blue.",
    stopIds: [30, 31, 32, 33],
  },
  {
    id: "campground-country",
    name: "Sully's Campground Country",
    subtitle: "Where the show is really set",
    emoji: "⛺",
    color: "#2d7d7d",
    duration: "A relaxed half day",
    difficulty: "Half day",
    description:
      "Drive the roads around the real Sullivan's Crossing: spot the Timberlake town set and the Fun Forest camp, then pitch up (or paddle) at the Grand Lake provincial parks that double as Sully's campground.",
    stopIds: [2, 1, 22, 23],
  },
  {
    id: "dartmouth-day",
    name: "Dartmouth & Eastern Passage",
    subtitle: "Across the harbour",
    emoji: "🪓",
    color: "#4a90a4",
    duration: "A full, fun day",
    difficulty: "Full day",
    description:
      "Ferry over to Dartmouth for a paddle in Shubie Park, an axe-throwing session on Portland Street, then finish on the painted boardwalk of Fisherman's Cove with seafood at Boondocks.",
    stopIds: [16, 17, 18, 20, 21],
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const byId = new Map(locations.map((l) => [l.id, l]));

export function getLocationsByIds(ids: number[]): Location[] {
  return ids.map((id) => byId.get(id)).filter((l): l is Location => Boolean(l));
}

export function getRegionForLocation(locId: number): Region | undefined {
  return regions.find((r) => r.locationIds.includes(locId));
}

// Build a Google Maps directions URL that chains every stop into one route.
export function buildRouteUrl(locs: Location[]): string {
  if (locs.length === 0) return "https://www.google.com/maps";
  const points = locs.map((l) => `${l.lat},${l.lon}`).join("/");
  return `https://www.google.com/maps/dir/${points}`;
}

// A few derived stats for the landing page.
export const stats = {
  total: locations.length,
  publicAccess: locations.filter((l) => l.publicAccess).length,
  regions: regions.length,
  seasons: show.seasons,
};
