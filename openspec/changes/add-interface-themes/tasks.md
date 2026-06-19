# Tasks — Add interface themes

## 1. Switcher infrastructure (DONE — shipped)

- [x] Top-right theme switcher UI (`#theme-switch`, 5 buttons)
- [x] `applyTheme()` + `initThemeSwitch()` + `mc_theme` localStorage persistence
- [x] Anti-flash `<head>` script applying the saved theme before paint
- [x] `THEMES` array as source of truth (`comic`, `shield`, `jarvis`, `strange`, `tva`)
- [x] Empty `html[data-theme="…"]` placeholder blocks at end of stylesheet
- [x] CÓMIC theme fully styled (the default look)

## 2. Design (discuss first — blocked on user briefs)

- [x] Decide scoping strategy → comic stays the **global base**; each theme overrides under
      `[data-theme="<key>"]` (lower risk, no churn to comic). Revisit only if a theme needs a clean slate.
- [x] Decide asset strategy → **CSS-only + allow per-theme web fonts** (comic already loads Bangers from CDN).
- [x] Decide scope per theme → **full re-skin** (palette, fonts, background, panels, covers, stamps, toasts).
- [x] Font themability → the hardcoded `"Bangers"…` stacks were turned into CSS vars `--fd`/`--fdh`
      (default = Bangers); themes just override these two vars. Done once, benefits all future themes.
- [x] Agree design brief for S.H.I.E.L.D → blue/white classic comics palette, military-tech HUD.
- [x] Agree design brief for J.A.R.V.I.S → holographic glass, cyan reactor + hot-rod red, subtle motion.
- [x] Agree design brief for DR. STRANGE → mystic arts, gold spell + Dark-Dimension purple, pyrotechnic, Cinzel; background image (user-provided, like jarvis).
- [ ] Agree design brief for TVA

## 3. Implement (after each brief is agreed)

- [x] Implement `[data-theme="shield"]` styles — navy/steel HUD: tactical grid + scanlines bg,
      Oswald headings + Share Tech Mono labels, steel-white "dossier" cards, terminal toast,
      covers recolored to tactical navy with a decorative CLASSIFIED stamp, cyan accent.
- [x] Implement `[data-theme="jarvis"]` styles — holographic glass (backdrop-blur + glow), Orbitron
      headings + Share Tech Mono labels, animated arc-reactor glow/ring, HUD corner brackets on covers,
      cyan base + hot-rod-red accents, AI-style toast. Respects prefers-reduced-motion.
- [x] Implement `[data-theme="strange"]` styles — mystic gold+purple, Cinzel headings, animated spinning
      runic mandala behind hero portrait, twinkling ember sparks, gold-glow panels/covers, grimoire collection
      covers, mystic seals. Background uses `--strange-bg` (CSS fallback now; swap in user image when provided).
      Respects prefers-reduced-motion.
- [ ] Implement `[data-theme="tva"]` styles
- [ ] Smoke-test switching between all themes (covers, modals, collection covers, stamps, toasts)
      — S.H.I.E.L.D pending user's visual check in the browser.

## 4. Close out

- [ ] Update CLAUDE.md "Comic-book theme" section to describe the multi-theme system
- [ ] `openspec archive add-interface-themes`
