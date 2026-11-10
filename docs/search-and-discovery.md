---
audience: mixed
summary: Character discovery, saved identity, inherited ancestry, compatibility explanations, and community locations.
---

# Search & Discovery

## For end-users

### Opening Search

The **Search** button on the main menu opens a short list of ways to look for
other people using the system. The menu also tells you how many people have
been active in the region recently and how many people have registered in total.

### Search scopes

| Scope | What it shows |
|---|---|
| **Region** | Everyone currently active in your region, found two ways: a quick list from recent activity, and an active "ping" that asks nearby users' companions to respond directly (useful for people your region list hasn't picked up yet). |
| **Global** | Which regions have the most people active right now, so you can decide where to go. Selecting a region offers to teleport you there (if you're wearing a compatible teleport-assist device). |
| **Online** | Every character active anywhere in the last hour, with a link to start an instant message. |
| **Fertile** | Same as Online, but narrowed to characters who are currently able to conceive — handy when you're specifically looking for a breeding partner. |
| **Gardens** | A community directory of public locations that landowners have registered as breeding-friendly spots ("gardens" for smaller parcels, "forests" for large regions). Browse the list, see how busy a location has been, and teleport there. |
| **Profiles** | Look up a specific character by (part of) their name, regardless of whether they're currently online. |

### Acting on a result

Selecting a character from Region, Online, or Fertile results opens a small
card with their name, gender, species, and (if they've allowed it) their
current location. From here, depending on the scope and your relationship
with them, you may be able to:

- **View Profile** — see their full character sheet.
- **Breed** — send a breeding request, if you're both nearby and biologically
  compatible. See
  [Interaction & Role-Play Lifecycle](interaction-lifecycle.md) for how
  breeding requests and auto-acceptance work.
- **Adopt** — offer an adoption bond (Master/Slave, Owner/Pet, or Parent/Child).
  See [Accounts & Profiles](account-and-profiles.md).
- **Block** — exclude that person from your nearby, online, and fertile
  character results. This does not hide them from the name-based profile lookup
  or remove their activity from region totals. Blocking only affects your own
  results; it doesn't notify the other person or restrict them from finding you
  through other means.

### Character details in web Discover

Where supported by your dashboard, a result can show the character's saved
sexuality and picture. Unspecified details stay empty rather than being inferred
from the character's body. See
[Optional character identity](account-and-profiles.md#optional-character-identity)
for editing your own details and their visibility to other people.

A character's registered species and that species' recipe are not necessarily
their personal ancestry. A descendant can inherit different proportions, or
additional species, while retaining the same species name. An ancestry summary
describes the character's own inherited makeup, independently of whom you are
comparing them with. A named hybrid can still be a hybrid when its inherited
ratios differ from the original recipe.

Incomplete ancestry is not proof of pure breeding. Some known shares may be
shown while the overall classification remains unknown. Ancestry can also be
available when no match percentage can be calculated. For the inheritance rules
and worked examples, see
[Ancestry & Taxonomy](species-ancestry-and-taxonomy.md).

### Match percentages in web Discover

The **match** percentage compares the result with your active character using
the same compatibility calculation as the in-world companion. It includes
inherited species overlap, shared taxonomy, forced compatibility, garden and
partner bonuses, and form/class differences. Two characters with no shared
species ancestry can therefore have a positive match through shared taxonomy.
Where offered, open the match explanation to see how each factor changes the
running total.
The contributions are percentage-point changes applied in order; raw factor
percentages should not be added together. The explanation can name the shared
species and related classifications that contribute positively, but it is not
a complete ancestry list: a species with no contribution to this particular
match can still be part of the character's ancestry.

The value is an estimate for the two profiles; conception involving a particular
ovum can differ because the ovum's donor and stored traits are used there.

### Registering a Garden or Forest

You can register land you personally own, or land deeded to the group you have
active while wearing your companion. Stand on the parcel and open **Gardens**.
The parcel description must include AnE and its area must be at least 2,048
square metres:

- Parcels below 32,768 square metres register as a **Garden**; larger parcels
  register as a **Forest**.
- New listings start private and use your current position as the arrival
  point. Make the listing public when you want others to find it.
- Once registered, you can rename it, mark it public or private, set (or
  update) the exact spot visitors are teleported to, or remove the listing
  entirely.
- Listings you manage are ranked in the browse list by how much recent
  activity they've seen, so active, welcoming locations surface first.

Where your dashboard offers garden controls, you can also browse public
listings and your own private listings, manage your registrations, and request
a teleport. Keep the companion connected and teleport assistance enabled for
teleporting. Registration and moving the arrival point require standing on the
parcel; if you moved or the companion lost contact, return there and refresh.
A successful teleport request is not a guarantee of arrival.

---

## For developers

### Entry point

`RunningState::touch_root()`'s first HUD button opens
`RunningState::dialogSearchOptions()`, a `DialogButtons` prompt whose header
line combines recent header activity (`HeaderHelper::fetchHeadersAfter(...)`)
with total registered accounts
(`AccountHelper::countAccountsStartedAfter(...)`). The chosen scope constant
(`RunningState::SEARCH_REGION`/`SEARCH_GLOBAL`/`SEARCH_ONLINE`/`SEARCH_GARDEN`/
`SEARCH_FERTILE`/`SEARCH_PROFILES`) is dispatched by `menu_search_scope()` to
one of the dialogs below (all under `src/classes/prefabs/dialogs/`). The same
entry point backs `RunningState::touch_root()`'s dedicated "quick breed"
shortcut, which opens `RegionSearchDialog` pre-filtered to plausible breeding
partners and tagged with `StoryBreed`.

### Scope dialogs

| Scope | Class | Data source |
|---|---|---|
| Region | `RegionSearchDialog` | `HeaderHelper::fetchAccountsByRegionAfter(...)` (headers seen in-region within the last 2 minutes), filtered through `AccountBlockHelper`. Its "Nearby" button additionally issues a `SensorSearch` (an active in-world scan) via `SearchHelper::searchNearbyAgents()`, which wraps the shared framework's `SonarSearch`. |
| Global | `SearchGlobalDialog` | `HeaderHelper::fetchHeadersAfter(...)` over `Constants::DATETIME_INTERVAL_ONLINE` (1 hour), grouped and sorted by region population; teleports via `RlvService`/`RlvTpTo`. |
| Online | `SearchOnlineDialog` | Same 1-hour header window, not scoped to a region; profile card includes an instant-message link and honours the target's `SETTING_LOCATABLE_ENABLED` account setting before showing location. |
| Fertile | `SearchFertileDialog` | Same 1-hour window, additionally filtered by `ProfileHelper::newInstance(...)->maybeFertile()`. |
| Gardens | `SearchGardenDialog` | `SimulatorModelImpl` rows of type `SimulatorTypeEnum::SIMULATOR_GARDEN`/`SIMULATOR_FOREST` (via `SimulatorHelper`/`SimulatorRepositoryImpl`), ranked by `LocationHistoryRepository::fetchRegionActivityCounts(...)`. |
| Profiles | `ProfileSearchDialog` | `ProfileHelper::searchProfilesByNamesLike(...)`, a free-text `DialogTextbox` name match excluding deceased characters. |

Region, Online, and Fertile character searches filter through
`AccountBlockHelper`. Global region aggregates, the garden directory, and the
Profiles name search are not equivalent blocked-account lists.

### Web discovery rows

`DiscoveryHelper` (`src/classes/helpers/DiscoveryHelper.php`) serves
`/api?class=DiscoveryHelper&scope=<scope>`. Region, Online, and Fertile use the
one-hour `Constants::DATETIME_INTERVAL_ONLINE` window, exclude the caller, and
apply the caller's block list. The web Region scope therefore differs from the
native Region dialog's two-minute window. Fertile additionally requires an
active profile whose `ProfileHelper::maybeFertile()` is true.

Region and Online retain accounts with no active profile, using the agent name,
null identity/ancestry/compatibility fields, and an empty species composition;
Fertile excludes them. An error constructing one
active profile row is logged and that row is skipped. Unknown scopes return an
error with empty results; an outer query failure returns a generic unavailable
message.

| Field group | Behavior |
|---|---|
| `agentKey`, `agentName`, `profileId`, `name` | Account identity and the active character's full name; no inactive character is selected as a substitute. |
| `species`, `speciesHybridType`, `speciesComposition` | The registered species name, its kind, and names of its direct recipe members. These are species-definition data, not flattened inherited proportions. |
| `ancestry` | The individual's weighted inherited species; see below. |
| `gender`, `sexuality`, `imageUuid` | Stored character gender label, saved sexuality label, and optional texture UUID. Sexuality uses `SexualityTypeEnum::toLabel()`, not the enum backing key used by the editor; unset sexuality/image values remain null. |
| `region`, `fertile` | Stored profile region and current fertility estimate. The region is not the latest HUD location and does not apply the native Online dialog's locatable-setting check. |
| `compatibility`, `compatibilityBreakdown` | Nullable canonical pair score and explanation against the caller's active character. |
| `distance`, `canCopulate` | Region/Online only calculate proximity through `CopulateModule::copulationProximity()` when the caller has an active profile. Fertile leaves these null/false. A true flag is a range check, not consent or guaranteed acceptance. |

`global` instead uses `HeaderRepositoryImpl::groupActiveHeadersByRegion(60)`
and returns cleaned region names and header counts. These are activity counts,
not deduplicated character counts. The legacy `garden` scope still returns
`unavailable: true`; browser garden clients must use the separate
[Garden API](#browser-garden-requests), not treat this marker as a product-wide
restriction.

> **Privacy boundary:** discovery publishes the saved character identity and
> profile region described above, not the native dialog's location-visibility
> contract. Whether those reads should share an additional visibility setting
> requires maintainer confirmation.

### Individual ancestry in discovery

`CharacterAncestryHelper::forProfile()` in
`src/classes/helpers/CharacterAncestryHelper.php` uses the shared
`SpeciesCompositionHelper` resolver, with
`SpeciesCompositionDefinitionHelper::legacyHybrid()` identifying legacy species
whose recipe is missing. It is independent of taxonomy and of the comparison
partner, and does not mutate profiles or definitions.

| Ancestry field | Meaning |
|---|---|
| `species` | Known leaf species with `speciesId`, `speciesName`, and unrounded fractional `share`, ordered by descending share, then name and ID. |
| `unresolvedShare` | Weight belonging to unresolvable leaves, rather than redistributing that weight over known leaves. |
| `complete` | Nonempty ancestry resolved without a flagged scoring fallback or unknown leaf. |
| `classification` | `unknown` when incomplete; otherwise `purebred` for one leaf, `hybrid`/`composition` when multiple leaves match the registered species definition's membership and kind, or `mixed` otherwise. |
| `matchesSpecies` | True only when the complete ancestry matches the resolved definition's identities and proportions; false for a known mismatch; null when either side cannot be established. |

The resolver uses a founder's species recipe and a born character's parent
compositions, not a second contribution from the child's registered label.
Its numerical fallbacks still serve scoring, but do not certify ancestry as
complete. For example, a single known parent can yield known shares summing to
one while `complete` remains false and `unresolvedShare` is zero. Clients must
not infer completeness from that number alone.

Classification and definition matching answer different questions: a 25/75
descendant of a 50/50 hybrid can remain `hybrid` while `matchesSpecies` is false.
A definition that resolves to one leaf can match a `purebred` ancestry even if
the definition's own kind is `composition`. Comparisons use species identities,
not names or displayed rounded percentages; the relative proportion tolerance
is `1e-12` times the larger share. An unresolved definition can leave
`matchesSpecies` null even with complete individual ancestry.

No parent/ancestor character identities are included. Missing active comparison
characters do not suppress a target's ancestry. Unsupported profile types or
ancestry calculation failures return null ancestry, independently of the
compatibility result. Clients should suppress a redundant ancestry display only
when `matchesSpecies` is explicitly true, not because labels happen to match.

`tests/unit/CharacterAncestryHelperTest.php` covers unequal hybrid ratios,
additional ancestry, tiny shares, missing/cyclic recipes and pedigrees, and
definition-match uncertainty. Discovery E2E coverage under `tests/e2e/cases/`
includes `DiscoverySpeciesDetailsIncludeHybridDefinitionsTest.php` and
`DiscoveryProfileIdentityFieldsExposeSavedValuesTest.php`.

### Web compatibility values

`DiscoveryHelper` supplies nullable `compatibility` fractions in `[0, 1]` for
Region, Online, and Fertile profile rows. It builds components once with
`ProfileHelper::calcCompatibility()` with the active profile first, the target
second, and `explain: true`, then evaluates `CompatibilityHelper::breakdown()`
once. The caller's character remains first,
matching `RegionSearchDialog`; inherited composition and configured modifiers
are unchanged. `compatibility` is exactly the resulting breakdown's `total`.
The API does not round this fraction, so small positive probabilities remain
visible to clients. Missing active characters or calculation failures remain
`null`; valid zero compatibility is `0`. The lookup does not create taxonomy,
change profile data, or invoke AI.

The nullable `compatibilityBreakdown` contains `total` and `steps`; every step
has `key`, `value`, `before`, and `after`. With explanation metadata available,
it also includes `contributors` and `comparisons`.

Every number is an unrounded fraction. Seven steps are always present in this
order: `species`, `taxonomy`, `forcedSpecies`, `garden`, `partner`, `form`, `class`.
`before` and `after` are the successive probabilities; their difference times
100 is the signed percentage-point contribution. `value` is the factor used:

- Species starts with inherited overlap; taxonomy fills the remaining gap.
- Forced compatibility can raise the total to the average of the current total
  and the forced-compatibility input; it never lowers it.
- Garden and partnership each close their capped share of the remaining gap.
  Their effective values are in `[0, 0.5]`, including nonfinite/negative handling.
- Form and class multiply the running total; `1` is neutral.

Zero contributions and neutral factors remain visible. The final `after` and
`total` equal `compatibility` from the same evaluation. Missing characters or a
calculation failure produce `null` for both fields. No profile/ancestor character
identities are added to this explanation. Clients display the
server steps rather than reimplementing the formula. The scalar scorer used by
profiles and ova delegates to this same breakdown implementation.

`contributors.species` lists only positive overlap contributions, with the
species name, `ownShare`, `otherShare`, and `contribution`.
`contributors.taxonomy` lists positive species-pair contributions with
`species`, `otherSpecies`, `ownShare`, `otherShare`, their shared `rank`, and
`contribution`. `CompatibilityHelper` scales each taxonomy contribution by
the remaining gap after species overlap, so it explains the actual increase in
the total, not the raw taxonomy score. `comparisons.form` and `comparisons.class`
give the two readable values. These pair-specific lists must not substitute for
the complete `ancestry.species` list above.

### Blocking

`AccountBlockHelper` (`src/classes/helpers/AccountBlockHelper.php`) is a
one-directional block list keyed off the blocking account: `block(...)` records
it, `hasBlock(...)`/`hasBlockWith(...)` check it, and
`filterAccounts(...)`/`filterAccountsCollection(...)` (plus their static
`…With(...)` variants) strip blocked accounts out of a result set before it's
rendered. It is consulted by every "who's nearby/online" search dialog above.

### Gardens/Forests registry

- `SimulatorModelImpl` (`classes/models/`) stores a registered location's
  `key` (parcel UUID), `name`, `region`, owning `account`, `type`
  (`SimulatorTypeEnum::SIMULATOR_GARDEN` or `SIMULATOR_FOREST`), `public`
  flag, and a free-form `details` array (currently `area` and an optional
  teleport `point` `Vector`).
- Registration (`SearchGardenDialog::dialog_search_gardens()`,
  `ACTION_CREATE`) delegates to `GardenHelper::registerCurrentParcel()`, sharing
  browser registration checks and private-by-default creation described below.
- Management (`ACTION_UPDATE`/`ACTION_MANAGE` → rename, toggle `public`, set
  the teleport `point`, or `SimulatorRepositoryImpl::removeNow(...)` to
  delete) is restricted to the registering account.
- `GardenHelper` centralises location lookups used by gameplay and owns a
  separate browser API; the old `DiscoveryHelper` garden scope does not delegate
  to it.

### Browser garden requests

`GardenHelper` (`src/classes/helpers/GardenHelper.php`) is registered on state
initialization and session restore in `AbstractAneState`. GET at
`/api?class=GardenHelper` returns `ok`, `gardens`, `minutes`, `canTeleport`, and
`currentParcel`. The optional activity window `minutes` must be an integer from
1 to 60 (default 5). Only public, nonblank-name listings and the caller's own
listings are visible. Owner listings remain visible when private.

Each row includes parcel key, name, cleaned region, type, public/owned flags,
area, validated arrival point, visitor-header count, historical activity,
updated timestamp, and `canSetPoint`. Visitor counts cover the chosen window
and use the parcel for gardens or the region for forests; sorting uses six-month
region activity, then most recently updated, then name. These header counts
should not be described as unique visitors.

POST uses a body `action`:

| Action | Required inputs and checks |
|---|---|
| `create` | `parcelKey` must match the signed-in owner's recent persisted HUD location. A live parcel probe verifies its identity, name, AnE description, area of at least 2048 m², and authority. Ownership is personal or proven by an attached, owner-matching HUD with the group to which the land is deeded. Location and HUD identity are rechecked before persistence. |
| `update` | Owner-only `key`, trimmed nonempty `name` of at most 255 characters without control characters, and a boolean `public`. |
| `set-point` | Owner-only `key`; requires a recent location on that parcel and stores the server-resolved position, not browser coordinates. |
| `remove` | Owner-only `key` and literal boolean `confirmed: true`. |
| `teleport` | `key` for the caller's own listing or a public named listing, a valid saved point, recent connected HUD location, and enabled RLV. |

Creation stores the probing account as manager, initializes `public` to false,
and saves the current position. Forest classification begins at 32768 m².
The location source must belong to the caller, be no older than
`StatusHelper::SESSION_HEADER_TTL_SECONDS` (300 seconds), and contain a valid
parcel, region, and finite nonnegative position. Browser-supplied ownership,
area, description, and coordinates are not trusted.

Mutations are transactional; successful POST returns `ok: true` and optionally
`notificationId` for a teleport. Clients re-read GET rather than assuming a
full updated listing is returned. `TeleportHelper` dispatches the RLV action
with notifications, but success acknowledges dispatch, not confirmed arrival.
Validation errors return `ok: false` with an actionable message; unexpected
failures are logged and return a generic refresh message.

`tests/e2e/cases/GardensApiOwnershipAndParcelValidationTest.php` and
`tests/unit/GardenHelperTest.php` cover ownership, spoofed/stale locations,
registration probes, private visibility, actions, and validation.

### Related documentation

- The dashboard's web equivalent of these scopes (`DiscoveryHelper`) →
  [The Companion Web Dashboard](companion-dashboard.md)
- What happens once a breeding request is sent →
  [Interaction & Role-Play Lifecycle](interaction-lifecycle.md)
- Adoption bonds offered from a search result →
  [Accounts & Profiles](account-and-profiles.md)
