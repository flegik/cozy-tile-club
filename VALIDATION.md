# MVP verification — 2026-10-13

## Passed locally

- `npm run check`: 20 tests across 4 test files, strict TypeScript and production Vite build.
- 30 shipped levels independently solved and replayed to victory using the gameplay engine.
- 500 distinct seeds, each generated twice for deterministic equality, independently certified and replayed. All passed, no rejected candidates in this set. Maximum tray usage on the verified routes: 6.
- Five board masks and offset layers. Release heuristic scores: 17–44, ordered ascending.
- Exhaustive engine-oracle vs independent solver comparison for every reachable state of a small stacked puzzle.
- Seventh-slot triple is removed before checking loss; blocked/repeated selections cannot mutate state.
- Undo, true failure vs search-budget distinction, midgame save replay/history validation.
- Bounds, integer-grid coordinates, footprint collisions and single-instance furniture relocation.
- First-clear rewards only, ownership, balances and unlocks.
- React DOM interaction tests: full level, hint/Undo/atlas/resume, purchase/place/remove furniture.
- Simulated service-worker install/activation/offline navigation and inclusion of solver worker/icons in precache.
- Isometric room SVG rendered to PNG and visually inspected locally.

## Not verified

- Real Android or responsive browser rendering, pointer hit testing, install prompts, real Worker timing and flight-mode caching. No supported browser-QA tool was available; no preview server was started.
- GitHub repository creation/push and GitHub Actions run. Workflow exists locally; its remote run is pending repository creation.
- No public or private web hosting deployment has taken place.

## MVP limits

Original vector placeholder artwork, one room, one item instance per catalog ID, rectangular footprints, no tabletop/wall decoration stacking. 15 catalog entries include wallpapers/floor finishes. Difficulty is heuristic and needs human playtesting; certainty is restricted to solution paths and proven unsafe moves. Search exhaustion is explicitly unknown. Cozy runs bounded searches in a worker and refuses unproven moves unless turned off. Additional level packs need the UI/save cap extended and a stable ID/save migration policy. Browser-local data requires export for cross-device transfer.

## Review next

Play on Android at 360/393/412 px widths, verify tapping and furniture movement, reload midway through a level, use Undo after losing, test Cozy warnings and hints, install then test flight mode. Refine the art and level ordering from that review before Cloudflare deployment.
