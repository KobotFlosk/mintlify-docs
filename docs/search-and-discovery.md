# Search and Discovery

How you find other characters and community-registered breeding locations, and
how those results are gathered and filtered behind the scenes.

- **🎮 End-User Documentation** — the Search menu, its scopes, and what you can
  do with a result.
- **🧑‍💻 Developer Documentation** — the dialogs, helpers, and data behind
  each scope.

---

## 🎮 End-User Documentation

### Opening Search

The **Search** button on the main menu opens a short list of ways to look for
other people using the system. The menu also tells you how many people have
been active in the region recently and how many characters exist in total.

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
  [Interaction and Role-Play Lifecycle](interaction-lifecycle.md) for how
  breeding requests and auto-acceptance work.
- **Adopt** — offer an adoption bond (Master/Slave, Owner/Pet, or Parent/Child).
  See [Accounts and Profiles](account-and-profiles.md).
- **Block** — stop that person from appearing in any of your search results
  going forward. Blocking only affects your own results; it doesn't notify the
  other person or restrict them from finding you through other means.

### Registering a Garden or Forest

If you own or manage land, and its description marks it as suitable, you can
register it as a public breeding location from the **Gardens** scope while
standing on the parcel:

- Land of a moderate size registers as a **Garden**; very large regions
  register as a **Forest**.
- Once registered, you can rename it, mark it public or private, set (or
  update) the exact spot visitors are teleported to, or remove the listing
  entirely.
- Listings you manage are ranked in the browse list by how much recent
  activity they've seen, so active, welcoming locations surface first.

---

## 🧑‍💻 Developer Documentation

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

All scope dialogs filter results through `AccountBlockHelper` (except the
Profiles name search, which searches characters rather than accounts) and
render with `DialogButtonMode::HYBRID` so short lists show as native buttons
and longer ones fall back to a paged text list.

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
  `ACTION_CREATE`) probes the current parcel with `ProbeParcelDetails`,
  requires the parcel description to match `Constants::REGEX_ANE_REGION` and
  its area to be at least 2048 m², and classifies it as a Forest instead of a
  Garden once the area reaches 32768 m².
- Management (`ACTION_UPDATE`/`ACTION_MANAGE` → rename, toggle `public`, set
  the teleport `point`, or `SimulatorRepositoryImpl::removeNow(...)` to
  delete) is restricted to the registering account.
- `GardenHelper` centralises read-side lookups used elsewhere in the system
  (e.g. `RunningState`'s idle loop and the companion dashboard's `garden`
  search scope) and also implements `ApiSubscriber::on_api()` to expose an
  activity-ranked simulator listing over the API.

### Related documentation

- The dashboard's web equivalent of these scopes (`DiscoveryHelper`) →
  [The Companion Web Dashboard](companion-dashboard.md)
- What happens once a breeding request is sent →
  [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)
- Adoption bonds offered from a search result →
  [Accounts and Profiles](account-and-profiles.md)
