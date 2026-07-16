/**
 * Sullivan's Crossing Fan Site – Landing page
 * A cinematic home that introduces the show and guides fans into the
 * interactive map, the regional guides and the trip planner.
 */

import { Link } from "wouter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal, { CountUp } from "@/components/Reveal";
import {
  show,
  stats,
  regions,
  cast,
  whereToWatch,
  getLocationsByIds,
  itineraries,
} from "@/data/show";
import { getMapsUrl, getMarkerColor } from "@/data/locations";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const TEAL = "oklch(0.52 0.10 185)";
const TEAL_LT = "oklch(0.66 0.09 185)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";

const FAN_FAVOURITE_IDS = [25, 4, 27, 30, 18, 21];

// Topographic-line texture as an inline SVG data URI for the hero.
const TOPO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='none' stroke='%232d7d7d' stroke-width='1' opacity='0.14'%3E%3Cpath d='M-20 40 Q 40 10 70 40 T 160 40'/%3E%3Cpath d='M-20 70 Q 40 40 70 70 T 160 70'/%3E%3Cpath d='M-20 100 Q 40 70 70 100 T 160 100'/%3E%3Cpath d='M-20 130 Q 40 100 70 130 T 160 130'/%3E%3C/g%3E%3C/svg%3E\")";

function SectionLabel({ children, color = TEAL }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color,
        marginBottom: 14,
      }}
    >
      <span style={{ width: 26, height: 2, background: color, borderRadius: 2 }} />
      {children}
    </div>
  );
}

export default function Home() {
  const favourites = getLocationsByIds(FAN_FAVOURITE_IDS);

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      <SiteNav transparent />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          background: `radial-gradient(1200px 600px at 75% -10%, oklch(0.30 0.07 200) 0%, transparent 55%), linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`,
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, backgroundImage: TOPO, backgroundSize: "280px 280px", opacity: 1 }} />
        {/* glow */}
        <div
          style={{
            position: "absolute",
            top: "-30%",
            right: "-10%",
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, oklch(0.62 0.13 70 / 0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(56px, 10vw, 110px) clamp(18px, 5vw, 28px) clamp(48px, 8vw, 88px)",
          }}
        >
          <Reveal>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 30,
                background: "oklch(0.62 0.13 70 / 0.16)",
                border: "1px solid oklch(0.62 0.13 70 / 0.4)",
                color: "oklch(0.82 0.11 70)",
                fontSize: 12.5,
                fontWeight: 600,
                letterSpacing: "0.06em",
                marginBottom: 22,
              }}
            >
              ⚓ The unofficial fan travel guide
            </div>
          </Reveal>

          <Reveal delay={70}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                color: PARCHMENT_LT,
                fontWeight: 700,
                fontSize: "clamp(38px, 8vw, 82px)",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Sullivan's Crossing
              <br />
              <span style={{ fontStyle: "italic", color: TEAL_LT, fontWeight: 400 }}>
                filmed in Nova Scotia
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p
              style={{
                marginTop: 22,
                maxWidth: 620,
                fontSize: "clamp(16px, 2.4vw, 20px)",
                lineHeight: 1.6,
                color: "oklch(0.82 0.03 75)",
              }}
            >
              Every windswept lighthouse, cozy diner booth and lakeside campground has a
              real address. Explore all {stats.total} confirmed filming locations, plan a
              road trip, and stand exactly where Maggie, Cal and Sully do.
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
              <Link
                href="/map"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: AMBER,
                  color: NAVY,
                  fontWeight: 700,
                  fontSize: 15.5,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px oklch(0.62 0.13 70 / 0.35)",
                }}
              >
                🗺 Explore the Interactive Map
              </Link>
              <Link
                href="/trip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: "oklch(1 0 0 / 0.06)",
                  color: PARCHMENT_LT,
                  fontWeight: 600,
                  fontSize: 15.5,
                  textDecoration: "none",
                  border: "1px solid oklch(1 0 0 / 0.18)",
                }}
              >
                Plan Your Trip →
              </Link>
            </div>
          </Reveal>

          {/* Stats strip */}
          <Reveal delay={300}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 1,
                marginTop: 56,
                background: "oklch(1 0 0 / 0.1)",
                border: "1px solid oklch(1 0 0 / 0.1)",
                borderRadius: 16,
                overflow: "hidden",
              }}
            >
              {[
                { label: "Filming Locations", value: stats.total },
                { label: "Seasons", value: stats.seasons },
                { label: "Regions to Explore", value: stats.regions },
                { label: "Open to the Public", value: stats.publicAccess },
              ].map((s) => (
                <div key={s.label} style={{ background: "oklch(0.20 0.055 220)", padding: "20px 16px", textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(30px, 5vw, 44px)",
                      fontWeight: 700,
                      color: AMBER,
                      lineHeight: 1,
                    }}
                  >
                    <CountUp to={s.value} />
                  </div>
                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 11.5,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "oklch(0.7 0.03 185)",
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)", gap: "clamp(28px, 5vw, 64px)", alignItems: "start" }} className="about-grid">
          <Reveal>
            <SectionLabel>About the Show</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, color: NAVY, lineHeight: 1.12, margin: 0 }}>
              {show.tagline}
            </h2>
            <p style={{ marginTop: 20, fontSize: 17, lineHeight: 1.7, color: "oklch(0.32 0.05 220)" }}>
              {show.premise}
            </p>
            <p style={{ marginTop: 16, fontSize: 15.5, lineHeight: 1.7, color: MUTED }}>
              {show.basedOn} {show.filmedIn}
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div
              style={{
                background: NAVY,
                borderRadius: 18,
                padding: "26px 24px",
                boxShadow: "0 20px 50px oklch(0.22 0.06 220 / 0.18)",
              }}
            >
              <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: TEAL_LT, marginBottom: 18 }}>
                Quick Facts
              </div>
              {[
                { k: "Premiered", v: show.premiere },
                { k: "Seasons", v: `${show.seasons} (${show.years})` },
                { k: "Filmed in", v: "Nova Scotia, Canada" },
                { k: "Based on", v: "Robyn Carr's novels" },
              ].map((row, i, arr) => (
                <div
                  key={row.k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 14,
                    padding: "12px 0",
                    borderBottom: i < arr.length - 1 ? "1px solid oklch(1 0 0 / 0.1)" : "none",
                  }}
                >
                  <span style={{ fontSize: 13, color: "oklch(0.68 0.03 185)", letterSpacing: "0.04em" }}>{row.k}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: PARCHMENT_LT, textAlign: "right" }}>{row.v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── REGIONS ───────────────────────────────────────────────────────── */}
      <section style={{ background: PARCHMENT_LT, borderTop: "1px solid oklch(0.85 0.025 75)", borderBottom: "1px solid oklch(0.85 0.025 75)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)" }}>
          <Reveal>
            <SectionLabel>Explore by Region</SectionLabel>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, color: NAVY, margin: 0, maxWidth: 620, lineHeight: 1.12 }}>
              Six corners of Nova Scotia, one show
            </h2>
          </Reveal>

          <div
            style={{
              marginTop: 40,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 18,
            }}
          >
            {regions.map((r, i) => (
              <Reveal key={r.id} delay={i * 60}>
                <Link
                  href="/map"
                  style={{
                    display: "block",
                    height: "100%",
                    background: PARCHMENT,
                    borderRadius: 16,
                    padding: "22px 22px 20px",
                    textDecoration: "none",
                    border: "1px solid oklch(0.85 0.025 75)",
                    borderTop: `4px solid ${r.color}`,
                    transition: "transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms",
                  }}
                  className="region-card"
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span style={{ fontSize: 30 }}>{r.emoji}</span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: r.color,
                        background: r.color + "1a",
                        padding: "4px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {r.locationIds.length} spots
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.2 }}>
                    {r.name}
                  </h3>
                  <div style={{ fontSize: 12.5, color: TEAL, fontStyle: "italic", marginTop: 3, fontWeight: 600 }}>
                    {r.tagline}
                  </div>
                  <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6, color: MUTED }}>{r.blurb}</p>
                  <div style={{ marginTop: 14, fontSize: 13.5, fontWeight: 700, color: r.color }}>View on map →</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAN FAVOURITES ────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)" }}>
        <Reveal>
          <SectionLabel color={AMBER}>Fan Favourites</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, color: NAVY, margin: 0, maxWidth: 640, lineHeight: 1.12 }}>
            Six spots you can actually visit
          </h2>
          <p style={{ marginTop: 14, fontSize: 16, color: MUTED, maxWidth: 620, lineHeight: 1.6 }}>
            Order the smoked-meat sandwich, walk the granite at Peggy's Cove, or book a night
            in Cal's cabin — these public locations are the easiest way to step into the show.
          </p>
        </Reveal>

        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
          }}
        >
          {favourites.map((loc, i) => {
            const color = getMarkerColor(loc);
            return (
              <Reveal key={loc.id} delay={i * 60} style={{ height: "100%" }}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: PARCHMENT_LT,
                    borderRadius: 16,
                    overflow: "hidden",
                    border: "1px solid oklch(0.85 0.025 75)",
                    boxShadow: "0 8px 24px oklch(0.22 0.06 220 / 0.06)",
                  }}
                >
                  <div style={{ height: 6, background: color }} />
                  <div style={{ padding: "20px 20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 18.5, fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.22 }}>
                      {loc.name}
                    </h3>
                    <div style={{ fontSize: 13, color: TEAL, fontStyle: "italic", marginTop: 4 }}>{loc.showName}</div>
                    <div
                      style={{
                        marginTop: 14,
                        padding: "11px 13px",
                        background: color + "12",
                        borderLeft: `3px solid ${color}`,
                        borderRadius: 8,
                        flex: 1,
                      }}
                    >
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color }}>
                        Fan Tip
                      </div>
                      <p style={{ fontSize: 13.5, color: "oklch(0.32 0.05 220)", marginTop: 4, lineHeight: 1.55 }}>{loc.visitorTip}</p>
                    </div>
                    <a
                      href={getMapsUrl(loc)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        marginTop: 16,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 16px",
                        alignSelf: "flex-start",
                        background: color,
                        color: "white",
                        borderRadius: 9,
                        fontSize: 13,
                        fontWeight: 700,
                        textDecoration: "none",
                      }}
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── TRIP PLANNER TEASER ───────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: TOPO, backgroundSize: "260px 260px", opacity: 0.7 }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: "clamp(28px, 5vw, 56px)", alignItems: "center" }} className="about-grid">
            <Reveal>
              <SectionLabel color={TEAL_LT}>Plan Your Trip</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, color: PARCHMENT_LT, margin: 0, lineHeight: 1.12 }}>
                Turn the map into a road trip
              </h2>
              <p style={{ marginTop: 16, fontSize: 16.5, lineHeight: 1.65, color: "oklch(0.8 0.03 75)" }}>
                Pick from {itineraries.length} ready-made fan itineraries — a walkable Halifax
                diner crawl, the South Shore's postcard coastline, an overnight in Season 3's
                Hubbards — or build your own route and open every stop in Google Maps with one tap.
              </p>
              <Link
                href="/trip"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 26,
                  padding: "13px 24px",
                  borderRadius: 12,
                  background: AMBER,
                  color: NAVY,
                  fontWeight: 700,
                  fontSize: 15.5,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px oklch(0.62 0.13 70 / 0.3)",
                }}
              >
                Start planning →
              </Link>
            </Reveal>

            <Reveal delay={120}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {itineraries.slice(0, 3).map((it) => (
                  <div
                    key={it.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      background: "oklch(1 0 0 / 0.06)",
                      border: "1px solid oklch(1 0 0 / 0.12)",
                      borderRadius: 14,
                      padding: "16px 18px",
                    }}
                  >
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: 12,
                        background: it.color + "33",
                        border: `1px solid ${it.color}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 22,
                        flexShrink: 0,
                      }}
                    >
                      {it.emoji}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: PARCHMENT_LT }}>{it.name}</div>
                      <div style={{ fontSize: 13, color: "oklch(0.72 0.03 185)", marginTop: 2 }}>
                        {it.stopIds.length} stops · {it.duration}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CAST ──────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)" }}>
        <Reveal>
          <SectionLabel>Cast & Characters</SectionLabel>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 700, color: NAVY, margin: 0, lineHeight: 1.12 }}>
            Who you'll be following
          </h2>
        </Reveal>

        {/* Leads */}
        <div
          style={{
            marginTop: 36,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 18,
          }}
        >
          {cast.filter((c) => c.lead).map((c, i) => (
            <Reveal key={c.character} delay={i * 70} style={{ height: "100%" }}>
              <div
                style={{
                  height: "100%",
                  background: PARCHMENT_LT,
                  border: "1px solid oklch(0.85 0.025 75)",
                  borderRadius: 16,
                  padding: "24px 22px",
                }}
              >
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${TEAL}, ${NAVY})`,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    marginBottom: 16,
                  }}
                >
                  {c.character.replace(/[“”"]/g, "").split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: NAVY, margin: 0 }}>{c.character}</h3>
                <div style={{ fontSize: 13.5, color: AMBER, fontWeight: 700, marginTop: 3 }}>{c.actor}</div>
                <p style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.6, color: MUTED }}>{c.blurb}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Ensemble */}
        <Reveal delay={120}>
          <div style={{ marginTop: 22, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: MUTED, marginBottom: 12 }}>
            And featuring
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {cast.filter((c) => !c.lead).map((c) => (
              <div
                key={c.character}
                style={{
                  background: PARCHMENT_LT,
                  border: "1px solid oklch(0.85 0.025 75)",
                  borderRadius: 12,
                  padding: "10px 15px",
                }}
              >
                <div style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 700, color: NAVY }}>{c.character}</div>
                <div style={{ fontSize: 12.5, color: TEAL, marginTop: 1 }}>{c.actor}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── WHERE TO WATCH ────────────────────────────────────────────────── */}
      <section style={{ background: PARCHMENT_LT, borderTop: "1px solid oklch(0.85 0.025 75)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 8vw, 84px) clamp(18px, 5vw, 28px)" }}>
          <Reveal>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <SectionLabel color={AMBER}>Where to Watch</SectionLabel>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 700, color: NAVY, margin: 0 }}>
                Catch up before you go
              </h2>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18, maxWidth: 720, margin: "0 auto" }}>
            {whereToWatch.map((w, i) => (
              <Reveal key={w.region} delay={i * 80}>
                <div style={{ background: PARCHMENT, border: "1px solid oklch(0.85 0.025 75)", borderRadius: 16, padding: "22px 24px" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>
                    {w.region}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {w.services.map((s) => (
                      <div key={s.name} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
                        <span style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 700, color: NAVY }}>{s.name}</span>
                        <span style={{ fontSize: 12.5, color: MUTED }}>{s.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(155deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: TOPO, backgroundSize: "260px 260px", opacity: 0.7 }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", padding: "clamp(56px, 9vw, 96px) clamp(18px, 5vw, 28px)", textAlign: "center" }}>
          <Reveal>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🧭</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 700, color: PARCHMENT_LT, margin: 0, lineHeight: 1.1 }}>
              Ready to find your way to the Crossing?
            </h2>
            <p style={{ marginTop: 16, fontSize: 17, color: "oklch(0.8 0.03 75)", lineHeight: 1.6 }}>
              {stats.total} pins are waiting. Zoom in, filter by season, and start your own
              Sullivan's Crossing pilgrimage across Nova Scotia.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", marginTop: 30 }}>
              <Link
                href="/map"
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: AMBER,
                  color: NAVY,
                  fontWeight: 700,
                  fontSize: 16,
                  textDecoration: "none",
                  boxShadow: "0 8px 24px oklch(0.62 0.13 70 / 0.35)",
                }}
              >
                🗺 Open the Map
              </Link>
              <Link
                href="/trip"
                style={{
                  padding: "14px 28px",
                  borderRadius: 12,
                  background: "oklch(1 0 0 / 0.06)",
                  color: PARCHMENT_LT,
                  fontWeight: 600,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "1px solid oklch(1 0 0 / 0.18)",
                }}
              >
                Plan a Trip
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        html, body { overflow-x: hidden; }
        .region-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px oklch(0.22 0.06 220 / 0.14); }
        @media (max-width: 760px) {
          .about-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
