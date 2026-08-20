# Documentation State

This file tracks the last commit on `develop` covered by the automated weekly
documentation sync, so the next run knows where to start looking for changes.

## Last run

- **Covered commit (`develop` HEAD):** `48edca6d7a1b09b15b4272e7e9ac93a39a1daeb6`
- **Date:** 2026-08-15
- **Baseline used:** No prior `DOCS_STATE.md` existed, so this run fell back
  to the last 7 days of commits on `develop` (back to `f96e66c3`) as the
  prioritisation signal, per the fallback rule.

### Changelog

- **Changed:** `docs/system-design.md` — added an "Observability & metrics
  endpoints" subsection documenting `public/metrics.php` (Prometheus scrape
  endpoint) and `public/fetch.metrics.php`/`JsonMetricsHelper`/`QueryParam`
  (segmented JSON metrics endpoint), neither of which was previously
  described beyond a passing mention. Reworded the "Entry scripts" bullet to
  point at the new subsection instead of restating it.
- **Added:** `docs/DOCS_STATE.md` (this file).
- No documents were found to be wrong, orphaned, or in need of a split/merge
  in this pass; see the accompanying pull request for known gaps deferred to
  the next run.
