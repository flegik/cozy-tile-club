# Game feel and vector portraits · 0.7

## Authoritative state and visual projection

No changes to any of the 100 level objects, certificates, puzzle transition rules, solver, save key or schema. Logical selections still commit once immediately and are persisted before animation starts. Grouping never sorts `state.tray`. The visual tray reconstructs stable tile IDs from the chronological removed-ID history, performs the same motif triple removal, then groups by first appearance among remaining motifs. Existing saves need no migration and load directly into an idle visual projection.

Forward motion stages an extra incoming visual tile even when the logical engine already removed a triple. Real board and seven-anchor DOM rectangles define flight endpoints. A 340ms transform timeline includes a lift/pop and sampled curved path, followed by a 140ms landing bounce. For triples, all three remain visible through landing, then glow and pop/dissolve together over 320ms with a separate ring, eight stars and two hearts. Remaining groups shift using one FLIP measurement and 180ms transform animations. The moving clone remains visible during flight; its staged tray token becomes visible on landing. Ordinary selection takes around 480ms; a full match including collapse takes up to 980ms.

A synchronous lock prevents rapid duplicate actions before React renders. Phase callbacks are guarded by a generation counter, with cancellable requestAnimationFrame completion promises rather than timeout chains. Undo can cancel a selection or match and fly the most recently selected motif back from its current visible position or corresponding anchor. Restart, navigation, mode switch, rules/planning opening, visibility change, pagehide, scrolling and resizing safely cancel presentation and rebuild from the authoritative state. Stale callbacks cannot modify a later attempt. Undo/hint accounting and shared economy remain unchanged. Win/loss dialogs wait for visual completion, or appear immediately when an interruption settles to a terminal state.

A lightweight requestAnimationFrame driver interpolates transform and opacity keyframes without depending on Web Animations API support. It preserves the actual curved geometry, easing and cancellable completion. Reduced-motion preference, or missing frame scheduling, simplifies the sequence to an immediate grouped projection. CSS decorative effects are disabled under reduced motion. All flight/shift/pop motion uses transforms and opacity; no per-frame layout reads, canvas, dependency or external asset loads are added. Scrolling or rotation deliberately snaps a pending transition rather than flying toward stale viewport coordinates.

## Portraits and sound

Six entirely new vector head portraits replace the previous six character paths: Hello Kitty, My Melody, Kuromi, Cinnamoroll, Pompompurin, Keroppi. Motif IDs 0–5 and names are unchanged; accessory IDs 6–9 retain their renderers. Portraits use a new 100×100 view box, fine contours, characteristic silhouettes/accessories and flat character colors. Cinnamoroll has longer drooping ears; Kitty has an oval face, ear bow and six whiskers; Kuromi uses a dark jester hood and pink skull; My Melody uses a pink rabbit hood and flower; Pompompurin has a brown beret and floppy ears; Keroppi has oversized protruding eyes and a striped collar. Kuromi's thin outer edge remains distinguishable on dark menu surfaces.

Original fan vectors, not downloaded official assets. Visual reference: the official Sanrio character/product imagery at https://www.sanrio.com/collections/hello-kitty-friends and https://www.sanrio.com/collections/all-sanrio-characters. No watermark or third-party image file is integrated. `scripts/render-art.ts` exports the actual SVG renderers for size review; portraits were raster-reviewed at 180px, 44px and 30px. Perceived faithfulness and personal preference still require your girlfriend's review.

A pooled Web Audio context is unlocked on user interaction, with Safari-compatible optional resume. Separate soft synthesized cues cover selection, landing, match, Undo, invalid taps and victory. Two sine partials, short gain envelopes and low-pass filtering replace the old single-frequency sweep. Notes use the audio clock and release their nodes on oscillator completion. Sound setting remains authoritative; blocked/missing audio never blocks gameplay. Real iPhone volume/silent-mode/background behavior needs listening on the device.

## Quality assurance

Controlled animation tests verify actual source/destination coordinates, group insertion and shifts, the incoming third tile through landing, synchronized three-token matching, collapse, seventh-slot match, delayed terminal dialogs, rapid taps, cancellation, Undo, restart and reduced motion. Real App integration tests cover immediate single saved commits, interrupted Undo quotas, navigation/mode persistence and invalid covered taps. Existing campaign/solver/room/save/progression/PWA checks remain required. No playtest or save data is transmitted.

Local-file browser previews are not permitted in this environment. Final visual motion review therefore uses the regular deployed HTTPS version, separate from unit tests. Real iPhone/Safari and Android touch performance, sustained frame rate and audible cue balance remain manual test points. Browsers without frame scheduling, or with reduced motion, snap safely; interruption settles immediately rather than retaining unfinished visual frames in saves.

## Release verification · 14 October 2026

88 automated tests across 13 files passed, including all existing solver, level, save, mode, room and PWA checks. The production build and Pages subpath check passed. The release-lock test confirms all 100 published level objects remain unchanged. CI quality checks and the Pages deployment succeeded; all ten deployed build files returned HTTP 200 and matched the tested local build byte for byte.

On the public HTTPS app, an existing attempt resumed after updating with its tray, remaining help and shared wallet intact. An interleaved Kuromi → Hello Kitty → Kuromi selection visibly grouped as Kuromi → Kuromi → Hello Kitty. Match collapse, Undo quota changes and reload persistence were checked. Actual DOM measurements showed the flying tile traversing the board-to-tray route. Portraits and grouped tray were visually reviewed in browser screenshots.

The controlled browser's screenshot operation captures the settled view after the animation, so the captured images do not validate the complete intermediate motion or provide a reliable animation recording. Full visual motion quality, touch performance and audio balance still need an actual iPhone/Safari playthrough. No real iPhone or Android hardware was available. This limitation is separate from the passing deterministic timeline/phase tests.

## Flicker correction · 0.7.1

Board tiles no longer have a reusable opacity entry animation. Removing the newly-free or hint state therefore cannot restart tile-in. Reveal feedback uses an independent border pseudo-element with fading glow; it does not scale or fade the tile surface. Board transform transitions are disabled so they cannot interpolate against the frame driver. Free-tile opacity is explicitly stable during input locking.

Each motion phase owns its animation handles and retains final transform/opacity values until the next React commit. In particular, matched tiles remain at zero opacity until their DOM nodes are removed; completion no longer restores them visibly before removal. Cancellation is idempotent so a stale cleanup cannot overwrite a subsequent animation.

Selection now has a radial sparkle, sweep highlight and brighter moving star. Landing has a separate impact ring. Match particles live in a fixed overlay, outside dissolving tray tokens, so they are not dimmed by parent opacity. All effects remain local-only, pointer-transparent, theme-aware and hidden for reduced motion.

91 tests across 14 files include two regressions using the real frame driver and actual application/CSS: unchanged board node identity, opacity and animation during consecutive selections; and the dissolved triple held at zero opacity through the pre-commit microtasks. Existing engine, level, solver, saves, progression and room checks remain unchanged.

Reduced motion skips effect DOM and effect-only geometry reads. The full multi-level campaign UI roundtrip retains all assertions with a 15-second per-test allowance for shared CI runners; the default timeout for other tests is unchanged.
