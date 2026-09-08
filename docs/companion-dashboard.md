# The Companion Web Dashboard

A browser-based, read-and-write "second screen" for your character that mirrors
what the in-world companion is doing in real time — status, stats, abilities,
items, genetics, settings, and more — without needing to open in-world menus.

- **🎮 End-User Documentation** — what the dashboard shows you and how you open
  it.
- **🧑‍💻 Developer Documentation** — the API surface that powers it and how to
  add a new panel.

> This is a different thing from [The Web Portal](web-portal.md), which is a
> one-off page used only to securely enter credentials or scan a pairing code
> for a third-party link. The dashboard described here is an ongoing browser
> session that keeps mirroring your character while it's open.

---

## 🎮 End-User Documentation

### What it is

The dashboard is a website that shows a live view of your active character —
the same information and menus you'd normally dig through in-world, laid out
as a single page that updates on its own. It's optional and purely a
convenience: everything it shows or does is also reachable through the normal
in-world menus.

### How you open it

From your character's profile menu in-world, choose the option that opens your
character sheet as a web page (the "Tree" view). A browser window opens with a
one-time, time-limited link — you don't need to log in separately, and the
link expires after a short while if unused.

### What you'll see

- **Live status** — whether your companion is currently active, and, while
  you're in an intimate scene, a mirrored, moment-by-moment narration of what's
  happening (so you can follow along even if you've stepped away from local
  chat).
- **Character sheet** — your name, species, gender, form, class, region, and
  parents, plus your core stats (vitality, arousal, stamina, essence, strength,
  defense), fertility/pregnancy flags, and body growth.
- **Abilities** — any special ability your character currently has access to
  (for example, a shapeshifter's Shift ability), with the same controls as the
  in-world menu.
- **Genetics, pregnancies and births** — the same family-tree, pregnancy, and
  birth-history views as the in-world profile menu.
- **Items and attachable devices** — a live scan of nearby usable items and your
  worn attachable devices/plugins.
- **Settings** — the same account settings you'd change in-world (AI narrator
  preferences, privacy toggles, movement/RLV restrictions, access permissions),
  editable directly from the page.
- **Search and discovery** — other active characters nearby, online, or
  currently fertile, each with a compatibility percentage against your active
  character, plus a "Breed" button that sends the same breeding request the
  in-world Search menu would send.
- **World presence** — a snapshot of overall community activity: how many
  characters are online, the busiest regions, and the most common species.
- **Store** — browsing and spending your Credit balance (see
  [The Store and Rewards Economy](store-and-rewards.md)).

### Staying in sync

The page checks in with your in-world companion every few seconds. If your HUD
goes offline (removed, region change taking too long, etc.) for more than a
few minutes, the dashboard shows your session as offline until it hears from
your companion again — nothing is lost, it just pauses.

### Privacy and security

- The link you open from in-world is single-purpose and expires on its own; it
  isn't a permanent login you need to remember or protect.
- Anything you type into a linked settings field is validated and applied the
  same way it would be from the in-world menu — there is no extra access
  granted beyond what the in-world menu already allows.

---

## 🧑‍💻 Developer Documentation

### Purpose and relationship to the frontend

The backend does not render the dashboard itself — it exposes a stateless
JSON API that a separate Next.js frontend (referred to throughout the
codebase's inline docs as `ane-ui-nextjs`, not part of this repository)
consumes to render the live dashboard. This document only covers the
backend-side surface; the frontend is out of scope.

### Entry point and hand-off

- **`ProfileDialog::menu_profile_dialog()`** (`PROFILE_TREE` button) mints a
  short-lived signed token via `TokenHelper::createUrlToken()` carrying
  `target` (the profile id being viewed) and `viewer` (the caller's owner
  key), and opens `{ui.protocol}://{ui.host}/?token=<jwt>` in the in-world
  media browser (`MediaModule::openMediaBrowserAndDialog()`).
- **`TokenHelper`** (`src/classes/helpers/TokenHelper.php`) centralises JWT
  creation (`firebase/php-jwt`, `HS256`, signed with the `jwt.secret`
  application setting). `createToken()`/`createUrlToken()` always stamp
  `iat`/`exp` server-side (default TTL `DEFAULT_TTL_SECONDS` = 600s), so a
  caller can supply arbitrary claims but can't forge or extend the expiry.
  It also exposes itself over the API (`on_api()`, routed via the `token`
  segment) so the frontend can mint additional scoped tokens after the initial
  hand-off.

### Request routing

Two complementary routing styles are used, both dispatched through the shared
framework's `ApiService`/`ApiEvent` machinery (`/api?...`) and matched to
`ApiSubscriber` implementations:

1. **Segmented dispatch (`ApiHelper`)** — `src/classes/helpers/ApiHelper.php`
   resolves `/api?class=ApiHelper&segments=state,account,profile,...` by
   splitting the `segments` query param and fanning each name out to a fixed
   helper (`state`, `account`, `headers`, `profile`, `species`, `plugins`,
   `genetics`, `fluids`, `stats`, `attachments`, `pregnancies`, `births`,
   `token`). `state`/`account`/`headers` are always resolved; every other
   segment is gated behind `!InitialState::isState()` (i.e. there must be an
   active character) so the frontend can safely request a wide payload without
   a foreach of individual checks. An `outfits` segment name is also recognised
   but currently just returns an empty payload — it's a reserved placeholder,
   not a working panel yet.
2. **Direct per-class endpoints** — most dashboard panels are their own
   top-level `ApiSubscriber`, resolved by short class name
   (`/api?class=<ClassName>`), for example:
   - `StatusHelper` — `/api?class=StatusHelper`: the stable top-level poll
     endpoint (~every 10s from the frontend). Returns the current state-machine
     state (`resolveStateName()`), a rendered character summary
     (`renderCharacter()`, including `RenderHelper::renderProfileOf()` and the
     same stat block `AbstractAneState::on_broadcast(CHAN_BROADCAST_STATS)`
     uses), a `present` heartbeat flag, and — while `CopulateState` is active —
     a `copulation` block from `CopulateState::buildCopulationActivity()`.
     `present` is derived from the age of the account's latest in-world header
     versus `SESSION_HEADER_TTL_SECONDS` (300s; kept in sync with
     `SESSION_HEADER_TTL_SECONDS` in the frontend's `useAppStatus.ts`).
   - `AbilityHelper` / `AbilityShiftHelper` — the Abilities panel; `AbilityHelper`
     reports which abilities the active character has (today, only the
     Shapeshifter's Shift, gated on `FormTypeEnum::FORM_SHIFT`), and
     `AbilityShiftHelper` drives the Shift ability's own detail surface,
     collapsing the in-world MyProfile → Abilities → Shift dialog tree.
   - `ItemHelper` — the Items panel; wraps
     `ItemService::discoverItemObjects(notifyAgent: false, clearCache: true)`,
     the same scan as the in-world `touch → Items` button, with
     `notifyAgent` suppressed so it doesn't spam local chat.
   - `SettingHelper` — the account Settings page; collapses `SettingsDialog`'s
     blue-dialog tree into a schema-driven surface. `GET ?group=<name>`
     returns the group's field schema (label/description/type/bounds/default)
     merged with the currently stored value; `POST ?group=<name>` validates and
     persists submitted fields (range clamping/snapping, boolean coercion, text
     length/regex validation — the validation regex itself is stripped before
     being sent to the client) via `AccountSettingHelper`, applies any
     side-effect (e.g. immediately locking/unlocking the RLV detach point when
     the "Detachable" setting changes), then re-reads and returns the group so
     the client reconciles to the true stored state. Wired groups: `ai`
     (AI role-play narration limits), `privacy` (location broadcasting),
     `rlv` (movement/auto-strip/detachable/character-switching/relay
     restrictions), `access` (public access).
   - `DiscoveryHelper` — the Search panel; `/api?class=DiscoveryHelper&scope=<scope>`
     collapses the in-world Search dialog tree (Region/Global/Online/
     Garden/Fertile — see [Search and Discovery](search-and-discovery.md)) into
     one scoped endpoint. `region`/`online`/`fertile`
     return profile rows (name, species, gender, region, fertility, and
     lineage-aware breeding compatibility against the caller's active
     character via `SpeciesAffinityHelper`); `region` additionally carries
     proximity/`canCopulate` (whether a breeding request can be sent, mirroring
     `CopulateModule`'s in-world range gate); `global` returns busiest-region
     counts; `garden` returns an explicit "unavailable on the web" marker
     because it needs an in-world parcel/sensor scan.
   - `CopulateModule::on_api()` — `POST /api?class=CopulateModule&target=<agentKey>`:
     the Search panel's "Breed" button. Validates the target resolves to a
     real, currently-active character within `Constants::COPULATION_RANGE`,
     then calls the same `offerCopulate()` used by the in-world flow — the
     target still confirms (or auto-accepts, per their trust/relationship/access
     settings — see `CopulateModule::resolveAutoApprovalReason()` and
     [Accounts and Profiles](account-and-profiles.md)) before
     `CopulateState` is entered.
   - `WorldPresenceHelper` — the World Presence panel; aggregate community
     stats (`online` accounts, busiest `regions`, most-populous `species`),
     each section independently guarded so one failing query degrades
     gracefully instead of failing the whole payload.
   - `StoreModule::on_api()` — reserved `ApiSubscriber` stub for exposing store
     actions (e.g. `vend`) over the API; see
     [The Store and Rewards Economy](store-and-rewards.md).
   - `AttachmentsHelper` (RLV shared-folders module) — a read-only listing
     (`list=folders|outfits|garments|all`) of the character's shared folders,
     current outfit, and worn/unworn garments, each flagged active/inactive;
     see [RLV-Driven Character and Outfit Control](rlv-and-control.md).

### Live scene mirroring

While a character is in `CopulateState`, `RolePlayService` buffers narrated
prose, whispers, and a small set of sequenced events (climax, conception) in
per-request/session ("Application meta") scratch storage — `SCENE_TRANSCRIPT`
/ `SCENE_EVENTS` (capped at 80/24 entries) — purely so `StatusHelper`'s
`copulation` block can mirror the running scene to the dashboard. This is
intentionally **not persisted**: it's cleared on state entry/exit, unlike the
`ChoiceStory` history retention used for the AI companion (see
[The AI Role-Play Companion](ai-companion.md)).

### Security notes

- All JWTs are signed with the `jwt.secret` application setting; claims come
  from the caller but `iat`/`exp` are always re-stamped server-side, and an
  optional `ttl` query param can only shorten (not extend) the effective
  lifetime.
- Segment-gated helpers under `ApiHelper` refuse to resolve most segments
  unless an active character exists, preventing state/profile data from
  leaking through the dashboard before a HUD session is established.
- `SettingHelper` strips server-only validation regexes from its schema
  response and clamps/validates every submitted value before persisting, so a
  malformed or malicious dashboard request can't write out-of-range or
  unvalidated settings.

### Extension points

- **New dashboard panel:** add a class implementing `ApiSubscriber` (either a
  new `helpers/*Helper.php` resolved directly by class name, or a new segment
  wired into `ApiHelper`), subscribe it alongside `StatusHelper` in
  `AbstractAneState::on_initialized`, and have the frontend poll/call it.
- **New settings group:** add a `*Schema()` method and a `match` arm in
  `SettingHelper::schemaFor()`, following the existing field shape
  (`key`/`label`/`description`/`type`/bounds or `maxLength`+`validate`
  /`default`).

See [System Design](system-design.md) for how this fits into the overall
architecture, and [The Web Portal](web-portal.md) for the separate credential
hand-off flow.
