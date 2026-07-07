# Attachable Items & Devices

How consumable items (pills, potions, fluid containers, and similar objects) and
attachable plugins/devices (extractors, ovipositors, connected hardware, and
similar add-ons) extend the companion.

- **🎮 End-User Documentation** — what items and add-ons do and how you use them.
- **🧑‍💻 Developer Documentation** — how they are implemented and how to add new
  ones.

---

## 🎮 End-User Documentation

### Items

Items are small in-world objects you can rez, wear, or hand to someone that add a
one-off or limited-use effect. Typical items include:

- **Fertility Pills** / **Plan B Pills** — temporarily raise or lower your
  fertility for a limited number of uses.
- **Condom Pak** — a supply of protection against conception, used up as it is
  worn.
- **Fluid Bottle** — captures a sample of a fluid so it can be stored, given to
  someone else, or used later.
- **Ovum Ampoule** — carries a stored egg cell for later use, such as assisted
  conception.
- **Paternity Tester** — checks parentage between a child and a candidate parent.
- **Poison Apple** — a novelty consumable with a harmful in-character effect.
- **Transformation Potion** — a novelty consumable that changes appearance for a
  time.
- **Name Change** — lets you rename your character.
- **Egg** — represents an egg laid during an egg-laying scene; it can hatch into
  a birth later.

Each item has a limited number of uses or a quantity that goes down as you use
it, and most open their own small menu when touched.

### Attachable devices and toys

Beyond the companion itself, you can attach optional add-ons that react to what
is happening during a scene and add their own menu:

- **Extractors** (for example a nectar or spunk extractor) — capture a
  character's fluids into a container while active in a scene.
- **Ovipositor** / **Oviposition** add-ons — let egg-laying happen as part of a
  scene and produce **Egg** items.
- **Ovum Exchanger** — a device that lets ovum (egg cells) be exchanged between
  two characters directly, outside of a full scene.
- **Role Player** — an add-on that focuses on narration and role-play flavour
  around scenes rather than mechanical effects.
- **Kiss Arousal** — a small effect add-on that raises arousal from a kiss-style
  interaction.
- Connected/projectile-style devices — hardware toys or "shooter" props that
  inject or extract fluids from a distance rather than through direct touch.
- Third-party connected toys (see the companion's settings) can also react to
  scenes in real time, buzzing in sync with in-character events.

Add-ons are optional: you choose which ones to wear or attach, and each adds its
own menu button alongside your regular companion menu. Some effects (such as
lingering weakness from a harmful potion, or a "bio" style device applying a
slow-changing effect over time) apply gradually and wear off or complete after a
set duration.

---

## 🧑‍💻 Developer Documentation

### Items

Items live in `src/classes/items/` and extend `NueKryL\classes\items\AbstractItemObject`
(the shared framework's item base) through one of these domain base classes:

| Base class | Behaviour |
|---|---|
| `AbstractItemObjectTypeConsumable` | One-shot use; tracks a boolean `consumed` flag and calls `doPurge()` after `doConsume()`. |
| `AbstractItemObjectTypeLimitedConsumable` | Tracks a `consume` counter against a `maximum`; used for multi-charge packs (e.g. pill packs). |
| `AbstractItemObjectTypeQuantityConsumable` | Tracks a `quantity`/`maximum` pair for stackable consumables. |
| `AbstractItemObjectTypeTransaction` | Tracks an `amount`, driven through a `DialogTextbox`; used for store/vendor-style items. |
| `AbstractItemObjectTypePoison` / `AbstractItemObjectTypePotion` | Consumables that display a short-lived message dialog (`getName()` returns `'Potion'`) and are gated by `InitialState::isState()`. |
| `AbstractItemFluidTypeContainer` (extends `NueKryL\classes\items\AbstractItemFluidTypeContainer`) | Adds an `enabled` flag and rendering via `RenderHelper`; shared by fluid-holding items. |
| `AbstractMonitoredItemObject` | Implements `InteractionSubscriber` and self-subscribes to `InteractionService` on attach, so an item can react to nearby interaction events. |

Concrete item classes (`ItemObjectPillFertility`, `ItemObjectPillContraception`,
`ItemObjectCondoms`, `ItemObjectFluidContainer`, `ItemObjectRifleFluidContainer`,
`ItemObjectOvumAmpoule`, `ItemObjectPaternityTester`, `ItemObjectPoisonApple`,
`ItemObjectPotionTransformation`, `ItemObjectProfileRename`, `ItemObjectBirthEgg`,
`ItemObjectConferrable`, `ItemObjectDeliverable`, `ItemObjectFluidSyringe`) each
declare `getVersion()`, `getType()`, `getName()`, `canUse()`, and a
`useDialog(...)`/`*_render(...)`/`*_dialog(...)` chain built from
`DialogButtons`/`DialogButtonsDynamic`/`DialogConfirm` (the same dialog primitives
used by states and stories).

Items are wired into the runtime in `Application::doInitialize()` via
`ItemService::setItemClasses(...)`, and the in-world item action channel is
registered with `self::mapAction(ItemObjectInteract::class, 'AnE.items')` /
`ItemObjectMonitor::class`. Only classes passed to `setItemClasses(...)` are
resolvable at runtime; as of this writing `ItemObjectFluidSyringe` and
`ItemObjectDeliverable` exist in the codebase but are **not** included in that
list, so they are not currently reachable in production — flag this before
relying on them.

### Plugins and devices

Attachable add-ons live in `src/classes/plugins/` (plus the `external/`,
`fullarray/`, and `projectile/` subfolders) and extend `AbstractAnePlugin`
(itself extending the shared framework's `AbstractPlugin`), or the thin
`AbstractDevicePlugin` marker subclass for hardware-like devices:

- `AbstractAnePlugin` maps the `AnE.comms` action channel, subscribes to
  `RolePlayService` on `on_plugin_attached()` / unsubscribes on
  `on_plugin_detached()`, and provides a standard dynamic `useDialog()` built
  from `DialogButtonsDynamic` and the plugin's `getShortName()` as a label.
  Subclasses implement `RolePlaySubscriber::on_roleplay_event(...)` and can
  override `onDialog(...)` to add custom buttons.
- `AbstractExtractorPlugin` additionally implements `RlvSubscriber` and is the
  base for fluid-capturing add-ons.

Notable concrete plugins/devices:

| Class | `getShortName()` | Role |
|---|---|---|
| `NectarExtractorPlugin` | Nectar Extractor | Extends `AbstractExtractorPlugin`; captures nectar-type fluid during penetration events. |
| `SpunkExtractorPlugin` | (extractor) | Same pattern for semen-type fluid; present in code but **commented out** of the plugin factory in `Application::doInitialize()`, so not currently attachable. |
| `OvipositionPlugin` | Oviposition | Drives egg-laying via `BirthHelper`, producing `ItemObjectBirthEgg` items and `BirthEvent`s. |
| `OvipositorPlugin` | Ovipositor | Companion add-on for the oviposition flow. |
| `OvumExchangeDevice` | Ovum Exchanger | Extends `AbstractDevicePlugin`, implements `InteractionSubscriber`; exchanges ovum directly between two profiles via `OvumHelper`/`PregnancyHelper`. |
| `GenitalsControllerPlugin` | Kiss Arousal | Raises arousal stats from kiss-style interactions. |
| `RolePlayerPlugin` | Role Player | Narration/role-play-flavour add-on reacting to a broad set of role-play events. |
| `ItsNotMinePlugin` | `It's Not Mine` Plugin | Implements `OpenTransferSubscriber`; alters paternity/attribution behaviour on fluid transfer. |
| `NaniteTesiPlugin` | (Nanite-Systems TESI integration) | Implements `OpenTransferSubscriber`; bridges to the third-party Nanite Systems TESI protocol. |
| `SexRifleDevice` | (rifle device) | Uses `FluidContainerTrait`; a projectile-style fluid device. |
| `external/ProjectArousalPlugin` | Project Arousal 1/2 | Bridges to the third-party "Project Arousal" HUD/attachment. |
| `fullarray/FullArrayPlugin` | (full-array outfit controller) | Tracks outfit/genital visibility state and reacts to `AbilityShiftEvent`/penetration events for full-array-style avatars. |
| `projectile/ExtractorProjectileDevice`, `projectile/InjectorProjectileDevice` | (projectile devices) | Concrete handles (`device.projectile.extractor`, `device.projectile.injector`) over `AbstractFluidExtractorProjectileDevice` / `AbstractFluidInjectorProjectileDevice`. |

Devices are resolved by handle through a factory closure registered with
`PluginService::onCreatePlugin(...)` in `Application::doInitialize()`, mapping
each `getHandle()` to its class. Only plugins registered in that closure are
attachable at runtime (see the commented-out `SpunkExtractorPlugin` line as an
example of a defined-but-inactive plugin).

### Timed effects (modifiers)

Longer-running, gradually-applied effects (as opposed to instantaneous item use)
are implemented as **modifiers** in `src/classes/modifiers/`, extending
`AbstractProfileModifier` / `AbstractStatProfileModifier` /
`AbstractAgingProfileModifier`: `IncreasedAgingProfileModifier`,
`PoisonVitalityProfileModifier`, `BioBugDeviceProfileModifier`, and
`BioBugRemoteProfileModifier`. These are persisted per-profile via
`ProfileModifierModelImpl`/`ProfileModifierRepositoryImpl` and progressed by
`ProfileModifierService`.

### Extension points

- **New item:** add a class under `src/classes/items/` extending the
  appropriate `AbstractItemObjectType*` base, then register it in
  `ItemService::setItemClasses(...)` inside `Application::doInitialize()`.
- **New plugin/device:** add a class under `src/classes/plugins/` extending
  `AbstractAnePlugin` (or `AbstractDevicePlugin`), implement
  `on_roleplay_event(...)`, give it a `getHandle()`, and register it in the
  `PluginService::onCreatePlugin(...)` factory closure.
- **New timed effect:** add a class under `src/classes/modifiers/` extending
  `AbstractProfileModifier` (or a more specific base) and apply it through
  `ProfileModifierService`.

See [System Design](system-design.md) for how items and plugins fit into the
overall layered architecture, and
[Interaction & Role-Play Lifecycle](interaction-lifecycle.md) for how add-ons
participate in an active scene.
