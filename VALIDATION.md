# Gameplay 0.2 validation

See [GAMEPLAY_REWORK.md](GAMEPLAY_REWORK.md) for the current generator, behavioral calibration, all 30 strategy rates, save migration and verification limits.

The original MVP passed its initial GitHub Actions run, but those tests did not detect mathematically unwinnable-to-lose early levels. The rework adds explicit loss certificates, behavioral rejection and 180,000 reproducible games. Local UI uses jsdom; real Android viewport and PWA-upgrade behavior remain for device review.

## Local final checks

- `npm run check` passed: **28 tests**, strict TypeScript and production build.
- All 30 new levels independently certified and engine-replayed; all 30 also have reachable seven-slot loss certificates.
- 500 additional deterministic candidate seeds: all 500 independently solved and replayed under the 60,000-node budget.
- 90,000 calibration and 90,000 independent-stream validation games reproduced exactly in tests.
- Holdout results preserve increasing average difficulty across all four tiers.
- Normal-play loss, explicit Cozy activation, complete planning information, migration and replay-reward protection passed UI/rule tests.
- GitHub Actions verification for this rework is performed after pushing; the final task report links the run. Browser QA limitations above remain.
