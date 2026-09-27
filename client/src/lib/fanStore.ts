// Tiny persistent fan-state store (visited locations + trip stops).
// Backed by localStorage so a fan's passport and route survive reloads, and
// shared across pages via useSyncExternalStore so the map, trip planner and
// passport always agree. Every storage access is guarded: private windows or
// blocked storage simply fall back to in-memory state.

import { useSyncExternalStore } from "react";

type Key = "visited" | "trip";
const STORAGE_KEYS: Record<Key, string> = {
  visited: "sc-fan:visited",
  trip: "sc-fan:trip",
};

function read(key: Key): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}

const state: Record<Key, number[]> = { visited: read("visited"), trip: read("trip") };
const listeners = new Set<() => void>();

function set(key: Key, next: number[]) {
  state[key] = next;
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(next));
  } catch {
    /* storage unavailable – keep in memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.visited) state.visited = read("visited");
    else if (e.key === STORAGE_KEYS.trip) state.trip = read("trip");
    else return;
    cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

// ─── Visited (Fan Passport) ─────────────────────────────────────────────────
export function useVisited() {
  const visited = useSyncExternalStore(subscribe, () => state.visited);
  return {
    visited,
    isVisited: (id: number) => visited.includes(id),
    toggleVisited: (id: number) =>
      set("visited", state.visited.includes(id) ? state.visited.filter((x) => x !== id) : [...state.visited, id]),
    resetVisited: () => set("visited", []),
  };
}

// ─── Trip stops (ordered) ───────────────────────────────────────────────────
export function useTrip() {
  const trip = useSyncExternalStore(subscribe, () => state.trip);
  return {
    trip,
    inTrip: (id: number) => trip.includes(id),
    toggleTrip: (id: number) =>
      set("trip", state.trip.includes(id) ? state.trip.filter((x) => x !== id) : [...state.trip, id]),
    setTrip: (ids: number[]) => set("trip", Array.from(new Set(ids))),
    moveStop: (id: number, dir: -1 | 1) => {
      const idx = state.trip.indexOf(id);
      const next = idx + dir;
      if (idx < 0 || next < 0 || next >= state.trip.length) return;
      const copy = [...state.trip];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      set("trip", copy);
    },
  };
}

// ─── Sharing ────────────────────────────────────────────────────────────────
// Build an absolute URL for an in-app path, respecting the GitHub Pages base.
export function appUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${window.location.origin}${base}${path}`;
}

// Use the native share sheet where available, otherwise copy to clipboard.
// Resolves to "shared", "copied" or "failed" so callers can show feedback.
export async function shareLink(title: string, url: string, text?: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return "shared";
    }
  } catch (err) {
    if ((err as DOMException)?.name === "AbortError") return "shared";
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
}
