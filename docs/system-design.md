# System Design

*A high-level map of the whole system.* Read this first; the other documents zoom
into individual subsystems.

This document has two halves:

- **🎮 End-User Documentation** — what the experience is and how it is used.
- **🧑‍💻 Developer Documentation** — how it is built.

---

## 🎮 End-User Documentation

### What this is

AnE is a wearable companion system for a 3D virtual world. Once you attach it, it
gives your character a living biology and a rich set of intimate, reproductive,
and role-play features:

- A **profile** that stores your character's identity — species, body form,
  gender, class, appearance, and relationships.
- A set of **vital statistics** (things like health, arousal, stamina, and
  essence) that rise and fall as you play.
- **Intimacy and breeding** scenes that respond to who you are and who your
  partner is, including realistic fluid exchange.
- A full **reproductive life-cycle**: fertility cycles, conception, pregnancy,
  and birth of a new character who inherits traits from both parents.
- A **species system** where new species can be designed, and where hybrids blend
  the makeup of their parents.
- **Attachable add-ons** — extra toys, tools, and devices that plug into the
  companion to add capabilities.
- An optional **AI role-play companion** that can narrate and react in character.
- A **web portal** for managing your character and settings outside the world.

### How you use it

1. **Wear it.** The companion attaches to your character and wakes up. The first
   time, it helps you create your character's profile.
2. **Open the menu.** Touching it opens an interactive menu. From here you reach
   your profile, settings, searches, the store, help, and any add-ons you own.
3. **Interact with others.** When you get close to another user of the system, you
   can start shared scenes. What each of you can do depends on your bodies and
   your personal permission settings.
4. **Live the life-cycle.** Over time your character can become fertile, conceive,
   carry a pregnancy, and give birth — producing a new character with inherited
   traits.
5. **Customise.** You choose your species, appearance, relationships, and content
   limits, and you can add optional devices for extra features.

Everything you do is remembered between sessions, so your character's state,
history, and relationships persist.

---

## 🧑‍💻 Developer Documentation

### One-paragraph overview

The backend is a stateless PHP request handler that serves an in-world HUD (the
worn object) over HTTP. Each in-world event (touch, chat, sensor, timer, item use,
etc.) becomes an HTTP request; the handler resolves the caller's account and
active profile, routes the request into a **state machine**, and returns a batch
of **actions** (chat output, dialogs, RLV commands, control instructions) that the
in-world object executes. Persistence is handled through Doctrine ORM against
PostgreSQL. The application is built on top of a shared framework library
(`nuefox/nuekryl`, referenced in code as the `NueKryL\…` namespace) and extends it
with the fertility/role-play domain.

### Request lifecycle

```
in-world object ──HTTP──▶ public entry script ──▶ Application::handle()
        ▲                                              │
        │                                              ▼
   actions (chat,                             resolve headers →
   dialogs, RLV,                              account → session →
   control) executed                          active profile
   in-world                                          │
        │                                            ▼
        └──────────── batch of actions ◀──── current State handles input
```

- **Entry scripts** live in `public/`. `public/sl.app.php` is the main HUD
  endpoint (`Application::handle($method, $params, $body)`); `public/callback.php`
  handles third-party callbacks (e.g. Telegram, Lovense); other scripts expose
  SQL/opcache admin tooling, a health-check (`public/health.php`, backed by
  `HealthHelper`, following the IETF "Health Check Response Format for HTTP
  APIs" draft), the [metrics endpoints](#observability--metrics-endpoints)
  below, and updater endpoints.
- **`ane\Application`** (`src/Application.php`) extends `NueKryL\Application`. Its
  `doConfigure()` wires Doctrine (PostgreSQL driver, metadata/query caches, entity
  and repository mappings) and registers domain closures; `doInitialize()` maps
  the in-world **action channels** (`AnE`, `AnE.listen`, `AnE.output`,
  `AnE.interact`, `AnE.rlv`, `AnE.plugins`, `AnE.items`, …), registers the item
  classes and plugin factory, and sets up logging.
- **Headers** carry the in-world context (owner key/name, region, parcel, object
  name/description, params). These identify the caller and are also attached to
  structured logs.

### State machine

Input is dispatched to the **current state**; states return actions and may
transition to another state via `AbstractAneState::nextState(...)`. States live in
`src/classes/states/`:

| State | Role |
|---|---|
| `InitialState` | Entry point (`Application::setInitial(...)`). Onboarding, profile creation/switching, admin, settings, and the main menu; transitions to `RunningState`. |
| `RunningState` | The idle "living" state. Watches for nearby partners and birth readiness; transitions into `CopulateState` or `BirthingState`. |
| `CopulateState` | Drives active intimate scenes between profiles (the largest state). Returns to `RunningState` when the scene ends. |
| `BirthingState` | Drives the birth flow; returns to `RunningState`. |
| `ExamineState` | Lightweight inspection state. |
| `AbstractAneState` | Shared base: menu scaffolding, transitions, common helpers. |

### Layered architecture

The domain lives under `src/classes/` and `src/interfaces/`, organised by
responsibility:

| Layer | Location | Responsibility |
|---|---|---|
| **States** | `classes/states` | Request-handling flow / gameplay loop (above). |
| **Stories** | `classes/stories` | Self-contained intimate "scenes" (oral, anal, breed, oviposit, climax) offered inside `CopulateState`. Each is a `StoryInterface` with its own actions and dialogs. |
| **Services** | `classes/services` | Long-lived cross-cutting subscribers (interaction routing, role-play, AI, attachments, fluid transfer, profile modifiers, the web portal). |
| **Modules** | `classes/modules` | Feature bundles attached to a session (copulate, birth/adopt offers, packs, store, media, Lovense, RLV shared folders, command line). |
| **Helpers** | `classes/helpers` | Stateless domain logic and queries (~60 helpers): profiles, species, genetics, fluids, pregnancy, birth, ovum, incubators, compatibility, attachments, transactions, etc. |
| **Models** | `classes/models` + `interfaces/models` | Doctrine entities (interface + `…Impl`) for accounts, profiles, species, births, pregnancies, fluids, ovum, items, plugins, sessions, and more. |
| **Repositories** | `classes/repos` | Doctrine repositories; persistence and queries per aggregate, mapped in `Application`. |
| **Plugins / Devices** | `classes/plugins` | Attachable add-ons (`AbstractAnePlugin`) and hardware-like devices (`AbstractDevicePlugin`) that hook role-play events and add menus. See [Attachable Items & Devices](attachable-items-and-devices.md). |
| **Items** | `classes/items` | Consumables and objects (pills, condoms, syringes, ampoules, potions, testers). Registered via `ItemService::setItemClasses(...)`. See [Attachable Items & Devices](attachable-items-and-devices.md). |
| **Modifiers** | `classes/modifiers` | Timed effects on a profile's stats (aging, poison, bio-bug devices). |
| **Events** | `classes/events` | Role-play events (climax, penetration, stat change, death, …) published during scenes. |
| **Prefabs** | `classes/prefabs` | Reusable UI: dialogs, wizards, and preset actions. |
| **AI** | `classes/ai` | Pluggable AI platforms, chat context, tool schema, and MCP tools for the role-play companion. |
| **Enums / Types / Attributes / Serializers / Traits** | respective folders | Domain vocabulary, value types, PHP attributes, (de)serialization, and reusable mixins. |

### Core domain vocabulary (enums)

Enums in `src/classes/enums/` define the domain's fixed vocabulary. The most
load-bearing ones:

- `GenderTypeEnum` — male, female, hermaphrodite, andromorph, gynomorph, neutral.
- `FormTypeEnum` — anthro, human, feral, taur, monster, and **shift** (see the
  [Form Shapeshifters](form-shapeshifters.md) document).
- `FluidTypeEnum` — semen, nectar, milk, saliva, blood, urine, …
- `OrificeTypeEnum` / `StimulatorTypeEnum` — where fluids are received / what
  delivers them.
- `IncubatorTypeEnum` — where a deposit can gestate (uterus, colon, stomach).
- `StatTypeEnum` — vitality, arousal, stamina, essence, strength, defense.
- `HybridTypeEnum` / `TaxonomicTypeEnum` — species classification (truebred, true
  hybrid, composition hybrid). See the [Species](species-creation.md) documents.

### Interaction & events

Two request-driven mechanisms connect the pieces:

- **The API/event bus.** Many helpers and services implement `ApiSubscriber` and
  react to `ApiEvent`s, letting subsystems observe profile/fluid/ovum changes
  without hard coupling.
- **Role-play events.** During scenes, stories publish `AbstractRolePlayEvent`s
  (e.g. `ClimaxEvent`, `PenetrationEvent`, `StatChangeEvent`). Plugins, the AI
  companion, and third-party integrations subscribe via `RolePlaySubscriber`.

See [Interaction & Role-Play Lifecycle](interaction-lifecycle.md) for details.

### Vitality & stats

`StatsHelper` (`classes/helpers/StatsHelper.php`) calculates each profile's
vital stats (`StatTypeEnum`: vitality, arousal, stamina, essence, strength,
defense) in percent/quantity/ratio form; `RolePlayService` wraps stat changes
in a `StatInvokerInterface`-tagged pipeline that publishes `StatChangeEvent`s
and reacts to consciousness and vitality thresholds (`ConsciousEvent`,
`DeathEvent`, `CauseTypeEnum`). See [Vitality & Stats](vitality-and-stats.md).

### Reproduction chain

Fluid transfer → conception → pregnancy → birth → genetics/species inheritance is
a chain of cooperating helpers (`FluidsHelper`, `IncubatorHelper`, `OvumHelper`,
`PregnancyHelper`, `BirthHelper`, `GeneticsHelper`) and the
`OpenTransferService`. See
[Reproduction & Genetics Lifecycle](reproduction-and-genetics.md).

### Persistence & infrastructure

- **Database:** PostgreSQL via Doctrine ORM. Entities and repositories are mapped
  explicitly in `Application::doConfigure()`; metadata/query caches use a PHP-files
  adapter under `cache/`. CLI Doctrine tooling is wired through `cli-config.php`
  and `bin/`.
- **Runtime:** PHP-FPM behind nginx (see `Dockerfile`, `nginx-php.conf`,
  `php-fpm.conf`, `opcache.ini`, `supervisord.conf`); opcache is enabled for
  performance. Extensions (`xdebug`, `phpredis`) are installed with PHP
  Installer for Extensions (PIE) rather than PECL, and each required
  extension is verified individually after the build.
- **Cloud:** Deployed via `cloudbuild.yaml`; structured logs go to Google Cloud
  Logging with a per-request severity-gated logger (the log level is re-read from
  settings on every log call, not fixed when the logger is built); Pub/Sub is
  available for messaging.
- **Sessions:** PHP's own session storage (distinct from the domain `SessionModel`
  in the account → session → profile chain above) can be backed by Redis in the
  deployed container, selected via the `SESSION_STORAGE` build-trigger
  substitution. `cloudbuild.yaml` resolves the Redis host/port/URL from optional
  `_REDIS_HOST`/`_REDIS_PORT`/`_REDIS_URL` substitutions, falling back to the
  adjacent per-environment Redis container and the standard port/URL scheme when
  left blank; the password always comes from the `redis-{environment}-password`
  secret. `REDIS_PERSISTENT`/`REDIS_DRIVER`/`REDIS_PREFIX` (see `.env`) control
  persistent connections, the phpredis driver, and key prefixing.
- **Config:** Runtime settings come from the environment (database credentials,
  environment name, logging level, third-party keys). **Never** commit secrets;
  configuration specifics stay out of end-user documentation.

### Observability & metrics endpoints

Two `public/` entry scripts expose read-only operational metrics, separate
from the account/profile-driven HUD request path and unauthenticated like the
health-check:

- **`public/metrics.php`** — a Prometheus / Google Managed Service for
  Prometheus scrape endpoint. It renders a fixed set of gauges (via the shared
  framework's `MetricsHelper`) in Prometheus text-exposition format: birth
  counts split by `public`/`total` visibility, account count, active
  pregnancy count, and profile/species/item counts. It takes no query
  parameters. If collection fails it deliberately avoids emitting a
  half-written body (which would break a scraper's parser): it logs the
  error, returns HTTP 500, and emits a single `# metrics collection failed`
  comment line instead.
- **`public/fetch.metrics.php`** — a JSON metrics endpoint backed by
  `JsonMetricsHelper` (`src/classes/helpers/JsonMetricsHelper.php`). Unlike
  the Prometheus endpoint, it only performs the database work for the
  segments the caller actually asks for:
  - `defaultProviders()` maps segment names (`online`, `births`, `accounts`,
    `pregnancies`, `profiles`, `species`, `items`) to callables. Each callable
    receives a `QueryParam` (`src/classes/types/QueryParam.php`, a small
    read-only wrapper around the request's query string with
    `getParam()`/`hasParam()`/`hasParams()`/`optionalParam()`/`getParamNames()`
    accessors) so a segment can read its own filters — though none of the
    default providers currently do so.
  - A `GET` request selects segments via a `segments` query parameter, either
    comma-separated (`?segments=online,profiles`) or as an array
    (`segments[]=online&segments[]=profiles`); segment names are
    case-insensitive and de-duplicated. Omitting or emptying `segments`
    returns the list of available segment names instead of collecting
    anything.
  - An unrecognised segment name throws `InvalidMetricsSegmentsException`
    (`src/classes/exceptions/InvalidMetricsSegmentsException.php`), which
    `handle()` turns into an HTTP 400 response listing the offending
    segment(s) and the full `availableSegments` list.
  - Non-`GET`/`OPTIONS` requests get HTTP 405 with an `Allow: GET, OPTIONS`
    header; `OPTIONS` gets a bare 204. Every response carries permissive CORS
    headers and `Cache-Control: no-store` (`withCommonHeaders()`).
  - The `online` segment's shape depends on a `by` query parameter, both
    branches implemented in `HeaderRepositoryImpl`
    (`src/classes/repos/HeaderRepositoryImpl.php`):
    - By default (`by` absent or not `region`) it returns
      `{"total": <int>}`, the count of HUD headers whose `timestamp` falls
      within `Constants::DATETIME_INTERVAL_ONLINE` (`-1 hours`) of now, via
      `countOwnersAfter()`.
    - `by=region` instead returns `{"region": <int>}`, the count of headers
      in the region named by the `region` query parameter, via
      `countOwnersByRegionAfter()` — but with a hard-coded `-1000 hours`
      window instead of `Constants::DATETIME_INTERVAL_ONLINE`.
      > **Note:** the `-1000 hours` window for `by=region` looks like it
      > diverges from the default window by mistake rather than by design;
      > the code gives no indication either way. Also, `region` has no
      > default and isn't validated before being passed to
      > `countOwnersByRegionAfter()`, so requesting `by=region` without a
      > `region` value is not handled gracefully — the missing string
      > argument triggers an uncaught PHP `TypeError` (surfaced as an
      > unhandled server error) rather than a 400 response.
    - Both counts are per-header, not per-owner: neither query
      de-duplicates by owner anymore (the earlier `DISTINCT` was removed),
      so an owner with more than one attached HUD/device is counted once
      per header row.
  - `JsonMetricsHelper::collect()`/`::handle()` accept an explicit
    `providers`/`params` array, which is how the endpoint is unit-tested
    without booting `Application`.

Both scripts call `Application::doConfigure()` before doing any database
work, independent of the main HUD request path.

### Accounts, profiles, and access

An **account** (`AccountModelImpl`) represents the caller and owns one or more
**profiles** (`ProfileModelImpl`, the character aggregate); one profile is
active at a time. Roles (`AccountRoleEnum`) and permissions
(`AccountPermissionEnum`) gate privileged features (e.g. the AI companion).
See [Accounts & Profiles](account-and-profiles.md).

### Search & discovery

The main menu's "Search" button (`RunningState::dialogSearchOptions()`) offers
several scoped lookup dialogs — Region, Global, Online, Fertile, Gardens, and
Profiles — each backed by a dedicated `…SearchDialog` in `classes/prefabs/dialogs/`
and header/presence queries (`HeaderHelper`). A community-maintained directory
of public breeding-friendly locations (`SimulatorModelImpl`, `GardenHelper`) is
browsable from the Gardens scope, and `AccountBlockHelper` lets a character
exclude another from their own results. See
[Search & Discovery](search-and-discovery.md).

### Packs & groups

`PackModule` (`classes/modules/`) lets a profile create or join a small,
role-hierarchied group (`ProfilePackModelImpl` / `ProfilePackRoleModelImpl`,
roles from `ProfilePackRoleHelper`), reached from the profile menu, with
newborns inheriting their mother's pack role at birth (`InitialState`). See
[Packs & Groups](packs-and-groups.md).

### The AI role-play companion

`AiService` (`classes/services/AiService.php`) fronts a pluggable set of AI
platform adapters (`classes/ai/platforms/`) and an MCP-style tool-calling layer
(`classes/ai/mcp/tools/`), used by the `ChoiceStory` scene to narrate a
freeform, choice-driven interaction, gated by the `AI_PRIVILEGED` role. See
[The AI Role-Play Companion](ai-companion.md).

### Third-party integrations

`classes/thirdparty` and related modules integrate external services — including a
messaging bot bridge, a connected-device (Lovense) bridge, a character-profile
directory (F-List), a code-changes feed (GitHub), and Steam — plus a large
compatibility layer bridging popular third-party mesh body add-ons and gadgets
(genitals, fluid covers, reactive vocals/touch systems, mini-games) into the
same role-play event model everything else uses. These are optional and gated
per account/profile settings. See
[Third-Party Integrations & Product Compatibility](third-party-integrations.md).

### The web portal

Browser-based hand-off pages (`ui/portal.php`, `PortalService`) let a player
securely enter credentials or scan a pairing code for a third-party link
without typing them into the virtual world itself. See
[The Web Portal](web-portal.md).

### The companion web dashboard

A signed one-time token (`TokenHelper`) from the profile menu opens a
browser-based dashboard (a separate frontend, `ane-ui-nextjs`, not part of this
repository) that polls a stateless JSON API (`ApiHelper`'s segmented
dispatcher plus a set of dedicated `ApiSubscriber` helpers such as
`StatusHelper`, `SettingHelper`, `DiscoveryHelper`, `AbilityHelper`, and
`WorldPresenceHelper`) to mirror the active character's status, stats,
abilities, items, settings, and search/world-presence data in real time. See
[The Companion Web Dashboard](companion-dashboard.md).

### The store & rewards economy

`TransactionHelper` and `AccountTransactionRepositoryImpl` implement an
append-only, ledger-based Credit balance per account; `ProductHelper`/
`ProductModelImpl` back a browsable shop (`ShopDialog`, `PointStoreDialog`)
for spending Credits, and `AccountRewardsHelper`/`RewardModelImpl` implement
one-off reward grants (Credits or products) that can be claimed later via
`ManageRewardsDialog`. See [The Store & Rewards Economy](store-and-rewards.md).

### RLV-driven character & outfit control

`RlvSharedFoldersModule` (`classes/modules/`) maps a profile's current
outfit, base body, and abdomen size onto a fixed viewer-side shared-folder
convention, and issues batched attach/detach commands through the shared
framework's `RlvService` to automate dressing, undressing, outfit switching,
and protecting the companion/body from accidental removal during scenes. See
[RLV-Driven Character & Outfit Control](rlv-and-control.md).

### Command-line interaction

A decentralized chat-command bus (`CommandLineService`/`CommandLineSubscriber`
in the shared framework) lets modules, plugins, and services each claim the
`/ane <command>` chat commands relevant to them (`CommandLineModule`,
`RlvSharedFoldersModule`, `RolePlayerPlugin`, `TelegramModule`, …), with a
parallel `CommandHelpService` bus for `/ane help <topic>`. See
[Command-Line Interaction](command-line-tooling.md).

### Testing

- `tests/unit` — PHPUnit test suite (`composer test:unit`, configured via
  `phpunit.xml.dist`) for isolated, dependency-free logic such as value types
  and pure helpers.
- `tests/integration` — integration tests for helpers, services, and stories,
  including AI role-play runs (`composer test:integration:ai` →
  `tests/integration/run.php`).
- `tests/e2e` — end-to-end cases and support harness (`composer test:e2e`)
  driving full request/response cycles through `Application::handle()`.
- `composer test` runs the full suite.

### Where to go next

- Core gameplay loop → [Interaction & Role-Play Lifecycle](interaction-lifecycle.md)
- Health, arousal, stamina, and other vitals → [Vitality & Stats](vitality-and-stats.md)
- The reproductive life-cycle → [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md)
- Species math and creation → [Species Compatibility](species-compatibility.md),
  [Creating a Species](species-creation.md)
- Shapeshifting biology → [Form Shapeshifters](form-shapeshifters.md)
- Consumable items and attachable devices → [Attachable Items & Devices](attachable-items-and-devices.md)
- Accounts, characters, and access → [Accounts & Profiles](account-and-profiles.md)
- Forming a named group with roles and invites → [Packs & Groups](packs-and-groups.md)
- Finding other characters and breeding locations → [Search & Discovery](search-and-discovery.md)
- The optional AI narrator → [The AI Role-Play Companion](ai-companion.md)
- External services and third-party product compatibility → [Third-Party Integrations & Product Compatibility](third-party-integrations.md)
- Secure browser hand-off for linking accounts → [The Web Portal](web-portal.md)
- Live status dashboard for your character → [The Companion Web Dashboard](companion-dashboard.md)
- Spending and earning Credits → [The Store & Rewards Economy](store-and-rewards.md)
- Automated outfit/body attachment → [RLV-Driven Character & Outfit Control](rlv-and-control.md)
- Typed chat-command shortcuts → [Command-Line Interaction](command-line-tooling.md)
- The community group, manual, Discord, changelog, updates, and language → [Help & Support Menu](help-and-support.md)
