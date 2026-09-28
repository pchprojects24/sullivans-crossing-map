// Draws a shareable 1080×1350 "Fan Passport" card and downloads it as a PNG.

import { badges, badgeProgress, regions } from "@/data/show";
import { locations } from "@/data/locations";

export async function downloadPassportCard(visited: number[]): Promise<void> {
  await document.fonts?.ready;
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const display = "'Playfair Display', Georgia, serif";
  const body = "'Source Sans 3', system-ui, sans-serif";

  // Background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#1f3a4a");
  bg.addColorStop(1, "#0f2230");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(45,125,125,0.18)";
  ctx.lineWidth = 2;
  for (let y = 60; y < H; y += 70) {
    ctx.beginPath();
    ctx.moveTo(-20, y);
    ctx.bezierCurveTo(W * 0.3, y - 40, W * 0.6, y + 40, W + 20, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "#c8860a";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.textAlign = "center";
  ctx.fillStyle = "#e0a526";
  ctx.font = `700 30px ${body}`;
  ctx.fillText("⚓  OFFICIAL-ISH FAN PASSPORT  ⚓", W / 2, 130);
  ctx.fillStyle = "#fbf7f0";
  ctx.font = `700 84px ${display}`;
  ctx.fillText("Sullivan's Crossing", W / 2, 230);
  ctx.fillStyle = "#8fc9c9";
  ctx.font = `italic 400 38px ${display}`;
  ctx.fillText("Nova Scotia filming locations", W / 2, 290);

  // Progress ring
  const cx = W / 2;
  const cy = 500;
  const r = 150;
  const pct = visited.length / locations.length;
  ctx.lineCap = "round";
  ctx.lineWidth = 30;
  ctx.strokeStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  if (pct > 0) {
    ctx.strokeStyle = "#e0a526";
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();
  }
  ctx.fillStyle = "#fbf7f0";
  ctx.font = `700 110px ${display}`;
  ctx.fillText(String(visited.length), cx, cy + 30);
  ctx.fillStyle = "#b8c9cc";
  ctx.font = `600 32px ${body}`;
  ctx.fillText(`of ${locations.length} visited`, cx, cy + 80);

  // Region rows
  let y = 740;
  ctx.textAlign = "left";
  for (const reg of regions) {
    const done = reg.locationIds.filter((id) => visited.includes(id)).length;
    const total = reg.locationIds.length;
    ctx.fillStyle = "#fbf7f0";
    ctx.font = `600 32px ${body}`;
    ctx.fillText(`${reg.emoji}  ${reg.name}`, 110, y);
    ctx.textAlign = "right";
    ctx.fillStyle = done === total ? "#e0a526" : "#b8c9cc";
    ctx.fillText(`${done}/${total}${done === total ? " ✓" : ""}`, W - 110, y);
    ctx.textAlign = "left";
    y += 58;
  }

  // Earned badges
  const earned = badges.filter((b) => badgeProgress(b, visited).earned);
  ctx.textAlign = "center";
  ctx.fillStyle = "#8fc9c9";
  ctx.font = `700 26px ${body}`;
  ctx.fillText(`${earned.length} OF ${badges.length} BADGES EARNED`, W / 2, 1140);
  ctx.font = `56px ${body}`;
  const emojis = earned.length ? earned.map((b) => b.emoji).join(" ") : "🧭";
  ctx.fillText(emojis, W / 2, 1215, W - 160);

  ctx.fillStyle = "rgba(251,247,240,0.55)";
  ctx.font = `400 22px ${body}`;
  ctx.fillText("Unofficial fan guide · not affiliated with the show", W / 2, 1282);

  const blob: Blob | null = await new Promise((res) => canvas.toBlob(res, "image/png"));
  if (!blob) throw new Error("Could not render card");
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sullivans-crossing-fan-passport.png";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
