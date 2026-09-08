# Packs and Groups

How characters can band together into a small, named group with an internal
hierarchy, invite/removal flow, and helper conveniences.

- **🎮 End-User Documentation** — what a pack is and how you use one.
- **🧑‍💻 Developer Documentation** — how it is modelled and implemented.

---

## 🎮 End-User Documentation

### What a pack is

A **pack** is a small, named group of characters — a family, clan, gang, or
similar social unit. From your character's profile menu you can create a pack,
invite others nearby to join it, view its members, and leave it. A pack can
hold **up to 9 characters**, including its leader.

### Roles inside a pack

Every member holds one of three roles:

- **Alpha** — the pack's leader. There is exactly one per pack. Only the Alpha
  can invite new members. If the Alpha leaves, they must either hand
  leadership to an existing second-in-command or, if there is none, the pack
  is dissolved.
- **Beta** — a second-in-command. When an Alpha needs to step down and there
  are Betas available, they choose one to become the new Alpha.
- **Omega** — a regular member. The first member invited into a pack becomes
  its sole Beta automatically; anyone invited after that joins as an Omega.

### Creating a pack

From your character's profile menu, choose the pack option, then "Create."
You'll be asked to name your pack, then to pick a nearby character to found it
with — the founder becomes your pack's Alpha (with you as its first member).
Both parties must accept before the pack is created.

### Inviting and managing members

- Only the Alpha can send invitations, and only while the pack has room. The
  Alpha searches for characters nearby and sends an invite, which the other
  player can accept or decline.
- From the member list you can view any packmate's character profile, and —
  if they're currently active in-world and the automated outfit/body control
  add-on is enabled — teleport directly to their location.
- The Alpha can remove any member other than themselves.

### Leaving or dissolving a pack

- Any member can leave at will.
- If the Alpha leaves and there are Betas, they must choose a successor before
  leaving; that successor becomes the new Alpha.
- If the Alpha leaves and there are no Betas, the pack is dissolved entirely.

### Packs and new births

When a character gives birth while she is a pack member, her newborn joins the
same pack automatically, inheriting her role — unless she is the pack's Alpha,
in which case the newborn joins as a Beta rather than displacing her as leader.

---

## 🧑‍💻 Developer Documentation

### Module

`PackModule` (`src/classes/modules/PackModule.php`) is an `AbstractBaseModule`
attached to a profile's menu flow, driven entirely through the dialog system
(`DialogButtons`, `DialogButtonsDynamic`, `DialogConfirm`, `DialogTextbox`) and
the shared framework's `SonarSearchModule` for finding nearby agents. It is
reached from `MyProfileDialog`'s `ACTION_PACK` entry
(`PackModule::getInstance()->returnPacksDialog(...)`).

Key entry points:

- `returnPacksDialog(...)` / `render_character_pack(...)` — renders the
  top-level pack menu (create, or members/invite/leave if already in a pack).
- `menu_character_pack(...)` — dispatches `ACTION_CREATE`, `ACTION_INVITE`,
  `ACTION_MEMBERS`, `ACTION_LEAVE`.
- Invite flow: `menu_pack_invite1` (sonar search) → `menu_pack_invite2`
  (confirm target) → `menu_pack_invite3` (target accepts/declines and is
  persisted as a new `ProfilePackRoleModelImpl`, wrapped in a Doctrine
  transaction via `EntityManager::wrapInTransaction`).
- Member management: `menu_pack_member` / `menu_pack_member_action` handles
  `ACTION_REMOVE`, `ACTION_PROFILE` (opens `ProfileDialog`), and
  `ACTION_TELEPORT` (uses `RlvService::handlePassive(new RlvTpTo(...))` against
  the target's current header location, gated on `RlvService::isEnabled()`).
- Leaving/dissolving: `menu_pack_leave`, `menu_pack_abdicate` (Alpha hands the
  role to a chosen Beta), `menu_pack_dissolve` (removes the
  `ProfilePackModelImpl` entirely when no successor exists).
- Creation: `menu_pack_create1..5` — name entry (`FuncHelper::cleanToTitle`,
  validated against `Constants::REGEX_TITLE`), confirmation, a sonar search for
  a co-founder, and a cross-account confirm dialog (`DIALOG_CHANNEL_EXTERNAL`)
  before the `ProfilePackModelImpl`/first two `ProfilePackRoleModelImpl` rows
  are persisted.

`PACK_MAXIMUM = 9` caps membership size; enforced in the invite-accept path.

### Data model

- **`ProfilePackModelImpl`** (`ane_profile_packs`): `id`, `name`, `created`,
  and a `members` collection of `ProfilePackRoleModelImpl` (`OneToMany`,
  `cascade: ['all']`).
- **`ProfilePackRoleModelImpl`** (`ane_profile_pack_roles`): a composite-keyed
  join row linking `pack` (`ProfilePackModelImpl`), `account`
  (`AccountModelImpl`, one-to-one), and `profile` (`ProfileModelImpl`,
  one-to-one, `inversedBy: "packRole"`), plus `role` (string, defaults to
  `"OMEGA"`) and `entered` (timestamp). `ProfileModelImpl::getPackRole()` /
  `setPackRole(...)` expose the relation from the profile side.
- **`ProfilePackRoleHelper`** (`src/classes/helpers/ProfilePackRoleHelper.php`)
  defines the role vocabulary as string constants: `ROLE_ALPHA`, `ROLE_BETA`,
  `ROLE_OMEGA`. There is no dedicated enum for pack roles.
- **`ProfilePackRoleRepository`** (`src/classes/repos/ProfilePackRoleRepository.php`)
  provides the Doctrine repository for pack-role rows, mapped in
  `Application::doConfigure()`.

### Birth inheritance

`InitialState` (`src/classes/states/InitialState.php`), during the "assume a
birth" onboarding flow, checks whether the birth's genetic mother (`geneA`)
holds a `ProfilePackRoleModelImpl` that predates the birth. If so, it creates a
new `ProfilePackRoleModelImpl` for the newborn's account/profile in the same
`ProfilePackModelImpl`, copying the mother's role — except when she is
`ROLE_ALPHA`, in which case the newborn is assigned `ROLE_BETA` instead of
displacing her.

### Extension points

- Roles are plain strings rather than an enum, so adding a role means adding a
  new `ProfilePackRoleHelper` constant and updating the role-comparison logic
  scattered through `PackModule` and `InitialState`.
- Pack membership currently has no gameplay effect beyond menu access,
  teleport convenience, and birth inheritance; other subsystems (stories,
  events, third-party integrations) do not currently consult `getPackRole()`.

### Where to go next

- The character/account model packs attach to →
  [Accounts and Profiles](account-and-profiles.md)
- How births are produced and claimed →
  [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md)
- The automated outfit/body control add-on used for pack teleports →
  [RLV-Driven Character and Outfit Control](rlv-and-control.md)
