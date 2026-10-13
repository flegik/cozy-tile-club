# Design 0.3 — Cozy Tile Club

## Art direction

A coherent private Fan Edition with six custom SVG character illustrations: Hello Kitty, My Melody, Kuromi, Cinnamoroll, Pompompurin and Keroppi. Four accessory motifs complete the palette (ribbon, strawberry dessert, cherry blossom and moon). IDs, motif counts, all puzzle geometry and certificates are unchanged. Artwork replaces the previous renderer rather than rewriting level data. Illustrations are original vector drawings made for this project; no official asset files were downloaded.

The visual direction pairs restrained rosé/cream surfaces with a ribbon signature, editorial serif wordmark, quiet typography, consistent outline icons, light patterns and three collection identities: Rose Atelier, Cloud Lounge and Midnight Club. The same art appears in the menu, tiles, collection headers and selected room details.

## Light / dark system

`src/theme/tokens.ts` owns typed palette tokens and `themeStyle()` generates CSS properties for the application and document. Light is the default. Settings → Design → Hell / Dunkel changes and saves the palette. The existing version-2 save format gains a validated theme field; old saves without it default to light without losing progress, balances, room, active puzzle, Undo history or explicit Cozy preference. No new campaign/pack migration is triggered.

Every screen, navigation bar, tool, card, dialog, toast and save/import control inherits the selected tokens. Document color-scheme and browser theme-color follow the setting. Midnight Mauve includes plum/navy atmosphere, warm accents, lower-luminance tile surfaces and dedicated room lighting. The SVG room derives its wall/floor night colors from the saved finishes; stored finish values are not altered.

## Room and shop

Ribbon bedding, character cushions and prints, a Cinnamoroll textile, moonlit window, curtains, hanging stars, books, desk details, ceramics and two themed plush renderers add a shared visual identity. Night mode changes rim, wall, floor, outline and furnishing accent colors. A fixed floor textile and wall artwork are ambient illustration, not inventory objects; they do not affect placement/collisions.

All 15 catalog IDs, costs, unlock thresholds and footprints remain compatible. Names use simpler collection-style descriptions. Thumbnails render the **actual item ID**, including different wallpapers, rather than the first item in a category. Placement has a visible footprint plus green valid cells and an alternative with large Spalte / Reihe selectors and a Platzieren button. The existing placement engine is unchanged.

## Copy

All visible App and catalog text, install descriptions and main branding were reviewed. Examples:

| Before | After |
| --- | --- |
| Ein Herz nach dem anderen | Levelauswahl |
| Deine kleinen Schätze | Sammlung |
| Wunderbar gemacht! | Abgeschlossen |
| Ein neuer Anlauf? | Leiste voll |
| Deine Wohlfühlregeln | Einstellungen |
| Undo | Rückgängig |
| Wolkentraum-Bett | Rose Ribbon Bett |
| Bücherzauber | Sammlungsregal |
| Teestündchen | Tea Table |

The tagline is **Match. Decorate. Unwind.** Notifications state the result directly. Solver/budget jargon is removed from player-facing hint messages while preserving the actual safe/unknown behavior. Cozy still defaults off; assistance remains optional.

## Validation

- Full puzzle, room, save, economy, UI and behavioral regression suite: 34 tests.
- Both palette token sets pass >=4.5:1 for tested text/background pairs: primary labels, main/secondary panel text, accent text and tile labels. This checks defined token pairs, not a comprehensive rendered accessibility audit.
- UI tests switch themes, visit puzzle/map/room/shop/settings, reload the app, retain active state and return to light mode. The large position controls are tested for valid movement and rejection of out-of-bounds footprints.
- The 30 level datasets, independent solver and generator remain unchanged; 180,000 simulation results continue to reproduce exactly.
- Light/dark room and motif SVG sheets were rendered to PNG and visually inspected. This verifies actual SVG artwork; it is not a screenshot of the browser UI.
- Layout uses 44–46px minimum controls, fluid widths, wrapping text, no single-line clipping, safe-area navigation and reduced-motion support. Puzzle tiles remain about 45px wide at a 320px viewport; no tile positions/rules changed.

## Remaining review

The supported browser-QA capability was unavailable. Real Android text wrapping, font metrics, hit targets, color-mix/blur rendering, dialog focus behavior and PWA update/install flow still need a device review. The room grid uses small isometric cells; the position selectors provide a larger alternative. The UI intentionally keeps the complete planning view available. The fan illustrations and furniture are vectors, not final painted production art; future asset replacement can preserve IDs and logic.

The existing repository and existing owner-private test Site are used for delivery. No new repository or public audience is created.
