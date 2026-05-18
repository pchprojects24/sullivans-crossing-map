# Sullivan's Crossing Fan Map – Design Ideas

## Chosen Approach: Maritime Cartographic Romance

**Design Movement:** Vintage Nautical Cartography meets Warm Coastal Romanticism

**Core Principles:**
1. Aged parchment and inked-map textures evoke the handcrafted feel of a beloved travel journal
2. Deep teal/navy and warm amber palette mirrors Nova Scotia's sea and golden-hour light
3. Asymmetric sidebar layout with the map as the dominant canvas
4. Typography that blends serif display (Playfair Display) with clean sans-serif (Source Sans 3)

**Color Philosophy:**
- Deep ocean navy `#1a2e3b` as the primary dark tone
- Warm parchment `#f5ede0` for backgrounds and cards
- Teal `#2d7d7d` for interactive elements and category accents
- Amber gold `#c8860a` for highlights and season badges
- Soft fog `#e8dfd0` for secondary surfaces

**Layout Paradigm:**
- Full-viewport split: left sidebar (35%) with scrollable location list + legend, right panel (65%) with the interactive Google Map
- Header bar with show title, season filter chips, and category legend
- Location cards in sidebar slide in on map pin click
- Mobile: stacked layout with map on top, collapsible list below

**Signature Elements:**
1. Custom map pins shaped as compass roses or anchor icons per category
2. Parchment-textured sidebar with subtle topographic line pattern
3. Season badge ribbons on location cards (e.g. "Season 1", "All Seasons")

**Interaction Philosophy:**
- Clicking a map pin highlights the sidebar card and vice versa
- Filter by season or category with animated chip toggles
- Hover on pin shows a tooltip with show name and episode reference
- "Plan Your Visit" CTA on each card links to Google Maps directions

**Animation:**
- Sidebar cards fade+slide in (150ms ease-out) when selected
- Map pins bounce subtly on hover (scale 1.0 → 1.15, 120ms)
- Filter chips animate with a smooth width transition
- Page entrance: staggered fade-in of sidebar items (40ms stagger)

**Typography System:**
- Display: Playfair Display (bold, italic for show names)
- Body: Source Sans 3 (regular 400, medium 600)
- Accent: Playfair Display SC (small caps for category labels)
