// Sullivan's Crossing – Show information, cast, regions & fan itineraries
// Show facts and episode titles checked against CTV, The CW, Netflix Tudum, IMDb, TVMaze and trade press (Oct 2026).
// Regions and itineraries are derived from the confirmed filming-location dataset
// in ./locations.ts so there is a single source of truth for every place.

import { locations, type Location } from "./locations";

// ─── Show overview ──────────────────────────────────────────────────────────
// When the location/episode data was last reviewed. Shown in the footer.
export const DATA_UPDATED = "October 2026";

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
  // Season 4 aired on CTV from March 22, 2026 and on The CW from April 20, 2026.
  latestSeason: "Season 4 aired in spring 2026",
  // Renewed by CTV (June 2026) and The CW (July 2026); filming in Nova Scotia.
  nextSeason: "Season 5 is renewed — coming in 2027",
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
  // Which seasons the character appears in, when it isn't all of them.
  seasons?: string;
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
      "Maggie's gruff but big-hearted father, who runs the beloved Sullivan's Crossing campground. In Season 4 Sully is away overseas, so he isn't on screen.",
    lead: true,
    seasons: "Seasons 1–3",
  },
  {
    character: "Liam",
    actor: "Marcus Rosner",
    blurb:
      "Maggie's ex-husband, whose arrival in Season 4 with a shocking revelation upends her new life at the Crossing.",
    lead: true,
    seasons: "Season 4",
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
  // How the route should open in Google Maps (defaults to driving).
  travelMode?: "walking" | "driving";
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
    travelMode: "walking",
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

// ─── Episode guide ──────────────────────────────────────────────────────────
// Episode titles per season, with the filming locations the dataset ties to a
// specific episode. Locations that are only logged by season (or "all seasons")
// are listed separately on the episode guide page.
export interface Episode {
  season: 1 | 2 | 3 | 4;
  number: number;
  title: string;
  locationIds: number[];
}

const EPISODE_TITLES: Record<1 | 2 | 3 | 4, string[]> = {
  1: ["Coming Home", "Homewrecker", "Detours", "Rock and a Hard Place", "Pressure Drop", "Boiling Point", "Second Chances", "Aftershock", "Can't Help Falling", "Sins of the Father"],
  2: ["Guilt Trip", "A Storm Is Brewing", "Confessions", "Eye of the Storm", "Secrets", "Revelations", "Reunions", "Truth and Consequences", "Remorse", "It's a Wonderful Life"],
  3: ["New Beginnings", "Out of the Blue", "The Ties That Bind", "A Clear Perspective", "Misunderstandings", "Bad Timing", "Twists and Turns", "Blindsided", "First Cut Is the Deepest", "Head to the Heart"],
  4: ["Curveballs", "Open Wounds", "Northern Lights", "Gut Instincts", "Abandoning", "Falling Through the Cracks", "Face the Music", "Let It Go", "We Can Work It Out", "Healing Hearts"],
};

// "S1E6" → location ids, taken from the episode references in locations.ts.
const EPISODE_LOCATIONS: Record<string, number[]> = {
  S1E1: [6],
  S1E3: [34],
  S1E5: [5],
  S1E6: [7, 8, 9, 10],
  S1E7: [21, 29],
  S1E8: [29],
  S2E3: [26],
  S2E4: [12],
  S2E5: [17],
  S2E6: [18],
  S3E2: [36],
  S3E3: [28],
  S3E5: [33],
  S4E5: [13],
};

export const episodes: Episode[] = ([1, 2, 3, 4] as const).flatMap((season) =>
  EPISODE_TITLES[season].map((title, i) => ({
    season,
    number: i + 1,
    title,
    locationIds: EPISODE_LOCATIONS[`S${season}E${i + 1}`] ?? [],
  })),
);

export const episodeCode = (e: Pick<Episode, "season" | "number">) => `S${e.season}E${e.number}`;
export const episodeLabel = (e: Episode) => `${episodeCode(e)} “${e.title}”`;

export function getEpisodesForLocation(locId: number): Episode[] {
  return episodes.filter((e) => e.locationIds.includes(locId));
}

// ─── Helpers ────────────────────────────────────────────────────────────────
const byId = new Map(locations.map((l) => [l.id, l]));

export function getLocationsByIds(ids: number[]): Location[] {
  return ids.map((id) => byId.get(id)).filter((l): l is Location => Boolean(l));
}

export function getRegionForLocation(locId: number): Region | undefined {
  return regions.find((r) => r.locationIds.includes(locId));
}

// Build a Google Maps directions URL that chains every stop into one route,
// using the documented Maps URLs format so the travel mode is honoured.
export function buildRouteUrl(locs: Location[], mode: "walking" | "driving" = "driving"): string {
  if (locs.length === 0) return "https://www.google.com/maps";
  const pt = (l: Location) => `${l.lat},${l.lon}`;
  if (locs.length === 1) return `https://www.google.com/maps/search/?api=1&query=${pt(locs[0])}`;
  const params = new URLSearchParams({
    api: "1",
    origin: pt(locs[0]),
    destination: pt(locs[locs.length - 1]),
    travelmode: mode,
  });
  const waypoints = locs.slice(1, -1).map(pt).join("|");
  if (waypoints) params.set("waypoints", waypoints);
  return `https://www.google.com/maps/dir/?${params.toString().replace(/%2C/g, ",").replace(/%7C/g, "|")}`;
}

// A few derived stats for the landing page.
export const stats = {
  total: locations.length,
  publicAccess: locations.filter((l) => l.publicAccess).length,
  regions: regions.length,
  seasons: show.seasons,
};

// ─── Route helpers ──────────────────────────────────────────────────────────
// Google Maps only honours ~10 points in a single /dir/ link, so long routes
// are split into consecutive legs that share their joining stop.
export const MAX_POINTS_PER_LEG = 10;

export function splitRouteLegs(locs: Location[]): Location[][] {
  if (locs.length <= MAX_POINTS_PER_LEG) return [locs];
  const legs: Location[][] = [];
  for (let start = 0; start < locs.length - 1; start += MAX_POINTS_PER_LEG - 1) {
    legs.push(locs.slice(start, start + MAX_POINTS_PER_LEG));
  }
  return legs;
}

// Great-circle distance in km between two locations.
export function distanceKm(a: Location, b: Location): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Rough road estimate: straight-line distance × 1.3 for Nova Scotia's winding roads.
export function estimateRouteKm(locs: Location[]): number {
  let total = 0;
  for (let i = 1; i < locs.length; i++) total += distanceKm(locs[i - 1], locs[i]);
  return Math.round(total * 1.3);
}

// ─── Fan Passport badges ────────────────────────────────────────────────────
export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // Location ids that must all be visited, or a minimum count of any visits.
  requires: { ids: number[] } | { count: number };
}

export const badges: Badge[] = [
  { id: "first", name: "First Stop", emoji: "🎟️", description: "Visit or spot your first filming location.", requires: { count: 1 } },
  { id: "diner", name: "Diner Regular", emoji: "☕", description: "Visit both Shandon's Diners — Hali Deli and the Season 3 building in Hubbards.", requires: { ids: [4, 32] } },
  { id: "lighthouse", name: "Lighthouse Keeper", emoji: "🏮", description: "See the Peggy's Cove and Terence Bay lighthouses.", requires: { ids: [25, 26] } },
  { id: "waterfall", name: "Waterfall Chaser", emoji: "💧", description: "Find both waterfalls: Indian Falls and Ettinger Falls.", requires: { ids: [29, 36] } },
  { id: "season3", name: "Sleep Inside Season 3", emoji: "🛏️", description: "Rob's house, Cal's cabin and the new Shandon's Diner at Hubbards Beach.", requires: { ids: [30, 31, 32] } },
  { id: "heart", name: "Heart of the Crossing", emoji: "⛺", description: "Spot the campground, the Timberlake town set and Sully's house.", requires: { ids: [1, 2, 3] } },
  ...regions.map((r) => ({
    id: `region-${r.id}`,
    name: `${r.name} Complete`,
    emoji: r.emoji,
    description: `Every one of the ${r.locationIds.length} spots in ${r.name}.`,
    requires: { ids: r.locationIds },
  })),
  { id: "half", name: "Halfway to the Crossing", emoji: "🧭", description: `Visit or spot ${Math.ceil(locations.length / 2)} locations.`, requires: { count: Math.ceil(locations.length / 2) } },
  { id: "all", name: "True Crossing Fan", emoji: "🏆", description: `All ${locations.length} confirmed filming locations.`, requires: { count: locations.length } },
];

export function badgeProgress(badge: Badge, visited: number[]): { have: number; need: number; earned: boolean } {
  if ("count" in badge.requires) {
    const need = badge.requires.count;
    const have = Math.min(visited.length, need);
    return { have, need, earned: visited.length >= need };
  }
  const need = badge.requires.ids.length;
  const have = badge.requires.ids.filter((id) => visited.includes(id)).length;
  return { have, need, earned: have === need };
}

// ─── Fan trivia ─────────────────────────────────────────────────────────────
// Questions are generated from the confirmed-location dataset so every answer
// is backed by the same sources as the map.
export interface QuizQuestion {
  prompt: string;
  options: string[];
  answer: string;
  locationId: number;
}

// "Which real place played …?" clues, keyed by location id.
const PLAYED_CLUES: Record<number, string> = {
  1: "Sully's campground — the Sullivan's Crossing campground itself",
  2: "the exterior streets of Timberlake",
  3: "Sully's lakefront house",
  4: "Shandon's Diner in Seasons 1 & 2",
  6: "the awards ceremony gala in the very first episode",
  11: "Rafe's house from Season 2 onward",
  13: "the bridge scene in Season 4's 'Abandoning'",
  14: "the Nova Scotia Board of Physicians headquarters in Season 4",
  18: "the axe-throwing scene in Season 2's 'Revelations'",
  19: "the hospital where Maggie's surgery scenes were shot",
  25: "the coastline in the opening credits",
  27: "Timberlake's establishing shots",
  30: "Rob's house in Season 3",
  31: "Cal's cabin in Season 3",
  32: "the new Shandon's Diner in Season 3",
  34: "the campsite party and rodeo in Season 1's 'Detours'",
  36: "the cliff-side rescue in Season 3's 'Out of the Blue'",
};

// Locations that could also fairly answer a clue, so they're never distractors.
const CLUE_CONFLICTS: Record<number, number[]> = {
  1: [22, 23],
  2: [27],
  27: [2],
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function buildQuiz(length = 10): QuizQuestion[] {
  const played: QuizQuestion[] = Object.entries(PLAYED_CLUES).map(([idStr, clue]) => {
    const loc = byId.get(Number(idStr))!;
    const excluded = new Set([loc.id, ...(CLUE_CONFLICTS[loc.id] ?? [])]);
    const distractors = shuffle(locations.filter((l) => !excluded.has(l.id))).slice(0, 3).map((l) => l.name);
    return {
      prompt: `Which real Nova Scotia location played ${clue}?`,
      options: shuffle([loc.name, ...distractors]),
      answer: loc.name,
      locationId: loc.id,
    };
  });

  const where: QuizQuestion[] = shuffle(locations.filter((l) => l.publicAccess))
    .slice(0, 6)
    .map((loc) => {
      const region = getRegionForLocation(loc.id)!;
      const distractors = shuffle(regions.filter((r) => r.id !== region.id)).slice(0, 3).map((r) => r.name);
      return {
        prompt: `Road-trip time: which part of the province will you drive to for ${loc.name} (${loc.showName})?`,
        options: shuffle([region.name, ...distractors]),
        answer: region.name,
        locationId: loc.id,
      };
    });

  // "Which episode…?" — only locations tied to exactly one episode, so the answer is unambiguous.
  const episodeQs: QuizQuestion[] = [6, 34, 5, 7, 8, 9, 10, 12, 17, 18, 36, 28, 33, 13].map((id) => {
    const loc = byId.get(id)!;
    const answer = getEpisodesForLocation(id)[0];
    const distractors = shuffle(episodes.filter((e) => e.title !== answer.title && !e.locationIds.includes(id) && !(e.season === answer.season && e.number === answer.number)))
      .slice(0, 3)
      .map(episodeLabel);
    return {
      prompt: `Which episode includes a scene filmed at ${loc.name}?`,
      options: shuffle([episodeLabel(answer), ...distractors]),
      answer: episodeLabel(answer),
      locationId: id,
    };
  });

  const playedQs = shuffle(played).slice(0, Math.min(4, length - 6));
  const episodePick = shuffle(episodeQs).slice(0, 3);
  const wherePick = where.slice(0, length - playedQs.length - episodePick.length);
  return shuffle([...playedQs, ...episodePick, ...wherePick]);
}

// Reorder stops into a short drive: nearest-neighbour from the first stop,
// then 2-opt swaps to untangle crossings. Plenty for ≤37 points.
export function optimizeRoute(locs: Location[]): Location[] {
  if (locs.length < 3) return locs;
  const rest = locs.slice(1);
  const order = [locs[0]];
  while (rest.length) {
    const last = order[order.length - 1];
    let best = 0;
    for (let i = 1; i < rest.length; i++) {
      if (distanceKm(last, rest[i]) < distanceKm(last, rest[best])) best = i;
    }
    order.push(rest.splice(best, 1)[0]);
  }
  const len = (r: Location[]) => r.slice(1).reduce((sum, l, i) => sum + distanceKm(r[i], l), 0);
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < order.length - 1; i++) {
      for (let j = i + 1; j < order.length; j++) {
        const candidate = [...order.slice(0, i), ...order.slice(i, j + 1).reverse(), ...order.slice(j + 1)];
        if (len(candidate) + 1e-9 < len(order)) {
          order.splice(0, order.length, ...candidate);
          improved = true;
        }
      }
    }
  }
  return order;
}

// Distance in km from an arbitrary point (e.g. the visitor's position).
export function distanceFromKm(point: { lat: number; lon: number }, loc: Location): number {
  return distanceKm({ ...loc, lat: point.lat, lon: point.lon }, loc);
}
