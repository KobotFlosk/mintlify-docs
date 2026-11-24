---
audience: developer
summary: Baseline, coverage revision, and changelog for the latest documentation pass.
---

# Documentation State

## Last run

- **Covered commit (`develop` HEAD):** `3e3f13e567e0114da008049b8bbe33ca3edb1275`
- **Date:** 2026-11-14
- **Baseline SHA:** `6401199269d330643a0eb9b29b30cff4272b418d`
- **Fallback used:** No. Fetching the full history recovered the recorded commit;
  it was compared directly with the covered HEAD.

## Changed areas reviewed

The baseline-to-HEAD diff spans 91 files, including documentation from the prior
pass. Code changes cover native identity editing; saved discovery filters and
engagement activity; personal species attraction preferences and shared species
lookup; sexuality-gated gaze, encounter memory, observer and pregnancy-notice
cooldowns; saved browser restoration; Pack removal; Nectar Extractor controls;
partner-targeted browser consumables; commit-aware deployment announcements;
dependency updates; and related regression tests.

The 23-document tree was mapped by topic and audience before editing.
Accounts & Profiles owns identity; Search & Discovery owns result contracts,
presets, and gardens; Species Compatibility owns attraction versus breeding
scoring; the dashboard guide owns routing and media lifecycle. Architecture
links these components without duplicating their contracts. The remaining guides
cover ancestry/species creation, gameplay, items/devices, integrations, operations,
and support. This incremental pass prioritizes those first four owners, not a
complete re-audit of every changed subsystem.

The Pack feature and its guide were already removed in the covered code.
No additional orphaned guide or near-duplicate requiring removal was identified;
all additions fit existing topic owners.

## Changelog

- **Updated:** `account-and-profiles.md` — native identity menus, explicit image
  clearing versus empty replies, shared stale-save guards, and attraction links.
- **Updated:** `search-and-discovery.md` — saved filter lifecycle, multi-choice
  matching, account isolation, legacy upgrade, activity flags, and response fields.
- **Updated:** `species-compatibility.md` — personal preference editing/storage,
  directional attraction, gaze eligibility, separate notice lifetimes, and the
  distinction between lineage-only and full match scores; attributed the intro.
- **Updated:** `companion-dashboard.md` — saved browser restoration and fresh
  signing, affinity panel routing, and links to discovery/attraction contracts.
- **Updated:** `architecture.md` — shared identity flow, attraction preferences,
  filtered discovery, and browser restoration at a high level.
- **Updated:** `README.md` — refreshed ownership descriptions without new topics.
- **Updated:** `DOCS_STATE.md` — baseline, covered revision, changelog, and gaps.
- **Added / deleted / renamed:** none.

## Known gaps and follow-up

- The external frontend, authentication/event bridge, and shared framework are
  not present here; deployed filter/affinity editors, identity/image controls,
  ancestry presentation, signed demo consumption, and replay policy remain
  verification boundaries rather than confirmed frontend behavior.
- Browser consumable partner targeting, Nectar Extractor controls, ovum
  exchange/oviposition, and pregnancy sensation cooldowns remain for the existing
  item/device, reproduction, and interaction guides in the next pass.
- Lovense pairing/preferences/transport, RLV relay management, and mobile media
  layout still need detail coverage; saved browser restoration is now covered.
- AI per-run tool isolation, taxonomy suggestion reconciliation, and recent
  hybrid-definition/birth-selection changes warrant focused follow-up against
  their existing guides. Architecture already covers deployment announcements;
  deeper tagged-release and deployment/SSH operations remain deferred.
- Discovery's stored profile region does not use the native locatable check,
  and engagement activity is now exposed with identity. Confirm their intended
  visibility before introducing additional privacy controls; no code was changed.
- Confirm whether gaze should respect discovery blocks, and whether the separate
  engagement-watching arousal/narration path should also use sexuality gating and
  the observer cooldown. Currently it does neither; the documented affinity path
  must not be presented as a universal arousal or notification policy.
- The profile's occupied-volume summary includes early pregnancy volume even
  when the separate pregnancy panel hides development below 10%; confirm whether
  that distinction is intended.
- Consider splitting the dashboard's developer API/dialog detail and the growing
  species compatibility/attraction guide in a later pass; this run preserves
  existing ownership and links rather than introducing duplicate topics.
  The disabled Tree handler remains in code: decide whether
  to retire it or align its host/token contract before re-enabling it.
- Prior operational questions remain: metrics lookback/missing-region behavior,
  vendor delivery reconciliation, recipient-side emergency stopping, restored
  outfit/media/dialog subscriptions, token claims/lifetime limits, legacy
  target-based clothing authorization, and bulk underwear stripping scope.
- Role Player template/tag metadata, shared text rendering, E2E proxy isolation,
  and history mapping cardinalities remain deferred.
- No source, tests, configuration, or dependencies changed.
