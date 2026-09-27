/**
 * Leaflet + OpenStreetMap map canvas.
 *
 * No API key or proxy is needed, so the map works anywhere the static site is
 * hosted (GitHub Pages included). The parent receives the Leaflet map instance
 * via `onMapReady` and owns markers, popups and camera moves from there.
 *
 *   <MapView initialCenter={{ lat: 44.7, lng: -63.8 }} initialZoom={9}
 *            onMapReady={(map) => { mapRef.current = map; }} />
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { usePersistFn } from "@/hooks/usePersistFn";
import { cn } from "@/lib/utils";

// CARTO Voyager: a soft, low-contrast basemap that suits the parchment palette.
const TILE_URL = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
}

export function MapView({
  className,
  initialCenter = { lat: 44.7, lng: -63.8 },
  initialZoom = 9,
  onMapReady,
}: MapViewProps) {
  const container = useRef<HTMLDivElement>(null);

  const ready = usePersistFn((map: L.Map) => onMapReady?.(map));

  useEffect(() => {
    if (!container.current) return;
    const map = L.map(container.current, {
      center: [initialCenter.lat, initialCenter.lng],
      zoom: initialZoom,
      zoomControl: false,
      worldCopyJump: true,
    });
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer(TILE_URL, {
      attribution: TILE_ATTRIBUTION,
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);
    ready(map);

    // Keep tiles filling the container when the layout around it changes.
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(container.current);
    return () => {
      ro.disconnect();
      map.remove();
    };
    // Initial center/zoom only apply on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={container}
      role="region"
      aria-label="Map of Sullivan's Crossing filming locations"
      className={cn("w-full h-[500px]", className)}
      // Own stacking context so Leaflet's internal z-indexes stay below page overlays.
      style={{ position: "relative", zIndex: 0 }}
    />
  );
}
