# 🎀 Cozy Tile Club

**Gameplay 0.2:** 30 new strategic puzzles, normal play without automatic Cozy checks, versioned save migration. Full per-level strategy rates and legal loss/win evidence are documented in [GAMEPLAY_REWORK.md](GAMEPLAY_REWORK.md).

Private, mobile-first offline PWA: triple-tile puzzles + an isometric kawaii room. Original SVG artwork; no Sanrio assets, backend, ads, purchases or public deployment.

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
- Seven-slot tray, automatic triples, win/loss, unlimited Undo, identical restart.
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
| `src/save/store.ts` | Versioned saves, validation, economy and ownership |
| `src/assets/Motif.tsx` | Swappable original motif artwork and names |
| `src/App.tsx` | Navigation and interactive UI |
| `src/style.css` | Responsive pastel design and motion preferences |
| `scripts/pwa.mjs` | Build-hashed atomic precache service worker |
| `.github/workflows/ci.yml` | Tests, TypeScript, production build and build artifact |

## Exact puzzle rules and proof

A tile is blocked by any remaining tile on a higher layer when both coordinate distances are strictly below 0.94 tile units. Lower/same layers do not block. The view uses the same grid geometry and offset layers. The chosen motif is appended to the tray; exactly three matching motifs disappear **before** the capacity check. Seven unmatched tray entries lose. An empty board **and** empty tray wins. Lost states cannot make more moves until Undo/restart.

The new generator independently mixes balanced motifs over randomized layered geometry. It never assigns motifs along a solution route. A bounded independent DFS certifies each candidate. A curator rejects levels outside behavioral acceptance bands using random, greedy and three-ply beam-search simulations. Every shipped level has both a legal win certificate and a legal seven-slot loss certificate. Three strategies each run 1,000 trials per level, plus a second independent validation stream: 180,000 simulated games total. The simulation transition model is checked against the authoritative engine. No failed or unknown solver result can certify release.

Runtime hints solve the current state, not the original certificate. Their first move has a complete continuation proof. Cozy checks the prospective state: solved moves proceed; proven dead ends require a warning confirmation; unknown checks do not claim safety and stay unplayed unless Cozy is turned off. Undo is free, including after a loss. Worker search has a 200,000-node budget and a five-second watchdog. Atlas shows **all** motifs so unavailable information need never decide the game.

Fairness does not guarantee that every legal move wins. The explicit full-information atlas, unlimited Undo and safe move checks address player-created dead ends. The current atlas is a separate view; a future integrated x-ray view would make planning easier.

## Difficulty and new levels

`generate(seed, tier)` creates a balanced candidate, not a release-approved level. `buildPack()` performs independent solver certification and behavioral curation. Seven masks, randomized occupied cells, two to four offset layers and five to eight motifs create distinct dependency layouts. Metrics contain exact random/greedy/lookahead trial rates, blocked counts, motif count, solver effort and a behavior-derived index. See `GAMEPLAY_REWORK.md` for formulas, thresholds, seeds and all 30 rates.

Run `npm run levels` to deterministically curate a new release pack. `npm run validate:heldout` produces an independent validation stream. Existing saves now identify pack 2: old active attempts are safely cleared while room/economy/completed progress remain. Cozy defaults off, including migration from pack 1; version 2 preserves explicit opt-in. Voluntary campaign restart preserves the room/economy and tracks already-paid rewards separately. Freeze released seeds/IDs going forward or bump the pack version and migrate. Larger campaigns need UI/save caps extended together. **Never ship unproven candidates.**

## New furniture and motifs

Add furniture to `catalog` with a unique ID, price, unlock threshold, integer footprint, kind and color; add its renderer in `Room.tsx`. Its ID is the persisted identity. Furnishings occupy one rectangular footprint and one instance per ID. Decor does not stack on tables in this MVP. Wall/floor items have zero footprint and apply a finish. Extend placement categories for future rugs, wall objects or tabletop layers rather than bypassing collision tests.

Add a motif name and original SVG renderer to `Motif.tsx`, then extend the generator's allowed motif range. Keep the integer ID stable so existing levels and saves remain readable. Replacing the renderer preserves puzzle logic. Use original or properly licensed art for any future public version.

## Validation

`npm test`: rule edge cases, independent exhaustive small-state oracle comparison, all 30 shipped win/loss certificates, 500 candidate seeds generated twice, 180,000 reproducible strategy simulations, room footprints, save validation, first-clear economy, React DOM interaction flows including ordinary loss and explicit Cozy opt-in and a simulated service-worker offline test. `npm run build`: strict TypeScript plus Vite and precache generation. UI tests run in jsdom with a solver-backed Worker double, **not a real browser**. The service-worker test simulates install/activate/offline handlers, not an actual Android installation.

No actual Android/Chrome viewport, accessibility audit, real-worker browser timing or offline installation was verified in this environment because the supported browser-QA capability was unavailable. First device review should test widths 360/393/412 px, tall and short screens, tap accuracy, hints/cozy warnings, phone reload, flight mode and installability. The tested MVP has also passed [GitHub Actions](https://github.com/flegik/cozy-tile-club/actions/runs/38473049243). See `VALIDATION.md` for exact verification evidence.

## Next phase

1. Private device playtest, refine level difficulty with real choices/time/Undo counts.
2. Improve room artwork and larger touch placement targets; integrated motif x-ray.
3. Add more sets and stable appended level packs with save migration.
4. After review, configure private access/hosting separately; never assume a private GitHub repository makes a Pages site private.
