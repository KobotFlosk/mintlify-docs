# Species abilities

`AbilityTypeEnum` catalogs the supported abilities (`ability.shift`, displayed
as Transmute, and `ability.bite`). Eligibility is stored in
two tables with species precedence:

- `ane_abilities` (`AbilityModelImpl`): standard default grants, optionally
  restricted by form and class.
- `ane_species_abilities` (`SpeciesAbilityModelImpl`): overrides for a
  required species, optionally restricted by form and class.

Combinations are defined manually; the application does not seed either table.
Each selected row grants one ability when all its non-null selectors match.
For example, these defaults grant Bite to Feral forms and Transmute to
Shapeshifter forms; the species override instead restricts Transmute to that
species' Living Feral characters:

| Table | Species | Form | Class | Ability |
| --- | --- | --- | --- | --- |
| ane_abilities | not applicable | form.feral | NULL | ability.bite |
| ane_abilities | not applicable | form.shift | NULL | ability.shift |
| ane_species_abilities | a specific species ID | form.feral | class.living | ability.shift |

Null form/class means any value on that axis. Species cannot be null in
`ane_species_abilities`. A species-specific rule matches that species
ID exactly; hybrid ancestry does not implicitly grant a parent's abilities.
For each ability, if any rule exists for the character's species, only that
species' rules decide eligibility for that ability. This replacement happens
before form/class matching: a restrictive species rule can deny an ability that
the default would grant. If there are no species rules for that ability, the
defaults apply. Rules for other abilities or species are unaffected.
Within the selected table, matching any row grants the ability once. Multiple
species rows are alternatives, and both specified selectors must match a row.
A species row with null form and class grants the ability in all forms/classes,
even when the default is narrower. Species rules can also grant an ability with
no default. Removing the last species rule restores default eligibility.

`AbilityRepository::fetchAbilities()` returns matching defaults only for
abilities without any rule for the supplied species.
`SpeciesAbilityRepository::fetchAbilities()` returns matching species rules.
`SpeciesAbilityHelper` combines and deduplicates these results as the shared lookup used by the HUD,
dashboard API, and Shift authorization. Physical abilities follow the currently
worn species, form, and class. Transmute is resolved against the base character,
so a character with a matching Transmute grant retains the ability to change
back. Class-specific ways of acquiring forms (Define, Learn, Apply) continue to
use their existing rules.

The API retains the catalog-entry format with `available` flags, including
entries the active character does not have. Bite's action handle is
`AbilityBiteHelper`.

## Bite

Selecting Bite opens a list of active, unblocked characters in the same region
whose headers were updated within five minutes and place them no farther than
10m away. Self-selection is excluded. Eligibility, range, and the selected
character ID are checked again when the selection is submitted.

A successful bite adjusts the victim's Health (`VITALITY`) by -0.05 and Defense
by -0.10 through `StatsHelper`, clamped at zero. These are percentage-point
drains: 60% health becomes 55%. `FluidsHelper` takes a snapshot of the victim's
actual blood and deposits exactly 1ml through the biter's mouth into their
stomach, with the normal genetic encounter recording. Both actors' database
effects occur in one transaction.

After persistence succeeds, `InteractionService` sends a notification to the
victim's `AbilityBiteHelper` subscriber. Receiving that notification only informs
the victim; it never repeats damage or transfers more blood. The biter receives
the victim's name and the blood's flavor in owner chat.

The same action is exposed through `/api?class=AbilityBiteHelper`:

- GET returns `{available, targets: [{key, profileId, label}]}`.
- POST accepts `{target: <account key>, profileId: <selected character ID>}` and
  returns `{ok, message}` or `{ok: false, error}`.

No eligibility rules are installed by the action or its discovery endpoint.

## Uniqueness and persistence

The primary keys `ab_id` and `sa_id` are UUID v4 values assigned when the entity is constructed and
mapped as Doctrine `guid` (PostgreSQL `uuid`). There is no incremental sequence.
The tables explicitly declare unique keys on `(ab_class, ab_form, ab_ability)`
and `(sa_class, sa_form, sa_species_id, sa_ability)` respectively.

Because a normal nullable unique key permits duplicate wildcard rows, the
additional database-generated `ab_scope` and `sa_scope` normalize their selectors
into non-null keys; `(ab_scope, ab_ability)` and `(sa_scope, sa_ability)` are also
unique. This enforces combination uniqueness for wildcard rules, even through direct SQL. Both PostgreSQL
and the SQLite test harness use the same generated expression. The wildcard
marker `*` and separator `:` cannot occur in the species IDs or selector enum
values. Future selector enums must preserve that invariant.

Deleting a species cascades to its specific grants; it never turns those grants
into global wildcards. General grants in `ane_abilities` remain independent.

## Deployment

Deploy the schema before enabling code that reads the tables.
Preview the mapped schema change using the repository's existing DDL tooling:

```sh
php bin/doctrine ddl:sync --dump-sql
```

For new installations, apply `../ddl` and `../ddl`.
Existing installations already using these two tables need no schema or data
migration for override precedence. Review existing species rows: they now
replace the defaults for the same ability, including when their selectors do
not match. Do not run the fresh CREATE scripts on existing tables.

If the earlier integer-ID schema was already installed,
migrate existing row IDs to new UUIDs and remove the integer default/sequence;
integers cannot simply be cast to UUIDs. Direct SQL inserts must supply `ab_id` or `sa_id`.
Define the desired species/form/class/ability combinations manually.
Both tables start empty, which grants no abilities, including Transmute and Bite.
Ability lookups never create or restore grants.

To add a general grant, persist `new AbilityModelImpl($ability, $form, $class)`.
For a species override, persist
`new SpeciesAbilityModelImpl($ability, $species, $form, $class)`; species is a
required entity argument, and form/class are optional in both constructors. To change a
grant, remove its row and insert the replacement in one transaction.

Coverage: `SpeciesAbilityWildcardRulesMatchAndRejectDuplicatesTest` exercises all
four form/class wildcard shapes, required species, UUID persistence, the four-field unique key, every
form/class combination, exact species matching, duplicate rejection, and
overlapping grants.
`AbilityDefaultsWithSpeciesOverridesMatchAndRejectDuplicatesTest` covers default
wildcard grants, UUIDs, uniqueness, species precedence, and deduplication.
`SpeciesAbilityOverridesReplaceDefaultsAcrossFormsAndClassesTest` covers both
abilities across every form/class and all four selector shapes, other-species
isolation, unrelated defaults, alternative species rules, API/HUD agreement,
broader overrides, and restoring defaults after overrides are removed.
`SpeciesAbilityManualGrantsDriveApiAndShiftedFormsTest` exercises an empty table,
manually defined grants, API/HUD agreement, custom Shift grants, shifted Feral eligibility, reverting,
and rejection of revoked grants.

The Bite e2e cases cover selection and actual blood snapshot creation, flavor
and victim notifications, the 10m boundary, stale/distant/blocked/inactive targets,
changed profiles and forms, stat clamping, notification redelivery, and complete
rollback on fluid persistence failure.

The Bite snapshot regression also enforces the legacy PostgreSQL integer
restriction on `fs_profile_id` in the SQLite harness. New JSON snapshots keep
that deprecated column null and store the character UUID in `fs_detail.profile`,
which is what `FluidSnapshotModelImpl::getProfile()` reads. Creating a victim's
fluid from the biter's request is supported: identity, creator, and owner are
resolved from the supplied victim profile, not from the request's active user.
