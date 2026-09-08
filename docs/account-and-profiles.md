# Accounts and Profiles

How a real-world user is represented in the system, how that maps to one or more
in-character profiles, and how permissions, relationships, and trust between
characters work.

- **🎮 End-User Documentation** — what an account and a character are, and how
  you manage them.
- **🧑‍💻 Developer Documentation** — how they are modelled and persisted.

---

## 🎮 End-User Documentation

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

### Packs

Characters can also band together into a named **pack** with a small
leadership hierarchy (an Alpha, optional Betas, and Omegas), reached from your
character's profile menu. See [Packs and Groups](packs-and-groups.md) for the
full walkthrough.

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

## 🧑‍💻 Developer Documentation

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
    subsystems (see [System Design](system-design.md) for the layer map).
  - `relations` (`ProfileRelationModelImpl`) and `trusts` (a self-referencing
    many-to-many, `ane_profile_trusts`) — see below.
  - `geneA` / `geneB` — self-referencing many-to-one links to the two parent
    profiles used by genetics (see
    [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md)).
  - `species` / `speciesOverride` — the character's species and any per-profile
    override (see [Species Compatibility](species-compatibility.md) /
    [Creating a Species](species-creation.md)).
  - `class` (`ClassTypeEnum`), `form` (`FormTypeEnum`), `gender`
    (`GenderTypeEnum`), `race`, `region`, `outfit`, `height`, `weight`, `aging`,
    `activated`, `birth`, `death` (`ProfileDeathModelImpl`, one-to-one).

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

### Settings

- **Account-level** settings use the shared framework's
  `AccountSettingHelper`/`AccountSettingModelImpl` (key/value pairs scoped to
  the account).
- **Profile-level** settings use `ProfileSettingModelImpl`
  (`ps_key`/`ps_val`/`ps_updated`) via `ProfileSettingHelper`, storing
  per-character preferences such as content limits consulted by stories during
  eligibility checks (see
  [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)).

### Roles and permissions

- `AccountRoleEnum` (`src/classes/enums/AccountRoleEnum.php`): `ADMINISTRATOR`,
  `AFFILIATE`, `DEVELOPER`, `TASKFORCE`, `AI_PRIVILEGED`. Roles are rows in
  `AccountRoleModelImpl`, checked via `AccountHelper::hasRole(...)`. Notably,
  `AI_PRIVILEGED` gates access to the AI-driven scene (`ChoiceStory`) — see
  [The AI Role-Play Companion](ai-companion.md).
- `AccountPermissionEnum` (`src/classes/enums/AccountPermissionEnum.php`):
  fine-grained permissions such as `PERM_ACCOUNT_BAN`, `PERM_CAN_DEBUG`,
  `PERM_CLI_SEND_COMMAND`, `PERM_GRANT_PERM`, `PERM_UNLIMITED_CHARACTERS`,
  `PERM_VIEW_ACCOUNT_DETAILS`, `PERM_VIEW_ACCOUNT_LOCATION`. Rows live in
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
[Interaction and Role-Play Lifecycle](interaction-lifecycle.md) for how it fits
into the broader state machine.

### Where to go next

- Layered architecture and the request lifecycle → [System Design](system-design.md)
- Forming a named group with roles and invites → [Packs and Groups](packs-and-groups.md)
- How a profile's biology drives scenes → [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)
- How a profile's genetics/species are inherited → [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md)
- The optional AI narrator and its access gating → [The AI Role-Play Companion](ai-companion.md)
