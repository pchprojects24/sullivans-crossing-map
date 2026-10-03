import { Link } from "wouter";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

const NAVY = "oklch(0.22 0.06 220)";
const AMBER = "oklch(0.62 0.13 70)";

// Friendly dead end for mistyped or outdated links.
export default function NotFound() {
  return (
    <div style={{ background: "oklch(0.94 0.025 75)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav />
      <main style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 20px", textAlign: "center" }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 54 }} aria-hidden>🧭</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 6vw, 48px)", color: NAVY, margin: "10px 0 0", lineHeight: 1.1 }}>
            Looks like you've wandered off the trail
          </h1>
          <p style={{ marginTop: 14, fontSize: 17, lineHeight: 1.6, color: "oklch(0.40 0.05 220)" }}>
            That page doesn't exist, but the Crossing is just a few clicks away.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 26 }}>
            <Link href="/" style={{ padding: "12px 22px", borderRadius: 12, background: AMBER, color: NAVY, fontWeight: 700, textDecoration: "none" }}>Back to home</Link>
            <Link href="/map" style={{ padding: "12px 22px", borderRadius: 12, border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 700, textDecoration: "none" }}>Open the map</Link>
            <Link href="/episodes" style={{ padding: "12px 22px", borderRadius: 12, border: `1.5px solid ${NAVY}`, color: NAVY, fontWeight: 700, textDecoration: "none" }}>Episode guide</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
