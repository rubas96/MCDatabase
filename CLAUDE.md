# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A **single self-contained file**, `Marvel Champions Collection.html` (~920 KB, ~2970 lines: HTML + CSS + vanilla JS, no framework, no build step). It is a personal collection tracker and deck builder for the *Marvel Champions* LCG. Open it by double-clicking — it runs entirely in the browser. UI is in English; surrounding docs (`LEEME.md`, `COMO-COMPARTIR.md`) are in Spanish — match the language of the file you're editing.

The one exception to "all in the browser" is the optional **`sync-server/`** (Bun) used for cross-device profile sync — see its section below.

There is no package manager, bundler, linter, or test suite. "Editing the app" means editing that one HTML file directly.

## Commands

There is no build/lint/test for the app itself — open the HTML in a browser to run it. The only scripts are for regenerating embedded data and deploying (details in the sections below):

```bash
python _extract_pdf.py    # PDF -> mc_rules_clean.md   (needs PyMuPDF / fitz)
python _build_rules.py    # mc_rules_clean.md -> _rulesref.json
node   _embed_rules.mjs    # inject _rulesref.json into the HTML's const RULES
node   _fetch_starters.mjs # refresh STARTER_SLOTS from MarvelCDB (edit DECKS map first)
pwsh   subir-a-rubas.ps1   # deploy: upload HTML as index.html to rubas.aypapol.com
openspec list --json      # list active change proposals (needs openspec CLI on PATH)

cd sync-server && docker compose up -d --build   # run the optional profile-sync backend (Bun)
```

## Architecture (the one HTML file)

Everything below lives inside `Marvel Champions Collection.html`.

- **Data engine:** SQLite compiled to WASM via **sql.js** (`initSqlJs`), loaded from the jsDelivr CDN. Card data is loaded into an in-browser SQLite DB (`createSchema` / `buildDatabase`), then queried with the `q()` / `q1()` helpers.
- **Card data sources (with fallback chain):** `chooseSource()` first tries the **MarvelCDB API** (`DATA_API = marvelcdb.com/api/...`) because it is the only source that includes villains/encounters/set-types; falls back to a **jsDelivr mirror** of `zzorba/marvelsdb-json-data` (`DATA_BASE`, player cards + `packs.json` only); and to an **allorigins CORS proxy** (`CORS_PROXY`) if the API blocks CORS. `normCard()` normalizes both schemas. So **first load and "↻ Update data" need internet**; card **images** (`IMG_BASE`) always need internet.
- **Caching & persistence (three layers):**
  - The built SQLite DB is cached in **IndexedDB** (`mc_db`, a `kv` object store via `idb`/`idbGet`/`idbPut`) so later loads are offline.
  - **Owned products** → `localStorage["mc_owned"]` (a Set of pack codes; `saveOwned()`). This is the single source of truth that filters every other tab (`applyOwned()`).
  - **Saved decks** → `localStorage["mc_decks"]`.
  - Backup/Restore export this state as JSON; Help can also export the whole DB as a `.db` file (`exportDb`).
- **Tabs** (`<nav class="tabs">` + `#tab-*` sections, switched in the `data-tab` handler near the bottom): Collection, Heroes, Villains, Modular, Cards, Deck Builder, Rules, Help. Each render function (`renderCollection`, `renderRules`, etc.) re-queries the DB filtered by `owned`.
- **Deck Builder:** signature cards auto-included by hero set code (`signatureCards()`); enforces one aspect + Basic, ≥40 cards, per-card copy limits, and owned-only counts. **Import & check** pastes a MarvelCDB decklist URL/ID, loads it (via CORS proxy), and reports missing cards grouped by the product that contains them.
- **Recommended pairings** (`recommend()` / `renderRecs()`, panel `#db-recs` in the deck-side column): a **fully offline, heuristic** synergy suggester — no external decks. Signals are derived from the card DB itself: a trait vocabulary harvested from all `traits` (`traitVocab()`), word-boundary matching (`wordIn()`), and a seed built from hero + signatures + added cards (`deckSeed()`). Scores owned aspect+Basic candidates on named-card combos (unique/multi-word only), traits the deck's text asks for, trait payoffs/tribes, and a light per-aspect archetype nudge (`ARCH`). Reads as "best cards for this hero" before you add cards, "pairs with your deck" after. It is intentionally **not** sourced from MarvelCDB meta decks (a live/build-time variant was considered and declined).

When changing data handling, keep the API/jsDelivr/proxy fallback chain and `normCard()` working against **both** schemas — they have different field names.

## Profiles, themes & cross-device sync

These three features are newer than the comic theme and the deck builder; all live in the same HTML file (logic roughly around the `pdb` / `PROFILES` / `THEMES` region near the bottom).

- **Profiles (multi-user).** Several people can share one browser install, each with isolated **owned collection + saved decks + theme**. Profiles live in a **dedicated SQLite DB** (`pdb`, separate from the card-data DB), serialized to IndexedDB under key `profiles_v1` — tables `profiles(id,name,color,owned,decks,theme,created,pos)` and `meta(k,v)` with `meta['active']` = active profile. The `localStorage` keys `mc_owned` / `mc_decks` / `mc_theme` are now a **mirror of the active profile** (kept for instant first paint and offline single-profile fallback); `pdb` is the source of truth. On first run, an existing collection is auto-migrated into a "Jugador 1" profile — never wipe `mc_owned`/`mc_decks` on init. UI is the 👤 dropdown in the header.
- **Themes.** A top-right switcher (`#theme-switch`) toggles `<html data-theme="...">`; `applyTheme()` persists to `localStorage["mc_theme"]`, and an inline `<head>` script applies the saved theme **before paint** to avoid a flash. `const THEMES = ["comic","shield","jarvis","strange","tva"]` is the source of truth. **Only `comic` is styled** — the other four (S.H.I.E.L.D, J.A.R.V.I.S, Dr. Strange, TVA) are wired buttons with empty placeholder CSS blocks at the end of the stylesheet that currently fall back to comic. New theme CSS must be scoped `html[data-theme="<key>"] { … }`. Designing these is the active `add-interface-themes` OpenSpec change.
- **Sync.** The profiles `pdb` is exported to base64 and `PUT`/`GET` against the optional `sync-server` (👤 → "☁ Sincronización…", needs a server URL + a sync code). Last-write-wins by server clock. No auth.

`imagenes/` holds local image assets (e.g. alternate card/cover art like the Dr. Strange Sanctum) staged for use in the app; they are not embedded in the HTML.

- **Comic-book theme:** a halftone/Ben-Day **background** (layered `radial-gradient` dot grids on `body`) plus Bangers-font banners, cream "paper" panels, and ink outlines/box-shadows applied app-wide (see the `COMIC THEME` CSS block and `--ink`/`--paper` vars). The **hero detail** modal (`openHeroDetail`) renders its header as a **comic cover** (`.herocover`: masthead with pack-as-issue, big outlined title, traits tagline, featured hero-card image) before the signature/aspect card grids. The **Heroes grid** tiles (`renderHeroes`) are vertical **mini comic covers** (`.herotile`) — each gets a deterministic unique hue from `heroHue(code)` (FNV-1a hash → 0–359), with masthead, framed card art, and a Bangers title banner.
  - **Villains as comic covers:** the Villains tab reuses this language. `renderSetGroups(targetSel, setTypes, term, ownedOnly, cover)` takes a 5th `cover` flag — `renderVillains` passes `true`, `renderModular` does not. When set, each villain set's collapsible header (`.cathead.vcover`) renders as a comic cover: featured villain-card art (first `type_code==='villain'`/`main_scheme` card), a "Marvel Villains · <set type>" masthead, a Bangers title, and a per-set hue from `heroHue(s.set_code)`. The header stays the `data-toggle` click target that expands the card grid below — keep that contract if you touch the markup.
  - **Other Marvel touches:** aspect picker buttons (in `renderDeckBuilder`) always carry their official faction colour (`FACTION[a].c`) — solid fill when viewed, a `color-mix()` wash when it's the deck's chosen aspect, coloured outline otherwise. The legal-deck validation box (`renderValidation`) stamps a rotated rubber-stamp `.deck-stamp` ("Deck Ready!") when `ok`. Toasts (`#toast`) are styled as a cream comic **speech bubble** with an ink-outlined `::after` tail. These all live in the `COMIC THEME` CSS block; the aspect-button wash needs `color-mix()` (degrades to outline-only on old engines).

## Rules tab — verbatim rules pipeline

The **Rules tab shows the official Rules Reference verbatim**, searchable by keyword + category. The text is embedded in the HTML as `const RULES = [...]` (objects shaped `{t: title, c: category, x: literal body, g: group/source}`) and rendered by `renderRules()` (filters on `t`/`x`/`g`; `rulesFmt()` converts the body's `**bold**`/`_italic_`/`- bullets` to HTML and highlights the search term). Categories live in `RULE_CATS` / `RULE_ORDER`.

That embedded array is **generated, not hand-edited** — it's the content of `_rulesref.json`. The full pipeline:

```bash
python _extract_pdf.py    # mc_rulesreference_v17-compressed.pdf -> mc_rules_clean.md  (needs PyMuPDF / `fitz`)
python _build_rules.py    # mc_rules_clean.md -> _rulesref.json  (467 entries, {t,c,x,g})
node   _embed_rules.mjs   # injects _rulesref.json into the HTML, replacing the const RULES array
```

So to change the Rules tab: regenerate `_rulesref.json` (re-run the Python steps, or edit it) then run `_embed_rules.mjs` — do **not** hand-edit the giant `const RULES` array in the HTML. (`mc_rules.md` and `mc_rules_clean.md` are the intermediate markdown.) Categories present in the data: Basics, Glossary, Card anatomy, Deck customization, Game environments, FAQ, Errata.

## Starter decks — embedded decklists

Box heroes show their preconstructed deck via `const STARTER_SLOTS={...}` in the HTML (a map of `heroCode -> {cardCode: copies}`), generated like the rules array — do **not** hand-edit it. `node _fetch_starters.mjs` pulls each mapped hero's official decklist from the MarvelCDB API (`DECKS` maps hero code → MarvelCDB deck id at the top of the script) and replaces the `STARTER_SLOTS={...}` literal in place (also writing `_starter_slots.json`). To add/update a hero's starter deck, edit the `DECKS` map and re-run the script.

## Deploy

`subir-a-rubas.ps1` publishes the app to the [File Browser](https://filebrowser.org/) server at `rubas.aypapol.com`: it logs in (prompts for the panel password, never stored; sent url-encoded in the `X-Password` header), then uploads the HTML **renamed to `index.html`** under `/oculto/marvel-champions/`. Edit `$VIS` (`publico`/`oculto`) / `$PROJ` at the top if needed. `COMO-COMPARTIR.md` documents the no-server alternatives (Netlify Drop, GitHub Pages) — both also rely on renaming the file to `index.html`.

## sync-server/ (optional Bun backend)

A tiny **Bun** service (no dependencies, **no auth** — personal project) that stores each sync code's profile blob as a JSON file and serves it to any device using the same code. It is the answer to the cross-device-sync problem laid out in `decision-backend-nextjs-vs-supabase.txt` (the rubas.aypapol.com host is static-only, so a separate stateful service was needed; a minimal Bun server was chosen over Next.js/Supabase).

```bash
cd sync-server
docker compose up -d --build        # recommended: restart + ./datos volume
PORT=8787 DATA_DIR=./datos bun run server.js   # or run Bun directly
```

Routes (`server.js`): `GET /perfiles/:codigo` → `{updated, blob}`; `PUT /perfiles/:codigo` (body `{blob}`, overwrites, last-write-wins by server time); `GET /salud` → `OK`. `:codigo` must match `^[A-Za-z0-9_-]{1,64}$` (path-traversal guard); 12 MB body cap; CORS open. Behind HTTPS, proxy it under `/sync` (see `sync-server/LEEME.md`) — the app appends `/perfiles/<codigo>` itself. Data is just `*.json` files in `DATA_DIR`; back up that folder.

## Spec-driven changes (OpenSpec)

This project uses **OpenSpec** for non-trivial changes (requires the `openspec` CLI on PATH):
- `openspec/specs/<capability>/spec.md` — current capabilities as `Requirement:` + Gherkin `Scenario:` blocks (e.g. `collection-tracking` documents the `mc_owned` localStorage contract and ownership-driven filtering — keep these in sync when you touch that behavior).
- `openspec/changes/` holds active change proposals; `openspec/changes/archive/` the completed ones.
- Slash commands in `.claude/commands/opsx/` with matching skills `.claude/skills/openspec-*`: `/opsx:explore` (think, never implement) → `/opsx:propose` → `/opsx:apply` → `/opsx:archive` / `/opsx:sync`.

Currently active changes: `add-profiles` (the profiles feature above — partly shipped) and `add-interface-themes` (styling the four unstyled themes — design pending, see its proposal's "Open questions"). The current spec is `collection-tracking`.

For a substantive feature/behavior change, run `openspec list --json` for active work and prefer the propose→apply→archive flow over editing the HTML ad hoc. Trivial fixes don't need a change.

## MCDatabase/

`MCDatabase/index.html.html` is an older standalone snapshot of the app (~93 KB), not the active build. Treat `Marvel Champions Collection.html` as the source of truth.
