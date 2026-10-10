import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("react", () => ({
  useSyncExternalStore: (_subscribe: unknown, snapshot: () => unknown) => snapshot(),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));
vi.mock("@/lib/confetti", () => ({ confetti: vi.fn() }));

beforeEach(() => {
  vi.resetModules();
  const saved = new Map<string, string>();
  vi.stubGlobal("localStorage", {
    getItem: (key: string) => saved.get(key) ?? null,
    setItem: (key: string, value: string) => saved.set(key, value),
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("saved fan data", () => {
  it("discards duplicates, unknown locations and invalid values while preserving stop order", async () => {
    localStorage.setItem("sc-fan:visited", '[1,1,999,-1,"4",null,4]');
    localStorage.setItem("sc-fan:trip", '[4,1,4,999,2.5]');
    const { useVisited, useTrip } = await import("./fanStore");
    expect(useVisited().visited).toEqual([1, 4]);
    expect(useTrip().trip).toEqual([4, 1]);
    useTrip().setTrip([4, 999, 1, 4]);
    expect(useTrip().trip).toEqual([4, 1]);
    expect(JSON.parse(localStorage.getItem("sc-fan:trip")!)).toEqual([4, 1]);
  });

  it("recovers from malformed storage and keeps changes in memory if storage is blocked", async () => {
    localStorage.setItem("sc-fan:visited", '{broken');
    localStorage.setItem("sc-fan:trip", '{}');
    const { useVisited, useTrip } = await import("./fanStore");
    expect(useVisited().visited).toEqual([]);
    expect(useTrip().trip).toEqual([]);
    vi.stubGlobal("localStorage", {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
    });
    useTrip().setTrip([4, 1]);
    expect(useTrip().trip).toEqual([4, 1]);
    useVisited().toggleVisited(4);
    expect(useVisited().visited).toEqual([4]);
  });
});
