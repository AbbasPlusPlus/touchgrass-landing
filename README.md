# touchgrass-landing

One-page landing site for [TouchGrass](https://github.com/AbbasPlusPlus/touchgrass) — the macOS break reminder.

Next.js 16 (App Router, Turbopack) + React 19 + Tailwind v4. Static — the whole page
prerenders, the scene is drawn client-side on canvas.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static prerender + OG image
npm run lint
npm run typecheck
```

Deploys to Vercel with no configuration.

## What's here

Dusk field at golden hour: dark UI, fireflies, a glowing break screen.

```
app/
  layout.tsx            Fraunces + Nunito via next/font, metadata, OG/Twitter tags
  page.tsx              section order + SoftwareApplication JSON-LD
  globals.css           design tokens (@theme), the fixed backdrop stack, .btn
  opengraph-image.tsx   1200×630 share card, generated at build
components/
  Backdrop.tsx          mounts the canvas scene; everything else is a server component
  BreakScreen.tsx       the break-screen mock — live clock, running countdown
  Hero / Features / Closing / icons
lib/
  grass.ts              the canvas engine
  site.ts               all copy, links, version, requirements
```

No nav and no footer: the page is a headline, the mock, three cards and two Download
buttons. Copy, the download URL, version and requirements live in `lib/site.ts` — edit
there, not in JSX. `site.download` currently points at the GitHub releases page; swap it
for the real asset.

## The scene

`lib/grass.ts` draws the dusk field on three stacked canvases (far / mid / near). The outer
two get a CSS blur so the middle band reads as the focal plane, the way a long lens sees a
field. Blades grow in, sway on a gusting wind, part around the cursor, and sprout where you
click. Fireflies drift over the top.

Lifecycle is where the care went:

- one shared `requestAnimationFrame` for every canvas instead of four
- the loop parks itself when the tab is hidden
- everything returns a disposer, so React can unmount it cleanly
- `prefers-reduced-motion` gets a single static render and no loop at all
- the near band renders into its own container in front of the page, rather than being
  moved across the DOM after the fact

Density and firefly count drop on narrow screens.

## Design language

Taken from the app itself, not just from `../touchgrass/DESIGN.md`:

- **Palette** — `app/globals.css` `@theme` carries the dark-mode column of
  `TGOverlay/OverlayPalette.swift`'s `Hex` table, with the light values in comments so the
  two files stay easy to diff. Keep them in step.
- **Type** — the app is SF Rounded throughout, so `--font-sans` leads with `ui-rounded`
  (Mac visitors get the real thing) and falls back to Nunito. Fraunces is the app's bundled
  serif for numerals, and does the same job here.
- **Buttons** — the two tiers of `TGMenuBar/PillButtonStyle.swift`: `.btn-primary` is the
  matcha fill with `onMatcha` type, `.btn-ghost` is the quiet paper-glass pill.
- **The mock** — `components/BreakScreen.tsx` follows `TGOverlay/BreakView.swift`
  composition-for-composition, with sizes from `OverlayType` and colours from `BreakTone`.
  Everything is in `cqw` against the mock's own width, so it scales like a screenshot; the
  reference width is 1180pt rather than a real 1512pt display so the smallest chrome stays
  readable on a web page.

Logo mark is `public/mark.svg`, copied from
`../touchgrass/Support/logo/touchgrass-mark.svg`.

