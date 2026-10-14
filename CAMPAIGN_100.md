# 100-level campaign · 0.6

100 playable levels, 70 appended. Pack stays 2, save schema stays 3, and the storage key is unchanged. All objects in levels 1–30 are exactly the released baseline, including IDs, seeds, motifs, coordinates, certificates and metrics. `tests/fixtures/released-30.json` and `release-lock.json` protect against accidental replacement. Generation checks the release lock before doing anything; running `npm run levels` after reaching its configured target makes no changes. Future stage entries increase the append target and retain existing levels and validation records.

## Generation and curation

Legacy tiers 0–3 retain their deterministic generator. New tiers 4–8 add fourteen silhouette masks, staggered terraces, alternating diagonals, mirrored offsets and irregular layer caps. Geometry and balanced motif permutation remain independent of any winning route. The final stages use 42 tiles throughout, without shrinking touch tiles. Every accepted layout has Jaccard coordinate/layer similarity <=0.85 to every earlier layout; all 70 layouts are distinct and cover all fourteen new silhouettes. This exact-coordinate screen cannot detect every perceptual resemblance.

2,773 candidates examined: 251 lacked a proof within the 30,000-node release budget, 2,390 failed quick behavioral checks, 62 failed full behavior/structural checks, 70 accepted. Solver failure and unknown/budget are never acceptance. Each accepted candidate has an independent legal full solution and a replayed seven-slot loss. Full-information layers remain available.

Difficulty uses random, greedy, three-ply and six-ply policies, sampled safe/unsafe/unknown branches, dependency edges/chains, effective choices and next-match horizon. Six-ply search is a bounded width-six beam with deduplicated frontiers, not an exhaustive six-move oracle. Both planning policies use the atlas information and no solver/certificate. The legacy score remains informational; acceptance and ordering use deeper policy performance and structural gates. The additional challenge index combines greedy/three-/six-ply rates (10/25/65% weights). Scores alone do not certify quality.

`decisionDensity` is the fraction of positions along the winning certificate offering more than one motif/unlocking-consequence class. `effectiveChoices` averages these classes. `matchHorizon` is the largest sampled minimum number of legal moves to the next match, searched to six moves with a bounded frontier; unknown samples are reported separately. These are path-dependent proxies, not a proof of required human thinking depth or an exact count of all solutions. Sampled solved branches report existence of alternatives, not path cardinality.

## Calibration evidence

Each new level has 1,000 runs per policy on the curation seed and another 1,000 on an independent holdout seed: **560,000 new simulations**. `npm run validate:advanced` reproduced every stored result exactly and independently re-solved all 70. The original 180,000 simulations remain reproducible unchanged. A third smaller independent stream is included in regular CI. Full expensive reproduction stays separate from CI.

Training success percentages:

| Levels | Stage | Random | Greedy | Three-ply | Six-ply | Mean decision density | Mean sampled match horizon | Tiles |
|---|---|---:|---:|---:|---:|---:|---:|---:|
|31–40|Schwer|0|0.59|31.29|76.54|0.931|2.2|36|
|41–60|Sehr schwer|0|0.07|18.50|58.73|0.941|2.7|39|
|61–80|Experte|0|0.02|5.70|39.34|0.945|3.0|42|
|81–95|Master|0|0|2.88|26.16|0.941|3.0|42|
|96–100|Finale|0|0|2.06|14.76|0.938|3.2|42|

All 100 starts have independently verified full solver wins. Zero random wins is only a sample result, not a probability guarantee. The rates are neither human win probabilities nor evidence that humans need six moves exactly. The zero random/greedy saturation is why deeper planning, structural evidence and human playtests matter.

Ten-level group six-ply rates across the extended campaign: 76.54%, 66.63%, 50.83%, 45.10%, 33.57%, 28.92%, 17.70%. Existing 21–30 averages 89.60% in the six-ply baseline. Level 30 was already an unusually difficult individual level; the first extended collection permits a brief respite while exceeding the preceding collection on average. No per-level monotonic human difficulty is claimed. `campaign-summary.json` records ten-level groups; `advanced-calibration.json` contains every independent validation result.

## Runtime and UX

The independent DFS now precomputes tile bits. Runtime uses a stored certificate only after replaying every remaining move against the actual engine; if it is not a legal winning continuation, independent DFS takes over. No result bypasses gameplay validation or helper charging rules. The existing 200,000-node / five-second UI limits remain. 420 sampled start, midgame and alternative-choice queries completed with zero budget exhaustion: 286 used a validated proof fast path. Host Node timings: p95 1.53ms, max 7.76ms. These are not phone benchmarks and do not bound every reachable state; pathological queries can still exhaust the budget and return no hint without charging it.

Ten collapsible collections retain the original three names and use existing motifs. The current collection opens and scrolls into view, collection and total counters show all 100, level 30 continues to 31, and level 100 shows campaign completion without a 101st level. Normal/Cozy remain independent; room, inventory, hearts and themes remain shared. Rewards remain once per level/mode. Playtest data is loaded dynamically through all 100 levels.

## Verification and limits

**69 automated tests, production build and Pages subpath validation passed.** Full extension validation separately reproduced 560,000 runs.

Automated coverage: released-level lock, all 100 solver/replay proofs, win/loss sequences, deterministic and balanced new geometry, near-duplicate screen, independent behavioral trend, Normal-47 / Cozy-12 restoration, old active saves, help limits, tracking through level 100, finale reward/closure, room/shop regression, UI collections, PWA/offline handlers, Pages asset paths. 500 legacy plus 500 advanced candidate seeds tested. In the advanced sample, 443 proved within 15,000 nodes, 49 returned explicit budget exhaustion and 8 were unsolvable; only proved states are replayed.

The campaign intentionally keeps the same pack and schema: old active attempts remain valid and all existing playtest data survives. No furniture, prices or rewards changed. Real iPhone/Safari and Android responsiveness, touch accuracy, offline installed launch and arbitrary midgame hint performance require device testing. Existing local JSON tracking supports subsequent human recalibration; no actual private user playtest report was supplied, so none was invented or used as evidence.

Deployment uses the existing public GitHub repository and Pages workflow. No other project is modified.
