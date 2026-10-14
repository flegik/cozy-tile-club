# Pre-playtest polish · 0.5

- Four concise introduction steps explain free tiles, triples, seven tray slots and layers. Skip, finish and Escape mark completion permanently; rules can reopen it without starting an attempt.
- The planner shows one selected layer at a time in a compact modal. Every remaining motif and its ID/position is retained. The switcher scrolls horizontally if necessary. No planning action spends help or moves a tile. Focus is contained, Escape closes and prior focus is restored.
- Tray and help tools stay together in a sticky bottom panel during normal play. Theme tokens apply to both new dialogs; layer buttons are at least 44px tall. Existing contrast tests apply to their primary/text palette.
- Local aggregate playtest JSON is available in settings. No server or analytics requests were introduced. Counts are tied to actual domain actions, isolated per mode/level and saved with the existing save. No retroactive stats. Terminal outcomes are observed once each per attempt, so a lost attempt recovered through Undo can later also count a win.
- Active visible puzzle time excludes dialogs and all other screens; saved on transitions, background/pagehide and every 15 seconds. Hard process termination can lose the last interval. A full save import carries tracking/tutorial data; an older import has empty tracking.
- Schema 3 additive migration preserves both campaigns and shared furnishings/economy/settings; old versions retain existing migration paths. Level data, generator and solver remain unchanged.

## Automated evidence

58 tests passed, including export and pagehide coverage. Strict TypeScript, Vite production build and generated offline shell are required before publication. Regression coverage includes 30 win/loss certificates, 500 reproducible candidate seeds, 180,000 strategy simulations, exact Normal-7 / Cozy-4 restoration, limited helpers, room/shop flows, palettes, and simulated service-worker install/activation/offline.

UI coverage uses jsdom and a solver-backed Worker double. It is not a browser visual or touch-device test. No supported browser QA tool or real Android device is available here.

## Manual smartphone checklist (still open)

1. At widths 360, 393 and 412px, in short/long screens: first launch → Level 1 → tutorial finish/skip, reload, reopen from rules. Inspect clipping, keyboard focus and font scaling.
2. Plan each layer without scrolling the whole game; compare motif numbers/positions with the board. Inspect tray/tools at bottom, tile tap precision, safe-area inset and dark/light appearance.
3. Change Normal/Cozy with a running level; reload and check exact tray/help/progress. Verify loss → limited Undo and win → once-only hearts.
4. Buy/place/remove furniture; export playtest JSON and full save from Android Chrome, including the Downloads flow.
5. Load fully while online, install PWA, relaunch in airplane mode, run hint/Cozy Worker checks offline, then reconnect and verify the new cache updates. Private hosted sign-in may require network, so verify the installed offline route separately.

Existing private Site access is retained. Do not broaden the audience before agreeing external playtester access.
