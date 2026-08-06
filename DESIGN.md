# DESIGN.md — Go-Live Site Clearance

## Brand & Imagery
- **Anchor metaphor**: Airline boarding pass + security clearance stamp. The product is a gate checkpoint, not a dashboard and not a warm paper archive.
- **Core visual**: A tearable boarding pass. Left stub = brand. Right panel = GATE / DEST / STATUS. Circular ink stamp lands on STATUS.
- **Tone**: Precise, slightly wry travel-security. Indie tool with official bones.

## Color Palette
- **Background**: Cool gate gray `#eef0f3` — terminal concourse, not cream paper
- **Surface / Pass**: `#ffffff` with hairline `#c8cdd5` borders
- **Ink**: Near-black `#0f1218`
- **Muted**: `#5c6570`
- **Signal green (CLEARED)**: `#0f7a4c`
- **Signal amber (HOLD)**: `#b45309`
- **Signal red (DENIED)**: `#c01d2e`
- **Accent line**: Single ink bar / perforation — no large amber gold fields
- Avoid: warm cream washes, purple gradients, glow, soft SaaS cards

## Typography
- **Brand / Display**: `Space Grotesk` (600–700) — geometric, gate-signage energy
- **UI body**: `Space Grotesk` (400/500)
- **Technical / finding IDs only**: `JetBrains Mono`
- Stamp labels: uppercase, tracked, heavy — inside the circular seal

## Layout & Components
- **Boarding pass**: Horizontal on desktop (brand pane | perforated tear | fields). Stack on mobile.
- **Field labels**: Tiny uppercase GATE / DEST / STATUS / DOC
- **URL input**: Lives in DEST row; Inspect is the tear-stub CTA
- **Clearance stamp**: Circular double-ring SVG, −8° tilt, ink color by state
- **Report / certificate**: Same pass language — DOC no., issued/valid, dashed perforation
- **Header**: Minimal ink bar; mark is a small gate glyph, not a soft pill logo

## Motion & Interaction
- **Stamp**: Scale 1.6 → 1 with rotation settle on result
- **Scanning**: Perforation “punch lights” pulse along the tear line
- **Findings**: Short fade-up stagger
- Prefer 2–3 intentional motions; no ambient gradient animation

## Design Don'ts
- No Inter / Roboto / system-default display
- No warm `#faf8f5` paper nostalgia as the primary identity
- No dashboard metric grids in the hero
- No rounded-2xl card stacks; corners stay tight (`rounded-sm` / `rounded-md`)
- No dark mode in V1
