// Post-build step for GitHub Pages: write a real index.html per route with the
// right <title>, description and social-card tags, so shared links unfurl
// correctly and deep links return HTTP 200 instead of the 404.html fallback.
// Also writes sitemap.xml and robots.txt.
//
// usage: node scripts/prerender-routes.mjs <outDir> <siteOrigin> <basePath>
import fs from "node:fs";
import path from "node:path";

const [outDir = "dist/public", origin = "", basePath = "/"] = process.argv.slice(2);
const base = basePath.endsWith("/") ? basePath : `${basePath}/`;
const image = `${origin}${base}og.png`;
// Social crawlers need an absolute image URL.
const html = fs.readFileSync(path.join(outDir, "index.html"), "utf8").replace('content="og.png"', `content="${image}"`)
  // Re-running on an already-prerendered build must not stack tags.
  .replace(/\s*<link rel="canonical"[^>]*>/g, "")
  .replace(/\s*<meta property="og:url"[^>]*>/g, "");

const routes = {
  "": null, // home keeps the default tags
  map: ["Interactive Map · Sullivan's Crossing Fan Guide", "Every Sullivan's Crossing filming location on one map. Filter by season, region and type, find the closest spot to you, and get directions."],
  episodes: ["Episode Guide · Sullivan's Crossing Fan Guide", "All 40 episodes of Sullivan's Crossing with the Nova Scotia filming locations tied to each one. Rewatch a scene, then visit the real place."],
  trip: ["Plan a Trip · Sullivan's Crossing Fan Guide", "Ready-made Sullivan's Crossing fan road trips across Nova Scotia, plus a route builder that opens every stop in Google Maps."],
  passport: ["Fan Passport · Sullivan's Crossing Fan Guide", "Tick off every Sullivan's Crossing filming location you've visited, earn badges and share your passport card."],
  quiz: ["Location Trivia · Sullivan's Crossing Fan Guide", "Ten questions on where your favourite Sullivan's Crossing scenes were filmed and which episode they were in. A new mix every time."],
  getaway: ["Find Your Fan Getaway · Sullivan's Crossing Fan Guide", "Five quick questions match you with the perfect Sullivan's Crossing fan road trip across Nova Scotia."],
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
// Pages serves /map/ from map/index.html, so use the trailing-slash form.
const url = (route) => `${origin}${base}${route}${route ? "/" : ""}`;

function withMeta(source, route, title, description) {
  const set = (re, replacement) => {
    if (!re.test(source)) throw new Error(`index.html is missing ${re}`);
    source = source.replace(re, replacement);
  };
  set(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`);
  set(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${esc(description)}" />`);
  set(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${esc(title)}" />`);
  set(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${esc(description)}" />`);
  return source.replace("</head>", `    <link rel="canonical" href="${url(route)}" />\n    <meta property="og:url" content="${url(route)}" />\n  </head>`);
}

// Home: just add the canonical + og:url.
fs.writeFileSync(path.join(outDir, "index.html"), html.replace("</head>", `    <link rel="canonical" href="${url("")}" />\n    <meta property="og:url" content="${url("")}" />\n  </head>`));

for (const [route, meta] of Object.entries(routes)) {
  if (!meta) continue;
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), withMeta(html, route, ...meta));
}

if (origin) {
  const urls = Object.keys(routes).map((r) => `  <url><loc>${url(r)}</loc></url>`).join("\n");
  fs.writeFileSync(path.join(outDir, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  fs.writeFileSync(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${origin}${base}sitemap.xml\n`);
}
console.log(`Prerendered ${Object.keys(routes).length} routes into ${outDir}`);
