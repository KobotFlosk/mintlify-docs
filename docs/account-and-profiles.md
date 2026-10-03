---
audience: mixed
summary: Accounts, active characters, relationships, trust, and access permissions.
---

# Accounts & Profiles

## For end-users

### Account vs. character

Two different things are tracked for every person who uses the system:

- Your **account** is tied to your identity in the virtual world. It is created
  automatically the first time you use the companion and holds things that span
  all of your characters: your unlocked rewards, any special roles you've been
  granted, and which character is currently active.
- A **character** (referred to elsewhere in this documentation as your
  "profile") is the actual in-character persona: its name, species, body, class,
  stats, relationships, and history. One account can own **several characters**
  and switch between them, but only one can be active at a time.

### Creating and switching characters

- The first time you wear the companion, it walks you through creating your
  first character.
- From the main menu you can create additional characters (if you're allowed
  more than the default number), switch which one is active, or resume an
  existing one.
- Some characters can also be "assumed" from a nearby egg or another
  hand-off, which is how a newly born character gets picked up and played.

### Relationships and trust

- Characters can be linked to each other as **partners**. A relationship you
  form with someone is mirrored back on their side automatically.
- You can mark another character as **trusted**, which relaxes certain limits or
  checks between the two of you (for example, some interactions or exchanges
  behave differently between trusted characters than between strangers).
- Two characters can also share a formal **parent/child link** — the result of
  an adoption or of giving birth/being born — which matters for genetics and for
  who counts as a "descendant" of whom.
- Adoptions can also establish **dominant/paired dynamics** — a Master/Slave or
  Owner/Pet bond. Both trusting someone and holding such a bond are among the
  situations that let a **breeding request auto-accept** without prompting you —
  but that is a property of copulation/breeding, not of relationships alone: the
  full set of auto-acceptance rules (which also covers your combat stats, public
  access, and partnership) and their priority order are described under
  [When a breeding request auto-accepts](interaction-lifecycle.md#when-a-breeding-request-auto-accepts).

### Packs

Characters can also band together into a named **pack** with a small
leadership hierarchy (an Alpha, optional Betas, and Omegas), reached from your
character's profile menu. See [Packs & Groups](packs-and-groups.md) for the
full walkthrough.

### Professions

A character can be granted a **profession title** (for example, Chemist or
Doctor) — a small badge of standing rather than a mechanical bonus. Titles are
conferred by using a special consumable item on yourself; once conferred, the
title is simply recorded on your character.

### Blocking

You can block another character from appearing in any of your search results.
Blocking is one-directional — it only affects what you see, doesn't notify the
other person, and doesn't stop them from finding or contacting you through
other means. See [Search & Discovery](search-and-discovery.md) for where
blocking is offered.

### Special roles and permissions

A small number of accounts are granted extra roles behind the scenes — for
things like moderation, private test features, or access to the AI companion
in scenes. These are granted individually and don't affect the everyday
experience of a regular player.

### Settings

Both accounts and individual characters carry their own settings — things like
notification preferences, content limits, and feature toggles — which are
changed from the settings section of the main menu.

---

## For developers

### Two aggregates: `AccountModelImpl` and `ProfileModelImpl`

- **`AccountModelImpl`** (`src/classes/models/AccountModelImpl.php`, table
  `ane_accounts`) extends the shared framework's account entity and represents
  the caller identified by the in-world "owner key"/"owner name" pair carried in
  request headers. It holds:
  - `profile` — the currently **active** `ProfileModelImpl` (one-to-one).
  - `profiles` — **all** profiles owned by the account (one-to-many).
  - `rewards`, `roles`, `perms` — collections of `AccountRewardModelImpl`,
    `AccountRoleModelImpl`, `AccountPermissionModelImpl`.
  - `enabled`, `admin`, `demo`, `started`, `created` flags/timestamps.
  - `ane\interfaces\models\AccountModel` extends the framework's
    `AccountModel` interface with the profile/role/perm accessors above.
- **`ProfileModelImpl`** (`src/classes/models/ProfileModelImpl.php`, table
  `ane_profiles`) is the character aggregate and the busiest entity in the
  system. Notable relations:
  - `account` (many-to-one back to the owning `AccountModelImpl`).
  - `fluids`, `stats`, `modifiers`, `attachments`, `ovum`, `pregnancies`,
    `adoptions`, `professions` — one-to-many collections into the respective
    subsystems (see [Architecture](architecture.md) for the layer map).
  - `relations` (`ProfileRelationModelImpl`) and `trusts` (a self-referencing
    many-to-many, `ane_profile_trusts`) — see below.
  - `geneA` / `geneB` — self-referencing many-to-one links to the two parent
    profiles used by genetics (see
    [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md)).
  - `species` / `speciesOverride` — the character's species and any per-profile
    override (see [Species Compatibility](species-compatibility.md) /
    [Creating a Species](species-creation.md)).
  - `class` (`ClassTypeEnum`), `form` (`FormTypeEnum`), `gender`
    (`GenderTypeEnum`), `race`, `region`, `outfit`, `height`, `weight`, `aging`,
    `activated`, `birth`, `death` (`ProfileDeathModelImpl`, one-to-one).

### Professions

`ProfileProfessionModelImpl` (table `ane_profile_professions`) is a composite-key
join of a `ProfileModelImpl` and a `ProfessionTitleEnum` (`TITLE_CHEMIST`,
`TITLE_DOCTOR`) plus an `added` timestamp; it carries no behaviour of its own.
`ItemObjectConferrable` (`src/classes/items/`, type
`item.conferrable.profession`) is the consumable that grants one: its dialog
lets the holder pick a `ProfessionTitleEnum` case, stores the choice in the
item's own content, and on confirmation (`confer_confirm_dialog(...)`)
consumes the item and adds that case directly to
`ProfileModelImpl::getProfessions()`. There is currently no other gameplay
system reading `getProfessions()` back out — it is purely a cosmetic title
marker today.

### Relations and trust

- `ProfileRelationModelImpl` (`ane_profile_relations`-style table via
  `relations`) links a profile to another it "relates to" with a
  `RelationTypeEnum` (currently only `PARTNER`, which is reciprocal —
  `RelationTypeEnum::inverseRelation()` mirrors the relation on the other
  profile automatically).
- `trusts` is a self-referencing `ManyToMany` on `ProfileModelImpl` via the
  `ane_profile_trusts` join table (modelled through `ProfileTrustModelImpl`),
  used by helpers/stories to relax checks between two trusting profiles.
- Parent/child lineage is tracked separately through `geneA`/`geneB` (genetic
  parents) and `ProfileAdoptionModelImpl` (adoptive relationships), queried via
  `ProfileAdoptionHelper`. `AccountHelper::isAncestorOf(...)` /
  `isAccountAncestorOf(...)` walk this lineage.
- `ProfileAdoptionModelImpl` (`ane_profile_adoptions` via `adoptions`) links an
  owning `profile` to the `adopted` profile with an `AdoptionTypeEnum`
  (`adoptedAs`) describing the role the **adopted** profile holds toward the
  owner (e.g. an owner-side row with `adoptedAs = ADOPTION_TYPE_SLAVE` means the
  adopted profile is that owner's Slave). `AdoptionTypeEnum::inverseRelation()`
  pairs the reciprocal roles: `MASTER`↔`SLAVE`, `OWNER`↔`PET`, `PARENT`↔`CHILD`.
- **Breeding-request auto-acceptance:** `trusts`, `relations`
  (`RelationTypeEnum::PARTNER`), and `adoptions` (the Master/Owner/Pet bonds) are
  three of the inputs to the copulation/breeding auto-acceptance rules, alongside
  the receiver's combat stats and public-access setting. The rules are **not** a
  relations feature — they belong to copulation as a whole and are resolved by
  `CopulateModule::resolveAutoApprovalReason()` into a priority-ordered
  `CopulateApprovalReasonEnum`. See
  [Breeding-request auto-acceptance rules](interaction-lifecycle.md#breeding-request-auto-acceptance-rules)
  for the full ruleset, priority order, and narration.

### Settings

- **Account-level** settings use the shared framework's
  `AccountSettingHelper`/`AccountSettingModelImpl` (key/value pairs scoped to
  the account).
- **Profile-level** settings use `ProfileSettingModelImpl`
  (`ps_key`/`ps_val`/`ps_updated`) via `ProfileSettingHelper`, storing
  per-character preferences such as content limits consulted by stories during
  eligibility checks (see
  [Interaction & Role-Play Lifecycle](interaction-lifecycle.md)).

### Roles and permissions

- `AccountRoleEnum` (`src/classes/enums/AccountRoleEnum.php`): `ADMINISTRATOR`,
  `AFFILIATE`, `DEVELOPER`, `TASKFORCE`, `AI_PRIVILEGED`. Roles are rows in
  `AccountRoleModelImpl`, checked via `AccountHelper::hasRole(...)`. Notably,
  `AI_PRIVILEGED` gates access to the AI-driven scene (`ChoiceStory`) — see
  [The AI Role-Play Companion](ai-companion.md).
- `AccountPermissionEnum` (`src/classes/enums/AccountPermissionEnum.php`):
  fine-grained permissions such as `PERM_ACCOUNT_BAN`, `PERM_CAN_DEBUG`,
  `PERM_CLI_FORWARD_COMMAND`, `PERM_CLI_SEND_COMMAND`, `PERM_GRANT_PERM`,
  `PERM_UNLIMITED_CHARACTERS`, `PERM_VIEW_ACCOUNT_DETAILS`,
  `PERM_VIEW_ACCOUNT_LOCATION`. Rows live in
  `AccountPermissionModelImpl`; checked via `AccountHelper::hasPerm(...)`.

### Account/profile lookups

`AccountHelper` (`src/classes/helpers/AccountHelper.php`, extending the shared
framework's `AccountHelper`) centralises the common lookups used throughout the
request lifecycle:

- `fetchAccount()` / `fetchAccountById(...)` / `fetchAccountByKey(...)` —
  resolve the caller's account (typically from the request headers).
- `fetchActiveProfile(...)` / `hasActiveProfile(...)` /
  `optionalActiveProfile(...)` — the account's currently active character.
- `activateProfile(...)` — switches which profile is active on an account.
- `countAccounts(...)` / `countAccountsStartedAfter(...)` — reporting/metrics
  queries.

Onboarding (first-run profile creation), switching, "assuming" a nearby
egg/hand-off, and the settings/admin menus are driven by `InitialState`
(`src/classes/states/InitialState.php`) — see
[Interaction & Role-Play Lifecycle](interaction-lifecycle.md) for how it fits
into the broader state machine.

### Where to go next

- Layered architecture and the request lifecycle → [Architecture](architecture.md)
- Finding other characters and breeding locations → [Search & Discovery](search-and-discovery.md)
- Forming a named group with roles and invites → [Packs & Groups](packs-and-groups.md)
- How a profile's biology drives scenes → [Interaction & Role-Play Lifecycle](interaction-lifecycle.md)
- How a profile's genetics/species are inherited → [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md)
- The optional AI narrator and its access gating → [The AI Role-Play Companion](ai-companion.md)
