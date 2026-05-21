/**
 * Sullivan's Crossing – Nova Scotia Filming Locations Fan Map
 * Landing page: hero header + interactive map with always-visible legend
 * Desktop: left sidebar (38%) with pinned legend + right map canvas (62%)
 * Mobile: full-screen map + draggable bottom sheet
 */

import { MapView } from "@/components/Map";
import { useRef, useState, useCallback, useEffect } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import {
  locations,
  categoryGroups,
  seasonColors,
  getMarkerColor,
  getMapsUrl,
  type Location,
} from "@/data/locations";

// ── Season filter config ────────────────────────────────────────────────────
const SEASON_FILTERS = [
  { label: "All", value: "all" },
  { label: "S1", value: "Season 1" },
  { label: "S2", value: "Season 2" },
  { label: "S3", value: "Season 3" },
  { label: "S4", value: "Season 4" },
  { label: "All Seasons", value: "All Seasons" },
  { label: "Multi", value: "Multiple Seasons" },
];

function matchesSeason(loc: Location, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "Season 1")
    return ["Season 1", "Seasons 1 & 2", "All Seasons", "Multiple Seasons"].includes(loc.season);
  if (filter === "Season 2")
    return ["Season 2", "Seasons 1 & 2", "Seasons 2 & 3", "Season 2+", "All Seasons", "Multiple Seasons"].includes(loc.season);
  if (filter === "Season 3")
    return ["Season 3", "Seasons 2 & 3", "Season 2+", "All Seasons", "Multiple Seasons"].includes(loc.season);
  if (filter === "Season 4")
    return ["Season 4", "All Seasons", "Multiple Seasons"].includes(loc.season);
  return loc.season === filter;
}

// ── Small reusable badges ───────────────────────────────────────────────────
function SeasonBadge({ season }: { season: string }) {
  const color = seasonColors[season] || "#5a5a7a";
  return (
    <span style={{
      display: "inline-block", fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 20,
      backgroundColor: color + "22", color,
      border: `1px solid ${color}44`,
      lineHeight: 1.6,
    }}>
      {season}
    </span>
  );
}

function AccessBadge({ publicAccess }: { publicAccess: boolean }) {
  return (
    <span style={{
      display: "inline-block", fontSize: 11,
      padding: "2px 8px", borderRadius: 20,
      backgroundColor: publicAccess ? "#4a7c5922" : "#c8860a22",
      color: publicAccess ? "#2d5a3d" : "#8b5e0a",
      border: `1px solid ${publicAccess ? "#4a7c5944" : "#c8860a44"}`,
      lineHeight: 1.6,
    }}>
      {publicAccess ? "✓ Public" : "⚠ Private"}
    </span>
  );
}

// ── Legend component (used in both sidebar and mobile sheet) ────────────────
function MapLegend({ compact = false }: { compact?: boolean }) {
  return (
    <div style={{
      padding: compact ? "10px 14px 12px" : "14px 16px 16px",
      borderTop: "2px solid oklch(0.82 0.030 75)",
      background: "oklch(0.22 0.06 220)",
      flexShrink: 0,
    }}>
      <h4 style={{
        fontFamily: "var(--font-display)",
        fontSize: compact ? 10 : 11,
        fontWeight: 700,
        color: "oklch(0.75 0.09 185)",
        letterSpacing: "0.10em",
        textTransform: "uppercase",
        marginBottom: compact ? 8 : 10,
      }}>
        Map Legend
      </h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: compact ? "6px 12px" : "7px 14px" }}>
        {categoryGroups.map((g) => (
          <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 11, height: 11,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: g.color,
              border: "1.5px solid oklch(0.40 0.04 220)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: compact ? 10 : 11,
              color: "oklch(0.80 0.025 75)",
              fontWeight: 500,
            }}>
              {g.label}
            </span>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: compact ? 8 : 10,
        paddingTop: compact ? 6 : 8,
        borderTop: "1px solid oklch(0.30 0.05 220)",
        fontSize: 9,
        color: "oklch(0.55 0.04 220)",
        lineHeight: 1.5,
      }}>
        Sources: Nova Scotia Tourism · Atlas of Wonders · IMDB · CBC · Playback Online · Screen Nova Scotia
      </div>
    </div>
  );
}

// ── Location card (used in sidebar list and mobile sheet) ───────────────────
function LocationCard({
  loc, idx, isSelected, onSelect, compact = false,
}: {
  loc: Location; idx: number; isSelected: boolean; onSelect: () => void; compact?: boolean;
}) {
  const color = getMarkerColor(loc);
  return (
    <div
      onClick={onSelect}
      style={{
        padding: compact ? "11px 14px" : "13px 16px",
        borderBottom: "1px solid oklch(0.88 0.025 75)",
        cursor: "pointer",
        background: isSelected ? "oklch(0.97 0.015 75)" : "transparent",
        borderLeft: isSelected ? `3px solid ${color}` : "3px solid transparent",
        transition: "all 150ms cubic-bezier(0.23,1,0.32,1)",
        touchAction: "manipulation",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          width: 20, height: 20,
          borderRadius: "50% 50% 50% 0",
          transform: "rotate(-45deg)",
          background: color, flexShrink: 0, marginTop: 3,
          border: "2px solid white",
          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
        }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: compact ? 13 : 14,
            color: "oklch(0.22 0.06 220)", lineHeight: 1.3, marginBottom: 2,
          }}>
            {idx + 1}. {loc.name}
          </h3>
          <p style={{
            fontSize: compact ? 11 : 12,
            color: "oklch(0.52 0.10 185)", fontStyle: "italic",
            marginBottom: 5, lineHeight: 1.3,
          }}>
            {loc.showName}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            <SeasonBadge season={loc.season} />
            <AccessBadge publicAccess={loc.publicAccess} />
          </div>

          {isSelected && (
            <div style={{
              marginTop: 10, padding: "10px 12px",
              background: "oklch(0.93 0.022 75)", borderRadius: 8,
              fontSize: compact ? 12 : 13,
              color: "oklch(0.30 0.06 220)", lineHeight: 1.6,
              animation: "fadeIn 150ms ease-out",
            }}>
              <p style={{ marginBottom: 8 }}>{loc.description}</p>
              <div style={{
                padding: "8px 10px", background: "oklch(0.88 0.030 75)",
                borderRadius: 6, borderLeft: `3px solid ${color}`, marginBottom: 8,
              }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.06em", color,
                }}>
                  Fan Tip
                </span>
                <p style={{ fontSize: 12, color: "oklch(0.30 0.06 220)", marginTop: 3 }}>
                  {loc.visitorTip}
                </p>
              </div>
              <div style={{ fontSize: 12, color: "oklch(0.50 0.04 220)", marginBottom: 8 }}>
                📍 {loc.address}
              </div>
              <a
                href={getMapsUrl(loc)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-block", padding: "6px 14px",
                  background: color, color: "white", borderRadius: 7,
                  fontSize: 12, fontWeight: 600, textDecoration: "none",
                  touchAction: "manipulation",
                }}
              >
                Open in Google Maps →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Mobile bottom sheet snap positions ─────────────────────────────────────
const SHEET_PEEK = 0.72;
const SHEET_HALF = 0.42;
const SHEET_FULL = 0.06;

// ── Main page component ─────────────────────────────────────────────────────
export default function Home() {
  const isMobile = useIsMobile();
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetSnap, setSheetSnap] = useState<"peek" | "half" | "full">("peek");
  const [mobileLegendOpen, setMobileLegendOpen] = useState(false);

  const dragStartY = useRef<number | null>(null);
  const dragStartSnap = useRef<"peek" | "half" | "full">("peek");

  const filteredLocations = locations.filter((loc) => {
    const matchSeason = matchesSeason(loc, seasonFilter);
    const matchCat =
      categoryFilter === "all" ||
      categoryGroups.find((g) => g.label === categoryFilter)?.categories.includes(loc.category);
    const matchSearch =
      searchQuery === "" ||
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.showName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSeason && matchCat && matchSearch;
  });

  const selectLocation = useCallback((loc: Location) => {
    setSelectedId(loc.id);
    if (mapRef.current) {
      mapRef.current.panTo({ lat: loc.lat, lng: loc.lon });
      mapRef.current.setZoom(14);
    }
    if (isMobile) setSheetSnap("half");
    setTimeout(() => {
      cardRefs.current.get(loc.id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200);
  }, [isMobile]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    infoWindowRef.current = new google.maps.InfoWindow();

    map.setOptions({
      styles: [
        { elementType: "geometry", stylers: [{ color: "#e8dfd0" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#1a2e3b" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#f5ede0" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#a8c8d8" }] },
        { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#1a2e3b" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#d4c5b0" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#c4b5a0" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#c8a87a" }] },
        { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#c8d8b8" }] },
        { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#4a7c59" }] },
        { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#b0a090" }] },
        { featureType: "poi", elementType: "geometry", stylers: [{ color: "#ddd5c8" }] },
        { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6b5b45" }] },
        { featureType: "transit", elementType: "geometry", stylers: [{ color: "#c8b898" }] },
      ],
      gestureHandling: "greedy",
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });

    locations.forEach((loc) => {
      const color = getMarkerColor(loc);
      const pinEl = document.createElement("div");
      pinEl.style.cssText = `
        width:24px;height:24px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);background:${color};
        border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.35);
        cursor:pointer;transition:transform 120ms cubic-bezier(0.23,1,0.32,1),box-shadow 120ms;
      `;
      const marker = new google.maps.marker.AdvancedMarkerElement({
        map, position: { lat: loc.lat, lng: loc.lon }, title: loc.name, content: pinEl,
      });
      marker.addListener("click", () => {
        selectLocation(loc);
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(`
            <div style="font-family:'Source Sans 3',sans-serif;max-width:200px;padding:4px 2px;">
              <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:13px;color:#1a2e3b;margin-bottom:3px;line-height:1.3;">${loc.name}</div>
              <div style="font-size:11px;color:#2d7d7d;font-style:italic;margin-bottom:4px;">${loc.showName}</div>
              <div style="font-size:10px;color:#6b5b45;background:#f5ede0;padding:2px 6px;border-radius:4px;display:inline-block;">${loc.season}</div>
            </div>
          `);
          infoWindowRef.current.open(map, marker);
        }
      });
      markersRef.current.set(loc.id, marker);
    });
  }, [selectLocation]);

  // Update marker visibility when filters change
  useEffect(() => {
    const ids = new Set(filteredLocations.map((l) => l.id));
    markersRef.current.forEach((marker, id) => {
      marker.map = ids.has(id) ? mapRef.current : null;
    });
  }, [filteredLocations]);

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.content as HTMLElement;
      if (!el) return;
      el.style.transform = id === selectedId
        ? "rotate(-45deg) scale(1.35)"
        : "rotate(-45deg) scale(1)";
      el.style.boxShadow = id === selectedId
        ? "0 6px 18px rgba(0,0,0,0.5)"
        : "0 2px 6px rgba(0,0,0,0.35)";
    });
  }, [selectedId]);

  // Bottom sheet drag
  const onDragStart = (y: number) => { dragStartY.current = y; dragStartSnap.current = sheetSnap; };
  const onDragEnd = (y: number) => {
    if (dragStartY.current === null) return;
    const delta = y - dragStartY.current;
    dragStartY.current = null;
    if (Math.abs(delta) < 10) return;
    if (delta < -60) setSheetSnap(dragStartSnap.current === "peek" ? "half" : "full");
    else if (delta > 60) setSheetSnap(dragStartSnap.current === "full" ? "half" : "peek");
  };

  const sheetTop = sheetSnap === "peek" ? SHEET_PEEK : sheetSnap === "half" ? SHEET_HALF : SHEET_FULL;
  const selectedLocation = locations.find((l) => l.id === selectedId);

  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      background: "oklch(0.94 0.025 75)", overflow: "hidden",
    }}>

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <header style={{
        flexShrink: 0, zIndex: 50,
        background: "oklch(0.22 0.06 220)",
        borderBottom: "2px solid oklch(0.62 0.13 70 / 0.5)",
      }}>
        <div style={{
          padding: isMobile ? "10px 14px" : "0 20px",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
          minHeight: isMobile ? "auto" : 56,
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "oklch(0.62 0.13 70)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}>⚓</div>
            <div style={{ minWidth: 0 }}>
              <h1 style={{
                fontFamily: "var(--font-display)",
                color: "oklch(0.96 0.015 75)",
                fontSize: "clamp(14px, 3.5vw, 19px)",
                fontWeight: 700, lineHeight: 1.1,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>
                Sullivan's Crossing
              </h1>
              <p style={{
                color: "oklch(0.62 0.09 185)",
                fontSize: "clamp(9px, 2vw, 10px)",
                letterSpacing: "0.10em", textTransform: "uppercase",
              }}>
                Nova Scotia Filming Locations · {locations.length} confirmed spots
              </p>
            </div>
          </div>

          {/* Season filter pills */}
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {SEASON_FILTERS.map((s) => (
              <button key={s.value} onClick={() => setSeasonFilter(s.value)} style={{
                padding: "3px 9px", borderRadius: 20,
                fontSize: "clamp(10px, 2.2vw, 11px)", fontWeight: 600,
                letterSpacing: "0.03em", cursor: "pointer",
                transition: "all 150ms cubic-bezier(0.23,1,0.32,1)",
                background: seasonFilter === s.value ? "oklch(0.62 0.13 70)" : "oklch(0.28 0.06 220)",
                color: seasonFilter === s.value ? "oklch(0.22 0.06 220)" : "oklch(0.78 0.03 75)",
                border: "1px solid oklch(0.38 0.06 220)",
                minHeight: 28, touchAction: "manipulation",
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0, position: "relative" }}>

        {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
        {!isMobile && (
          <aside style={{
            width: "clamp(280px, 36%, 410px)", flexShrink: 0,
            display: "flex", flexDirection: "column",
            background: "oklch(0.97 0.015 75)",
            borderRight: "1px solid oklch(0.82 0.030 75)",
            overflow: "hidden",
          }}>
            {/* Search + Category filters */}
            <div style={{
              padding: "12px 14px", flexShrink: 0,
              borderBottom: "1px solid oklch(0.85 0.025 75)",
              background: "oklch(0.99 0.010 75)",
            }}>
              <input
                type="text"
                placeholder="Search locations, show names…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "7px 12px", borderRadius: 8,
                  border: "1px solid oklch(0.82 0.030 75)",
                  background: "oklch(0.99 0.010 75)",
                  fontFamily: "var(--font-body)", fontSize: 13,
                  color: "oklch(0.22 0.06 220)", outline: "none",
                  marginBottom: 8, boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                <button
                  onClick={() => setCategoryFilter("all")}
                  style={{
                    padding: "3px 9px", borderRadius: 12,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 150ms",
                    background: categoryFilter === "all" ? "oklch(0.22 0.06 220)" : "oklch(0.90 0.020 75)",
                    color: categoryFilter === "all" ? "oklch(0.94 0.025 75)" : "oklch(0.40 0.05 220)",
                    border: "1px solid oklch(0.80 0.025 75)",
                  }}
                >
                  All Types
                </button>
                {categoryGroups.map((g) => (
                  <button key={g.label} onClick={() => setCategoryFilter(g.label)} style={{
                    padding: "3px 9px", borderRadius: 12,
                    fontSize: 11, fontWeight: 600, cursor: "pointer",
                    transition: "all 150ms",
                    background: categoryFilter === g.label ? g.color : "oklch(0.90 0.020 75)",
                    color: categoryFilter === g.label ? "white" : "oklch(0.40 0.05 220)",
                    border: `1px solid ${categoryFilter === g.label ? g.color : "oklch(0.80 0.025 75)"}`,
                  }}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location count */}
            <div style={{
              padding: "6px 14px", fontSize: 12,
              color: "oklch(0.52 0.05 220)",
              borderBottom: "1px solid oklch(0.88 0.025 75)", flexShrink: 0,
              background: "oklch(0.97 0.015 75)",
            }}>
              <span style={{ fontWeight: 700, color: "oklch(0.22 0.06 220)" }}>
                {filteredLocations.length}
              </span>{" "}
              of {locations.length} confirmed filming locations
            </div>

            {/* Scrollable location list */}
            <div className="custom-scrollbar" style={{ overflowY: "auto", flex: 1 }}>
              {filteredLocations.length === 0 ? (
                <div style={{
                  padding: "40px 20px", textAlign: "center",
                  color: "oklch(0.55 0.04 220)",
                  fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15,
                }}>
                  No locations match your filters.
                </div>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <div key={loc.id} ref={(el) => { if (el) cardRefs.current.set(loc.id, el); }}>
                    <LocationCard
                      loc={loc} idx={idx}
                      isSelected={selectedId === loc.id}
                      onSelect={() => selectLocation(loc)}
                      compact
                    />
                  </div>
                ))
              )}
            </div>

            {/* Legend – always pinned at the bottom */}
            <MapLegend compact />
          </aside>
        )}

        {/* ── Map canvas ──────────────────────────────────────────────────── */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          <MapView
            className="w-full h-full"
            initialCenter={{ lat: 44.7, lng: -63.8 }}
            initialZoom={9}
            onMapReady={handleMapReady}
          />

          {/* Location count overlay */}
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "oklch(0.22 0.06 220 / 0.90)",
            color: "oklch(0.94 0.025 75)",
            padding: "4px 12px", borderRadius: 20,
            fontSize: 12, fontWeight: 700,
            backdropFilter: "blur(4px)", zIndex: 5, pointerEvents: "none",
          }}>
            {filteredLocations.length} shown
          </div>

          {/* Mobile: legend toggle button */}
          {isMobile && (
            <button
              onClick={() => setMobileLegendOpen((v) => !v)}
              style={{
                position: "absolute", bottom: `calc(${(1 - SHEET_PEEK) * 100}vh + 14px)`,
                left: 12, zIndex: 25,
                background: "oklch(0.22 0.06 220 / 0.92)",
                color: "oklch(0.94 0.025 75)",
                border: "1px solid oklch(0.38 0.06 220)",
                borderRadius: 10, padding: "6px 12px",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                backdropFilter: "blur(4px)",
                touchAction: "manipulation",
              }}
            >
              {mobileLegendOpen ? "✕ Legend" : "🗺 Legend"}
            </button>
          )}

          {/* Mobile: floating legend panel */}
          {isMobile && mobileLegendOpen && (
            <div style={{
              position: "absolute",
              bottom: `calc(${(1 - SHEET_PEEK) * 100}vh + 50px)`,
              left: 10, right: 10,
              background: "oklch(0.22 0.06 220 / 0.96)",
              borderRadius: 12, overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              zIndex: 26, animation: "fadeIn 150ms ease-out",
            }}>
              <div style={{ padding: "12px 14px" }}>
                <h4 style={{
                  fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700,
                  color: "oklch(0.75 0.09 185)",
                  letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: 10,
                }}>Map Legend</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
                  {categoryGroups.map((g) => (
                    <div key={g.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{
                        width: 10, height: 10, borderRadius: "50% 50% 50% 0",
                        transform: "rotate(-45deg)", background: g.color,
                        border: "1.5px solid oklch(0.40 0.04 220)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.3)", flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 11, color: "oklch(0.80 0.025 75)", fontWeight: 500 }}>
                        {g.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mobile: selected location mini-card above sheet */}
          {isMobile && selectedLocation && sheetSnap === "peek" && (
            <div
              onClick={() => setSheetSnap("half")}
              style={{
                position: "absolute",
                bottom: `calc(${(1 - SHEET_PEEK) * 100}vh + 8px)`,
                left: 80, right: 12,
                background: "oklch(0.97 0.015 75)",
                borderRadius: 12, padding: "10px 14px",
                boxShadow: "0 4px 20px rgba(26,46,59,0.22)",
                border: "1px solid oklch(0.82 0.030 75)",
                zIndex: 20, cursor: "pointer",
                animation: "slideUp 200ms cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 18, height: 18, borderRadius: "50% 50% 50% 0",
                  transform: "rotate(-45deg)",
                  background: getMarkerColor(selectedLocation),
                  border: "2px solid white", boxShadow: "0 1px 4px rgba(0,0,0,0.25)", flexShrink: 0,
                }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13,
                    color: "oklch(0.22 0.06 220)", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {selectedLocation.name}
                  </div>
                  <div style={{
                    fontSize: 11, color: "oklch(0.52 0.10 185)", fontStyle: "italic",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {selectedLocation.showName}
                  </div>
                </div>
                <div style={{ marginLeft: "auto", fontSize: 18, color: "oklch(0.52 0.10 185)" }}>›</div>
              </div>
            </div>
          )}
        </div>

        {/* ── Mobile bottom sheet ─────────────────────────────────────────── */}
        {isMobile && (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0,
            top: `${sheetTop * 100}%`,
            background: "oklch(0.97 0.015 75)",
            borderRadius: "18px 18px 0 0",
            boxShadow: "0 -4px 24px rgba(26,46,59,0.18)",
            zIndex: 30, display: "flex", flexDirection: "column",
            transition: "top 300ms cubic-bezier(0.23,1,0.32,1)",
            overflow: "hidden",
          }}>
            {/* Drag handle */}
            <div
              style={{
                flexShrink: 0, padding: "10px 0 6px",
                display: "flex", flexDirection: "column", alignItems: "center",
                cursor: "grab", touchAction: "none", userSelect: "none",
                WebkitUserSelect: "none",
              } as React.CSSProperties}
              onMouseDown={(e) => onDragStart(e.clientY)}
              onMouseUp={(e) => onDragEnd(e.clientY)}
              onTouchStart={(e) => onDragStart(e.touches[0].clientY)}
              onTouchEnd={(e) => onDragEnd(e.changedTouches[0].clientY)}
            >
              <div style={{
                width: 36, height: 4, borderRadius: 2,
                background: "oklch(0.75 0.025 75)", marginBottom: 8,
              }} />
              <div style={{
                width: "100%", padding: "0 14px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: 15, color: "oklch(0.22 0.06 220)",
                }}>
                  {filteredLocations.length} Locations
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["peek", "half", "full"] as const).map((snap) => (
                    <button key={snap} onClick={() => setSheetSnap(snap)} style={{
                      width: 28, height: 28, borderRadius: 8,
                      border: "1px solid oklch(0.82 0.030 75)",
                      background: sheetSnap === snap ? "oklch(0.52 0.10 185)" : "oklch(0.91 0.020 75)",
                      color: sheetSnap === snap ? "white" : "oklch(0.45 0.05 220)",
                      fontSize: 13, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      touchAction: "manipulation",
                    }}>
                      {snap === "peek" ? "▁" : snap === "half" ? "▄" : "█"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search + Category */}
            <div
              style={{ flexShrink: 0, padding: "6px 14px 8px", borderBottom: "1px solid oklch(0.88 0.025 75)" }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                placeholder="Search locations…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "9px 14px", borderRadius: 10,
                  border: "1px solid oklch(0.82 0.030 75)",
                  background: "oklch(0.99 0.010 75)",
                  fontFamily: "var(--font-body)", fontSize: 14,
                  color: "oklch(0.22 0.06 220)", outline: "none",
                  marginBottom: 8, boxSizing: "border-box",
                  WebkitAppearance: "none",
                }}
              />
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
                <button onClick={() => setCategoryFilter("all")} style={{
                  padding: "5px 12px", borderRadius: 20,
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", flexShrink: 0, transition: "all 150ms",
                  background: categoryFilter === "all" ? "oklch(0.22 0.06 220)" : "oklch(0.90 0.020 75)",
                  color: categoryFilter === "all" ? "oklch(0.94 0.025 75)" : "oklch(0.40 0.05 220)",
                  border: "1px solid oklch(0.80 0.025 75)", touchAction: "manipulation", minHeight: 32,
                }}>
                  All Types
                </button>
                {categoryGroups.map((g) => (
                  <button key={g.label} onClick={() => setCategoryFilter(g.label)} style={{
                    padding: "5px 12px", borderRadius: 20,
                    fontSize: 12, fontWeight: 600, cursor: "pointer",
                    whiteSpace: "nowrap", flexShrink: 0, transition: "all 150ms",
                    background: categoryFilter === g.label ? g.color : "oklch(0.90 0.020 75)",
                    color: categoryFilter === g.label ? "white" : "oklch(0.40 0.05 220)",
                    border: `1px solid ${categoryFilter === g.label ? g.color : "oklch(0.80 0.025 75)"}`,
                    touchAction: "manipulation", minHeight: 32,
                  }}>
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location list */}
            <div
              className="custom-scrollbar"
              style={{ overflowY: "auto", flex: 1, WebkitOverflowScrolling: "touch", overscrollBehavior: "contain" } as React.CSSProperties}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {filteredLocations.length === 0 ? (
                <div style={{
                  padding: "32px 16px", textAlign: "center",
                  color: "oklch(0.55 0.04 220)",
                  fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 15,
                }}>
                  No locations match your filters.
                </div>
              ) : (
                filteredLocations.map((loc, idx) => (
                  <div key={loc.id} ref={(el) => { if (el) cardRefs.current.set(loc.id, el); }}>
                    <LocationCard
                      loc={loc} idx={idx}
                      isSelected={selectedId === loc.id}
                      onSelect={() => selectLocation(loc)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Legend pinned at bottom of mobile sheet */}
            <MapLegend compact />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: oklch(0.88 0.030 75); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: oklch(0.70 0.05 185); border-radius: 3px; }
        * { -webkit-tap-highlight-color: transparent; }
        body { overflow: hidden; }
      `}</style>
    </div>
  );
}
