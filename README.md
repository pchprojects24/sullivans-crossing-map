# Sullivan's Crossing – Unofficial Fan Guide

A fan-made travel guide to the 37 confirmed Nova Scotia filming locations of
*Sullivan's Crossing*. Built with React 19, Vite, Tailwind 4 and Leaflet, and
deployed as a static site on GitHub Pages.

## Features

- **Interactive map** (`/map`): every location on an OpenStreetMap basemap, with
  season, category, region and text filters, fan tips and directions. **Near me**
  sorts locations by distance from you, and **Surprise me** jumps to a random spot. Deep links
  work: `/map?loc=4` opens Hali Deli and `/map?region=southshore` frames the
  South Shore.
- **Plan a trip** (`/trip`): five ready-made fan itineraries, plus a route builder.
  Your route is saved on your device and can be shared as a `/trip?stops=…`
  link. Routes open in Google Maps and are split into legs of 10 points or
  fewer, which is the most Google Maps accepts in one link. **Optimize stop
  order** reorders your stops for the shortest drive.
- **Fan Passport** (`/passport`): tick off the locations you've visited (or
  spotted from the road), earn badges (with confetti), share your progress or
  download it as a passport-card image.
- **Location trivia** (`/quiz`): ten questions generated from the location data.
- **Find your fan getaway** (`/getaway`): five quick questions match you with one
  of the fan road trips and load it into the planner.

## Data

- `client/src/data/locations.ts` is the single source of truth for locations.
- `client/src/data/show.ts` holds show facts, cast, regions, itineraries,
  badges and quiz generation. All of it is derived from the location list.
- `client/src/lib/fanStore.ts` stores the visited list and trip stops in
  localStorage.

## Development

```bash
pnpm install
pnpm dev      # local dev server
pnpm check    # type-check
pnpm exec vite build --base=/sullivans-crossing-map/   # production build as on Pages
```

Every push to `main` deploys to GitHub Pages through
`.github/workflows/deploy-pages.yml`. No API keys or secrets are required.

## Disclaimer

This is an unofficial fan project. It is not affiliated with or endorsed by the
show, CTV, The CW, Netflix or any rights holder. Many locations are private
property, so please respect residents' privacy and posted signage.
