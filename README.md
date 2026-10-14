# 🎀 Cozy Tile Club

**Game Feel 0.7:** Curved tile flights, visible triple landings/matches, stable grouped visual tray, new vector character portraits and gesture-unlocked sound. [Architecture and QA notes](GAME_FEEL.md).

**Campaign 0.6:** 100 certified levels, ten collapsible collections and advanced difficulty calibration. Existing levels 1–30 and saves stay intact. [Campaign evidence](CAMPAIGN_100.md).

**Modes 0.4:** Dark by default, 3 Undo + 1 safe hint per attempt, independent Normal/Cozy campaigns and shared room/economy. [Mode/save migration notes](MODES_REWORK.md).

**Design 0.3:** Rose Atelier / Midnight Mauve themes, original Sanrio character fan illustrations, quieter German copy and detailed room artwork. [Design notes](DESIGN_REWORK.md).

**Gameplay 0.2:** 30 new strategic puzzles, normal play without automatic Cozy checks, versioned save migration. Full per-level strategy rates and legal loss/win evidence are documented in [GAMEPLAY_REWORK.md](GAMEPLAY_REWORK.md).

Mobile-first offline PWA: triple-tile puzzles + an isometric kawaii room. Original SVG fan illustrations, browser-local saves and a public GitHub Pages release. No backend, ads or purchases.

## Run

Node.js 22+ and npm. Dependencies are locked in `package-lock.json`.

```sh
npm ci
npm run dev
npm test
npm run build
npm run check
```

Open the Vite URL for development. `dist/` is the complete production output; serve it over HTTPS or localhost. Do not open `index.html` using `file://`. For a local production preview: `npx vite preview --host 0.0.0.0`. No deployment is configured or authorized yet. Later Cloudflare Pages can build with `npm ci && npm run build`, output `dist`.

Android installation: Chrome menu → Install app/Add to home screen. The production service worker precaches the entire application, solver worker and icons. Offline play requires one successful online installation/cache fill. Development deliberately does not register a service worker. Saves use this browser's localStorage; export/import in Settings transfers them. Browser data removal deletes local progress.

## Features

- 30 certified, reproducible levels; seven geometry families, offset layers, five to eight motifs per level.
- Seven-slot tray, automatic triples, win/loss, limited Undo, identical restart.
- Worker-based safe hints and Cozy move checks; time/node budgets with an explicit unknown result.
- Layer atlas reveals all unremoved motifs and their actual positions: no compulsory blind guesses.
- Three chapters, sequential unlocks, first-clear heart rewards (replays never farm hearts).
- 15 shop items: 12 furnishings/decorations, two wallpapers and one floor finish; default pink wallpaper and wooden floor.
- 7×7 isometric placement with multi-cell footprints, relocation/removal and owned inventory.
- Saved room, currency, progress, settings and active puzzle with validated Undo history.
- Touch-friendly controls, reduced-motion support, subtle optional generated sounds.
- Save export/import; storage-failure notice.

## Code map

| Module | Responsibility |
| --- | --- |
| `src/puzzle/engine.ts` | Authoritative accessibility, tray and terminal rules |
| `src/puzzle/generator.ts` | Seeded geometry, balanced/braided triple assignments, independent certification |
| `src/puzzle/solver.ts` | Independent bounded DFS, BigInt removal mask, failed-state memoization |
| `src/puzzle/solver.worker.ts` | Off-main-thread runtime solver |
| `src/puzzle/levels.json` | Reviewed release pack, including solution certificates and metrics |
| `src/puzzle/levels.ts` | Release-pack loader |
| `src/room/engine.ts` | Catalog, footprints, placement and projection |
| `src/room/Room.tsx` | Two-wall room and vector furniture rendering |
| `src/save/store.ts` | Schema-3 dual campaigns, validation, shared economy and ownership |
| `src/assets/Motif.tsx` | Swappable original motif artwork and names |
| `src/App.tsx` | Navigation and interactive UI |
| `src/style.css` | Responsive pastel design and motion preferences |
| `scripts/pwa.mjs` | Build-hashed atomic precache service worker |
| `.github/workflows/ci.yml` | Tests, TypeScript, production build and build artifact |

## Exact puzzle rules and proof

A tile is blocked by any remaining tile on a higher layer when both coordinate distances are strictly below 0.94 tile units. Lower/same layers do not block. The view uses the same grid geometry and offset layers. The chosen motif is appended to the tray; exactly three matching motifs disappear **before** the capacity check. Seven unmatched tray entries lose. An empty board **and** empty tray wins. Lost states cannot make more moves until Undo/restart.

The new generator independently mixes balanced motifs over randomized layered geometry. It never assigns motifs along a solution route. A bounded independent DFS certifies each candidate. A curator rejects levels outside behavioral acceptance bands using random, greedy and three-ply beam-search simulations. Every shipped level has both a legal win certificate and a legal seven-slot loss certificate. Three strategies each run 1,000 trials per level, plus a second independent validation stream: 180,000 simulated games total. The simulation transition model is checked against the authoritative engine. No failed or unknown solver result can certify release.

Runtime hints solve the current state, not the original certificate. Their first move has a complete continuation proof. Cozy checks the prospective state: solved moves proceed; proven dead ends require a warning confirmation; unknown checks do not claim safety and stay unplayed unless Cozy is turned off. Undo costs one of three attempt points, including after a loss. Hints cost one point only after a full continuation has been validated. Worker search has a 200,000-node budget and a five-second watchdog. Atlas shows **all** motifs so unavailable information need never decide the game.

Fairness does not guarantee that every legal move wins. The explicit full-information atlas, limited Undo and safe move checks address player-created dead ends. The atlas is a compact modal with a layer picker. Motifs retain their actual coordinates and IDs; no moves occur in planning.

## Difficulty and new levels

`generate(seed, tier)` creates a balanced candidate, not a release-approved level. `buildPack()` performs independent solver certification and behavioral curation. Seven masks, randomized occupied cells, two to four offset layers and five to eight motifs create distinct dependency layouts. Metrics contain exact random/greedy/lookahead trial rates, blocked counts, motif count, solver effort and a behavior-derived index. See `GAMEPLAY_REWORK.md` for formulas, thresholds, seeds and all 30 rates.

Run `npm run levels` to append configured release stages. It checks release locks and never regenerates an already complete campaign. `npm run validate:heldout` produces an independent validation stream. Existing saves now identify pack 2: old active attempts are safely cleared while room/economy/completed progress remain. Normal and Cozy are independent campaigns. Legacy progress is assigned to Normal; Cozy starts empty. Active pack-2 attempts migrate with fresh initial help budgets because previous usage was not tracked. Voluntary campaign restart preserves the room/economy and tracks already-paid rewards separately. Freeze released seeds/IDs going forward or bump the pack version and migrate. Campaign/save/tracking caps now derive from the level count; future collections are listed in `src/ui/collections.ts`. **Never ship unproven candidates.**

## New furniture and motifs

Add furniture to `catalog` with a unique ID, price, unlock threshold, integer footprint, kind and color; add its renderer in `Room.tsx`. Its ID is the persisted identity. Furnishings occupy one rectangular footprint and one instance per ID. Decor does not stack on tables in this MVP. Wall/floor items have zero footprint and apply a finish. Extend placement categories for future rugs, wall objects or tabletop layers rather than bypassing collision tests.

Add a motif name and original SVG renderer to `Motif.tsx`, then extend the generator's allowed motif range. Keep the integer ID stable so existing levels and saves remain readable. Replacing the renderer preserves puzzle logic. Use original or properly licensed art for any future public version.

## Validation

`npm test`: rule edge cases, independent exhaustive small-state oracle comparison, all 100 shipped win/loss certificates, 500 candidate seeds generated twice, 180,000 reproducible strategy simulations, room footprints, save validation, first-clear economy, React DOM interaction flows including ordinary loss and explicit Cozy opt-in and a simulated service-worker offline test. `npm run build`: strict TypeScript plus Vite and precache generation. UI tests run in jsdom with a solver-backed Worker double, **not a real browser**. The service-worker test simulates install/activate/offline handlers, not an actual Android installation.

No actual Android/Chrome viewport, accessibility audit, real-worker browser timing or offline installation was verified in this environment because the supported browser-QA capability was unavailable. First device review should test widths 360/393/412 px, tall and short screens, tap accuracy, hints/cozy warnings, phone reload, flight mode and installability. The tested MVP has also passed [GitHub Actions](https://github.com/flegik/cozy-tile-club/actions/runs/38473049243). See `VALIDATION.md` for exact verification evidence.

## Next phase

1. Private device playtest, refine level difficulty with real choices/time/Undo counts.
2. Review room artwork and touch targets on actual phones.
3. Add more sets and stable appended level packs with save migration.
4. After review, configure private access/hosting separately; never assume a private GitHub repository makes a Pages site private.

## Private playtest 0.5

Level 1 includes a four-step, skippable introduction, available again from Spielregeln. Completion is saved across both modes. Planning opens as a compact layer dialog; the normal tray and tools stay sticky. All existing level files and difficulty ratings are unchanged.

Settings → Playtest-Daten exportieren downloads local JSON, separated by mode and level: attempts, wins, losses, seconds, undos, hints and restarts. It contains no room, inventory or personal data. Tracking starts with this version; previous sessions are not reconstructed. Visible active puzzle time is accumulated on transitions, backgrounding/pagehide and every 15 seconds, excluding modal planning/tutorial/rules and other screens. Approximate time may lose up to 15 seconds on a forced process kill. A resumed attempt never adds an attempt. Actual successful helper actions alone increment usage. A loss and win each count at most once per attempt; a rescued loss may contribute to both. Restart of the same active level creates an attempt and a restart.

Save schema 3 is extended additively with tutorialCompleted, tracking and attempt outcome observations. Missing fields default safely; both campaigns, current states, remaining help, purchases and room stay intact. These fields travel with full save exports. See PRE_PLAYTEST.md for checks and remaining device tasks.

## Public GitHub Pages & iPhone

Production URL: https://flegik.github.io/cozy-tile-club/

The Vite base is `/cozy-tile-club/`. The Pages workflow runs tests, builds, validates every entry-point asset and precache path, then deploys the artifact through GitHub Actions on main. GitHub repository Settings → Pages must use GitHub Actions. No backend or paid service is required. The previous private test Site is separate.

On iPhone, open the URL in Safari → Share → Add to Home Screen → enable Open as Web App → Add. Start the installed icon once while online so the whole offline shell, icons and solver Worker can cache. Apple metadata, a 180px touch icon, standalone manifest, viewport-fit and safe-area insets are included. Actual iPhone/Safari installation, status-bar appearance, background persistence and airplane-mode launch still require device testing.

Saves are local to the origin and browser context. Moving from the previous private test address to github.io does not copy storage automatically: export your full save on the old address and import on the new address. Safari and installed iOS web-app storage may differ; use export/import if progress does not appear after installation. Normal updates neither rename the save key nor reset campaigns, help, room or settings. Clearing browser data/uninstalling can remove local saves; keep an export.

Service-worker caches are scoped by this application's name and base pathname. Activation cannot delete WORDLE caches; requests outside this app's subpath are untouched. Every build gets a content-derived cache version, new precaching is atomic, and no update forces a game reload. A Pages release is publicly viewable independently of repository visibility.

## Campaign 0.6 · 100 levels

The first 30 remain exactly unchanged; 70 certified levels extend the campaign through Schwer, Sehr schwer, Experte, Master and Finale. Ten collapsible collections, dynamic save/tracking limits, independent Normal/Cozy progress and final-level completion support all 100. Shared room/economy and help limits are unchanged. Pack 2/schema 3 and the original save key are retained.

See [CAMPAIGN_100.md](CAMPAIGN_100.md) for all acceptance criteria, average strategy success rates and limitations. `npm run validate:advanced` separately reproduces 560,000 training/holdout games for the extension. Normal `npm test` uses proof replays plus smaller independent behavior samples, while preserving the existing baseline checks. `release-lock.json` makes accidental edits to any released level visible.
