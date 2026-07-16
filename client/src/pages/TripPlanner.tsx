/**
 * Sullivan's Crossing Fan Site – Plan Your Trip
 * Curated fan itineraries + a build-your-own route tool that chains any set of
 * filming locations into a single multi-stop Google Maps route.
 */

import { useState, useRef, useCallback } from "react";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import Reveal from "@/components/Reveal";
import {
  itineraries,
  regions,
  buildRouteUrl,
  getLocationsByIds,
  type Itinerary,
} from "@/data/show";
import { getMarkerColor, type Location } from "@/data/locations";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const TEAL = "oklch(0.52 0.10 185)";
const TEAL_LT = "oklch(0.66 0.09 185)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";

const TOPO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='none' stroke='%232d7d7d' stroke-width='1' opacity='0.14'%3E%3Cpath d='M-20 40 Q 40 10 70 40 T 160 40'/%3E%3Cpath d='M-20 70 Q 40 40 70 70 T 160 70'/%3E%3Cpath d='M-20 100 Q 40 70 70 100 T 160 100'/%3E%3Cpath d='M-20 130 Q 40 100 70 130 T 160 130'/%3E%3C/g%3E%3C/svg%3E\")";

function DifficultyPill({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 700,
        color,
        background: color + "1a",
        border: `1px solid ${color}55`,
        padding: "3px 10px",
        borderRadius: 20,
      }}
    >
      {children}
    </span>
  );
}

export default function TripPlanner() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const builderRef = useRef<HTMLDivElement | null>(null);

  const selectedLocations = getLocationsByIds(selectedIds);

  const toggle = useCallback((id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const remove = useCallback((id: number) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
  }, []);

  const move = useCallback((id: number, dir: -1 | 1) => {
    setSelectedIds((prev) => {
      const idx = prev.indexOf(id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy;
    });
  }, []);

  const loadItinerary = useCallback((it: Itinerary) => {
    setSelectedIds(it.stopIds);
    setTimeout(() => builderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  const routeUrl = buildRouteUrl(selectedLocations);

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh" }}>
      <SiteNav transparent />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)`, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: TOPO, backgroundSize: "260px 260px", opacity: 0.8 }} />
        <div style={{ position: "relative", maxWidth: 1100, margin: "0 auto", padding: "clamp(44px, 8vw, 76px) clamp(18px, 5vw, 28px)" }}>
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
                marginBottom: 18,
              }}
            >
              🧭 Plan Your Trip
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", color: PARCHMENT_LT, fontWeight: 700, fontSize: "clamp(32px, 6vw, 56px)", lineHeight: 1.05, margin: 0 }}>
              Build your Sullivan's Crossing pilgrimage
            </h1>
            <p style={{ marginTop: 18, maxWidth: 620, fontSize: "clamp(15px, 2.2vw, 18px)", lineHeight: 1.6, color: "oklch(0.8 0.03 75)" }}>
              Grab a ready-made fan itinerary or hand-pick your own stops — then open the whole
              route in Google Maps and drive it for real.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Curated itineraries ───────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 8vw, 80px) clamp(18px, 5vw, 28px) clamp(24px, 4vw, 40px)" }}>
        <Reveal>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: 14 }}>
            <span style={{ width: 26, height: 2, background: TEAL, borderRadius: 2 }} />
            Ready-Made Routes
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: NAVY, margin: 0, maxWidth: 640, lineHeight: 1.14 }}>
            Five fan trips, mapped and ready
          </h2>
        </Reveal>

        <div style={{ marginTop: 34, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
          {itineraries.map((it, i) => {
            const stops = getLocationsByIds(it.stopIds);
            return (
              <Reveal key={it.id} delay={i * 60} style={{ height: "100%" }}>
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: PARCHMENT_LT,
                    borderRadius: 18,
                    overflow: "hidden",
                    border: "1px solid oklch(0.85 0.025 75)",
                    boxShadow: "0 10px 30px oklch(0.22 0.06 220 / 0.07)",
                  }}
                >
                  <div style={{ background: it.color, padding: "18px 20px", color: "white", position: "relative" }}>
                    <div style={{ fontSize: 30, marginBottom: 6 }}>{it.emoji}</div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 700, margin: 0, lineHeight: 1.15 }}>{it.name}</h3>
                    <div style={{ fontSize: 13, opacity: 0.92, marginTop: 3, fontStyle: "italic" }}>{it.subtitle}</div>
                  </div>

                  <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                      <DifficultyPill color={it.color}>{it.difficulty}</DifficultyPill>
                      <DifficultyPill color={MUTED}>{it.stopIds.length} stops</DifficultyPill>
                    </div>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: "oklch(0.34 0.05 220)", margin: 0 }}>{it.description}</p>

                    <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                      {stops.map((s, si) => (
                        <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0" }}>
                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: "50%",
                              background: it.color + "22",
                              color: it.color,
                              fontSize: 11,
                              fontWeight: 700,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {si + 1}
                          </div>
                          <span style={{ fontSize: 13.5, color: NAVY, fontWeight: 500 }}>{s.name}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
                      <a
                        href={buildRouteUrl(stops)}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flex: "1 1 auto",
                          textAlign: "center",
                          padding: "10px 14px",
                          background: it.color,
                          color: "white",
                          borderRadius: 10,
                          fontSize: 13.5,
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                      >
                        Open route in Maps →
                      </a>
                      <button
                        onClick={() => loadItinerary(it)}
                        style={{
                          padding: "10px 14px",
                          background: "transparent",
                          color: it.color,
                          border: `1px solid ${it.color}`,
                          borderRadius: 10,
                          fontSize: 13.5,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Customize
                      </button>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Build your own ────────────────────────────────────────────────── */}
      <section
        ref={builderRef}
        style={{ background: PARCHMENT_LT, borderTop: "1px solid oklch(0.85 0.025 75)", scrollMarginTop: 70 }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(48px, 8vw, 80px) clamp(18px, 5vw, 28px)" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: AMBER, marginBottom: 14 }}>
              <span style={{ width: 26, height: 2, background: AMBER, borderRadius: 2 }} />
              Build Your Own
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 700, color: NAVY, margin: 0, maxWidth: 640, lineHeight: 1.14 }}>
              Pick your stops, get one route
            </h2>
            <p style={{ marginTop: 14, fontSize: 15.5, color: MUTED, maxWidth: 620, lineHeight: 1.6 }}>
              Tap any location to add it to your route. Reorder your stops, then open them all
              in Google Maps as a single turn-by-turn trip.
            </p>
          </Reveal>

          <div
            style={{ marginTop: 34, display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(0, 1fr)", gap: 24, alignItems: "start" }}
            className="builder-grid"
          >
            {/* Location picker grouped by region */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {regions.map((r) => {
                const locs = getLocationsByIds(r.locationIds);
                return (
                  <div key={r.id} style={{ background: PARCHMENT, border: "1px solid oklch(0.85 0.025 75)", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderBottom: "1px solid oklch(0.87 0.025 75)", borderLeft: `4px solid ${r.color}` }}>
                      <span style={{ fontSize: 18 }}>{r.emoji}</span>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: NAVY }}>{r.name}</span>
                      <span style={{ marginLeft: "auto", fontSize: 12, color: MUTED }}>{locs.length}</span>
                    </div>
                    <div>
                      {locs.map((loc) => {
                        const active = selectedIds.includes(loc.id);
                        const color = getMarkerColor(loc);
                        return (
                          <button
                            key={loc.id}
                            onClick={() => toggle(loc.id)}
                            style={{
                              width: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                              padding: "11px 16px",
                              background: active ? color + "12" : "transparent",
                              border: "none",
                              borderBottom: "1px solid oklch(0.9 0.02 75)",
                              cursor: "pointer",
                              textAlign: "left",
                            }}
                          >
                            <div
                              style={{
                                width: 24,
                                height: 24,
                                borderRadius: 7,
                                flexShrink: 0,
                                background: active ? color : "transparent",
                                border: `1.5px solid ${active ? color : "oklch(0.75 0.03 75)"}`,
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 14,
                                fontWeight: 700,
                                transition: "all 150ms",
                              }}
                            >
                              {active ? "✓" : "+"}
                            </div>
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, lineHeight: 1.25 }}>{loc.name}</div>
                              <div style={{ fontSize: 12, color: TEAL, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{loc.showName}</div>
                            </div>
                            <span
                              style={{
                                fontSize: 10.5,
                                fontWeight: 700,
                                color: loc.publicAccess ? "#2d5a3d" : "#8b5e0a",
                                background: loc.publicAccess ? "#4a7c5918" : "#c8860a18",
                                padding: "2px 7px",
                                borderRadius: 12,
                                flexShrink: 0,
                              }}
                            >
                              {loc.publicAccess ? "Public" : "Private"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Route summary */}
            <RouteSummary
              selectedLocations={selectedLocations}
              routeUrl={routeUrl}
              onRemove={remove}
              onMove={move}
              onClear={() => setSelectedIds([])}
            />
          </div>
        </div>
      </section>

      <SiteFooter />

      <style>{`
        html, body { overflow-x: hidden; }
        @media (max-width: 820px) {
          .builder-grid { grid-template-columns: 1fr !important; }
          .route-summary { position: static !important; }
        }
      `}</style>
    </div>
  );
}

// ── Sticky route summary panel ────────────────────────────────────────────
function RouteSummary({
  selectedLocations,
  routeUrl,
  onRemove,
  onMove,
  onClear,
}: {
  selectedLocations: Location[];
  routeUrl: string;
  onRemove: (id: number) => void;
  onMove: (id: number, dir: -1 | 1) => void;
  onClear: () => void;
}) {
  const count = selectedLocations.length;
  return (
    <div
      className="route-summary"
      style={{
        position: "sticky",
        top: 76,
        background: NAVY,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 20px 50px oklch(0.22 0.06 220 / 0.2)",
      }}
    >
      <div style={{ padding: "18px 20px", borderBottom: "1px solid oklch(1 0 0 / 0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: PARCHMENT_LT }}>My Route</div>
          <div style={{ fontSize: 12.5, color: TEAL_LT, marginTop: 2 }}>
            {count === 0 ? "No stops yet" : `${count} stop${count > 1 ? "s" : ""} selected`}
          </div>
        </div>
        {count > 0 && (
          <button
            onClick={onClear}
            style={{ background: "oklch(1 0 0 / 0.08)", color: "oklch(0.82 0.03 75)", border: "1px solid oklch(1 0 0 / 0.15)", borderRadius: 8, padding: "6px 12px", fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}
          >
            Clear
          </button>
        )}
      </div>

      <div style={{ maxHeight: 420, overflowY: "auto" }}>
        {count === 0 ? (
          <div style={{ padding: "36px 24px", textAlign: "center" }}>
            <div style={{ fontSize: 34, marginBottom: 10 }}>📍</div>
            <p style={{ fontSize: 14, color: "oklch(0.72 0.03 185)", lineHeight: 1.6, margin: 0 }}>
              Tap locations on the left to start building your route.
            </p>
          </div>
        ) : (
          selectedLocations.map((loc, i) => {
            const color = getMarkerColor(loc);
            return (
              <div
                key={loc.id}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", borderBottom: "1px solid oklch(1 0 0 / 0.07)" }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: color,
                    color: "white",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: PARCHMENT_LT, lineHeight: 1.25, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {loc.name}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                  <button onClick={() => onMove(loc.id, -1)} disabled={i === 0} title="Move up" style={arrowBtn(i === 0)}>
                    ↑
                  </button>
                  <button onClick={() => onMove(loc.id, 1)} disabled={i === selectedLocations.length - 1} title="Move down" style={arrowBtn(i === selectedLocations.length - 1)}>
                    ↓
                  </button>
                  <button onClick={() => onRemove(loc.id)} title="Remove" style={{ ...arrowBtn(false), color: "oklch(0.75 0.12 25)" }}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid oklch(1 0 0 / 0.1)" }}>
        <a
          href={count > 0 ? routeUrl : undefined}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (count === 0) e.preventDefault();
          }}
          style={{
            display: "block",
            textAlign: "center",
            padding: "13px 16px",
            borderRadius: 11,
            background: count > 0 ? AMBER : "oklch(0.35 0.04 220)",
            color: count > 0 ? NAVY : "oklch(0.6 0.02 220)",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            cursor: count > 0 ? "pointer" : "not-allowed",
            transition: "all 150ms",
          }}
        >
          {count > 1 ? "Open full route in Google Maps →" : count === 1 ? "Open stop in Google Maps →" : "Add stops to build a route"}
        </a>
        {count > 1 && (
          <p style={{ fontSize: 11.5, color: "oklch(0.6 0.03 185)", textAlign: "center", marginTop: 10, lineHeight: 1.5 }}>
            Opens all {count} stops as one multi-stop route. Reorder above to change the drive.
          </p>
        )}
      </div>
    </div>
  );
}

function arrowBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    borderRadius: 7,
    background: "oklch(1 0 0 / 0.08)",
    border: "1px solid oklch(1 0 0 / 0.12)",
    color: disabled ? "oklch(0.45 0.02 220)" : "oklch(0.85 0.03 75)",
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  };
}
