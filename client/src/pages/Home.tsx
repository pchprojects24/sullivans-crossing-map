/**
 * Sullivan's Crossing – Nova Scotia Filming Locations Fan Map
 * Design: Maritime Cartographic Romance
 * Palette: Deep ocean navy (#1a2e3b), warm parchment (#f5ede0), teal (#2d7d7d), amber (#c8860a)
 * Typography: Playfair Display (display) + Source Sans 3 (body)
 * Layout: Asymmetric split – left sidebar (38%) + right map canvas (62%)
 */

import { MapView } from "@/components/Map";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  locations,
  categoryGroups,
  seasonColors,
  getMarkerColor,
  type Location,
  type Season,
} from "@/data/locations";

const ALL_SEASONS: Season[] = [
  "All Seasons",
  "Season 1",
  "Season 2",
  "Season 3",
  "Season 4",
  "Seasons 1 & 2",
  "Seasons 2 & 3",
  "Multiple Seasons",
  "Season 2+",
];

const SEASON_FILTER_LABELS = [
  { label: "All", value: "all" },
  { label: "S1", value: "Season 1" },
  { label: "S2", value: "Season 2" },
  { label: "S3", value: "Season 3" },
  { label: "S4", value: "Season 4" },
  { label: "All Seasons", value: "All Seasons" },
  { label: "Multi", value: "Multiple Seasons" },
];

function matchesSeason(location: Location, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "Season 1")
    return (
      location.season === "Season 1" ||
      location.season === "Seasons 1 & 2" ||
      location.season === "All Seasons" ||
      location.season === "Multiple Seasons"
    );
  if (filter === "Season 2")
    return (
      location.season === "Season 2" ||
      location.season === "Seasons 1 & 2" ||
      location.season === "Seasons 2 & 3" ||
      location.season === "Season 2+" ||
      location.season === "All Seasons" ||
      location.season === "Multiple Seasons"
    );
  if (filter === "Season 3")
    return (
      location.season === "Season 3" ||
      location.season === "Seasons 2 & 3" ||
      location.season === "Season 2+" ||
      location.season === "All Seasons" ||
      location.season === "Multiple Seasons"
    );
  if (filter === "Season 4")
    return (
      location.season === "Season 4" ||
      location.season === "All Seasons" ||
      location.season === "Multiple Seasons"
    );
  return location.season === filter;
}

function SeasonBadge({ season }: { season: string }) {
  const color = seasonColors[season] || "#5a5a7a";
  return (
    <span
      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: color + "22",
        color: color,
        border: `1px solid ${color}44`,
        fontFamily: "var(--font-body)",
      }}
    >
      {season}
    </span>
  );
}

function AccessBadge({ publicAccess }: { publicAccess: boolean }) {
  return (
    <span
      className="inline-block text-xs px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: publicAccess ? "#4a7c5922" : "#c8860a22",
        color: publicAccess ? "#2d5a3d" : "#8b5e0a",
        border: `1px solid ${publicAccess ? "#4a7c5944" : "#c8860a44"}`,
        fontFamily: "var(--font-body)",
      }}
    >
      {publicAccess ? "✓ Public" : "⚠ Private"}
    </span>
  );
}

function CategoryDot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-full flex-shrink-0"
      style={{ backgroundColor: color, marginTop: 2 }}
    />
  );
}

export default function Home() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<number, google.maps.marker.AdvancedMarkerElement>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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
    // Scroll sidebar card into view
    setTimeout(() => {
      const el = cardRefs.current.get(loc.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  }, []);

  const handleMapReady = useCallback(
    (map: google.maps.Map) => {
      mapRef.current = map;
      infoWindowRef.current = new google.maps.InfoWindow();

      // Apply custom map style (muted terrain)
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
          { featureType: "administrative.land_parcel", elementType: "labels.text.fill", stylers: [{ color: "#6b5b45" }] },
          { featureType: "poi", elementType: "geometry", stylers: [{ color: "#ddd5c8" }] },
          { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#6b5b45" }] },
          { featureType: "transit", elementType: "geometry", stylers: [{ color: "#c8b898" }] },
        ],
      });

      // Create markers for all locations
      locations.forEach((loc) => {
        const color = getMarkerColor(loc);
        const pinEl = document.createElement("div");
        pinEl.style.cssText = `
          width: 28px; height: 28px; border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg); background: ${color};
          border: 2.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);
          cursor: pointer; transition: transform 120ms cubic-bezier(0.23,1,0.32,1), box-shadow 120ms;
        `;
        pinEl.addEventListener("mouseenter", () => {
          pinEl.style.transform = "rotate(-45deg) scale(1.2)";
          pinEl.style.boxShadow = "0 4px 12px rgba(0,0,0,0.45)";
        });
        pinEl.addEventListener("mouseleave", () => {
          pinEl.style.transform = "rotate(-45deg) scale(1)";
          pinEl.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
        });

        const marker = new google.maps.marker.AdvancedMarkerElement({
          map,
          position: { lat: loc.lat, lng: loc.lon },
          title: loc.name,
          content: pinEl,
        });

        marker.addListener("click", () => {
          selectLocation(loc);
          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(`
              <div style="font-family:'Source Sans 3',sans-serif; max-width:220px; padding:4px 2px;">
                <div style="font-family:'Playfair Display',serif; font-weight:700; font-size:14px; color:#1a2e3b; margin-bottom:4px; line-height:1.3;">${loc.name}</div>
                <div style="font-size:12px; color:#2d7d7d; font-style:italic; margin-bottom:4px;">${loc.showName}</div>
                <div style="font-size:11px; color:#6b5b45; background:#f5ede0; padding:3px 6px; border-radius:4px; display:inline-block;">${loc.season}</div>
              </div>
            `);
            infoWindowRef.current.open(map, marker);
          }
        });

        markersRef.current.set(loc.id, marker);
      });
    },
    [selectLocation]
  );

  // Update marker visibility when filters change
  useEffect(() => {
    const filteredIds = new Set(filteredLocations.map((l) => l.id));
    markersRef.current.forEach((marker, id) => {
      marker.map = filteredIds.has(id) ? mapRef.current : null;
    });
  }, [filteredLocations]);

  // Highlight selected marker
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const el = marker.content as HTMLElement;
      if (!el) return;
      if (id === selectedId) {
        el.style.transform = "rotate(-45deg) scale(1.35)";
        el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.5)";
        el.style.zIndex = "1000";
      } else {
        el.style.transform = "rotate(-45deg) scale(1)";
        el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.35)";
        el.style.zIndex = "1";
      }
    });
  }, [selectedId]);

  const selectedLocation = locations.find((l) => l.id === selectedId);

  return (
    <div
      className="flex flex-col"
      style={{ height: "100dvh", background: "oklch(0.94 0.025 75)", fontFamily: "var(--font-body)" }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "oklch(0.22 0.06 220)",
          borderBottom: "2px solid oklch(0.62 0.13 70 / 0.4)",
          flexShrink: 0,
          zIndex: 50,
          backgroundImage: `url('https://d2xsxph8kpxj0f.cloudfront.net/310519663404944025/TNFZ8cagyBkW9kG38ZG4xk/ns-hero-banner-dyPGQcfAxPewGyaNVUnqbW.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
          position: "relative",
        }}
        className="px-4 py-3 flex items-center justify-between gap-4"
      >
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "oklch(0.22 0.06 220 / 0.82)", backdropFilter: "blur(1px)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "contents" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "oklch(0.62 0.13 70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              fontSize: 18,
            }}
          >
            ⚓
          </div>
          <div className="min-w-0">
            <h1
              style={{
                fontFamily: "var(--font-display)",
                color: "oklch(0.94 0.025 75)",
                fontSize: "clamp(14px, 2.5vw, 20px)",
                fontWeight: 700,
                lineHeight: 1.1,
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Sullivan's Crossing
            </h1>
            <p
              style={{
                color: "oklch(0.62 0.09 185)",
                fontSize: "clamp(10px, 1.5vw, 12px)",
                fontFamily: "var(--font-body)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Nova Scotia Filming Locations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          {/* Season Filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {SEASON_FILTER_LABELS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSeasonFilter(s.value)}
                style={{
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  transition: "all 150ms cubic-bezier(0.23,1,0.32,1)",
                  background:
                    seasonFilter === s.value
                      ? "oklch(0.62 0.13 70)"
                      : "oklch(0.30 0.06 220)",
                  color:
                    seasonFilter === s.value
                      ? "oklch(0.22 0.06 220)"
                      : "oklch(0.80 0.02 75)",
                  border: "1px solid oklch(0.40 0.06 220)",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Mobile sidebar toggle */}
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen((v) => !v)}
            style={{
              padding: "5px 12px",
              borderRadius: 8,
              background: "oklch(0.30 0.06 220)",
              color: "oklch(0.80 0.02 75)",
              border: "1px solid oklch(0.40 0.06 220)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {sidebarOpen ? "Hide List" : "Show List"}
          </button>
        </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside
          className={`${sidebarOpen ? "flex" : "hidden"} lg:flex flex-col`}
          style={{
            width: "clamp(280px, 36%, 420px)",
            flexShrink: 0,
            background: "oklch(0.96 0.018 75)",
            borderRight: "1px solid oklch(0.82 0.030 75)",
            overflow: "hidden",
          }}
        >
          {/* Search + Category Filter */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: "1px solid oklch(0.82 0.030 75)",
              background: "oklch(0.97 0.015 75)",
              flexShrink: 0,
            }}
          >
            <input
              type="text"
              placeholder="Search locations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "7px 12px",
                borderRadius: 8,
                border: "1px solid oklch(0.82 0.030 75)",
                background: "oklch(0.99 0.010 75)",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                color: "oklch(0.22 0.06 220)",
                outline: "none",
                marginBottom: 8,
              }}
            />
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => setCategoryFilter("all")}
                style={{
                  padding: "3px 9px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 150ms",
                  background: categoryFilter === "all" ? "oklch(0.22 0.06 220)" : "oklch(0.90 0.020 75)",
                  color: categoryFilter === "all" ? "oklch(0.94 0.025 75)" : "oklch(0.40 0.05 220)",
                  border: "1px solid oklch(0.80 0.025 75)",
                }}
              >
                All Types
              </button>
              {categoryGroups.map((g) => (
                <button
                  key={g.label}
                  onClick={() => setCategoryFilter(g.label)}
                  style={{
                    padding: "3px 9px",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 150ms",
                    background:
                      categoryFilter === g.label
                        ? g.color
                        : "oklch(0.90 0.020 75)",
                    color:
                      categoryFilter === g.label
                        ? "white"
                        : "oklch(0.40 0.05 220)",
                    border: `1px solid ${categoryFilter === g.label ? g.color : "oklch(0.80 0.025 75)"}`,
                  }}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location count */}
          <div
            style={{
              padding: "8px 14px",
              fontSize: 12,
              color: "oklch(0.52 0.05 220)",
              borderBottom: "1px solid oklch(0.88 0.025 75)",
              fontFamily: "var(--font-body)",
              flexShrink: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: "oklch(0.22 0.06 220)" }}>
              {filteredLocations.length}
            </span>{" "}
            of {locations.length} confirmed locations
          </div>

          {/* Location List */}
          <div
            className="custom-scrollbar"
            style={{ overflowY: "auto", flex: 1 }}
          >
            {filteredLocations.length === 0 ? (
              <div
                style={{
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "oklch(0.55 0.04 220)",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 15,
                }}
              >
                No locations match your filters.
              </div>
            ) : (
              filteredLocations.map((loc, idx) => {
                const isSelected = selectedId === loc.id;
                const markerColor = getMarkerColor(loc);
                return (
                  <div
                    key={loc.id}
                    ref={(el) => {
                      if (el) cardRefs.current.set(loc.id, el);
                    }}
                    onClick={() => selectLocation(loc)}
                    className="location-card"
                    style={{
                      padding: "12px 14px",
                      borderBottom: "1px solid oklch(0.88 0.025 75)",
                      cursor: "pointer",
                      background: isSelected
                        ? "oklch(0.97 0.015 75)"
                        : "transparent",
                      borderLeft: isSelected
                        ? `3px solid ${markerColor}`
                        : "3px solid transparent",
                      transition: "all 150ms cubic-bezier(0.23,1,0.32,1)",
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50% 50% 50% 0",
                          transform: "rotate(-45deg)",
                          background: markerColor,
                          flexShrink: 0,
                          marginTop: 2,
                          border: "2px solid white",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h3
                            style={{
                              fontFamily: "var(--font-display)",
                              fontWeight: 700,
                              fontSize: 13,
                              color: "oklch(0.22 0.06 220)",
                              lineHeight: 1.3,
                              marginBottom: 2,
                            }}
                          >
                            {idx + 1}. {loc.name}
                          </h3>
                        </div>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: 11,
                            color: "oklch(0.52 0.10 185)",
                            fontStyle: "italic",
                            marginBottom: 5,
                            lineHeight: 1.3,
                          }}
                        >
                          {loc.showName}
                        </p>
                        <div className="flex flex-wrap gap-1 items-center">
                          <SeasonBadge season={loc.season} />
                          <AccessBadge publicAccess={loc.publicAccess} />
                        </div>
                        {isSelected && (
                          <div
                            style={{
                              marginTop: 8,
                              padding: "8px 10px",
                              background: "oklch(0.93 0.022 75)",
                              borderRadius: 6,
                              fontSize: 12,
                              color: "oklch(0.30 0.06 220)",
                              lineHeight: 1.5,
                              fontFamily: "var(--font-body)",
                              animation: "fadeIn 150ms ease-out",
                            }}
                          >
                            <p style={{ marginBottom: 6 }}>{loc.description}</p>
                            <div
                              style={{
                                padding: "6px 8px",
                                background: "oklch(0.88 0.030 75)",
                                borderRadius: 5,
                                borderLeft: `3px solid ${markerColor}`,
                                marginBottom: 6,
                              }}
                            >
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.06em",
                                  color: markerColor,
                                }}
                              >
                                Fan Tip
                              </span>
                              <p style={{ fontSize: 11, color: "oklch(0.30 0.06 220)", marginTop: 2 }}>
                                {loc.visitorTip}
                              </p>
                            </div>
                            <div style={{ fontSize: 11, color: "oklch(0.50 0.04 220)" }}>
                              📍 {loc.address}
                            </div>
                            {loc.mapsUrl && (
                              <a
                                href={loc.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: "inline-block",
                                  marginTop: 6,
                                  padding: "4px 10px",
                                  background: markerColor,
                                  color: "white",
                                  borderRadius: 5,
                                  fontSize: 11,
                                  fontWeight: 600,
                                  textDecoration: "none",
                                  transition: "opacity 150ms",
                                }}
                                onMouseEnter={(e) =>
                                  ((e.target as HTMLElement).style.opacity = "0.85")
                                }
                                onMouseLeave={(e) =>
                                  ((e.target as HTMLElement).style.opacity = "1")
                                }
                              >
                                Open in Google Maps →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Legend */}
          <div
            style={{
              padding: "12px 14px",
              borderTop: "2px solid oklch(0.82 0.030 75)",
              background: "oklch(0.97 0.015 75)",
              flexShrink: 0,
            }}
          >
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 700,
                color: "oklch(0.22 0.06 220)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Map Legend
            </h4>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {categoryGroups.map((g) => (
                <div key={g.label} className="flex items-center gap-1.5">
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50% 50% 50% 0",
                      transform: "rotate(-45deg)",
                      background: g.color,
                      border: "1.5px solid white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: "oklch(0.35 0.05 220)",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                    }}
                  >
                    {g.label}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 10,
                paddingTop: 8,
                borderTop: "1px solid oklch(0.88 0.025 75)",
                fontSize: 10,
                color: "oklch(0.55 0.04 220)",
                fontFamily: "var(--font-body)",
                lineHeight: 1.5,
              }}
            >
              Sources: Nova Scotia Tourism · Atlas of Wonders · IMDB · CBC · Playback Online · Screen Nova Scotia
            </div>
          </div>
        </aside>

        {/* ── Map ──────────────────────────────────────────────────────────── */}
        <div className="flex-1 relative min-w-0">
          <MapView
            className="w-full h-full"
            initialCenter={{ lat: 44.7, lng: -63.8 }}
            initialZoom={9}
            onMapReady={handleMapReady}
          />

          {/* Selected location overlay card (desktop) */}
          {selectedLocation && !sidebarOpen && (
            <div
              style={{
                position: "absolute",
                bottom: 24,
                left: 16,
                right: 16,
                background: "oklch(0.97 0.015 75)",
                borderRadius: 10,
                padding: "14px 16px",
                boxShadow: "0 8px 32px rgba(26,46,59,0.25)",
                border: "1px solid oklch(0.82 0.030 75)",
                maxWidth: 400,
                zIndex: 10,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: 15,
                  color: "oklch(0.22 0.06 220)",
                  marginBottom: 4,
                }}
              >
                {selectedLocation.name}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  color: "oklch(0.52 0.10 185)",
                  fontStyle: "italic",
                  marginBottom: 6,
                }}
              >
                {selectedLocation.showName}
              </p>
              <div className="flex gap-2 flex-wrap">
                <SeasonBadge season={selectedLocation.season} />
                <AccessBadge publicAccess={selectedLocation.publicAccess} />
              </div>
            </div>
          )}

          {/* Location count pill on map */}
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              background: "oklch(0.22 0.06 220 / 0.92)",
              color: "oklch(0.94 0.025 75)",
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              backdropFilter: "blur(4px)",
              zIndex: 5,
              pointerEvents: "none",
            }}
          >
            {filteredLocations.length} locations shown
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: oklch(0.88 0.030 75); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: oklch(0.70 0.05 185); border-radius: 3px; }
      `}</style>
    </div>
  );
}
