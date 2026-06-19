# Add interface themes (S.H.I.E.L.D · J.A.R.V.I.S · Dr. Strange · TVA)

> **Discussion starter — pick this up at the start of the next session.**
> The theme *switcher* is already built and shipping; what's pending is **designing
> and styling each new theme**. Read "Open questions" below and let's decide the look
> of each one before writing any CSS.

## Why

The app currently has a single comic-book look. We added a top-right **theme switcher**
so the user can choose between several interface "modes". The switching machinery,
persistence, and CSS hooks are already in place, but only the **CÓMIC** theme has styles —
the other four are wired buttons that currently fall back to the comic look. We need to
design and implement each remaining theme.

## Current state (already implemented)

- Top-right switcher with buttons: **CÓMIC · S.H.I.E.L.D · J.A.R.V.I.S · DR. STRANGE · TVA**
  (markup: `#theme-switch` in the header `.tools` row).
- `applyTheme(t)` sets `<html data-theme="t">`, persists to `localStorage["mc_theme"]`,
  and highlights the active button. `initThemeSwitch()` (called from `wire()`) binds the
  buttons and applies the saved theme. An inline `<head>` script applies the saved theme
  **before paint** to avoid a flash.
- `const THEMES = ["comic","shield","jarvis","strange","tva"]` is the source of truth.
- All current CSS is the **CÓMIC** look (the default). At the end of the stylesheet there
  are **empty placeholder blocks** with the convention: scope every rule as
  `html[data-theme="<key>"] { … }`. Keys: `comic` (default) · `shield` · `jarvis` ·
  `strange` · `tva`.

## What Changes

- Define the visual language for **S.H.I.E.L.D**, **J.A.R.V.I.S**, **Dr. Strange**, and **TVA**.
- Implement each as a scoped `html[data-theme="…"]` CSS block (palette, panels, headings,
  cover styles, accents) overriding the comic base.
- Decide the **scoping strategy** (see open questions): keep comic as the unscoped global
  base, or encapsulate the comic block under `html[data-theme="comic"]` so the other themes
  start from a clean slate. This does not change appearance, only how the CSS is organized.

## Open questions to discuss

- **Scoping strategy:** leave comic as the global base (other themes override it piecemeal),
  or move the comic-specific block under `html[data-theme="comic"]` for a clean base? The
  latter is cleaner if the new themes are radically different from comic.
- **Per-theme design briefs** (the user will describe each):
  - **S.H.I.E.L.D** — likely sleek agency/HUD: dark slate, cyan/amber accents, mono labels?
  - **J.A.R.V.I.S** — Iron Man UI: deep blue/black, glowing cyan, thin tech lines, glassy panels?
  - **DR. STRANGE** — mystic: purples/golds, arcane circles, eldritch orange sigils?
  - **TVA** — retro-bureaucratic (Loki): burnt orange/amber on cream, 70s office type, "VARIANT" stamps.
- **Scope of each theme:** full re-skin (backgrounds, panels, hero/villain covers, stamps,
  toasts, collection covers) or just palette + headings?
- **Asset strategy:** keep everything CSS-only (gradients, SVG data-URIs like the skyline)
  to preserve the single-file, offline-capable app, or allow CDN web fonts per theme?
- **Possible extra themes** proposed earlier: HYDRA, WAKANDA, ASGARD/BIFROST,
  SENTINEL/DANGER ROOM, VENOM/SYMBIOTE — add any?

## Impact

- Affected: CSS only, inside the single `Marvel Champions Collection.html` file
  (the per-theme `html[data-theme="…"]` blocks). No data, persistence, or backend changes.
- Specs: introduces a new `interface-theming` capability documenting the switcher contract
  (the `mc_theme` localStorage key and theme application), mirroring how `collection-tracking`
  documents `mc_owned`.
