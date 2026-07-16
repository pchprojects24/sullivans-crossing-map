// Shared site footer: where-to-watch, quick links, sources and fan disclaimer.

import { Link } from "wouter";
import { whereToWatch, stats } from "@/data/show";

export default function SiteFooter() {
  return (
    <footer
      style={{
        background: "oklch(0.19 0.055 220)",
        color: "oklch(0.82 0.03 75)",
        borderTop: "2px solid oklch(0.62 0.13 70 / 0.35)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "clamp(32px, 6vw, 56px) clamp(16px, 4vw, 28px) 28px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "32px 24px",
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "oklch(0.62 0.13 70)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
              }}
            >
              ⚓
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                color: "oklch(0.96 0.015 75)",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Sullivan's Crossing
            </div>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "oklch(0.7 0.03 185)" }}>
            A fan-made travel guide to the {stats.total} confirmed Nova Scotia filming
            locations behind the show.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 style={footerHeading}>Explore</h4>
          <ul style={footerList}>
            <li>
              <Link href="/" style={footerLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href="/map" style={footerLink}>
                Interactive Map
              </Link>
            </li>
            <li>
              <Link href="/trip" style={footerLink}>
                Plan a Trip
              </Link>
            </li>
          </ul>
        </div>

        {/* Where to watch */}
        <div>
          <h4 style={footerHeading}>Where to Watch</h4>
          {whereToWatch.map((w) => (
            <div key={w.region} style={{ marginBottom: 10 }}>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "oklch(0.6 0.04 185)",
                  marginBottom: 3,
                }}
              >
                {w.region}
              </div>
              <div style={{ fontSize: 13.5, color: "oklch(0.85 0.03 75)" }}>
                {w.services.map((s) => s.name).join(" · ")}
              </div>
            </div>
          ))}
        </div>

        {/* Sources */}
        <div>
          <h4 style={footerHeading}>Sources</h4>
          <p style={{ fontSize: 12, lineHeight: 1.7, color: "oklch(0.65 0.03 185)" }}>
            Nova Scotia Tourism · Atlas of Wonders · IMDb · CBC · Playback Online · Screen
            Nova Scotia, plus locations confirmed by fans and local residents.
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid oklch(0.28 0.05 220)",
          padding: "16px clamp(16px, 4vw, 28px)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: 11.5, lineHeight: 1.7, color: "oklch(0.55 0.03 185)" }}>
          This is an unofficial fan project and is not affiliated with, endorsed by, or
          sponsored by Sullivan's Crossing, CTV, The CW, Netflix, or any rights holder. All
          show names and trademarks belong to their respective owners. Many locations are
          private property — please always respect residents' privacy and posted signage.
        </p>
      </div>
    </footer>
  );
}

const footerHeading: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "oklch(0.75 0.09 185)",
  marginBottom: 12,
};

const footerList: React.CSSProperties = {
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const footerLink: React.CSSProperties = {
  fontSize: 13.5,
  color: "oklch(0.82 0.03 75)",
  textDecoration: "none",
};
