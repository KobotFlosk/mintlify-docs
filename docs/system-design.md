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
  metrics, SQL, opcache, and updater endpoints.
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
| **Helpers** | `classes/helpers` | Stateless domain logic and queries (~57 helpers): profiles, species, genetics, fluids, pregnancy, birth, ovum, incubators, compatibility, attachments, transactions, etc. |
| **Models** | `classes/models` + `interfaces/models` | Doctrine entities (interface + `…Impl`) for accounts, profiles, species, births, pregnancies, fluids, ovum, items, plugins, sessions, and more. |
| **Repositories** | `classes/repos` | Doctrine repositories; persistence and queries per aggregate, mapped in `Application`. |
| **Plugins / Devices** | `classes/plugins` | Attachable add-ons (`AbstractAnePlugin`) and hardware-like devices (`AbstractDevicePlugin`) that hook role-play events and add menus. See [Attachable Items and Devices](attachable-items-and-devices.md). |
| **Items** | `classes/items` | Consumables and objects (pills, condoms, syringes, ampoules, potions, testers). Registered via `ItemService::setItemClasses(...)`. See [Attachable Items and Devices](attachable-items-and-devices.md). |
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

### Interaction and events

Two request-driven mechanisms connect the pieces:

- **The API/event bus.** Many helpers and services implement `ApiSubscriber` and
  react to `ApiEvent`s, letting subsystems observe profile/fluid/ovum changes
  without hard coupling.
- **Role-play events.** During scenes, stories publish `AbstractRolePlayEvent`s
  (e.g. `ClimaxEvent`, `PenetrationEvent`, `StatChangeEvent`). Plugins, the AI
  companion, and third-party integrations subscribe via `RolePlaySubscriber`.

See [Interaction and Role-Play Lifecycle](interaction-lifecycle.md) for details.

### Reproduction chain

Fluid transfer → conception → pregnancy → birth → genetics/species inheritance is
a chain of cooperating helpers (`FluidsHelper`, `IncubatorHelper`, `OvumHelper`,
`PregnancyHelper`, `BirthHelper`, `GeneticsHelper`) and the
`OpenTransferService`. See
[Reproduction and Genetics Lifecycle](reproduction-and-genetics.md).

### Persistence and infrastructure

- **Database:** PostgreSQL via Doctrine ORM. Entities and repositories are mapped
  explicitly in `Application::doConfigure()`; metadata/query caches use a PHP-files
  adapter under `cache/`. CLI Doctrine tooling is wired through `cli-config.php`
  and `bin/`.
- **Runtime:** PHP-FPM behind nginx (see `Dockerfile`, `nginx-php.conf`,
  `php-fpm.conf`, `opcache.ini`, `supervisord.conf`); opcache is enabled for
  performance.
- **Cloud:** Deployed via `cloudbuild.yaml`; structured logs go to Google Cloud
  Logging with a per-request severity-gated logger; Pub/Sub is available for
  messaging.
- **Config:** Runtime settings come from the environment (database credentials,
  environment name, logging level, third-party keys). **Never** commit secrets;
  configuration specifics stay out of end-user documentation.

### Accounts, profiles, and access

An **account** (`AccountModelImpl`) represents the caller and owns one or more
**profiles** (`ProfileModelImpl`, the character aggregate); one profile is
active at a time. Roles (`AccountRoleEnum`) and permissions
(`AccountPermissionEnum`) gate privileged features (e.g. the AI companion).
See [Accounts and Profiles](account-and-profiles.md).

### Packs and groups

`PackModule` (`classes/modules/`) lets a profile create or join a small,
role-hierarchied group (`ProfilePackModelImpl` / `ProfilePackRoleModelImpl`,
roles from `ProfilePackRoleHelper`), reached from the profile menu, with
newborns inheriting their mother's pack role at birth (`InitialState`). See
[Packs and Groups](packs-and-groups.md).

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
[Third-Party Integrations and Product Compatibility](third-party-integrations.md).

### The web portal

Browser-based hand-off pages (`ui/portal.php`, `PortalService`) let a player
securely enter credentials or scan a pairing code for a third-party link
without typing them into the virtual world itself. See
[The Web Portal](web-portal.md).

### The store and rewards economy

`TransactionHelper` and `AccountTransactionRepositoryImpl` implement an
append-only, ledger-based Credit balance per account; `ProductHelper`/
`ProductModelImpl` back a browsable shop (`ShopDialog`, `PointStoreDialog`)
for spending Credits, and `AccountRewardsHelper`/`RewardModelImpl` implement
one-off reward grants (Credits or products) that can be claimed later via
`ManageRewardsDialog`. See [The Store and Rewards Economy](store-and-rewards.md).

### RLV-driven character and outfit control

`RlvSharedFoldersModule` (`classes/modules/`) maps a profile's current
outfit, base body, and abdomen size onto a fixed viewer-side shared-folder
convention, and issues batched attach/detach commands through the shared
framework's `RlvService` to automate dressing, undressing, outfit switching,
and protecting the companion/body from accidental removal during scenes. See
[RLV-Driven Character and Outfit Control](rlv-and-control.md).

### Command-line interaction

A decentralized chat-command bus (`CommandLineService`/`CommandLineSubscriber`
in the shared framework) lets modules, plugins, and services each claim the
`/ane <command>` chat commands relevant to them (`CommandLineModule`,
`RlvSharedFoldersModule`, `RolePlayerPlugin`, `TelegramModule`, …), with a
parallel `CommandHelpService` bus for `/ane help <topic>`. See
[Command-Line Interaction](command-line-tooling.md).

### Testing

- `tests/e2e` — end-to-end cases and support harness.
- `tests/integration` — integration tests for helpers, services, and stories,
  including AI role-play runs (`composer test:integration:ai` →
  `tests/integration/run.php`).

### Where to go next

- Core gameplay loop → [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)
- The reproductive life-cycle → [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md)
- Species math and creation → [Species Compatibility](species-compatibility.md),
  [Creating a Species](species-creation.md)
- Shapeshifting biology → [Form Shapeshifters](form-shapeshifters.md)
- Consumable items and attachable devices → [Attachable Items and Devices](attachable-items-and-devices.md)
- Accounts, characters, and access → [Accounts and Profiles](account-and-profiles.md)
- Forming a named group with roles and invites → [Packs and Groups](packs-and-groups.md)
- The optional AI narrator → [The AI Role-Play Companion](ai-companion.md)
- External services and third-party product compatibility → [Third-Party Integrations and Product Compatibility](third-party-integrations.md)
- Secure browser hand-off for linking accounts → [The Web Portal](web-portal.md)
- Spending and earning Credits → [The Store and Rewards Economy](store-and-rewards.md)
- Automated outfit/body attachment → [RLV-Driven Character and Outfit Control](rlv-and-control.md)
- Typed chat-command shortcuts → [Command-Line Interaction](command-line-tooling.md)
