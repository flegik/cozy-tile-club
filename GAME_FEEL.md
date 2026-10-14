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

The direct browser screenshot API subsequently captured twelve actual intermediate frames on the deployed 0.7.1 app: flight, landing with all three motifs present, synchronized glow/dissolve, independent ring/stars/hearts, and the empty tray afterward. This overcomes the earlier capture limitation noted in the historical 0.7 section. A slowed 140ms-per-frame image sequence was retained as QA evidence; it is not a frame-rate benchmark. Browser CSS inspection also confirmed that clearing newly-free kept the tile at opacity 1 and animation-name none. An existing 19-tile attempt with tray IDs 16/15 and its remaining help resumed unchanged after the service-worker update. Real iPhone/Safari performance and audio balance remain manual checks.

## Continuous selection and opaque tiles · 0.7.2

Board selection is no longer disabled for the duration of a visual transition. Each valid tap is checked against the latest authoritative attempt and persisted immediately, even inside one React event batch. Repeating an already removed ID does nothing. The visual layer buffers accepted transitions in order and gives each buffered tile immediate lifted feedback. With pending work, the current timeline and following transitions catch up smoothly; match playback is capped at 1.5× so a third-tile landing and synchronized match remain visible. This is buffered playback, not concurrent flights.

Undo, restart, navigation, mode changes and visibility interruption clear pending presentation while retaining the committed save. Undo reverses only the latest logical selection, including one awaiting presentation, and charges once. Logical win/loss still prevents later input and dialogs wait for the presentation to settle. Cozy's explicit solver checks and the hint guard remain intact. No engine, solver, level or save-schema changes.

Covered board tiles now use opacity 1, including input-disabled states; the existing brightness/saturation shading still distinguishes blocked tiles. Tests cover immediate distinct rapid inputs, duplicate suppression, queued triples, completion without ghosts, interruption, seven-slot loss, Undo and full tile opacity.

## 0.7.3 – Animation preference
Settings now offer System, Full and Reduced animation modes. Full explicitly overrides prefers-reduced-motion for both the frame driver and decorative CSS/effects, without changing device settings. Default System continues to respect accessibility preferences. The choice persists in the existing save key/schema; older saves default to System, preserving all campaign and room data. Automated coverage emulates reduced device motion and confirms Full still schedules flight and selection effects. Physical iPhone verification remains manual.
