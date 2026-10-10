# Fan app audit — 2026-10-10

## Changes

- Normalize saved passport and trip IDs: remove duplicates, unknown IDs and
  invalid values while retaining stop order. Handle cross-tab storage clearing.
- Keep the original route when the optimization heuristic produces a longer
  route. Regression example: stops `5,4,7,37,3,26,28,29` previously increased
  the estimated distance from 229 km to 275 km.
- Fit itinerary cards and route-picker controls to narrow screens instead of
  clipping controls at 320 pixels. Clarify that route distances are estimates.
- Update Axios, Express, Nanoid, Streamdown and affected transitive dependencies
  within compatible ranges. Preserve the existing Wouter patch.

## Validation

Validated with Node 24.19.0 and the repository-pinned pnpm 10.4.1:

```sh
export COREPACK_HOME=/workspace/.cache/corepack
corepack pnpm install --frozen-lockfile --store-dir /workspace/.cache/pnpm
corepack pnpm check
corepack pnpm test
corepack pnpm build
corepack pnpm exec vite build --base=/sullivans-crossing-map/
node scripts/prerender-routes.mjs dist/public https://pchprojects24.github.io /sullivans-crossing-map/
```

Type checking, all 15 tests, the Node server build, and the GitHub Pages build
and seven-route prerender pass. Frozen installation was repeated successfully.
The optional Express server served a direct trip link and its JavaScript assets.

Headless Chromium checks covered all seven pages at desktop, tablet and phone
widths; passport persistence and read-only shared links; cross-tab clearing;
shared trips, optimization and reordering; map markers, search and reset; all
ten quiz questions; the five-question getaway flow; and mobile navigation.
No JavaScript page errors occurred in the completed functional checks.

## Remaining limitations

- The cloud proxy returns HTTP 403 for CARTO tiles. Map markers and controls
  work, but live basemap rendering remains unverified. The environment draft
  includes `a.basemaps.cartocdn.com`, `b.basemaps.cartocdn.com`,
  `c.basemaps.cartocdn.com`, `d.basemaps.cartocdn.com`,
  `fonts.googleapis.com` and `fonts.gstatic.com`. Review and save the settings,
  verify tiles load, then publish the environment. Draft saving alone does not
  apply network rules or publish a snapshot.
- `corepack pnpm audit --prod` reports one low-severity KaTeX advisory, down
  from 80 advisories (including 17 high and one critical). The remaining issue
  concerns existing prototype pollution bypassing trust restrictions. KaTeX
  enters through Streamdown, which the current app does not import. Its fix
  requires KaTeX >=0.18.2, outside the parent's current compatible range;
  evaluate an upstream update or removal of the unused Markdown dependency.
  The audit still exits nonzero; this is not a clean security audit. Development
  dependency advisories were not included in this production scan.
- These checks do not verify filming-location facts, physical travel times,
  real-device geolocation, native sharing, or deployment in a fresh cloud task.
  No site deployment or environment publication was performed.
