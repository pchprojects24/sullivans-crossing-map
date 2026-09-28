/**
 * Sullivan's Crossing Fan Site – Find Your Fan Getaway
 * Five light-hearted questions score the curated itineraries and recommend
 * the fan road trip that suits you, ready to load into the trip planner.
 */

import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { itineraries, getLocationsByIds, estimateRouteKm } from "@/data/show";
import { appUrl, shareLink } from "@/lib/fanStore";
import { confetti } from "@/lib/confetti";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";

type Scores = Partial<Record<string, number>>;

const QUESTIONS: { prompt: string; options: { label: string; emoji: string; scores: Scores }[] }[] = [
  {
    prompt: "Your perfect Saturday morning starts with…",
    options: [
      { label: "Brunch in a cozy diner booth", emoji: "🥞", scores: { "halifax-crawl": 2, "hubbards-stay": 1 } },
      { label: "Coffee by a lighthouse, watching the waves", emoji: "🌊", scores: { "south-shore-drive": 2 } },
      { label: "A paddle across a quiet lake", emoji: "🛶", scores: { "campground-country": 2, "dartmouth-day": 1 } },
      { label: "Something a little adventurous", emoji: "🪓", scores: { "dartmouth-day": 2 } },
    ],
  },
  {
    prompt: "Pick your Sullivan's Crossing mood",
    options: [
      { label: "Campfire under the stars at the Crossing", emoji: "🔥", scores: { "campground-country": 2 } },
      { label: "Small-town streets and friendly faces", emoji: "🏘️", scores: { "south-shore-drive": 1, "halifax-crawl": 1 } },
      { label: "A cabin you never want to leave", emoji: "🛏️", scores: { "hubbards-stay": 2 } },
      { label: "City lights and harbour views", emoji: "🌉", scores: { "halifax-crawl": 2, "dartmouth-day": 1 } },
    ],
  },
  {
    prompt: "How much time have you got?",
    options: [
      { label: "A few hours", emoji: "⏱️", scores: { "halifax-crawl": 2, "campground-country": 1 } },
      { label: "One big, full day", emoji: "☀️", scores: { "south-shore-drive": 2, "dartmouth-day": 2 } },
      { label: "The whole weekend", emoji: "🗓️", scores: { "hubbards-stay": 3 } },
    ],
  },
  {
    prompt: "How do you like to get around?",
    options: [
      { label: "On foot — I want to wander", emoji: "🚶", scores: { "halifax-crawl": 2 } },
      { label: "A long, scenic coastal drive", emoji: "🚗", scores: { "south-shore-drive": 2, "campground-country": 1 } },
      { label: "Ferry hops and a bit of everything", emoji: "⛴️", scores: { "dartmouth-day": 2 } },
      { label: "Park once and stay put", emoji: "🅿️", scores: { "hubbards-stay": 2 } },
    ],
  },
  {
    prompt: "Which souvenir are you bringing home?",
    options: [
      { label: "A photo at a famous lighthouse", emoji: "📸", scores: { "south-shore-drive": 2 } },
      { label: "Axe-throwing bragging rights", emoji: "🎯", scores: { "dartmouth-day": 2 } },
      { label: "The memory of a smoked-meat sandwich", emoji: "🥪", scores: { "halifax-crawl": 2 } },
      { label: "A lakeside sunset from campground country", emoji: "🌅", scores: { "campground-country": 2 } },
      { label: "A night in Cal's cabin", emoji: "🏕️", scores: { "hubbards-stay": 2 } },
    ],
  },
];

export default function Getaway() {
  const [answers, setAnswers] = useState<number[]>([]);
  const step = answers.length;
  const done = step >= QUESTIONS.length;

  const choose = (optIdx: number) => {
    const next = [...answers, optIdx];
    setAnswers(next);
    if (next.length === QUESTIONS.length) setTimeout(confetti, 150);
  };

  // Tally scores; ties go to the itinerary listed first.
  const totals = new Map(itineraries.map((it) => [it.id, 0]));
  answers.forEach((a, qi) => {
    Object.entries(QUESTIONS[qi].options[a].scores).forEach(([id, pts]) => totals.set(id, (totals.get(id) ?? 0) + (pts ?? 0)));
  });
  const ranked = [...itineraries].sort((a, b) => (totals.get(b.id) ?? 0) - (totals.get(a.id) ?? 0));
  const match = ranked[0];
  const runnerUp = ranked[1];
  const stops = getLocationsByIds(match.stopIds);

  const share = async () => {
    const result = await shareLink(
      "My Sullivan's Crossing fan getaway",
      appUrl("/getaway"),
      `My perfect Sullivan's Crossing getaway is "${match.name}" ${match.emoji} — find yours!`,
    );
    if (result === "copied") toast.success("Link copied — see which getaway your friends get!");
  };

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav transparent />

      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px, 7vw, 64px) clamp(18px, 5vw, 28px)" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.82 0.11 70)", marginBottom: 12 }}>
            🧳 Find Your Fan Getaway
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", color: PARCHMENT_LT, fontWeight: 700, fontSize: "clamp(30px, 5.5vw, 48px)", lineHeight: 1.08, margin: 0 }}>
            Which Sullivan's Crossing trip is made for you?
          </h1>
          <p style={{ marginTop: 14, fontSize: "clamp(15px, 2.2vw, 17px)", lineHeight: 1.6, color: "oklch(0.8 0.03 75)" }}>
            Five quick questions, one perfect fan road trip across Nova Scotia.
          </p>
        </div>
      </section>

      <main style={{ flex: 1, width: "100%", maxWidth: 760, margin: "0 auto", padding: "clamp(28px, 5vw, 48px) clamp(18px, 5vw, 28px) clamp(48px, 8vw, 80px)" }}>
        {!done ? (
          <div key={step} style={{ animation: "gwIn 250ms cubic-bezier(0.23,1,0.32,1)" }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 22 }} aria-label={`Question ${step + 1} of ${QUESTIONS.length}`}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= step ? AMBER : "oklch(0.87 0.02 75)", transition: "background 200ms" }} />
              ))}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 3.6vw, 28px)", fontWeight: 700, color: NAVY, margin: "0 0 20px" }}>
              {QUESTIONS[step].prompt}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 12 }}>
              {QUESTIONS[step].options.map((o, oi) => (
                <button key={o.label} onClick={() => choose(oi)} className="gw-option" style={optionBtn}>
                  <span style={{ fontSize: 28 }} aria-hidden>{o.emoji}</span>
                  <span>{o.label}</span>
                </button>
              ))}
            </div>
            {step > 0 && (
              <button onClick={() => setAnswers(answers.slice(0, -1))} style={{ marginTop: 18, background: "none", border: "none", color: MUTED, fontWeight: 600, cursor: "pointer", fontSize: 14 }}>
                ← Back
              </button>
            )}
          </div>
        ) : (
          <div style={{ animation: "gwIn 300ms cubic-bezier(0.23,1,0.32,1)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, textAlign: "center" }}>
              Your perfect getaway is…
            </div>
            <div style={{ marginTop: 16, borderRadius: 20, overflow: "hidden", background: PARCHMENT_LT, border: "1px solid oklch(0.85 0.025 75)", boxShadow: "0 20px 50px oklch(0.22 0.06 220 / 0.14)" }}>
              <div style={{ background: match.color, color: "white", padding: "26px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 48 }} aria-hidden>{match.emoji}</div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 700, margin: "6px 0 0", lineHeight: 1.1 }}>{match.name}</h2>
                <div style={{ fontStyle: "italic", opacity: 0.92, marginTop: 4 }}>{match.subtitle}</div>
              </div>
              <div style={{ padding: "22px 24px" }}>
                <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "oklch(0.32 0.05 220)", margin: 0 }}>{match.description}</p>
                <div style={{ marginTop: 14, fontSize: 13.5, fontWeight: 700, color: MUTED }}>
                  {stops.length} stops · {match.duration}
                  {stops.length > 1 && ` · ≈ ${estimateRouteKm(stops)} km`}
                </div>
                <ol style={{ margin: "14px 0 0", paddingLeft: 20, color: NAVY, fontSize: 14.5, lineHeight: 1.8 }}>
                  {stops.map((s) => (
                    <li key={s.id}>
                      <Link href={`/map?loc=${s.id}`} style={{ color: NAVY, textDecoration: "none", fontWeight: 600 }}>{s.name}</Link>
                      <span style={{ color: MUTED, fontStyle: "italic" }}> — {s.showName}</span>
                    </li>
                  ))}
                </ol>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
                  <Link href={`/trip?stops=${match.stopIds.join(",")}`} style={{ ...cta, background: AMBER, color: NAVY }}>
                    🧭 Load into my trip planner
                  </Link>
                  <button onClick={share} style={{ ...cta, background: NAVY, color: PARCHMENT_LT }}>↗ Share my match</button>
                  <button onClick={() => setAnswers([])} style={{ ...cta, background: "transparent", color: NAVY, border: `1.5px solid ${NAVY}` }}>Retake</button>
                </div>
              </div>
            </div>
            <p style={{ marginTop: 18, textAlign: "center", fontSize: 14, color: MUTED }}>
              Runner-up: {runnerUp.emoji} <b>{runnerUp.name}</b> · or test yourself with the{" "}
              <Link href="/quiz" style={{ color: NAVY, fontWeight: 700 }}>location trivia</Link>
            </p>
          </div>
        )}
      </main>

      <SiteFooter />
      <style>{`
        @keyframes gwIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .gw-option:hover { border-color: ${AMBER} !important; transform: translateY(-2px); box-shadow: 0 10px 24px oklch(0.22 0.06 220 / 0.1); }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
      `}</style>
    </div>
  );
}

const optionBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  textAlign: "left",
  padding: "16px 18px",
  borderRadius: 14,
  border: "1.5px solid oklch(0.82 0.03 75)",
  background: PARCHMENT_LT,
  color: NAVY,
  fontSize: 15.5,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font-body)",
  transition: "all 180ms cubic-bezier(0.23,1,0.32,1)",
};

const cta: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "11px 18px",
  borderRadius: 11,
  fontWeight: 700,
  fontSize: 14.5,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: "var(--font-body)",
};
