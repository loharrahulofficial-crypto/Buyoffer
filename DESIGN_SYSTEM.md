# 🎨 Buyoffer Design System — Midnight & Cyan Palette

> **Version**: 1.0.0 | **Theme**: Midnight × Cyan | **Last Updated**: May 2026

This document is the single source of truth for all visual design decisions in the Buyoffer frontend. All colors, typography, spacing, and component styles are derived from the UI shown in the approved design reference.

---

## 📋 Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Component Color Map](#5-component-color-map)
6. [CSS Variables — App.css](#6-css-variables--appcss)
7. [Dark Theme Variants](#7-dark-theme-variants)
8. [Usage Rules & Do's / Don'ts](#8-usage-rules--dos--donts)

---

## 1. Design Philosophy

The Buyoffer UI is built on three visual pillars:

| Pillar | Description |
|--------|-------------|
| **Midnight Depth** | Deep navy backgrounds create a premium, focused environment that makes deals pop visually |
| **Cyan Energy** | Electric cyan `#00E5FF` is the single action color — every CTA, active state, and highlight uses it |
| **Glassmorphic Cards** | Deal cards use frosted blue-gray gradients over the dark base, giving a layered, modern feel |

The palette is intentionally **not blue** (avoids Booking.com) and **not white-dominant** (avoids generic marketplaces). It reads as a modern, Indian-market-native dark deals platform.

---

## 2. Color Tokens

### 2.1 Base / Background Colors

| Token Name | Hex | RGB | Usage |
|---|---|---|---|
| `--color-bg-base` | `#0A0F1E` | `10, 15, 30` | Page root background |
| `--color-bg-nav` | `#080C18` | `8, 12, 24` | Sticky navbar background |
| `--color-bg-section` | `#0D1529` | `13, 21, 41` | Hero section, section wrappers |
| `--color-bg-card` | `#111827` | `17, 24, 39` | Deal card background (dark) |
| `--color-bg-input` | `#141D36` | `20, 29, 54` | Search bar, input fields |
| `--color-bg-tabs` | `#FFFFFF` | `255, 255, 255` | Category tab bar background |
| `--color-bg-card-light` | `#B8D4E0` | `184, 212, 224` | Deal card image area (light teal-gray) |
| `--color-bg-overlay` | `rgba(10,15,30,0.85)` | — | Modal and drawer overlays |

---

### 2.2 Accent / Brand Colors

| Token Name | Hex | RGB | Usage |
|---|---|---|---|
| `--color-accent` | `#00E5FF` | `0, 229, 255` | Primary CTA buttons, active tabs, badges, highlights |
| `--color-accent-hover` | `#00B8CC` | `0, 184, 204` | Hover state of accent elements |
| `--color-accent-pressed` | `#0090A0` | `0, 144, 160` | Active/pressed state |
| `--color-accent-glow` | `rgba(0,229,255,0.12)` | — | Subtle glow background on hover cards |
| `--color-accent-glow-strong` | `rgba(0,229,255,0.25)` | — | Stronger glow for focused inputs, active borders |
| `--color-accent-text-on` | `#0A0F1E` | `10, 15, 30` | Text color **on** cyan backgrounds (dark navy) |

---

### 2.3 Text Colors

| Token Name | Hex | RGB | Usage |
|---|---|---|---|
| `--color-text-primary` | `#FFFFFF` | `255, 255, 255` | Main headings, card titles |
| `--color-text-secondary` | `#E8F4FD` | `232, 244, 253` | Body text, descriptions |
| `--color-text-muted` | `#7A9BB5` | `122, 155, 181` | Subtitles, placeholders, meta info |
| `--color-text-dim` | `#3D5A72` | `61, 90, 114` | Disabled text, input placeholders |
| `--color-text-accent` | `#00E5FF` | `0, 229, 255` | Eyebrow labels (e.g. "DEALS ACROSS INDIA"), links |
| `--color-text-on-light` | `#1A2540` | `26, 37, 64` | Text on light/white backgrounds (tab bar, cards) |
| `--color-text-strikethrough` | `#5A7A92` | `90, 122, 146` | Original price with strikethrough |

---

### 2.4 Border Colors

| Token Name | Hex / Value | Usage |
|---|---|---|
| `--color-border-subtle` | `rgba(0,229,255,0.10)` | Default card borders, dividers |
| `--color-border-default` | `rgba(0,229,255,0.20)` | Input borders, section separators |
| `--color-border-strong` | `rgba(0,229,255,0.35)` | Focused inputs, active cards |
| `--color-border-tab` | `#00E5FF` | Active tab bottom border (2px) |
| `--color-border-card-light` | `rgba(0,0,0,0.08)` | Borders on light-background card areas |

---

### 2.5 Status / Semantic Colors

| Token Name | Hex | Usage |
|---|---|---|
| `--color-discount-badge-bg` | `#1A2540` | Discount % badge background (on card) |
| `--color-discount-badge-text` | `#FFFFFF` | Discount % badge text |
| `--color-see-deal-bg` | `#00E5FF` | "See Deal" button background |
| `--color-see-deal-text` | `#0A0F1E` | "See Deal" button text |
| `--color-rating` | `#FFB347` | Star rating color (amber) |
| `--color-price-original` | `#5A7A92` | Strikethrough original price |
| `--color-price-discounted` | `#00E5FF` | Final discounted price |
| `--color-success` | `#00C896` | Success states, confirmation |
| `--color-error` | `#FF6B6B` | Error states, alerts |

---

### 2.6 Full Palette Swatch Reference

```
Midnight Scale (Backgrounds)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  #080C18  ████  Nav / Darkest
  #0A0F1E  ████  Page Base
  #0D1529  ████  Section BG
  #111827  ████  Cards
  #141D36  ████  Inputs
  #1B2645  ████  Hover cards / elevated surfaces
  #243260  ████  Highlighted containers

Cyan Accent Scale
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  #00E5FF  ████  Primary accent (buttons, badges, active)
  #00B8CC  ████  Hover state
  #0090A0  ████  Pressed/active state
  rgba(0,229,255,0.25)  ░░░░  Glow / subtle bg

Text Scale
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  #FFFFFF  ████  Headings
  #E8F4FD  ████  Body
  #7A9BB5  ████  Muted
  #3D5A72  ████  Dim / placeholder
  #1A2540  ████  Text on light bg

Card Light Surface
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  #B8D4E0  ████  Card image bg (primary)
  #C8DDE8  ████  Card image bg (variant 2)
  #A8CAD8  ████  Card image bg (variant 3)
```

---

## 3. Typography

| Role | Font | Weight | Size | Color Token |
|---|---|---|---|---|
| Logo | `'Segoe UI'`, system-ui | 800 | 15px | `--color-text-primary` |
| Page Title (Hero) | `'Segoe UI'`, system-ui | 800 | 28–32px | `--color-text-primary` |
| Eyebrow Label | `'Segoe UI'`, system-ui | 600 | 11px | `--color-text-accent` |
| Section Heading | `'Segoe UI'`, system-ui | 700 | 18–22px | `--color-text-primary` |
| Card Title | `'Segoe UI'`, system-ui | 600 | 13px | `--color-text-on-light` |
| Body / Description | `'Segoe UI'`, system-ui | 400 | 13–14px | `--color-text-secondary` |
| Muted / Meta | `'Segoe UI'`, system-ui | 400 | 11–12px | `--color-text-muted` |
| Tab Labels | `'Segoe UI'`, system-ui | 500 | 13px | `--color-text-muted` (inactive) / `--color-accent` (active) |
| Button Text | `'Segoe UI'`, system-ui | 700 | 13px | `--color-accent-text-on` |
| Badge Text | `'Segoe UI'`, system-ui | 800 | 10px | `#FFFFFF` |
| Price Discounted | `'Segoe UI'`, system-ui | 700 | 14px | `--color-accent` |
| Price Original | `'Segoe UI'`, system-ui | 400 | 11px | `--color-price-original` (strikethrough) |
| Letter Spacing (eyebrow) | — | — | — | `2px` uppercase |

---

## 4. Spacing & Layout

### 4.1 Grid

```
Mobile:  1-column grid, 12px gap
Tablet:  2-column grid, 14px gap
Desktop: 3-column grid, 16px gap
```

### 4.2 Border Radius

| Element | Radius |
|---|---|
| Page wrapper | `12px` |
| Deal cards | `10px` |
| Buttons (CTA) | `8px` |
| Badges | `4px` |
| Search bar | `10px` |
| Input fields | `8px` |
| Tab bar | `0` (flush) |
| Logo icon | `6px` |
| Filter chips | `999px` (pill) |

### 4.3 Elevation / Shadows

| Level | Value | Usage |
|---|---|---|
| Base | `none` | Default card state |
| Hover | `0 8px 32px rgba(0,229,255,0.08)` | Hovered deal card |
| Active | `0 0 0 2px rgba(0,229,255,0.35)` | Focused inputs |
| Glow Orb 1 | `radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)` | Hero top-right orb |
| Glow Orb 2 | `radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%)` | Hero bottom-left orb |

---

## 5. Component Color Map

### 5.1 Navbar

| Part | Color Token | Value |
|---|---|---|
| Background | `--color-bg-nav` | `#080C18` |
| Logo box | `--color-accent` | `#00E5FF` |
| Logo box text | `--color-accent-text-on` | `#0A0F1E` |
| Brand name | `--color-text-primary` | `#FFFFFF` |
| Brand name accent | `--color-accent` | `#00E5FF` |
| Nav button border | `--color-border-default` | `rgba(0,229,255,0.20)` |
| Nav button text | `--color-text-secondary` | `#E8F4FD` |
| Sign In (primary) bg | `--color-accent` | `#00E5FF` |
| Sign In (primary) text | `--color-accent-text-on` | `#0A0F1E` |
| Bottom border | `--color-border-subtle` | `rgba(0,229,255,0.10)` |

---

### 5.2 Hero Section

| Part | Color Token | Value |
|---|---|---|
| Background gradient start | — | `#080D1C` |
| Background gradient mid | — | `#0A1428` |
| Background gradient end | — | `#0D1A30` |
| Eyebrow ("DEALS ACROSS INDIA") | `--color-text-accent` | `#00E5FF` |
| Main title | `--color-text-primary` | `#FFFFFF` |
| Title accent word | `--color-accent` | `#00E5FF` |
| Subtitle | `--color-text-muted` | `#7A9BB5` |
| Stat numbers | `--color-accent` | `#00E5FF` |
| Stat labels | `--color-text-muted` | `#7A9BB5` |

---

### 5.3 Search Bar

| Part | Color Token | Value |
|---|---|---|
| Container background | `--color-bg-input` | `#141D36` |
| Container border | `--color-border-default` | `rgba(0,229,255,0.20)` |
| Container border (focused) | `--color-border-strong` | `rgba(0,229,255,0.35)` |
| Input text | `--color-text-secondary` | `#E8F4FD` |
| Placeholder text | `--color-text-dim` | `#3D5A72` |
| Divider | `--color-border-subtle` | `rgba(0,229,255,0.10)` |
| Search button bg | `--color-accent` | `#00E5FF` |
| Search button text | `--color-accent-text-on` | `#0A0F1E` |
| Search button hover | `--color-accent-hover` | `#00B8CC` |

---

### 5.4 Category Tab Bar

| Part | Color Token | Value |
|---|---|---|
| Bar background | `--color-bg-tabs` | `#FFFFFF` |
| Bar bottom border | `--color-border-card-light` | `rgba(0,0,0,0.08)` |
| Inactive tab text | — | `#555E6E` |
| Active tab text | `--color-accent` | `#00E5FF` |
| Active tab indicator (2px bottom) | `--color-border-tab` | `#00E5FF` |
| Tab hover text | `--color-accent` | `#00E5FF` |

---

### 5.5 Deal Cards

| Part | Color Token | Value |
|---|---|---|
| Card background | `--color-bg-card` | `#111827` |
| Card border | `--color-border-subtle` | `rgba(0,229,255,0.10)` |
| Card border (hover) | `--color-border-default` | `rgba(0,229,255,0.20)` |
| Card hover shadow | — | `0 8px 32px rgba(0,229,255,0.08)` |
| Card image area bg (fashion) | — | `linear-gradient(135deg, #1a0530, #2d0a4e)` |
| Card image area bg (grocery) | — | `linear-gradient(135deg, #0a1f0a, #0f2e15)` |
| Card image area bg (food) | — | `linear-gradient(135deg, #200008, #300010)` |
| Card image area bg (travel) | — | `linear-gradient(135deg, #00101f, #001828)` |
| Card image area bg (default) | `--color-bg-card-light` | `#B8D4E0` |
| Category label text | `--color-accent` | `#00E5FF` |
| Card title text | `--color-text-primary` | `#FFFFFF` |
| Location / meta text | `--color-text-muted` | `#7A9BB5` |
| Divider (footer) | `--color-border-subtle` | `rgba(0,229,255,0.10)` |
| Original price | `--color-price-original` | `#5A7A92` (strikethrough) |
| Discounted price | `--color-accent` | `#00E5FF` |
| Rating stars | `--color-rating` | `#FFB347` |

---

### 5.6 Discount Badge (on card)

| Part | Color Token | Value |
|---|---|---|
| Badge background | `--color-discount-badge-bg` | `#1A2540` |
| Badge text | `--color-discount-badge-text` | `#FFFFFF` |
| Badge font weight | — | `800` |
| Badge font size | — | `10px` |
| Badge border radius | — | `4px` |
| Badge padding | — | `3px 8px` |

---

### 5.7 "See Deal" Button

| State | Property | Value |
|---|---|---|
| Default bg | `--color-see-deal-bg` | `#00E5FF` |
| Default text | `--color-see-deal-text` | `#0A0F1E` |
| Hover bg | `--color-accent-hover` | `#00B8CC` |
| Pressed bg | `--color-accent-pressed` | `#0090A0` |
| Border radius | — | `6px` |
| Font weight | — | `700` |
| Font size | — | `12px` |

---

### 5.8 Filter Chips

| State | Background | Border | Text |
|---|---|---|---|
| Default | `transparent` | `rgba(0,229,255,0.20)` | `#7A9BB5` |
| Hover | `rgba(0,229,255,0.08)` | `#00E5FF` | `#00E5FF` |
| Active / Selected | `#00E5FF` | `#00E5FF` | `#0A0F1E` |

---

## 6. CSS Variables — App.css

Paste this complete block into `frontend/src/App.css` inside your `:root` selector:

```css
:root {
  /* ── Backgrounds ── */
  --color-bg-base:           #0A0F1E;
  --color-bg-nav:            #080C18;
  --color-bg-section:        #0D1529;
  --color-bg-card:           #111827;
  --color-bg-input:          #141D36;
  --color-bg-elevated:       #1B2645;
  --color-bg-tabs:           #FFFFFF;
  --color-bg-card-light:     #B8D4E0;
  --color-bg-overlay:        rgba(10, 15, 30, 0.85);

  /* ── Accent / Brand ── */
  --color-accent:            #00E5FF;
  --color-accent-hover:      #00B8CC;
  --color-accent-pressed:    #0090A0;
  --color-accent-glow:       rgba(0, 229, 255, 0.12);
  --color-accent-glow-strong:rgba(0, 229, 255, 0.25);
  --color-accent-text-on:    #0A0F1E;

  /* ── Text ── */
  --color-text-primary:      #FFFFFF;
  --color-text-secondary:    #E8F4FD;
  --color-text-muted:        #7A9BB5;
  --color-text-dim:          #3D5A72;
  --color-text-accent:       #00E5FF;
  --color-text-on-light:     #1A2540;

  /* ── Borders ── */
  --color-border-subtle:     rgba(0, 229, 255, 0.10);
  --color-border-default:    rgba(0, 229, 255, 0.20);
  --color-border-strong:     rgba(0, 229, 255, 0.35);
  --color-border-tab:        #00E5FF;
  --color-border-light:      rgba(0, 0, 0, 0.08);

  /* ── Components ── */
  --color-badge-bg:          #1A2540;
  --color-badge-text:        #FFFFFF;
  --color-price-original:    #5A7A92;
  --color-price-final:       #00E5FF;
  --color-rating:            #FFB347;
  --color-pop-pink:          #FF6B9D;

  /* ── Status ── */
  --color-success:           #00C896;
  --color-error:             #FF6B6B;
  --color-warning:           #FFB347;

  /* ── Shadows ── */
  --shadow-card-hover:       0 8px 32px rgba(0, 229, 255, 0.08);
  --shadow-input-focus:      0 0 0 2px rgba(0, 229, 255, 0.35);
  --orb-1:                   radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%);
  --orb-2:                   radial-gradient(circle, rgba(255,107,157,0.08) 0%, transparent 70%);

  /* ── Typography ── */
  --font-primary:            'Segoe UI', system-ui, -apple-system, sans-serif;

  /* ── Border Radius ── */
  --radius-sm:               4px;
  --radius-md:               6px;
  --radius-lg:               8px;
  --radius-xl:               10px;
  --radius-2xl:              12px;
  --radius-pill:             999px;
}
```

---

## 7. Dark Theme Variants

The entire site runs in **dark mode by default**. The `[data-theme="light"]` override below can be applied to the tab bar or card surfaces that use white backgrounds:

```css
[data-theme="light"] {
  --color-bg-base:           #F0F6FA;
  --color-bg-card:           #FFFFFF;
  --color-bg-input:          #EAF2F8;
  --color-text-primary:      #1A2540;
  --color-text-secondary:    #2C3E55;
  --color-text-muted:        #5A7A92;
  --color-border-subtle:     rgba(0, 100, 130, 0.12);
  --color-border-default:    rgba(0, 100, 130, 0.22);
}
```

> **Note**: The navbar, hero, and deal sections should always retain the dark midnight theme regardless of light overrides.

---

## 8. Usage Rules & Do's / Don'ts

### ✅ Do's

- Use `--color-accent` (`#00E5FF`) **only** for interactive, actionable elements: buttons, active states, prices, active tab indicators, and icons that indicate clickability.
- Always use `--color-accent-text-on` (`#0A0F1E`) as text color **on top of** cyan backgrounds — never white.
- Use `--color-text-accent` for purely decorative text labels like eyebrow headings ("DEALS ACROSS INDIA") — these are non-interactive.
- Keep the tab bar white (`#FFFFFF`) — it acts as a visual break from the dark hero section and improves scannability.
- Use the card light surface (`#B8D4E0`) only for placeholder/image areas within dark cards to create contrast.
- Add `--shadow-card-hover` on card `:hover` for tactile depth without borders.
- Use `--color-pop-pink` (`#FF6B9D`) sparingly — only for "Hot Deal" or "Trending" secondary badges. Max 1 per screen.

### ❌ Don'ts

- **Never** use `#00E5FF` as a background for large surfaces — it's reserved for small, focused action elements only.
- **Never** use white or light gray as a body/page background. The dark midnight base is a core identity element.
- **Never** put dark navy text directly on the dark page background — always use the text scale tokens.
- **Never** use pure black (`#000000`) anywhere — use `#080C18` (nav) or `#0A0F1E` (base) instead.
- **Don't** use more than 2 accent colors per card component. Stick to cyan + optional amber (rating).
- **Don't** add drop shadows with color on the dark background — they are invisible and add no value. Use glow instead.
- **Don't** use gradients on text (no gradient-clipped text) — it harms readability at small sizes.

---

## Quick Reference Card

```
╔══════════════════════════════════════════════════════╗
║           BUYOFFER — MIDNIGHT × CYAN                 ║
╠══════════════════════════════════════════════════════╣
║  Page BG         #0A0F1E   ████  Midnight            ║
║  Nav BG          #080C18   ████  Darkest             ║
║  Card BG         #111827   ████  Elevated Dark       ║
║  Input BG        #141D36   ████  Input Fields        ║
║  ─────────────────────────────────────────────────── ║
║  Accent          #00E5FF   ████  Cyan (CTAs)         ║
║  Accent Hover    #00B8CC   ████  Cyan Dim            ║
║  Pop             #FF6B9D   ████  Pink (rare)         ║
║  Rating          #FFB347   ████  Amber Stars         ║
║  ─────────────────────────────────────────────────── ║
║  Text Primary    #FFFFFF   ████  Headings            ║
║  Text Body       #E8F4FD   ████  Body                ║
║  Text Muted      #7A9BB5   ████  Subtitles           ║
║  Text Dim        #3D5A72   ████  Placeholders        ║
║  Text on Light   #1A2540   ████  Card / Tab text     ║
╚══════════════════════════════════════════════════════╝
```

---

*© 2026 Buyoffer (Lots of Offers). Design System v1.0 — Midnight × Cyan Edition.*
