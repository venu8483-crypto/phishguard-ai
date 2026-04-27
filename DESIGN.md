# Design Brief — Fake Website Detection Platform

**Purpose:** Professional URL threat analysis tool for security-conscious users. Deep analysis requires visual confidence and speed. Dark, intense, trustworthy.

## Direction & Tone

**Aesthetic:** Industrial cybersecurity. Electric neon against deep space. Bold, not playful. High vigilance intensity. Enterprise security product visual language.

## Color Palette (OKLCH)

| Name | Light | Dark | Usage |
|------|-------|------|-------|
| Background | `0.95 0 0` | `0.08 0 0` | Page base; nearly black in dark mode |
| Foreground | `0.15 0 0` | `0.95 0 0` | Text; white in dark mode for max contrast |
| Card | `0.98 0 0` | `0.12 0 0` | Elevated surfaces; slightly lighter than bg |
| Primary (Cyan) | `0.5 0.15 260` | `0.65 0.2 260` | Main accent; electric blue-cyan |
| Accent (Cyan) | `0.65 0.2 260` | `0.65 0.2 260` | Interactive elements, highlights, borders |
| Destructive (Red) | `0.55 0.22 25` | `0.65 0.22 25` | Danger states, threat indicators |
| Destructive-FG | `0.98 0 0` | `0.95 0 0` | Foreground on danger backgrounds |
| Success (Lime) | `0.62 0.2 140` | `0.62 0.2 140` | Safe/verified state |
| Border | `0.88 0 0` | `0.2 0 0` | Subtle lines; dark in dark mode |
| Muted | `0.92 0 0` | `0.15 0 0` | Disabled, tertiary, faded text |

## Typography

| Layer | Font | Usage |
|-------|------|-------|
| Display | **Space Grotesk** | Headlines, primary actions, strong emphasis. Geometric, technical personality. |
| Body | **DM Sans** | Body text, descriptions, readable at all sizes. Professional, clean. |
| Mono | **Geist Mono** | Code, technical details, threat identifiers, scan data. Terminal aesthetic. |

## Elevation & Depth

- **Structural zones:** Header (border-bottom), main content (background), analysis card (elevated card surface), footer (muted background)
- **Card treatment:** Subtle border, inset cyan glow shadow for depth and theme reinforcement
- **Layering:** Card > border > glow effect > content

## Shape Language

- **Radius:** `0.375rem` (sharp, minimal, industrial)
- **Spacing:** Density varies; tight in results, relaxed in hero
- **No softness:** Precision and clarity over warmth

## Component Patterns

- **Buttons:** Background color variant, hover scale + glow effect
- **Threat cards:** Red/green/yellow states with matching glow, monospace identifier text
- **Input fields:** Dark background, cyan border focus, clear affordance
- **Progress bars:** Animated scan sweep; fills left-to-right with gradient or pulsing edge
- **Badges:** Safe (lime), danger (red), scanning (cyan pulse)

## Motion & Animation

- **Entrance:** Fade-in (200ms) for content, slide-up (400ms) for cards
- **Interaction:** Hover = scale 1.02 + glow intensification (smooth 300ms)
- **Scanning state:** Pulsing cyan glow on main card, animated progress bar sweep
- **Pulse:** 2s cycle on threat indicators and stat counters
- **Transition easing:** `cubic-bezier(0.4, 0, 0.2, 1)` for all interactive elements

## Signature Detail

**Animated scanning visualization:** Pulsing cyan border with inset glow on the main analysis card. Scan line sweep across progress indicator. Cascading fade-in of threat results with staggered timing. Neon text glow on critical metrics (threat score, scan completion).

## Layout Zones

| Zone | Background | Border | Typography | Elevation |
|------|------------|--------|-----------|-----------|
| Header | Card | Bottom cyan border | DM Sans, bold | Elevated |
| Main Content | Background | None | Inherit | Base |
| Analysis Card | Card | Cyan, `0.375rem` | Display headline | Glowing |
| Results | Card | Success/Danger border | Mono for IDs | Glowing |
| Footer | Muted | Top subtle border | Muted text | Base |

## Custom Classes

- `.glow-cyan` — box shadow with cyan neon effect
- `.glow-green` — lime neon effect
- `.glow-red` — danger red neon effect
- `.text-glow-cyan`, `.text-glow-green`, `.text-glow-red` — text shadow glow
- `.hover-glow-cyan` — smooth glow on hover
- Animation utilities: `.animate-glow-pulse`, `.animate-scan-sweep`, `.animate-fade-in`, `.animate-slide-up`, `.animate-bounce-in`

## Constraints & Guardrails

1. **No gradients on text** — use text-shadow glow only for emphasis
2. **Cyan is exclusive** — primary accent only, not scattered everywhere
3. **Red for danger only** — never decorative
4. **Animations choreographed** — no scattered, random motion
5. **Dark mode optimized** — all OKLCH values tuned for `0.08 0 0` background contrast
6. **Accessible contrast** — all text ≥ AA on primary backgrounds
7. **No blur effects** — clarity prioritized over softness
8. **Monospace for code** — reinforces security/technical aesthetic

## Success Criteria

- Cybersecurity professionals should recognize this as an enterprise security tool instantly
- Threat indicators command visual attention through color and glow, not size
- Scanning state feels active, not static; pulsing and sweeping animations create urgency
- Every interactive element has deliberate affordance (color, glow, hover state)
- Dark mode is the primary aesthetic; light mode serves as professional alternative
