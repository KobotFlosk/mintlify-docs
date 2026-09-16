# Documentation State

This file tracks the last commit on `develop` covered by the automated weekly
documentation sync, so the next run knows where to start looking for changes.

## Last run

- **Covered commit (`develop` HEAD):** `268e32b8a82a2fc4fc296ab35961f481e4e544fe`
- **Date:** 2026-09-12
- **Baseline used:** `docs/DOCS_STATE.md` from the prior run recorded
  `ef2b4504`; diffed `ef2b450..268e32b8` on `develop` to find the changed
  areas (no fallback needed). That range covered PR #150 ("feature/ability-
  abstraction": species-specific ability grants, the Bite ability, and a
  later follow-up introducing species-independent default ability rules),
  attachment-control changes (a manual per-attachment "Override" mode plus a
  new `AttachmentsHelper` web API for attach/detach/control/test), a
  `ChoiceStory` resilience fix so a failed AI narration/stat-application step
  no longer blocks the mandatory partner handoff, a `StatusHelper` response
  change (`agentName` added, `headerAgeSeconds` removed), and a Good Moaning
  vocals protocol validation/command tidy-up.

### Changelog

- **Added:** `docs/abilities.md` — new detail document covering the
  `AbilityTypeEnum` (Transmute/Shift, Bite), the two-layer default/
  species-override grant model (`ane_abilities`/`ane_species_abilities`,
  `AbilityRepository`/`SpeciesAbilityRepository`), the
  `SpeciesAbilityHelper` eligibility resolver (with a diagram) and its
  "an override replaces, it never falls back to the default" nuance, the
  in-world `ProfileAbilitiesDialog`/`BiteAbilityDialog` flow, and the
  dashboard's `AbilityHelper`/`AbilityShiftHelper`/`AbilityBiteHelper`
  surface, including the Bite mechanic itself (range, effects, target
  re-validation, and the sender-only-applies-effects note on the
  `InteractionSubscriber` notification path). This whole system was
  undocumented, and `docs/companion-dashboard.md` already contained a
  dangling link to a `species-abilities.md` file that never existed (added by
  the feature commit itself, not a prior docs pass) — this document is now
  the real target, with the link text and path corrected.
- **Changed:** `docs/companion-dashboard.md` — corrected a wrong entry
  (`AttachmentsHelper` mislabeled as "RLV shared-folders module"; that class
  is actually `RlvSharedFoldersModule`, dating to the previous docs pass) and
  added the real, previously-undocumented `AttachmentsHelper` panel
  (attach/detach/override/control/test for managed plugins/devices, also
  reachable as the `attachments` `ApiHelper` segment and mirrored at
  `/api?class=AttachmentService` for backward compatibility). Updated the
  Abilities panel bullet to describe the new default/species grant system
  and fixed the broken `species-abilities.md` link to point at the new
  `abilities.md`. Updated the `StatusHelper` bullet for the new `agentName`
  field and the removed `headerAgeSeconds` field. Updated the End-User
  "Abilities" and "Items & attachable devices" bullets to mention Bite and
  the new attach/detach/Override controls.
- **Changed:** `docs/third-party-integrations.md` — added a "Manual override
  (user-driven control)" subsection under "Attachment compatibility layer"
  describing `AbstractAttachmentBase::setUserOverride()`/
  `isUserOverrideEnabled()`/`runUserCommand()` (pausing `RolePlaySubscriber`/
  `OpenTransferSubscriber` reactions and outbound HUD commands while under
  manual control, session-only, never persisted) and how it gates
  `AttachmentsHelper`'s `control`/`method` actions; noted `#[ControlMethod]`'s
  own constructor-level bounds validation; noted `AttachmentService::on_api()`
  now delegates to `AttachmentsHelper`; added a matching End-User paragraph
  about the dashboard's manual Override toggle. None of this was documented
  before.
- **Changed:** `docs/ai-companion.md` — added a "Choice handoff resilience"
  subsection describing `ChoiceStory::processChoice()`/
  `prepareChoiceHandoff()` (a failure while narrating/applying effects for a
  choice is now caught and logged instead of preventing the mandatory partner
  handoff) and the new public `doClimax()`/`recordAiPenetration()` boundary
  methods the `choice_climax`/`choice_penetrate` tools call. This resilience
  behavior existed in code but had no doc coverage; the surrounding dialog
  generation/retry doc already covered a different, adjacent failure mode.
- **Changed:** `docs/form-shapeshifters.md` — added a short cross-reference
  noting that whether Shift can be invoked at all is now decided by the
  ability-grant system (`docs/abilities.md`), not by this document, since
  `RolePlayService::doShift()`/`AbilityShiftHelper` moved off a hardcoded
  form check onto `SpeciesAbilityHelper::hasAbility()`.
- **Changed:** `docs/README.md` — added `abilities.md` to the documentation
  index table.
- No documents were found to be orphaned or in need of a split/merge this
  pass. Deferred to a future run (see "Known gaps" in the pull request): the
  Good Moaning vocals remote-drive protocol's internal command
  validation tidy-up (already covered at the right level of detail by the
  existing "Vocals" table row) and minor internal-only fixes (a
  `HeaderHelper` distance-comparison variable bug, `FluidSnapshotModelImpl`
  legacy-column backfill) that have no externally-visible behavior to
  document.
- This run again kept the repo's established house style (emoji-headed
  audience sections, no YAML front matter) instead of migrating to the
  front-matter/`## For developers`/`## For end-users` convention described in
  the task brief, consistent with prior runs; see the accompanying pull
  request for the still-open question to maintainers.
