---
audience: developer
summary: Baseline, coverage revision, and changelog for the latest documentation pass.
---

# Documentation State

## Last run

- **Covered commit (`develop` HEAD):** `6401199269d330643a0eb9b29b30cff4272b418d`
- **Date:** 2026-11-10
- **Baseline SHA:** `dce81e73b31f74d193867acbaff2b9c5d99cacf2`
- **Fallback used:** No. Fetching the full history recovered the recorded commit;
  it was compared directly with the covered HEAD.

## Changed areas reviewed

The baseline-to-HEAD diff spans 286 files. Changed areas include ancestry,
taxonomy and hybrid definition/selection; compatibility contributors; profile
identity and locking; discovery and gardens; item/device browser actions;
Lovense and RLV integration; media and shared dialogs; AI tool isolation;
onboarding and demo launch context; tagged change history; database cloning;
deployment and dependency updates; and related regression tests.

The documentation tree was mapped by topic and audience before editing.
Existing owners cover these areas: species creation/compatibility and the
ancestry worked guide own inheritance rules; Accounts & Profiles owns identity;
Search & Discovery owns result contracts and gardens; the dashboard guide owns
routing and panel integration. The remaining guides own gameplay, devices,
integrations, operations, and support. This pass prioritizes recently changed
identity/discovery contracts and incorrect dashboard claims, not a complete
re-audit of every changed subsystem.

## Changelog

- **Updated:** `abilities.md` — consolidated grant schema, deployment and
  regression details; corrected percentage-point Bite effects, unavailable
  dashboard entries, and the browser's dependence on recent owner location.
- **Updated:** `account-and-profiles.md` — attributed the previously unscoped
  identity section to developers; added safe player guidance, atomic/stale
  save behavior, locking, discovery visibility, and blocking scope.
- **Updated:** `search-and-discovery.md` — separate species definitions,
  individual ancestry, definition-match uncertainty, saved identity, and
  pair-specific contributions; documented the working Garden API separately
  from the unavailable legacy discovery scope and corrected registration rules.
- **Updated:** `companion-dashboard.md` — removed the advertised Tree entry,
  documented signed demo context, current character profile/species panels,
  garden routing, and semantic button metadata; linked detail contracts to
  their existing owners instead of duplicating them.
- **Updated:** `architecture.md` — high-level identity and ancestry relationships,
  dedicated garden routing, current dashboard entry, and distinct taxonomy ranks.
- **Updated:** `README.md` — refreshed topic ownership and index descriptions.
- **Updated:** `DOCS_STATE.md` — baseline, covered revision, and deferred work.
- **Deleted:** `species-abilities.md` — redundant, unindexed guide without
  audience metadata; unique operational details were merged into `abilities.md`.
  The feature still exists, so this is consolidation, not removal of a subsystem.
- **Added / renamed:** none. No orphaned subsystem document was identified.

## Known gaps and follow-up

- The external frontend, authentication/event bridge, and shared framework are
  not present here; deployed identity/image controls, ancestry presentation,
  signed demo consumption, replay policy, and session internals need verification.
- Detail coverage of browser item actions, ovum exchange/oviposition,
  Lovense pairing/preferences/transport, RLV relay management, and persisted/
  mobile media behavior is deferred to the existing subsystem owners.
- AI per-run tool isolation, taxonomy suggestion reconciliation, and recent
  hybrid-definition/birth-selection changes warrant focused follow-up against
  their existing guides. Tagged release automation and deployment/SSH behavior
  also need developer coverage; database cloning already has its own guide.
- Discovery's stored profile region does not use the native locatable check.
  Confirm intended visibility of that region and optional identity fields
  before introducing additional privacy controls; no code was changed.
- The profile's occupied-volume summary includes early pregnancy volume even
  when the separate pregnancy panel hides development below 10%; confirm whether
  that distinction is intended.
- Consider splitting the dashboard's expanding developer API/dialog detail
  into a dedicated guide in a later pass; this run moved discovery detail to
  its existing owner. The disabled Tree handler remains in code: decide whether
  to retire it or align its host/token contract before re-enabling it.
- Prior operational questions remain: metrics lookback/missing-region behavior,
  vendor delivery reconciliation, recipient-side emergency stopping, restored
  outfit/media/dialog subscriptions, token claims/lifetime limits, legacy
  target-based clothing authorization, and bulk underwear stripping scope.
- Role Player template/tag metadata, shared text rendering, E2E proxy isolation,
  and history mapping cardinalities remain deferred.
- No source, tests, configuration, or dependencies changed.
