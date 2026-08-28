# Prime Couriex Express Ltd
## UI Design Brief
### Website & Online Booking Platform

**Version 1.0**
**26 August 2026**

*Companion to the PRD and TRD (v1.0). Scope: visual direction only — color, type, shape, imagery. Does not redefine any locked product/technical decision.*

---

## Table of Contents

1. [Brand Direction](#1-brand-direction)
2. [Color Palette](#2-color-palette)
3. [Typography](#3-typography)
4. [Shape & Elevation Language](#4-shape--elevation-language)
5. [Light & Dark Mode](#5-light--dark-mode)
6. [Imagery](#6-imagery)
7. [Component Notes](#7-component-notes)
8. [Accessibility Baseline](#8-accessibility-baseline)
9. [Open Exploration — How to Use This Brief](#9-open-exploration--how-to-use-this-brief)

---

## 1. Brand Direction

**Mood: Trustworthy & authoritative.** Prime Couriex Express handles legal process serving and corporate documents — the visual language should read as credible, secure, and professional first, and approachable second. This rules out playful/bright treatments and favors deep, confident color, generous white space, and restraint over decoration.

Core palette stays **white + navy blue**, per brand. This brief explores *which* navy/blue does that job best, plus the minimum supporting colors any real interface needs.

---

## 2. Color Palette

### 2.1 Anchor Color

Your existing Internal Rate Sheet document already uses **`#12234C`** as a header color. Rather than inventing a new blue from scratch, this brief treats that hex as the confirmed brand anchor — the deepest, most saturated point in the primary scale — so the new site is consistent with color already in circulation internally.

### 2.2 Three Directions to Compare

You said you want to play with different shades — here are three real, computed directions built from the same anchor hue family. Each is a full 10-step scale (light tint → deep shade) so you can see how each direction behaves across UI weight (backgrounds, borders, body text, headings, buttons).

A companion visual swatch page has been sent alongside this brief so you can actually *see* these side by side rather than just read hex codes — reading hex values in isolation is a poor way to judge a blue.

#### A — Deep Navy *(anchored on your existing `#12234C`)*

The most literal continuation of what you already have. Reads as formal, institutional, legal-grade.

| Step | Hex | Contrast vs. white | Typical use |
|---|---|---|---|
| 50 | `#EFF2FB` | 1.12 (background only) | Page/section background tint |
| 100 | `#DEE5F7` | 1.26 (background only) | Card/table stripe background |
| 200 | `#B9C9EE` | 1.66 (background only) | Borders, dividers |
| 300 | `#87A2E3` | 2.52 (background only) | Disabled states, subtle icons |
| 400 | `#5279D6` | 4.17 (AA, large text only) | Secondary buttons, links on dark |
| 500 | `#2D57BE` | 6.51 (AA) | Interactive accents, focus rings |
| 600 | `#234494` | 8.98 (AA) | Primary buttons, links on white |
| 700 | `#1B3573` | 11.61 (AA) | Headings, strong emphasis |
| 800 | `#152857` | 14.30 (AA) | Dense text on white |
| **900** | **`#12234C`** | **16.67 (AA)** | **Brand anchor — nav bar, footer, hero backgrounds** |

#### B — Royal / Cobalt Blue *(more vivid, modern)*

Same family, pushed brighter and more saturated. Reads as more energetic and tech-forward — worth comparing if "trustworthy" shouldn't tip into "stuffy."

| Step | Hex | Contrast vs. white | Typical use |
|---|---|---|---|
| 50 | `#ECF0FD` | 1.14 (background only) | Page/section background tint |
| 100 | `#DAE0FC` | 1.31 (background only) | Card/table stripe background |
| 200 | `#B0BDF8` | 1.82 (background only) | Borders, dividers |
| 300 | `#778FF3` | 2.99 (background only) | Disabled states, subtle icons |
| 400 | `#3B5DED` | 5.28 (AA) | Secondary buttons, links on dark |
| 500 | `#1439D7` | 8.07 (AA) | Interactive accents, focus rings |
| 600 | `#0F2DA8` | 10.71 (AA) | Primary buttons, links on white |
| 700 | `#0C2383` | 13.28 (AA) | Headings, strong emphasis |
| 800 | `#091A62` | 15.70 (AA) | Dense text on white |
| 900 | `#061346` | 17.68 (AA) | Nav bar, footer, hero backgrounds |

#### C — Slate / Steel Blue *(muted, calm)*

Same family, desaturated. Reads as quieter and more reassuring — worth comparing if "authoritative" should feel gentle rather than heavy, given some customers are booking a sensitive legal delivery for the first time.

| Step | Hex | Contrast vs. white | Typical use |
|---|---|---|---|
| 50 | `#F1F4F8` | 1.10 (background only) | Page/section background tint |
| 100 | `#E4E9F2` | 1.22 (background only) | Card/table stripe background |
| 200 | `#C5D0E2` | 1.56 (background only) | Borders, dividers |
| 300 | `#9CAECE` | 2.24 (background only) | Disabled states, subtle icons |
| 400 | `#708AB8` | 3.50 (AA, large text only) | Secondary buttons, links on dark |
| 500 | `#4D6A9D` | 5.42 (AA) | Interactive accents, focus rings |
| 600 | `#3D537B` | 7.72 (AA) | Primary buttons, links on white |
| 700 | `#2F4160` | 10.31 (AA) | Headings, strong emphasis |
| 800 | `#233048` | 13.16 (AA) | Dense text on white |
| 900 | `#192333` | 15.84 (AA) | Nav bar, footer, hero backgrounds |

> **Reading the contrast column:** "AA" means the shade passes WCAG 2.1 AA (4.5:1) for normal body text on a white background — safe to use for paragraphs and labels. "AA, large text only" passes only at 18px+/bold (headings, big numbers). "Background only" means the shade is too light for any text on white and should only be used as a fill, tint, or border.

### 2.3 Recommendation

**Direction A (Deep Navy, anchored)** is the safest default given the "trustworthy & authoritative" mood and the fact that `#12234C` is already in your documents — it costs nothing to stay consistent with what exists. Use the swatch page to sanity-check this against B and C before committing; a hex code reads very differently as a full nav bar than it does as a 40px square.

### 2.4 Supporting Neutrals

Regardless of which blue direction wins, the interface needs a warm-neutral gray scale for text, borders, and surfaces that isn't pure black/white:

| Token | Hex | Use |
|---|---|---|
| Gray 50 | `#F7F8FA` | Page background (off-white, easier on the eyes than pure white for large surfaces) |
| Gray 100 | `#EEF0F3` | Card backgrounds, input fields |
| Gray 300 | `#D3D8DF` | Borders, dividers |
| Gray 500 | `#8A94A3` | Placeholder text, disabled labels |
| Gray 700 | `#4B5563` | Secondary body text |
| Gray 900 | `#1A1D23` | Primary body text (near-black, not pure black) |

### 2.5 Semantic / Functional Colors

Per your decision to keep blue + white dominant but add a small functional set for status and validation — used **only** for booking status badges, form errors, and confirmations, never for branding elements (buttons, nav, headings stay in the blue scale):

| Purpose | Text color | Background tint | Contrast (text vs. white) |
|---|---|---|---|
| Success (booking confirmed, payment successful) | `#15803D` | `#EAF7EE` | 5.02 (AA) |
| Error (validation, rejected booking) | `#B91C1C` | `#FDECEC` | 6.47 (AA) |
| Warning (pending review, attention needed) | `#B45309` | `#FEF3E2` | 5.02 (AA) |

---

## 3. Typography

**Direction: clean modern sans-serif.** Neutral, highly legible, works equally well across marketing pages, a dense booking form, and the staff admin dashboard.

- **Recommended pairing:** [Inter](https://fonts.google.com/specimen/Inter) or [Manrope](https://fonts.google.com/specimen/Manrope) for everything — headings and body — using weight (600–700 for headings, 400–500 for body) rather than a second typeface to create hierarchy. Both are free, web-optimized, and have excellent Naira/₦ and Latin-extended character support.
- **Scale (suggested):**
  - Display / hero: 40–48px, weight 700
  - H1: 32px, weight 700
  - H2: 24px, weight 600
  - H3: 18–20px, weight 600
  - Body: 16px, weight 400–450
  - Small / caption: 13–14px, weight 400
- **Line length:** cap body text at ~65–75 characters per line for readability, especially in FAQ and About content.
- Avoid a serif entirely — it was considered and set aside in favor of a single consistent sans-serif system, which keeps the booking form and dashboard feeling like the same product as the marketing site.

---

## 4. Shape & Elevation Language

**Direction: soft rounded corners, subtle shadows.**

- Border radius: 8px for buttons and inputs, 12px for cards and modals, full-round (pill) for status badges/tags.
- Shadows: light and infrequent — a single soft shadow (`0 1px 3px rgba(18,35,76,0.08)`, using the navy at low opacity rather than pure black) on cards and dropdowns; flat elsewhere. Avoid heavy drop shadows or gradients, which would clash with the authoritative mood.
- Buttons: solid navy fill for primary actions ("Book Now," "Submit Booking"), navy outline/ghost style for secondary actions, generous horizontal padding (20–24px) so buttons feel substantial rather than cramped.
- This single language applies consistently across the public site, booking flow, and admin dashboard — no separate "sharp for admin" treatment, to keep the whole product feeling like one system.

---

## 5. Light & Dark Mode

Both are in scope.

- **Light mode** (primary/default): white and Gray 50 backgrounds, navy for nav/headings/primary actions, as detailed in Section 2.
- **Dark mode**: navy-dominant background rather than pure black — e.g. Navy 900 (`#12234C` in Direction A) as the base surface, with lighter navy steps (400–200) used for text and borders so contrast holds. Semantic colors (Section 2.5) need dark-mode variants too — don't reuse the light-mode tints, which will be invisible on a dark background; use the mid-scale text colors (e.g. `#15803D`-family lightened, not the pale background tints) directly as dark-surface accents.
- Where dark mode matters most in practice: the **admin dashboard**, which staff may have open for long stretches — prioritize building and testing dark mode there first, then extend to the public site.
- Every component in Section 7 should be designed with both modes in mind from the start, not retrofitted — this avoids the common failure mode of a dark mode that's just an inverted light mode with broken contrast.

---

## 6. Imagery

**Direction: real photography**, used for trust-building sections:

- **Home hero:** a rider/courier in motion, or a professional handling a document — should feel authentic to Abuja/Nigeria, not generic stock-photo Western office imagery.
- **About page:** team or operations photography reinforcing "secure, confidential, professional handling."
- **Services page:** could pair each of the five service types with a relevant photo (a courtroom/document context for Process Serving, a corporate office for Corporate Courier, etc.) if budget allows; otherwise fall back to a consistent icon system (Section 7) for this page specifically.
- Treatment: photos should sit behind a subtle navy overlay or gradient when used as a hero background, so white text stays legible without needing a heavy dark scrim that kills the photo.
- Sourcing note: this brief doesn't include photography — commissioning or licensing real Abuja-specific photography is a separate, budget-relevant task to plan for before build.

---

## 7. Component Notes

Quick visual notes for the components this build actually needs (per the PRD), so design and build stay in sync:

- **Booking form:** long, multi-section form (Section 9 of the PRD) — group fields under clear subheadings (Contact, Pickup, Delivery, Package Details, and a conditionally-shown Legal Details section), use the Gray 100 input-field background with a navy focus ring, and show the live price calculation (Section 10 of the PRD) in a sticky/pinned summary card as the customer fills the form, not just at the end.
- **Delivery Price Calculator (standalone):** should visually feel like a lightweight, single-purpose tool — a card, not a full page of chrome — so it's inviting to try with no commitment.
- **Status badges** (Pending Review / Confirmed / Rejected / In Transit / Delivered): use the semantic pill/badge style from Section 2.5 plus Section 4 — pale background tint, saturated text, full-round corners.
- **Admin dashboard booking queue:** dense, table-based, optimized for scanning — this is the one place a slightly more compact, "sharper" information density than the marketing site is appropriate, even though the shape language (Section 4) stays consistent.
- **Track My Booking:** minimal, single-input, mobile-first — most customers checking status will do so from a phone.

---

## 8. Accessibility Baseline

- All body text and interactive labels must hit **WCAG 2.1 AA (4.5:1)** contrast — see the "AA" column in every palette table above; only use sub-AA tints as backgrounds/borders, never as text color.
- Don't rely on color alone for booking status — pair every status badge with a text label (already the plan) and consider an icon, since color-blind users may not reliably distinguish the success/error/warning hues.
- Focus states (keyboard navigation) need a visible ring using the 500-step of whichever blue direction is chosen — this matters especially for the booking form, which is long and form-heavy.
- This baseline matches the accessibility target already set in the TRD (Section 12) — this brief doesn't introduce a new requirement, just gives it concrete color values.

---

## 9. Open Exploration — How to Use This Brief

This brief intentionally leaves the final blue direction (A/B/C) open, per your request to "play around a bit." Suggested next step: review the companion visual swatch page against real content (put Direction A's navy behind your actual logo, try a button in Direction B, etc.) before locking a final choice — color decisions made from isolated swatches often look different once placed behind real UI weight. Once a direction is chosen, everything else in this brief (typography, shape, imagery, components) stays the same regardless of which blue wins.
