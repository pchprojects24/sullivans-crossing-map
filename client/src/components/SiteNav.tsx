// Shared top navigation for the fan site (used on all content pages).
// The map page uses its own compact header so the map can stay full-bleed.

import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Interactive Map", href: "/map" },
  { label: "Plan a Trip", href: "/trip" },
];

export default function SiteNav({ transparent = false }: { transparent?: boolean }) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: transparent ? "oklch(0.22 0.06 220 / 0.86)" : "oklch(0.22 0.06 220)",
        backdropFilter: transparent ? "blur(10px)" : undefined,
        WebkitBackdropFilter: transparent ? "blur(10px)" : undefined,
        borderBottom: "1px solid oklch(0.62 0.13 70 / 0.35)",
      } as React.CSSProperties}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(14px, 4vw, 28px)",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Brand */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", minWidth: 0 }}
        >
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
              flexShrink: 0,
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            ⚓
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-display)",
                color: "oklch(0.96 0.015 75)",
                fontSize: 17,
                fontWeight: 700,
                lineHeight: 1.05,
                whiteSpace: "nowrap",
              }}
            >
              Sullivan's Crossing
            </div>
            <div
              style={{
                color: "oklch(0.62 0.09 185)",
                fontSize: 9.5,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              The Fan Map
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {NAV.map((item) => {
              const active = location === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    fontSize: 13.5,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all 150ms cubic-bezier(0.23,1,0.32,1)",
                    color: active ? "oklch(0.22 0.06 220)" : "oklch(0.82 0.03 75)",
                    background: active ? "oklch(0.62 0.13 70)" : "transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Mobile toggle */}
        {isMobile && (
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid oklch(0.38 0.06 220)",
              background: "oklch(0.28 0.06 220)",
              color: "oklch(0.9 0.03 75)",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {open ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {isMobile && open && (
        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "6px 14px 14px",
            gap: 4,
            borderTop: "1px solid oklch(0.34 0.06 220)",
            background: "oklch(0.22 0.06 220)",
          }}
        >
          {NAV.map((item) => {
            const active = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: "11px 14px",
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  textDecoration: "none",
                  color: active ? "oklch(0.22 0.06 220)" : "oklch(0.85 0.03 75)",
                  background: active ? "oklch(0.62 0.13 70)" : "oklch(0.26 0.06 220)",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
