/**
 * Sullivan's Crossing Fan Site – Location Trivia
 * A 10-question quiz generated from the confirmed-location dataset: match
 * scenes to the real places that played them, and places to their region.
 * Each answer reveals the location's fan tip and a link to the map.
 */

import { useState, useCallback } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { buildQuiz, type QuizQuestion } from "@/data/show";
import { locations } from "@/data/locations";
import { appUrl, shareLink } from "@/lib/fanStore";

const NAVY = "oklch(0.22 0.06 220)";
const NAVY_DEEP = "oklch(0.17 0.05 220)";
const PARCHMENT = "oklch(0.94 0.025 75)";
const PARCHMENT_LT = "oklch(0.97 0.015 75)";
const TEAL = "oklch(0.52 0.10 185)";
const AMBER = "oklch(0.62 0.13 70)";
const MUTED = "oklch(0.45 0.05 220)";
const RIGHT = "#2d7d4d";
const WRONG = "#b0413e";

function rank(score: number, total: number): { title: string; blurb: string } {
  const pct = score / total;
  if (pct === 1) return { title: "Honorary Timberlake Local", blurb: "Sully would hire you on the spot." };
  if (pct >= 0.7) return { title: "Campground Regular", blurb: "You know your way around the Crossing." };
  if (pct >= 0.4) return { title: "Weekend Camper", blurb: "A few more episodes and a road trip, and you'll be a local." };
  return { title: "Just Passing Through", blurb: "Time for a rewatch — and a trip to the map!" };
}

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => buildQuiz());
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const done = index >= questions.length;
  const q = questions[index];
  const loc = q ? locations.find((l) => l.id === q.locationId) : undefined;

  const choose = (opt: string) => {
    if (picked) return;
    setPicked(opt);
    if (opt === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    setPicked(null);
    setIndex((i) => i + 1);
  };

  const restart = useCallback(() => {
    setQuestions(buildQuiz());
    setIndex(0);
    setPicked(null);
    setScore(0);
  }, []);

  const share = async () => {
    const r = rank(score, questions.length);
    const result = await shareLink(
      "Sullivan's Crossing Location Trivia",
      appUrl("/quiz"),
      `I scored ${score}/${questions.length} on the Sullivan's Crossing filming-location trivia — "${r.title}"! Can you beat me?`,
    );
    if (result === "copied") toast.success("Link copied — challenge a friend!");
  };

  return (
    <div style={{ background: PARCHMENT, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <SiteNav transparent />

      <section style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_DEEP} 100%)` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(40px, 7vw, 64px) clamp(18px, 5vw, 28px)" }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "oklch(0.82 0.11 70)", marginBottom: 12 }}>
            ❓ Location Trivia
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", color: PARCHMENT_LT, fontWeight: 700, fontSize: "clamp(30px, 5.5vw, 48px)", lineHeight: 1.08, margin: 0 }}>
            How well do you know the Crossing?
          </h1>
          <p style={{ marginTop: 14, fontSize: "clamp(15px, 2.2vw, 17px)", lineHeight: 1.6, color: "oklch(0.8 0.03 75)" }}>
            Ten questions about where your favourite scenes were really filmed. A new mix every time you play.
          </p>
        </div>
      </section>

      <main style={{ flex: 1, width: "100%", maxWidth: 760, margin: "0 auto", padding: "clamp(28px, 5vw, 48px) clamp(18px, 5vw, 28px) clamp(48px, 8vw, 80px)" }}>
        {!done && q ? (
          <div>
            {/* Progress */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: MUTED, marginBottom: 8 }}>
              <span>Question {index + 1} of {questions.length}</span>
              <span>Score: {score}</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "oklch(0.87 0.02 75)", overflow: "hidden", marginBottom: 22 }}>
              <div style={{ width: `${(index / questions.length) * 100}%`, height: "100%", background: AMBER, transition: "width 300ms" }} />
            </div>

            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(20px, 3.4vw, 26px)", fontWeight: 700, color: NAVY, lineHeight: 1.3, margin: "0 0 20px" }}>
              {q.prompt}
            </h2>

            <div role="group" aria-label="Answer options" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {q.options.map((opt) => {
                const isAnswer = opt === q.answer;
                const isPicked = opt === picked;
                const reveal = picked !== null;
                const border = reveal && isAnswer ? RIGHT : reveal && isPicked ? WRONG : "oklch(0.82 0.03 75)";
                const bg = reveal && isAnswer ? RIGHT + "18" : reveal && isPicked ? WRONG + "14" : PARCHMENT_LT;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(opt)}
                    disabled={reveal}
                    style={{
                      textAlign: "left",
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: `1.5px solid ${border}`,
                      background: bg,
                      color: NAVY,
                      fontSize: 15.5,
                      fontWeight: 600,
                      cursor: reveal ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      transition: "all 150ms",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span style={{ flex: 1 }}>{opt}</span>
                    {reveal && isAnswer && <span style={{ color: RIGHT, fontWeight: 700 }}>✓</span>}
                    {reveal && isPicked && !isAnswer && <span style={{ color: WRONG, fontWeight: 700 }}>✕</span>}
                  </button>
                );
              })}
            </div>

            {picked && loc && (
              <div aria-live="polite" style={{ marginTop: 20, padding: "16px 18px", borderRadius: 12, background: PARCHMENT_LT, borderLeft: `4px solid ${picked === q.answer ? RIGHT : WRONG}` }}>
                <div style={{ fontWeight: 700, color: picked === q.answer ? RIGHT : WRONG, marginBottom: 6 }}>
                  {picked === q.answer ? "Correct!" : `Not quite — it's ${q.answer}.`}
                </div>
                <div style={{ fontSize: 14, color: "oklch(0.32 0.05 220)", lineHeight: 1.6 }}>
                  <b>{loc.showName}.</b> {loc.visitorTip}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, alignItems: "center" }}>
                  <button onClick={next} autoFocus style={primaryBtn}>
                    {index + 1 === questions.length ? "See my score →" : "Next question →"}
                  </button>
                  <Link href={`/map?loc=${loc.id}`} style={{ fontSize: 13.5, fontWeight: 700, color: TEAL, textDecoration: "none" }}>
                    See it on the map
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 54 }} aria-hidden>{score === questions.length ? "🏆" : score >= 7 ? "⛺" : "🧭"}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 8vw, 64px)", fontWeight: 700, color: NAVY, lineHeight: 1 }}>
              {score}/{questions.length}
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 700, color: AMBER, margin: "12px 0 6px" }}>
              {rank(score, questions.length).title}
            </h2>
            <p style={{ fontSize: 16, color: MUTED }}>{rank(score, questions.length).blurb}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 24 }}>
              <button onClick={restart} style={primaryBtn}>Play again</button>
              <button onClick={share} style={{ ...primaryBtn, background: NAVY, color: PARCHMENT_LT }}>↗ Challenge a friend</button>
              <Link href="/trip" style={{ ...primaryBtn, background: "transparent", color: NAVY, border: `1.5px solid ${NAVY}` }}>Plan a trip</Link>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  padding: "11px 20px",
  borderRadius: 11,
  background: AMBER,
  color: NAVY,
  fontWeight: 700,
  fontSize: 14.5,
  border: "none",
  cursor: "pointer",
  textDecoration: "none",
  fontFamily: "var(--font-body)",
};
