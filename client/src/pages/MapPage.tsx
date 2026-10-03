/**
 * Sullivan's Crossing – Nova Scotia Filming Locations Fan Map
 * Interactive map page: hero header + interactive map with always-visible legend
 * Desktop: left sidebar (38%) with pinned legend + right map canvas (62%)
 * Mobile: full-screen map + draggable bottom sheet
 */

import { MapView } from "@/components/Map";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { Link, useSearch } from "wouter";
import L from "leaflet";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/useMobile";
import {
  locations,
  categoryGroups,
  seasonColors,
  getMarkerColor,
  getMapsUrl,
  matchesSeason,
  type Location,
} from "@/data/locations";
import { regions, getRegionForLocation, distanceFromKm, getEpisodesForLocation, episodeCode } from "@/data/show";
import { correctionUrl } from "@/lib/links";
import { useVisited, useTrip, appUrl, shareLink } from "@/lib/fanStore";

// Escape dataset strings before they go into Leaflet popup HTML.
function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function pinIcon(color: string, selected: boolean, visited: boolean): L.DivIcon {
  const size = selected ? 32 : 24;
  return L.divIcon({
    className: "sc-pin",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    html: `<div style="width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:${visited ? "3px solid #e0a526" : "2.5px solid white"};box-shadow:${selected ? "0 6px 18px rgba(0,0,0,0.5)" : "0 2px 6px rgba(0,0,0,0.35)"};display:flex;align-items:center;justify-content:center;transition:all 120ms;">${visited ? '<span style="transform:rotate(45deg);color:white;font-size:' + (selected ? 14 : 11) + 'px;font-weight:700;">✓</span>' : ""}</div>`,
  });
}

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
function formatKm(km: number): string {
  return km < 1 ? "< 1 km away" : `${km < 10 ? km.toFixed(1) : Math.round(km)} km away`;
}

function LocationCard({
  loc, idx, isSelected, onSelect, compact = false, distanceKm,
}: {
  loc: Location; idx: number; isSelected: boolean; onSelect: () => void; compact?: boolean; distanceKm?: number;
}) {
  const color = getMarkerColor(loc);
  const { isVisited, toggleVisited } = useVisited();
  const { inTrip, toggleTrip } = useTrip();
  const visited = isVisited(loc.id);
  const queued = inTrip(loc.id);
  const region = getRegionForLocation(loc.id);
  const eps = getEpisodesForLocation(loc.id);

  const share = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await shareLink(
      `${loc.showName} – Sullivan's Crossing filming location`,
      appUrl(`/map?loc=${loc.id}`),
      `${loc.name} played ${loc.showName} in Sullivan's Crossing.`,
    );
    if (result === "copied") toast.success("Link copied to clipboard");
    else if (result === "failed") toast.error("Couldn't share this link");
  };

  return (
    <div
      onClick={onSelect}
      className="loc-card"
      aria-current={isSelected ? "true" : undefined}
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
            {/* Real button for keyboard/screen-reader users; the click bubbles to the card. */}
            <button className="loc-title" aria-expanded={isSelected} style={{ all: "unset", cursor: "pointer" }}>
              {idx + 1}. {loc.name}
            </button>
            {visited && (
              <span title="Visited" style={{ marginLeft: 6, fontSize: 11, color: "#b07d10", fontFamily: "var(--font-body)" }}>✓ visited</span>
            )}
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
            {loc.fanSpotted && (
              <span title="Identified by a fan or local witnesses" style={{ display: "inline-block", fontSize: 11, padding: "2px 8px", borderRadius: 20, background: "#7a3a5a18", color: "#7a3a5a", border: "1px solid #7a3a5a44", lineHeight: 1.6 }}>
                👀 Fan-spotted
              </span>
            )}
            {distanceKm !== undefined && (
              <span style={{ fontSize: 11, fontWeight: 700, color: "oklch(0.45 0.08 250)", lineHeight: 1.6, padding: "2px 4px" }}>
                📍 {formatKm(distanceKm)}
              </span>
            )}
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
              {eps.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 8, fontSize: 12 }}>
                  <span style={{ fontWeight: 700 }}>📺 Rewatch:</span>
                  {eps.map((e) => (
                    <Link key={episodeCode(e)} href={`/episodes#${episodeCode(e)}`} onClick={(ev) => ev.stopPropagation()} style={{ color: "oklch(0.40 0.10 185)", fontWeight: 700, textDecoration: "underline" }}>
                      {episodeCode(e)} “{e.title}”
                    </Link>
                  ))}
                </div>
              )}
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
                📍 {loc.address}{region ? ` · ${region.emoji} ${region.name}` : ""}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
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
                Directions →
              </a>
              <button
                onClick={(e) => { e.stopPropagation(); toggleVisited(loc.id); }}
                aria-pressed={visited}
                style={cardActionBtn(visited ? "#b07d10" : undefined)}
              >
                {visited ? "✓ Visited" : loc.publicAccess ? "Mark visited" : "Mark spotted"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); toggleTrip(loc.id); toast.success(queued ? "Removed from your trip" : "Added to your trip"); }}
                aria-pressed={queued}
                style={cardActionBtn(queued ? "oklch(0.52 0.10 185)" : undefined)}
              >
                {queued ? "✓ In trip" : "+ Add to trip"}
              </button>
              <button onClick={share} style={cardActionBtn()} aria-label={`Share ${loc.name}`}>
                ↗ Share
              </button>
              </div>
              <a
                href={correctionUrl(loc.name)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ display: "inline-block", marginTop: 8, fontSize: 11.5, color: "oklch(0.45 0.05 220)" }}
              >
                Spotted a mistake? Suggest a correction
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
export default function MapPage() {
  const isMobile = useIsMobile();
  const search = useSearch();
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const { visited } = useVisited();

  // Deep links: /map?loc=<id> opens a location, /map?region=<id> filters to a region.
  const initialParams = useMemo(() => new URLSearchParams(search), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    const id = Number(initialParams.get("loc"));
    return locations.some((l) => l.id === id) ? id : null;
  });
  const [regionFilter, setRegionFilter] = useState<string>(() => {
    const r = initialParams.get("region");
    return regions.some((x) => x.id === r) ? r! : "all";
  });
  const [seasonFilter, setSeasonFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [visitFilter, setVisitFilter] = useState<"all" | "todo" | "done">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetSnap, setSheetSnap] = useState<"peek" | "half" | "full">(() => (initialParams.get("loc") ? "half" : "peek"));
  const [mobileLegendOpen, setMobileLegendOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const dragStartY = useRef<number | null>(null);
  const dragStartSnap = useRef<"peek" | "half" | "full">("peek");

  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const userMarkerRef = useRef<L.CircleMarker | null>(null);

  const activeRegion = regions.find((r) => r.id === regionFilter);
  const q = searchQuery.trim().toLowerCase();
  const filteredLocations = useMemo(() => locations.filter((loc) => {
    const matchRegion = !activeRegion || activeRegion.locationIds.includes(loc.id);
    const matchSeason = matchesSeason(loc, seasonFilter);
    const matchCat =
      categoryFilter === "all" ||
      categoryGroups.find((g) => g.label === categoryFilter)?.categories.includes(loc.category);
    const matchSearch =
      q === "" ||
      loc.name.toLowerCase().includes(q) ||
      loc.showName.toLowerCase().includes(q) ||
      loc.address.toLowerCase().includes(q) ||
      loc.description.toLowerCase().includes(q) ||
      getEpisodesForLocation(loc.id).some((e) => e.title.toLowerCase().includes(q) || episodeCode(e).toLowerCase() === q);
    const matchVisit = visitFilter === "all" || (visitFilter === "done") === visited.includes(loc.id);
    return matchRegion && matchSeason && matchCat && matchSearch && matchVisit;
  }), [activeRegion, seasonFilter, categoryFilter, q, visitFilter, visited]);

  // With "Near me" on, list the closest locations first.
  const distances = useMemo(
    () => (userPos ? new Map(locations.map((l) => [l.id, distanceFromKm(userPos, l)])) : null),
    [userPos],
  );
  const listedLocations = useMemo(
    () => (distances ? [...filteredLocations].sort((a, b) => distances.get(a.id)! - distances.get(b.id)!) : filteredLocations),
    [filteredLocations, distances],
  );

  const syncUrl = (params: Record<string, string | null>) => {
    const next = new URLSearchParams(window.location.search);
    Object.entries(params).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
    const qs = next.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  const selectLocation = useCallback((loc: Location) => {
    setSelectedId(loc.id);
    syncUrl({ loc: String(loc.id) });
    const map = mapRef.current;
    if (map) {
      const zoom = Math.max(map.getZoom(), 14);
      let target = L.latLng(loc.lat, loc.lon);
      if (isMobile) {
        // Centre the pin in the strip of map left visible above the half-open sheet.
        const h = map.getSize().y;
        const shift = h * (0.5 - SHEET_HALF / 2);
        target = map.unproject(map.project(target, zoom).add([0, shift]), zoom);
      }
      map.flyTo(target, zoom, { duration: 0.6 });
      markersRef.current.get(loc.id)?.openPopup();
    }
    if (isMobile) setSheetSnap("half");
    setTimeout(() => {
      cardRefs.current.get(loc.id)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 200);
  }, [isMobile]);

  const changeRegion = (id: string) => {
    setRegionFilter(id);
    syncUrl({ region: id === "all" ? null : id });
  };

  const handleMapReady = useCallback((map: L.Map) => {
    mapRef.current = map;

    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lon], {
        icon: pinIcon(getMarkerColor(loc), false, false),
        title: loc.name,
        alt: loc.name,
        keyboard: true,
        riseOnHover: true,
      });
      marker.bindPopup(
        `<div style="font-family:'Source Sans 3',sans-serif;max-width:210px;">
          <div style="font-family:'Playfair Display',serif;font-weight:700;font-size:13.5px;color:#1a2e3b;margin-bottom:3px;line-height:1.3;">${esc(loc.name)}</div>
          <div style="font-size:11.5px;color:#2d7d7d;font-style:italic;margin-bottom:5px;">${esc(loc.showName)}</div>
          <div style="font-size:10.5px;color:#6b5b45;background:#f5ede0;padding:2px 6px;border-radius:4px;display:inline-block;">${esc(loc.season)}</div>
        </div>`,
        { closeButton: false, autoPanPadding: [40, 80] },
      );
      marker.on("click", () => selectLocation(loc));
      markersRef.current.set(loc.id, marker);
    });
    setMapReady(true);
  }, [selectLocation]);

  // Open a deep-linked location once the map exists.
  useEffect(() => {
    if (!mapReady || selectedId === null) return;
    const loc = locations.find((l) => l.id === selectedId);
    if (loc) selectLocation(loc);
    // Only on first map load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady]);

  // Show only markers that match the filters; frame them when a region is chosen.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const ids = new Set(filteredLocations.map((l) => l.id));
    markersRef.current.forEach((marker, id) => {
      if (ids.has(id)) marker.addTo(map);
      else marker.remove();
    });
  }, [filteredLocations, mapReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (activeRegion) {
      const pts = locations.filter((l) => activeRegion.locationIds.includes(l.id)).map((l) => [l.lat, l.lon] as [number, number]);
      map.flyToBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 14, duration: 0.6 });
    }
  }, [activeRegion, mapReady]);

  // Restyle markers for the selected + visited state.
  useEffect(() => {
    markersRef.current.forEach((marker, id) => {
      const loc = locations.find((l) => l.id === id)!;
      marker.setIcon(pinIcon(getMarkerColor(loc), id === selectedId, visited.includes(id)));
      marker.setZIndexOffset(id === selectedId ? 1000 : 0);
    });
  }, [selectedId, visited, mapReady]);

  const locateMe = () => {
    if (userPos) {
      // Toggle off.
      setUserPos(null);
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      return;
    }
    if (!navigator.geolocation) {
      toast.error("Your browser can't share your location");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const here = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setUserPos(here);
        const map = mapRef.current;
        if (!map) return;
        userMarkerRef.current?.remove();
        userMarkerRef.current = L.circleMarker([here.lat, here.lon], {
          radius: 8, color: "white", weight: 3, fillColor: "#2f6fdb", fillOpacity: 1,
        }).bindTooltip("You are here").addTo(map);
        const nearest = [...locations].sort((a, b) => distanceFromKm(here, a) - distanceFromKm(here, b))[0];
        const km = distanceFromKm(here, nearest);
        if (km > 400) {
          toast(`The closest filming location is ${nearest.name}, ${Math.round(km).toLocaleString()} km away. Time to plan a trip to Nova Scotia!`);
          return;
        }
        map.flyToBounds(L.latLngBounds([[here.lat, here.lon], [nearest.lat, nearest.lon]]), { padding: [60, 60], maxZoom: 13, duration: 0.8 });
        toast.success(`Closest to you: ${nearest.name} (${formatKm(km)})`);
        if (isMobile) setSheetSnap("half");
      },
      () => {
        setLocating(false);
        toast.error("Couldn't get your location — check your browser's location permission");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  };

  const surpriseMe = () => {
    const pool = filteredLocations.length ? filteredLocations : locations;
    const others = pool.filter((l) => l.id !== selectedId);
    const pick = (others.length ? others : pool)[Math.floor(Math.random() * (others.length || pool.length))];
    selectLocation(pick);
  };

  const resetFilters = () => {
    setSeasonFilter("all");
    setCategoryFilter("all");
    setVisitFilter("all");
    setSearchQuery("");
    changeRegion("all");
  };

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
          padding: isMobile ? "8px 12px" : "0 20px",
          display: "flex", alignItems: "center",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between", gap: isMobile ? 8 : 12,
          minHeight: isMobile ? "auto" : 56,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: isMobile ? "100%" : "auto", minWidth: 0 }}>
            {/* Brand → links home */}
            <Link href="/" aria-label="Sullivan's Crossing home" style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, textDecoration: "none" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
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
                  letterSpacing: "0.10em", textTransform: "uppercase", whiteSpace: "nowrap",
                }}>
                  {locations.length} locations · ✓ {visited.length} visited
                </p>
              </div>
            </Link>
            <nav aria-label="Site" style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {MAP_NAV.filter((n) => !isMobile || n.href !== "/").map((n) => (
                <Link key={n.href} href={n.href} style={isMobile ? { ...mapNavChip, padding: "5px 7px" } : mapNavChip} aria-label={n.label} title={n.label}>
                  {isMobile ? n.icon : n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div style={{
            display: "flex", gap: 4,
            flexWrap: isMobile ? "nowrap" : "wrap", justifyContent: "flex-end",
            overflowX: isMobile ? "auto" : "visible", width: isMobile ? "100%" : "auto",
            scrollbarWidth: "none",
          }}>
            {SEASON_FILTERS.map((s) => (
              <button key={s.value} onClick={() => setSeasonFilter(s.value)} aria-pressed={seasonFilter === s.value} style={{
                padding: "3px 9px", borderRadius: 20, flexShrink: 0, whiteSpace: "nowrap",
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
                placeholder="Search places, scenes, episodes…"
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
                aria-label="Search locations"
              />
              <RegionSelect value={regionFilter} onChange={changeRegion} />
              <VisitFilter value={visitFilter} onChange={setVisitFilter} count={visited.length} />
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
              {activeRegion && <> in <b>{activeRegion.name}</b></>}
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
                  <div>
                    <button onClick={resetFilters} style={{ ...cardActionBtn(), marginTop: 12, fontStyle: "normal" }}>Reset filters</button>
                  </div>
                </div>
              ) : (
                listedLocations.map((loc, idx) => (
                  <div key={loc.id} ref={(el) => { if (el) cardRefs.current.set(loc.id, el); }}>
                    <LocationCard
                      loc={loc} idx={idx}
                      distanceKm={distances?.get(loc.id)}
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
            initialZoom={isMobile ? 8 : 9}
            onMapReady={handleMapReady}
          />

          {/* Near me / Surprise me */}
          <div style={{ position: "absolute", top: 10, left: 10, zIndex: 6, display: "flex", gap: 6 }}>
            <button onClick={locateMe} aria-pressed={!!userPos} disabled={locating} style={mapFab(!!userPos)}>
              {locating ? "Locating…" : userPos ? "✕ Near me" : "📍 Near me"}
            </button>
            <button onClick={surpriseMe} style={mapFab(false)} title="Jump to a random filming location">
              🎲 Surprise me
            </button>
          </div>

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
                placeholder="Search places, scenes, episodes…"
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
                aria-label="Search locations"
              />
              <RegionSelect value={regionFilter} onChange={changeRegion} />
              <VisitFilter value={visitFilter} onChange={setVisitFilter} count={visited.length} />
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
                  <div>
                    <button onClick={resetFilters} style={{ ...cardActionBtn(), marginTop: 12, fontStyle: "normal" }}>Reset filters</button>
                  </div>
                </div>
              ) : (
                listedLocations.map((loc, idx) => (
                  <div key={loc.id} ref={(el) => { if (el) cardRefs.current.set(loc.id, el); }}>
                    <LocationCard
                      loc={loc} idx={idx}
                      distanceKm={distances?.get(loc.id)}
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
        .loc-title:focus-visible { outline: 2px solid oklch(0.52 0.10 185); outline-offset: 2px; border-radius: 3px; }
        .sc-pin { background: none; border: none; }
        .leaflet-popup-content-wrapper { border-radius: 10px; background: #fbf7f0; }
        .leaflet-popup-tip { background: #fbf7f0; }
        .leaflet-container { font-family: var(--font-body); background: #e8dfd0; }
        .leaflet-tile-pane { filter: sepia(0.18) saturate(0.95); }
        ${isMobile ? `.leaflet-bottom { bottom: calc(${(1 - SHEET_PEEK) * 100}vh + 4px); }` : ""}
        body { overflow: hidden; }
      `}</style>
    </div>
  );
}

const MAP_NAV = [
  { label: "Home", href: "/", icon: "🏠" },
  { label: "Episodes", href: "/episodes", icon: "📺" },
  { label: "Plan a Trip", href: "/trip", icon: "🧭" },
  { label: "Passport", href: "/passport", icon: "🎟️" },
  { label: "Trivia", href: "/quiz", icon: "❓" },
  { label: "Getaway", href: "/getaway", icon: "🧳" },
];

function VisitFilter({ value, onChange, count }: { value: "all" | "todo" | "done"; onChange: (v: "all" | "todo" | "done") => void; count: number }) {
  const opts = [
    { v: "all", label: "All" },
    { v: "todo", label: "Still to visit" },
    { v: "done", label: `Visited (${count})` },
  ] as const;
  return (
    <div role="group" aria-label="Filter by passport progress" style={{ display: "flex", gap: 4, marginBottom: 8 }}>
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => onChange(o.v)}
          aria-pressed={value === o.v}
          style={{
            flex: 1, padding: "5px 6px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", minHeight: 30,
            touchAction: "manipulation", fontFamily: "var(--font-body)",
            background: value === o.v ? "oklch(0.62 0.13 70)" : "oklch(0.90 0.020 75)",
            color: value === o.v ? "oklch(0.22 0.06 220)" : "oklch(0.40 0.05 220)",
            border: "1px solid oklch(0.80 0.025 75)",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function RegionSelect({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by region"
      style={{
        width: "100%", padding: "6px 10px", borderRadius: 8, marginBottom: 8,
        border: "1px solid oklch(0.82 0.030 75)", background: "oklch(0.99 0.010 75)",
        fontFamily: "var(--font-body)", fontSize: 13, color: "oklch(0.22 0.06 220)",
      }}
    >
      <option value="all">All regions</option>
      {regions.map((r) => (
        <option key={r.id} value={r.id}>{r.emoji} {r.name} ({r.locationIds.length})</option>
      ))}
    </select>
  );
}

function mapFab(active: boolean): React.CSSProperties {
  return {
    padding: "7px 12px", borderRadius: 20, fontSize: 12.5, fontWeight: 700,
    cursor: "pointer", touchAction: "manipulation", fontFamily: "var(--font-body)",
    background: active ? "oklch(0.62 0.13 70)" : "oklch(0.22 0.06 220 / 0.92)",
    color: active ? "oklch(0.22 0.06 220)" : "oklch(0.94 0.025 75)",
    border: "1px solid oklch(0.38 0.06 220)", boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
    backdropFilter: "blur(4px)",
  };
}

function cardActionBtn(activeColor?: string): React.CSSProperties {
  return {
    display: "inline-block", padding: "6px 12px", borderRadius: 7,
    fontSize: 12, fontWeight: 600, cursor: "pointer", touchAction: "manipulation",
    fontFamily: "var(--font-body)",
    background: activeColor ? activeColor : "oklch(0.97 0.015 75)",
    color: activeColor ? "white" : "oklch(0.30 0.06 220)",
    border: `1px solid ${activeColor ?? "oklch(0.80 0.025 75)"}`,
  };
}

const mapNavChip: React.CSSProperties = {
  padding: "5px 11px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  textDecoration: "none",
  color: "oklch(0.82 0.03 75)",
  background: "oklch(0.28 0.06 220)",
  border: "1px solid oklch(0.38 0.06 220)",
};
