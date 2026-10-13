# 🎀 Cozy Tile Club

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

- 30 certified, reproducible levels; five geometries, offset layers, ten original motifs.
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

The generator first constructs a legal geometric removal route, assigning complete motif triples along it. Later difficulty uses two- and three-motif interleaving (up to six unmatched entries on that route). Every candidate is then independently solved and the resulting route is replayed using the actual engine during verification. The solver does **not** import the engine, generator or constructed route. It derives higher-layer blockers independently and searches all legal tile choices with exact triple/capacity rules. It returns `solved`, `unsolvable`, or `budget`; only `solved` can certify release. A rejected candidate throws rather than entering the shipped pack.

Runtime hints solve the current state, not the original certificate. Their first move has a complete continuation proof. Cozy checks the prospective state: solved moves proceed; proven dead ends require a warning confirmation; unknown checks do not claim safety and stay unplayed unless Cozy is turned off. Undo is free, including after a loss. Worker search has a 200,000-node budget and a five-second watchdog. Atlas shows **all** motifs so unavailable information need never decide the game.

Fairness does not guarantee that every legal move wins. The explicit full-information atlas, unlimited Undo and safe move checks address player-created dead ends. The current atlas is a separate view; a future integrated x-ray view would make planning easier.

## Difficulty and new levels

`generate(seed, difficulty, id)` supports deterministic candidates. Release metrics include average legal decision count, actual layer depth, sampled proven traps and search effort/lookahead. The composite score orders the 30-level pack; it is a heuristic, not a claim of measured human difficulty. Trap probing is sampled and budget-limited; unproven cases do not count as proven traps. Playtesting should refine this ordering.

Run `npm run levels` to regenerate the current release pack. The test builds 500 seeds twice, proves and engine-replays each, validates motif multiplicities, and verifies the pack matches its deterministic generator. Add seeds/geometries/braid configurations in `generator.ts` and update the pack-building test. **Do not ship uncertified or budget-exhausted candidates.** Existing saves refer to level IDs: freeze released seeds/IDs; when extending the pack, append new IDs and migrate saves rather than reshuffling live IDs. The MVP UI and save cap currently use 30 and must be extended together for a larger release.

## New furniture and motifs

Add furniture to `catalog` with a unique ID, price, unlock threshold, integer footprint, kind and color; add its renderer in `Room.tsx`. Its ID is the persisted identity. Furnishings occupy one rectangular footprint and one instance per ID. Decor does not stack on tables in this MVP. Wall/floor items have zero footprint and apply a finish. Extend placement categories for future rugs, wall objects or tabletop layers rather than bypassing collision tests.

Add a motif name and original SVG renderer to `Motif.tsx`, then extend the generator's allowed motif range. Keep the integer ID stable so existing levels and saves remain readable. Replacing the renderer preserves puzzle logic. Use original or properly licensed art for any future public version.

## Validation

`npm test`: rule edge cases, independent exhaustive small-state oracle comparison, all 30 shipped levels, 500 deterministic seeds generated twice, room footprints, save validation, first-clear economy, three React DOM interaction flows and a simulated service-worker offline test. `npm run build`: strict TypeScript plus Vite and precache generation. UI tests run in jsdom with a solver-backed Worker double, **not a real browser**. The service-worker test simulates install/activate/offline handlers, not an actual Android installation.

No actual Android/Chrome viewport, accessibility audit, real-worker browser timing or offline installation was verified in this environment because the supported browser-QA capability was unavailable. First device review should test widths 360/393/412 px, tall and short screens, tap accuracy, hints/cozy warnings, phone reload, flight mode and installability. The tested MVP has also passed [GitHub Actions](https://github.com/flegik/cozy-tile-club/actions/runs/38473049243). See `VALIDATION.md` for exact verification evidence.

## Next phase

1. Private device playtest, refine level difficulty with real choices/time/Undo counts.
2. Improve room artwork and larger touch placement targets; integrated motif x-ray.
3. Add more sets and stable appended level packs with save migration.
4. After review, configure private access/hosting separately; never assume a private GitHub repository makes a Pages site private.
