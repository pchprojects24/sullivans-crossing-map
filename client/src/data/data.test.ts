import { describe, expect, it } from "vitest";
import { locations, matchesSeason } from "./locations";
import { regions, itineraries, episodes, buildQuiz, buildRouteUrl, splitRouteLegs, badges, getEpisodesForLocation, optimizeRoute } from "./show";

const ids = new Set(locations.map((l) => l.id));

describe("location data", () => {
  it("has unique ids and valid coordinates inside Nova Scotia", () => {
    expect(ids.size).toBe(locations.length);
    for (const l of locations) {
      expect(l.lat, l.name).toBeGreaterThan(43.3);
      expect(l.lat, l.name).toBeLessThan(47.1);
      expect(l.lon, l.name).toBeGreaterThan(-66.5);
      expect(l.lon, l.name).toBeLessThan(-59.6);
    }
  });

  it("puts every location in exactly one region", () => {
    const seen = regions.flatMap((r) => r.locationIds);
    expect(seen.length).toBe(locations.length);
    expect(new Set(seen).size).toBe(locations.length);
    seen.forEach((id) => expect(ids.has(id)).toBe(true));
  });

  it("only references real locations in itineraries, badges and episodes", () => {
    itineraries.forEach((it) => it.stopIds.forEach((id) => expect(ids.has(id), it.id).toBe(true)));
    badges.forEach((b) => "ids" in b.requires && b.requires.ids.forEach((id) => expect(ids.has(id), b.id).toBe(true)));
    episodes.forEach((e) => e.locationIds.forEach((id) => expect(ids.has(id), e.title).toBe(true)));
  });

  it("agrees with the episode numbers written in each location's show name", () => {
    for (const l of locations) {
      const m = l.showName.match(/Season (\d), Ep(?:s?)\. ([\d& ]+)/);
      if (!m) continue;
      const nums = m[2].split("&").map((n) => Number(n.trim()));
      nums.forEach((n) => {
        const ep = episodes.find((e) => e.season === Number(m[1]) && e.number === n);
        expect(ep?.locationIds, `${l.name} → S${m[1]}E${n}`).toContain(l.id);
      });
    }
  });

  it("quotes the right episode title in the show name", () => {
    for (const l of locations) {
      const m = l.showName.match(/Season (\d), Ep\. (\d+) '([^']+)'/);
      if (!m) continue;
      const ep = episodes.find((e) => e.season === Number(m[1]) && e.number === Number(m[2]));
      expect(ep?.title.toLowerCase(), l.name).toBe(m[3].toLowerCase());
    }
  });

  it("has ten episodes in each of the four seasons", () => {
    [1, 2, 3, 4].forEach((s) => expect(episodes.filter((e) => e.season === s).length).toBe(10));
  });
});

describe("season matching", () => {
  it("includes Season 2+ locations in Season 4", () => {
    const rafe = locations.find((l) => l.id === 11)!;
    expect(matchesSeason(rafe, "Season 4")).toBe(true);
    expect(matchesSeason(rafe, "Season 1")).toBe(false);
  });
});

describe("quiz", () => {
  it("builds ten questions whose answers are always among the options", () => {
    for (let i = 0; i < 50; i++) {
      const quiz = buildQuiz();
      expect(quiz.length).toBe(10);
      quiz.forEach((q) => {
        expect(q.options).toContain(q.answer);
        expect(new Set(q.options).size).toBe(q.options.length);
      });
    }
  });

  it("never offers a second correct episode as a distractor", () => {
    for (let i = 0; i < 100; i++) {
      buildQuiz().filter((q) => q.prompt.startsWith("Which episode")).forEach((q) => {
        const valid = getEpisodesForLocation(q.locationId).map((e) => `S${e.season}E${e.number}`);
        const wrong = q.options.filter((o) => o !== q.answer);
        wrong.forEach((o) => expect(valid.some((v) => o.startsWith(v + " ")), o).toBe(false));
      });
    }
  });
});

describe("routes", () => {
  const stops = locations.slice(0, 12);
  it("splits long routes into legs of at most 10 points that share joints", () => {
    const legs = splitRouteLegs(stops);
    legs.forEach((leg) => expect(leg.length).toBeLessThanOrEqual(10));
    expect(legs[0].at(-1)).toBe(legs[1][0]);
  });

  it("builds Google Maps links with origin, destination, waypoints and mode", () => {
    const url = new URL(buildRouteUrl(stops.slice(0, 4), "walking"));
    expect(url.searchParams.get("travelmode")).toBe("walking");
    expect(url.searchParams.get("origin")).toBe(`${stops[0].lat},${stops[0].lon}`);
    expect(url.searchParams.get("destination")).toBe(`${stops[3].lat},${stops[3].lon}`);
    expect(url.searchParams.get("waypoints")?.split("|").length).toBe(2);
  });

  it("keeps the first stop and every stop when optimizing", () => {
    const out = optimizeRoute(stops);
    expect(out[0]).toBe(stops[0]);
    expect(new Set(out.map((l) => l.id))).toEqual(new Set(stops.map((l) => l.id)));
  });
});
