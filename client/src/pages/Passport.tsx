/**
 * Sullivan's Crossing Fan Site – Fan Passport
 * A personal checklist of every filming location. Fans tick off the places
 * they've visited (or spotted from the road), earn badges and share progress.
 * State lives in localStorage via fanStore, shared with the map page.
 */

import { Link } from "wouter";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import { regions, badges, badgeProgress, getLocationsByIds } from "@/data/show";
import { locations, getMarkerColor } from "@/data/locations";
import { useVisited, appUrl, shareLink } from "@/lib/fanStore";
import { downloadPassportCard } from "@/lib/passportCard";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const TEAL = "oklch(0.52 0.10 185)";
const TEAL_LT = "oklch(0.66 0.09 185)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";
const GOLD = "#b07d10";

function ProgressRing({ value, total }: { value: number; total: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = total ? value / total : 0;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label={`${value} of ${total} locations visited`}>
      <circle cx="70" cy="70" r={r} fill="none" stroke="oklch(1 0 0 / 0.12)" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={r}
        fill="none"
        stroke={AMBER}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dasharray 500ms cubic-bezier(0.23,1,0.32,1)" }}
      />
      <text x="70" y="68" textAnchor="middle" fontFamily="var(--font-display)" fontSize="34" fontWeight="700" fill={PARCHMENT_LT}>
        {value}
      </text>
      <text x="70" y="92" textAnchor="middle" fontSize="12" fill="oklch(0.75 0.03 185)">
        of {total}
      </text>
    </svg>
  );
}

export default function Passport() {
  const { visited, isVisited, toggleVisited, resetVisited } = useVisited();
  const earned = badges.filter((b) => badgeProgress(b, visited).earned);
  const pct = Math.round((visited.length / locations.length) * 100);

  const share = async () => {
    const result = await shareLink(
      "My Sullivan's Crossing Fan Passport",
      appUrl("/passport"),
      `I've visited ${visited.length} of ${locations.length} Sullivan's Crossing filming locations in Nova Scotia and earned ${earned.length} badges! 🎟️`,
    );
    if (result === "copied") toast.success("Link copied — share your progress!");
    else if (result === "failed") toast.error("Couldn't share right now");
  };

  const reset = () => {
    if (window.confirm("Clear every visited location from your passport?")) resetVisited();
  };

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      <SiteNav transparent />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "clamp(44px, 8vw, 76px) clamp(18px, 5vw, 28px)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "28px 48px",
          }}
        >
          <div style={{ flex: "1 1 360px", minWidth: 0 }}>
            <Reveal>
              <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.82 0.11 70)", marginBottom: 14 }}>
                🎟️ Fan Passport
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", color: PARCHMENT_LT, fontWeight: 700, fontSize: "clamp(32px, 6vw, 54px)", lineHeight: 1.05, margin: 0 }}>
                Collect every corner of the Crossing
              </h1>
              <p style={{ marginTop: 16, maxWidth: 560, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.6, color: "oklch(0.8 0.03 75)" }}>
                Tick off each filming location as you visit — or spot it from the road, for the
                private ones — and earn badges along the way. Your passport is saved on this device.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
                <button onClick={share} style={primaryBtn}>↗ Share my progress</button>
                <button
                  onClick={() => downloadPassportCard(visited).then(
                    () => toast.success("Passport card saved — post it proudly!"),
                    () => toast.error("Couldn't create the image on this device"),
                  )}
                  style={ghostBtn}
                >
                  ⬇ Download my card
                </button>
                <Link href="/map" style={ghostBtn}>Open the map</Link>
                {visited.length > 0 && (
                  <button onClick={reset} style={{ ...ghostBtn, color: "oklch(0.75 0.1 25)" }}>Reset</button>
                )}
              </div>
            </Reveal>
          </div>
          <Reveal delay={120}>
            <div style={{ textAlign: "center" }}>
              <ProgressRing value={visited.length} total={locations.length} />
              <div style={{ marginTop: 6, fontSize: 13, color: TEAL_LT }}>
                {pct}% complete · {earned.length}/{badges.length} badges
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Badges ────────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(44px, 7vw, 72px) clamp(18px, 5vw, 28px) 0" }}>
        <h2 style={h2}>Badges</h2>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {badges.map((b) => {
            const p = badgeProgress(b, visited);
            return (
              <div
                key={b.id}
                style={{
                  background: p.earned ? "oklch(0.95 0.05 80)" : PARCHMENT_LT,
                  border: `1px solid ${p.earned ? GOLD : "oklch(0.85 0.025 75)"}`,
                  borderRadius: 14,
                  padding: "16px 16px 14px",
                  opacity: p.earned ? 1 : 0.88,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 26, filter: p.earned ? "none" : "grayscale(1)", opacity: p.earned ? 1 : 0.55 }} aria-hidden>
                    {b.emoji}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 15.5, fontWeight: 700, color: NAVY, lineHeight: 1.2 }}>{b.name}</div>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: p.earned ? GOLD : MUTED }}>
                      {p.earned ? "✓ Earned" : `${p.have} / ${p.need}`}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, margin: "10px 0 0" }}>{b.description}</p>
                <div style={{ marginTop: 10, height: 5, borderRadius: 3, background: "oklch(0.88 0.02 75)", overflow: "hidden" }}>
                  <div style={{ width: `${(p.have / p.need) * 100}%`, height: "100%", background: p.earned ? GOLD : TEAL, transition: "width 400ms" }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Checklist ─────────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(44px, 7vw, 72px) clamp(18px, 5vw, 28px)" }}>
        <h2 style={h2}>Your checklist</h2>
        <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))", gap: 18 }}>
          {regions.map((r) => {
            const locs = getLocationsByIds(r.locationIds);
            const done = locs.filter((l) => isVisited(l.id)).length;
            return (
              <div key={r.id} style={{ background: PARCHMENT_LT, border: "1px solid oklch(0.85 0.025 75)", borderRadius: 16, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid oklch(0.87 0.025 75)", borderLeft: `4px solid ${r.color}` }}>
                  <span style={{ fontSize: 18 }} aria-hidden>{r.emoji}</span>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: NAVY }}>{r.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: done === locs.length ? GOLD : MUTED }}>
                    {done}/{locs.length}
                  </span>
                </div>
                {locs.map((loc) => {
                  const checked = isVisited(loc.id);
                  const color = getMarkerColor(loc);
                  return (
                    <div key={loc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderBottom: "1px solid oklch(0.9 0.02 75)" }}>
                      <button
                        role="checkbox"
                        aria-checked={checked}
                        aria-label={`${checked ? "Unmark" : "Mark"} ${loc.name} as visited`}
                        onClick={() => toggleVisited(loc.id)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          flexShrink: 0,
                          cursor: "pointer",
                          background: checked ? GOLD : "transparent",
                          border: `1.5px solid ${checked ? GOLD : "oklch(0.72 0.03 75)"}`,
                          color: "white",
                          fontSize: 15,
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        {checked ? "✓" : ""}
                      </button>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.25, textDecoration: checked ? "none" : undefined }}>{loc.name}</div>
                        <div style={{ fontSize: 12, color: TEAL, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc.showName}</div>
                      </div>
                      <Link
                        href={`/map?loc=${loc.id}`}
                        aria-label={`View ${loc.name} on the map`}
                        style={{ fontSize: 12, fontWeight: 700, color, textDecoration: "none", flexShrink: 0, whiteSpace: "nowrap" }}
                      >
                        {loc.publicAccess ? "Map →" : "Spot it →"}
                      </Link>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <p style={{ marginTop: 22, fontSize: 13, color: MUTED, lineHeight: 1.6 }}>
          Private locations count once you've spotted them from a public road. Please never
          trespass or disturb residents — a photo from the roadside is the fan-friendly way.
        </p>
      </section>

      <SiteFooter />
      <style>{`html, body { overflow-x: hidden; }`}</style>
    </div>
  );
}

const h2: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(24px, 4vw, 34px)",
  fontWeight: 700,
  color: NAVY,
  margin: 0,
};

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 22px",
  borderRadius: 12,
  background: AMBER,
  color: NAVY,
  fontWeight: 700,
  fontSize: 15,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
};

const ghostBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "12px 22px",
  borderRadius: 12,
  background: "oklch(1 0 0 / 0.06)",
  color: PARCHMENT_LT,
  fontWeight: 600,
  fontSize: 15,
  border: "1px solid oklch(1 0 0 / 0.18)",
  cursor: "pointer",
  textDecoration: "none",
};
