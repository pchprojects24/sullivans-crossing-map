/**
 * Sullivan's Crossing Fan Site – Episode Guide
 * Every episode title, with the filming locations tied to it. Built for
 * rewatches: spot a scene, then jump to the real place on the map.
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useSearch } from "wouter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { episodes, episodeCode } from "@/data/show";
import { locations, getMarkerColor, matchesSeason, isSeasonSpecific, type Location } from "@/data/locations";
import { useVisited } from "@/lib/fanStore";
import { ISSUES_URL } from "@/lib/links";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const TEAL = "oklch(0.52 0.10 185)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";
const GOLD = "#b07d10";

const SEASONS = [1, 2, 3, 4] as const;
const byId = new Map(locations.map((l) => [l.id, l]));
const episodeLocationIds = new Set(episodes.flatMap((e) => e.locationIds));

function LocationChip({ loc }: { loc: Location }) {
  const { isVisited } = useVisited();
  const color = getMarkerColor(loc);
  const seen = isVisited(loc.id);
  return (
    <Link
      href={`/map?loc=${loc.id}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        borderRadius: 10,
        border: `1px solid ${color}55`,
        borderLeft: `4px solid ${color}`,
        background: PARCHMENT,
        textDecoration: "none",
        maxWidth: "100%",
      }}
    >
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 13.5, fontWeight: 700, color: NAVY, lineHeight: 1.25 }}>{loc.name}</span>
        <span style={{ display: "block", fontSize: 12, color: TEAL, fontStyle: "italic", lineHeight: 1.3 }}>{loc.showName}</span>
      </span>
      <span style={{ fontSize: 11, fontWeight: 700, color: seen ? GOLD : loc.publicAccess ? "#2d5a3d" : "#8b5e0a", flexShrink: 0 }}>
        {seen ? "✓ Been" : loc.publicAccess ? "Public" : "Private"}
      </span>
    </Link>
  );
}

export default function Episodes() {
  const search = useSearch();
  const initial = Number(new URLSearchParams(search).get("season"));
  const [season, setSeason] = useState<number>(SEASONS.includes(initial as never) ? initial : 1);

  // /episodes#S1E6 opens that season and scrolls to the episode.
  useEffect(() => {
    const m = window.location.hash.match(/^#S([1-4])E(\d+)$/);
    if (!m) return;
    setSeason(Number(m[1]));
    setTimeout(() => document.getElementById(m[0].slice(1))?.scrollIntoView({ behavior: "smooth", block: "center" }), 150);
  }, []);

  const list = useMemo(() => episodes.filter((e) => e.season === season), [season]);
  const logged = list.filter((e) => e.locationIds.length).length;
  const seasonOnly = useMemo(
    () => locations.filter((l) => isSeasonSpecific(l) && matchesSeason(l, `Season ${season}`) && !episodeLocationIds.has(l.id)),
    [season],
  );
  const recurring = useMemo(() => locations.filter((l) => !isSeasonSpecific(l)), []);

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      <SiteNav transparent />

      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(44px, 8vw, 76px) clamp(18px, 5vw, 28px)" }}>
          <Reveal>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.82 0.11 70)", marginBottom: 14 }}>
              📺 Episode Guide
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", color: PARCHMENT_LT, fontWeight: 700, fontSize: "clamp(32px, 6vw, 54px)", lineHeight: 1.05, margin: 0 }}>
              Rewatch it, then go there
            </h1>
            <p style={{ marginTop: 16, maxWidth: 600, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.6, color: "oklch(0.8 0.03 75)" }}>
              All 40 episodes across four seasons, with every filming location we can pin to a
              specific episode. Spot a scene on screen, then follow the link to the real place.
            </p>
          </Reveal>
        </div>
      </section>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(28px, 5vw, 48px) clamp(18px, 5vw, 28px) clamp(48px, 8vw, 80px)" }}>
        <div role="tablist" aria-label="Season" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {SEASONS.map((n) => (
            <button
              key={n}
              role="tab"
              aria-selected={season === n}
              onClick={() => setSeason(n)}
              style={{
                padding: "10px 20px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                background: season === n ? NAVY : PARCHMENT_LT,
                color: season === n ? PARCHMENT_LT : NAVY,
                border: `1.5px solid ${season === n ? NAVY : "oklch(0.82 0.03 75)"}`,
              }}
            >
              Season {n}
            </button>
          ))}
        </div>

        <p style={{ marginTop: 16, fontSize: 14, color: MUTED }}>
          {logged} of {list.length} Season {season} episodes have a location tied to them so far.
          {season === 4 && " Sully is away overseas this season, so look for the Crossing's new faces instead."}
        </p>

        <ol style={{ listStyle: "none", margin: "20px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((e) => {
            const locs = e.locationIds.map((id) => byId.get(id)!).filter(Boolean);
            return (
              <li
                key={e.number}
                id={episodeCode(e)}
                style={{
                  background: PARCHMENT_LT,
                  border: "1px solid oklch(0.85 0.025 75)",
                  borderLeft: `5px solid ${locs.length ? AMBER : "oklch(0.85 0.025 75)"}`,
                  borderRadius: 14,
                  padding: "14px 18px",
                  scrollMarginTop: 80,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", color: TEAL }}>{episodeCode(e)}</span>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: NAVY, margin: 0 }}>{e.title}</h2>
                </div>
                {locs.length > 0 ? (
                  <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {locs.map((l) => (
                      <LocationChip key={l.id} loc={l} />
                    ))}
                  </div>
                ) : (
                  <p style={{ margin: "8px 0 0", fontSize: 13, color: MUTED }}>
                    No filming location logged for this episode yet.{" "}
                    <a href={`${ISSUES_URL}/new?template=location-correction.yml&title=${encodeURIComponent(`Location in ${episodeCode(e)} ${e.title}`)}`} target="_blank" rel="noopener noreferrer" style={{ color: TEAL, fontWeight: 700 }}>
                      Know one?
                    </a>
                  </p>
                )}
              </li>
            );
          })}
        </ol>

        {seasonOnly.length > 0 && (
          <section style={{ marginTop: 40 }}>
            <h2 style={sectionH2}>Also in Season {season} (episode not logged)</h2>
            <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
              {seasonOnly.map((l) => (
                <LocationChip key={l.id} loc={l} />
              ))}
            </div>
          </section>
        )}

        <section style={{ marginTop: 40 }}>
          <h2 style={sectionH2}>Seen all through the series</h2>
          <p style={{ margin: "8px 0 0", fontSize: 14, color: MUTED }}>Establishing shots and recurring sets that turn up across many episodes.</p>
          <div style={{ marginTop: 14, display: "flex", flexWrap: "wrap", gap: 10 }}>
            {recurring.map((l) => (
              <LocationChip key={l.id} loc={l} />
            ))}
          </div>
        </section>
      </main>

      <SiteFooter />
      <style>{`html, body { overflow-x: hidden; }`}</style>
    </div>
  );
}

const sectionH2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(20px, 3.4vw, 26px)",
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};
