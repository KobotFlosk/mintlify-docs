---
audience: mixed
summary: Character ability eligibility and the use of Shift and Bite.
---

# Abilities

## For end-users

### What abilities are

An ability is a special action a character can take beyond the usual
menu-driven scenes, offered from **MyProfile → Abilities** in-world (and
mirrored on the [dashboard](companion-dashboard.md)'s Abilities panel).
Whether your character has access to a given ability depends on your
character's species, current form, and class — it's something the
world/story runner configures, not something you toggle yourself. If your
character doesn't currently qualify for an ability, the in-world menu won't
offer it; the dashboard can list it as unavailable.

The abilities available today:

| Ability | What it does |
|---|---|
| **Transmute (Shift)** | Change between forms you've learned. See [Form Shapeshifters](form-shapeshifters.md) for what shifting actually changes about your character. |
| **Bite** | Bite a nearby character (within about 10 metres), draining a small amount of their health and defense and sampling a taste of their blood. |

### Using Bite

Choose **Bite** from the Abilities menu (or the dashboard's Abilities panel),
then pick a character within range from the list offered — only characters
seen nearby recently are listed. Biting them:

- Lowers the target's vitality (health) by 5 percentage points and defense by
  10 percentage points, without taking either below zero. For example, 60%
  health becomes 55%.
- Gives you a small taste of their blood, described by its flavor.
- Notifies the target that they were bitten and what they lost.

If the character you picked has moved out of range or stopped being available
since the menu opened, you'll be asked to search again rather than the bite
silently failing or landing on the wrong person.

If no targets appear in the browser, keep your companion worn and let it update
your location before searching again; both you and the target need recent
in-world activity.

### Things to keep in mind

- Not every character has every ability — some are restricted to particular
  species, forms, or classes, and that restriction is set up ahead of time by
  whoever configures the world, not by the player.
- Shift's availability doesn't necessarily mean you already have any
  particular alternate form learned — that's a separate matter of which
  disguises you've picked up (see [Form Shapeshifters](form-shapeshifters.md)).

---

## For developers

### `AbilityTypeEnum`

`AbilityTypeEnum` (`src/classes/enums/AbilityTypeEnum.php`) is the closed set
of abilities: `SHIFT` (`ability.shift`, displayed as "Transmute") and `BITE`
(`ability.bite`, displayed as "Bite"). Each case carries its own
`toValue()` display label, `getDescription()` player-facing blurb, and
`getApiHandle()` — the name of the helper class that serves that ability's
own detail surface on the dashboard (`AbilityShiftHelper` /
`AbilityBiteHelper`), used so a generic client can route a selected ability to
the right panel without a hardcoded switch. Adding a new ability means adding
a case here plus its own helper/dialog pair (see Extension points, below).

### Two-layer grant model

Eligibility is **not** hardcoded per form (that was the pre-existing
behaviour before this system existed). Instead it is driven by two database
tables, both populated by direct configuration rather than any in-world or
dashboard authoring UI — there is no wizard for these; rows are created
directly against the schema (see `ddl/Abilities.sql` /
`ddl/SpeciesAbilities.sql`):

| Table / entity | Selector columns | Meaning |
|---|---|---|
| `ane_abilities` / `AbilityModelImpl` (`AbilityRepository`) | `ability`, optional `form`, optional `class` | A **species-independent default** grant: any profile whose form/class matches (a `null` selector matches anything) gets the ability, *unless* a species override exists for that ability (see below). |
| `ane_species_abilities` / `SpeciesAbilityModelImpl` (`SpeciesAbilityRepository`) | `species`, `ability`, optional `form`, optional `class` | A **per-species override**. Once any row exists for a given `(species, ability)` pair, that species' eligibility for that ability is decided *only* by its own override row(s) — the general default for that ability no longer applies to that species at all, even for form/class combinations none of the species' own rows mention. |

Both tables generate a stored `scope` column (`form:class`, or
`species:form:class`) purely to carry a database-level uniqueness constraint
across wildcard (`NULL`) combinations — `uniq_ability_scope` /
`uniq_species_ability_scope` — alongside a plain-column uniqueness constraint,
so two rules can't be inserted for the same effective scope by mistake, even
via a direct SQL write.

> **Overrides replace, they don't add.** A species can have several override
> rows for the same ability (e.g. one scoped to a form, one scoped to a
> class) — matching *any one* of them grants the ability. But as soon as one
> override row exists for `(species, ability)`, the species-wide default for
> that ability is gone entirely for that species; it does not fall back to
> the general default for form/class combinations none of the species' rows
> cover. An override with no form/class restriction at all effectively grants
> the ability to every form/class of that species, even overriding a more
> restrictive default. This is deliberate — see
> `AbilityRepository::fetchAbilities()`'s inline comment — but it means a
> narrowly-scoped species override can end up *revoking* an ability from some
> of that species' forms/classes compared to the default, which is easy to
> get wrong when authoring rules by hand.

### Resolving eligibility (`SpeciesAbilityHelper`)

`SpeciesAbilityHelper` (`src/classes/helpers/SpeciesAbilityHelper.php`) is the
single place both the in-world dialog and the dashboard route through:

- `fetchAbilities(ProfileModel $profile): AbilityTypeEnum[]` — the profile's
  full set of granted abilities.
- `hasAbility(ProfileModel $profile, AbilityTypeEnum $ability): bool` — a
  single-ability check.

```mermaid
flowchart TD
    A[Profile] --> B["Unwrap to base profile\n(ProfileHelper::unwrap)"]
    B --> C["Match defaults + species overrides\nfor the base profile"]
    C --> D{Base profile\ngranted SHIFT?}
    D -- no --> E["Abilities = base matches\n(SHIFT excluded)"]
    D -- yes --> F["Resolve active shifted form\n(FormShiftHelper)"]
    F --> G{Has an active\nshifted form?}
    G -- no --> H["Abilities = base matches"]
    G -- yes --> I["Match defaults + species overrides\nfor the shifted form"]
    I --> J["Abilities = shifted-form matches\n(SHIFT re-added)"]
```

Physical abilities (currently just Bite) follow the **worn form** — a
character disguised as something with Bite can bite while shifted, and one
disguised as something without it cannot, regardless of their real species.
Shift itself is always evaluated against the **base** profile: changing form
can never remove your own ability to change back. `hasAbility()` special-cases
`SHIFT` to skip the "does the currently-worn disguise still resolve" check
that `fetchAbilities()` performs for other abilities, so a stale/invalid saved
disguise never blocks shifting back.

Matching itself (`fetchMatchingAbilities()`, private) merges
`AbilityRepository::fetchAbilities()` (remaining defaults not overridden for
this species) with `SpeciesAbilityRepository::fetchAbilities()` (this
species' own override grants matching the profile's form/class), de-duplicates
by the enum's backing value, and returns them ordered by that value.

### Dashboard surface

- **`AbilityHelper`** (`/api?class=AbilityHelper`) — lists every
  `AbilityTypeEnum` case with its label, description, `handle` (the detail
  helper's class name), and whether the active profile currently has it
  (`SpeciesAbilityHelper::fetchAbilities()`). This is the web equivalent of
  the in-world **MyProfile → Abilities** menu (`ProfileAbilitiesDialog`).
- **`AbilityShiftHelper`** (`/api?class=AbilityShiftHelper`) — the Shift
  ability's own detail surface (learned forms, current form, switching).
  Availability now checks `SpeciesAbilityHelper::hasAbility(..., SHIFT)`
  instead of the old hardcoded "is this profile's form
  `FormTypeEnum::FORM_SHIFT`" check; `RolePlayService::doShift()` (the
  in-world shift action itself) was changed the same way, so both surfaces
  agree on eligibility.
- **`AbilityBiteHelper`** (`/api?class=AbilityBiteHelper`, and subscribed as
  an `InteractionSubscriber` for the cross-account notification) — see below.

### Bite mechanics (`AbilityBiteHelper`)

`AbilityBiteHelper` (`src/classes/helpers/AbilityBiteHelper.php`):

1. `fetchTargets()` — returns active, unblocked characters seen in the region
   within the last 5 minutes (`RECENT_INTERVAL`) and within 10 metres
   (`RANGE_METERS`) of the biter, via
   `HeaderHelper::fetchAccountsInRegionAfter()` filtered through
   `AccountBlockHelper`. Used by both the in-world `BiteAbilityDialog` target
   picker and the dashboard's target list.
2. `bite(string $targetKey, string $expectedProfileId)` — re-checks
   eligibility, range, and that the selected target still matches the
   expected profile id (so a stale menu can't bite whoever happens to occupy
   that slot now), then in one transaction: deposits 1ml of the target's
   actual blood snapshot through the biter's mouth into the stomach
   (`FluidsHelper::persistFluid()`, see
   [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md)), and
   reduces the target's vitality by 5 percentage points and defense by 10
   percentage points, clamped at zero
   (`StatsHelper::adjustStatByPercent()`, see [Vitality & Stats](vitality-and-stats.md)).
   The blood's flavor is read back for the biter's confirmation message.
3. The bite is announced to the target via
   `InteractionService::outputTarget()` (`ACTION_BITTEN`); `on_action()`
   (the `InteractionSubscriber` handler, registered alongside every state in
   `AbstractAneState::on_initialized()`/`on_state_leave()`) only narrates the
   notification on the receiving session — it never re-applies effects, since
   the sender's transaction already committed them, which protects against a
   redelivered interaction re-biting the same target.
4. `on_api()` mirrors the same flow for the dashboard: `GET` reports
   availability + targets (`key`, `profileId`, `label`), `POST` (`target`,
   `profileId`) performs the bite and returns `ok` plus a message or error.

Target lookup also rejects an origin header older than five minutes or missing
its region/local position. The framework installs the owner's stored HUD headers
for web requests; browser-supplied location is not a replacement for recent
in-world presence. The same check applies when submitting the selection.

Blood persistence and stat changes share one transaction, so a failed fluid
write rolls back both actors' database effects. Notification follows the commit.
`FluidSnapshotModelImpl` (`src/classes/models/FluidSnapshotModelImpl.php`) reads
the character UUID from `fs_detail.profile`; new snapshots leave the deprecated
integer `fs_profile_id` null. `FluidsHelper` uses the supplied victim profile for
fluid ownership and identity rather than the current request's biter.

In-world, `ProfileAbilitiesDialog` lists only the abilities
`SpeciesAbilityHelper::fetchAbilities()` currently returns for the active
profile and routes `ability.bite` to `BiteAbilityDialog` (the target picker)
and `ability.shift` to `ShiftAbilityDialog`.

### Grant persistence and deployment

The grant entities live under `src/classes/models/`; the repositories under
`src/classes/repos/` implement the matching rules above. Species selectors match
the exact species ID, not its hybrid ancestors. Deleting a species cascades to
its overrides without creating global grants. Removing the last override for an
ability restores that species' use of defaults.

Both grant entities construct UUID v4 primary keys (`ab_id` and `sa_id`, mapped
as Doctrine `guid`). Direct SQL inserts must supply those UUIDs. The generated
scope columns normalize null selectors to `*` and separate selector values with
`:`, so future selector values must not contain either reserved character.
PostgreSQL and the SQLite test harness use the same generated expressions.

Deploy the schema before code that reads these tables. For a fresh installation,
review and apply `ddl/Abilities.sql` and `ddl/SpeciesAbilities.sql`; the existing
`php bin/doctrine ddl:sync --dump-sql` command previews mapped schema changes.
Do not run the fresh CREATE statements on existing tables. An older integer-ID
installation needs new UUIDs for existing rows and removal of its integer
default/sequence; integer values cannot simply be cast to UUIDs.

Neither lookup nor deployment seeds grants: empty tables mean no abilities,
including Shift and Bite. Configure the intended rules explicitly. Persist
`AbilityModelImpl` for defaults or `SpeciesAbilityModelImpl` for an override,
with optional form/class selectors and a required species for the latter.
Change a rule by removing and replacing it transactionally. Override precedence
itself needs no schema migration on installations already using these tables,
but existing restrictive overrides should be reviewed for lost default access.

### Regression coverage

The cases under `tests/e2e/cases/` include:

- `SpeciesAbilityWildcardRulesMatchAndRejectDuplicatesTest.php` and
  `AbilityDefaultsWithSpeciesOverridesMatchAndRejectDuplicatesTest.php`:
  wildcard combinations, UUIDs, uniqueness, exact species matching, precedence,
  and deduplication.
- `SpeciesAbilityOverridesReplaceDefaultsAcrossFormsAndClassesTest.php` and
  `SpeciesAbilityManualGrantsDriveApiAndShiftedFormsTest.php`: alternatives,
  broader/restrictive overrides, empty grants, revocation, HUD/API agreement,
  and shifting back.
- The `Bite` cases: actual blood snapshots, notification redelivery, stale,
  blocked, distant or changed targets, stat clamping, and rollback on fluid
  failure. `BiteWebRequestsUseStoredHudPositionTest.php` covers the browser's
  dependency on valid owner headers.

### Extension points

- **New ability:** add a case to `AbilityTypeEnum` with its label,
  description, and (if it needs its own dashboard detail surface) an
  `getApiHandle()` pointing at a new helper class; add a dialog under
  `src/classes/prefabs/dialogs/` and wire it into
  `ProfileAbilitiesDialog::menu_profile_abilities()`; grant it via new rows in
  `ane_abilities`/`ane_species_abilities`.
- **New default/species rule:** insert an `AbilityModelImpl` or
  `SpeciesAbilityModelImpl` row directly (there is no authoring UI); remember
  that any species-specific row for an ability fully replaces that species'
  default eligibility for it, per the note above.

See [Architecture](architecture.md) for how this fits into the overall
architecture.
