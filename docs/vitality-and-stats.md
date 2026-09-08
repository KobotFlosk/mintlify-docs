# Vitality and Stats

The set of vital statistics every character has — health, arousal, stamina,
essence, strength, and defense — how they rise and fall during play, and what
happens when one of them bottoms out (unconsciousness, death, and its causes).

- **🎮 End-User Documentation** — what your vitals mean and how they behave.
- **🧑‍💻 Developer Documentation** — how stats are modelled, calculated, and
  changed, and how the death/cause system works.

---

## 🎮 End-User Documentation

### What it is

Every character tracked by the companion has a small set of **vitals** that
shift as you play:

- **Health** — your overall physical condition. It recovers slowly on its own
  and is reduced by harmful things (overexertion, poison, a rough birth). If it
  runs out entirely, your character dies and you're returned to character
  selection to create or switch to another one.
- **Arousal** — builds up during intimate scenes and eventually leads to a
  climax, voluntary or otherwise.
- **Stamina** — your energy for staying active and alert. If it drops too low
  you become **unconscious** and temporarily unable to act or defend yourself,
  though you recover given time and rest.
- **Essence** — the fertility-related fluid resource produced by your body,
  which is spent and replenished as part of intimate scenes and reproduction.
- **Strength** and **Defense** — how capable you are of acting on, and
  resisting, someone else during a scene. Being weak or undefended can mean
  advances you'd normally be able to refuse go through anyway.

### How you use it

You don't manage vitals directly with a dial or a form — they move on their
own as a natural consequence of what your character does and what happens to
them:

- Being active in a scene raises arousal and drains stamina and defense a
  little at a time; resting lets stamina, strength, and defense recover.
  Climaxing gives a small health boost but costs arousal.
  Giving birth costs some health, more so for a tighter fit.
- If your stamina falls too low, you'll be told you've become unconscious;
  wait and rest to recover it.
  Weakness or reduced defense can be *fun* to lean into narratively, or you can
  simply rest until you're ready again.
- If your health is ever fully depleted — from a harmful item, an accident, or
  some other in-character cause — your character passes away. This ends that
  character permanently; you'll want to switch to (or create) another one
  afterwards, and the way your character died may be shown as their in-world
  cause of passing.
- Some optional add-ons and consumable items (see
  [Attachable Items and Devices](attachable-items-and-devices.md)) exist purely
  to affect your vitals — a novelty poison item, for instance, is a
  guaranteed way to end that character's life if consumed.

Vitals are yours alone; they aren't a competitive resource to take from other
players, though someone else's actions during a shared scene (like a birth,
or a rough encounter) can certainly affect yours.

---

## 🧑‍💻 Developer Documentation

### The vocabulary: `StatTypeEnum`

`StatTypeEnum` (`src/classes/enums/StatTypeEnum.php`) is the fixed list of
trackable stats: `VITALITY` (health), `STRENGTH`, `DEFENSE`, `AROUSAL`,
`ESSENCE`, `STAMINA`. Every stat is expressed in three interchangeable forms,
via the shared framework's `MetricTypeEnum`:

- **`PERCENT`** — a `0.0`–`1.0` fraction of the stat's current maximum. This is
  the canonical, persisted representation.
- **`QUANTITY`** — an absolute unit amount, derived from percent times a
  calculated maximum (see below).
- **`RATIO`** — a profile-level multiplier applied on top of the species'
  baseline quantity for that stat (used to give an individual character a
  bigger/smaller max than their species' default, e.g. from growth).

### `StatsHelper` — reading and changing a stat

`StatsHelper` (`src/classes/helpers/StatsHelper.php`) is the calculation layer
behind every stat read/write. Values are persisted per-profile
(`ProfileStatsModelImpl`) and per-species baseline (`SpeciesStatsModelImpl`);
`StatsHelper` combines the two:

- `calcStatQuantity(StatTypeEnum)` — the *effective maximum* for a stat:
  `profileQuantity + (profileRatio * speciesQuantity)`. This is what percent is
  measured against.
- `fetchStatByPercent(...)` / `fetchStatByQuantity(...)` / `fetchStatBy(..., MetricTypeEnum)`
  — read the current value in the given form.
- `defineStatBy(...)` — set a stat to an **absolute** value (bounded to
  `0.0`–`1.0` in percent terms).
- `adjustStatBy(...)` — change a stat by a **relative** amount (add/subtract
  from the current value), still bounded to `0.0`–`1.0`.
- `affectStatBy(...)` — change a stat by a relative amount *scaled toward
  whichever bound it's heading for* (`affectByPercent()`): a positive affect
  shrinks as the stat nears its maximum, a negative affect shrinks as it nears
  zero. This is used for effects that should have diminishing impact near the
  extremes (e.g. birth strain, poison) rather than a flat add/subtract.
- `calcProfileEssenceUnits(...)` / `calcExpectedEssenceUnits(...)` /
  `calcProfileEssencePercent(...)` — essence is additionally scaled against a
  profile's uterus/incubator volume and a gender ratio
  (`calcGenderEssenceRatioOf(...)`) to translate the abstract percent into a
  concrete fluid-volume unit used elsewhere in reproduction (see
  [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md)).

### `StatInvokerInterface` — who changed a stat, and why

Callers never adjust a stat with a bare number; they pass a `StatInvokerInterface`
(`src/interfaces/modifiers/stats/`), typically an anonymous `readonly class`
extending the concrete `StatInvoker` value object
(`src/classes/types/StatInvoker.php`) and implementing the stat-specific marker
interface (`VitalityStatInvokerInterface`, `ArousalStatInvokerInterface`,
`StrengthStatInvokerInterface`, `DefenseStatInvokerInterface`,
`EssenceStatInvokerInterface`, `ConsciousStatInvokerInterface` for stamina).
A `StatInvoker` carries the `StatTypeEnum`, the `MetricTypeEnum`, the amount,
and a `CauseTypeEnum` (defaulting to `CAUSE_UNKNOWN`) that records *why* the
change happened.

### `RolePlayService` — the stat-change pipeline

`RolePlayService::defineStatBy(...)` / `adjustStatBy(...)` / `affectStatBy(...)`
(`src/classes/services/RolePlayService.php`) wrap the equivalent `StatsHelper`
calls with the rest of the pipeline every stat change goes through:

1. Guarded by `loopGuard(...)` (keyed per stat) to prevent runaway recursive
   adjustments from subscriber reactions to the resulting event.
2. Reads the stat's percent before and after the change.
3. Publishes a `StatChangeEvent` (`src/classes/events/StatChangeEvent.php`) —
   carrying the originating `StatInvokerInterface`, the new percent, the
   previous percent, the delta, and the raw amount — to every
   `RolePlaySubscriber` (states, active stories, attachments, third-party
   integrations; see
   [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)).

`RolePlayService::handleStatChange(...)` is itself a subscriber to its own
`StatChangeEvent`s and layers in the domain reactions:

- **Arousal rising** reduces defense proportionally (`change * -1.5`) and
  cancels any in-progress climax cooldown; if involuntary climax is enabled
  (gated by the `roleplay.involuntary.climax` setting and excluded for the
  synthetic character class) and arousal crosses a randomised threshold, it
  triggers a climax automatically. Rising arousal above `10%` also slowly
  drains essence.
- **Vitality reaching (effectively) zero** (`< 0.001`) publishes a `DeathEvent`
  carrying the triggering `CauseTypeEnum`.

Separately, `RolePlayService::on_system_ping()` applies small periodic
regeneration/decay to defense, strength, and stamina (consciousness) on every
scene tick, and `handleClimax(...)` / `handleBirth(...)` apply the
climax/birth-specific vitality and arousal effects described in the end-user
section above (birth strain is computed from `ProfileHelper::calcOrificeStretchFactor(...)`
scaled per orifice, capped between `10%` and `80%`).

### Consciousness and defensibility

- `RolePlayService::isConscious(...)` — stamina percent at or above the
  `roleplay.conscious` setting (default `0.25`).
- `RolePlayService::hasDefense(...)` / `hasStrength(...)` — defense/strength
  percent at or above their own settings (`roleplay.defense`,
  `roleplay.strength`, both default `0.25`).
- `RolePlayService::isDefensible(...)` — all three of the above; stories use
  this to decide whether a character can refuse or resist an advance versus
  having it happen regardless (RolePlayService announces the transition with
  an in-character "*is seeming vulnerable...*" line the first time a
  character stops being defensible).
- `ConsciousEvent` (`src/classes/events/ConsciousEvent.php`) carries a plain
  `isConscious(): bool` and is published by story logic (`AbstractBaseStory`)
  around consciousness transitions during a scene.

### Death and causes

- `CauseTypeEnum` (`src/classes/enums/CauseTypeEnum.php`) enumerates *why* a
  harmful stat change happened: `CAUSE_UNKNOWN`, `CAUSE_CUSTOM`,
  `CAUSE_ORIFICE_OVERSTRETCH`, `CAUSE_UTERUS_OVERLOAD`, `CAUSE_POISON`,
  `CAUSE_TIE_FORCED_END`. `toValue()`/`toLabel()` map most cases to a
  human-readable phrase (others fall back to `'Unknown'`).
- `DeathEvent` (`src/classes/events/DeathEvent.php`) carries the triggering
  `CauseTypeEnum` and is published by `RolePlayService` when vitality bottoms
  out (see above).
- `RolePlayService::handleDeath(...)` persists a `ProfileDeathModelImpl`
  (`pd_profile_id`, `pd_cause`, `pd_reason`, `pd_timestamp`) row, gives the
  active state/story a last chance to react via `on_roleplay_event(...)`
  (needed because the ordinary subscriber dispatch order would otherwise miss
  it — the character is torn down immediately after), then calls
  `CharacterHelper::leaveCurrentCharacter(...)`, which deactivates the profile,
  announces the cause via `CommOwnerSay`, and transitions back to
  `InitialState` for character selection/creation.
- `ItemObjectPoisonApple` (`src/classes/items/`, see
  [Attachable Items and Devices](attachable-items-and-devices.md)) is a concrete
  example: consuming it calls `adjustStatBy(...)` with a `-1` (i.e. full)
  vitality change tagged `CAUSE_POISON`.

### Timed modifiers

Longer-running effects on a profile's stats are represented as **modifiers**
(`src/classes/modifiers/`), persisted per-profile via
`ProfileModifierModelImpl`/`ProfileModifierRepositoryImpl` and progressed
through `ProfileModifierService` (`withModifier(...)`, `hasModifier(...)`,
`filterModifiers(...)`). `AbstractProfileModifier` is the base (creation
timestamp, serialization, lifecycle hooks); `AbstractStatProfileModifier`
adds a floating-point `amount` for stat-affecting modifiers, and
`AbstractAgingProfileModifier` adds a growth `rate` and
`calcGrowthPercentByDuration(...)` for age/growth-affecting modifiers. Concrete
examples: `PoisonVitalityProfileModifier` (strength-affecting, tagged
`CAUSE_POISON`), `IncreasedAgingProfileModifier`, `BioBugDeviceProfileModifier`,
and `BioBugRemoteProfileModifier`. See
[Attachable Items and Devices](attachable-items-and-devices.md#timed-effects-modifiers)
for how modifiers relate to items/devices; note some of these classes are
scaffolded extension points with their `update()` step not yet fully wired to
a live effect.

### The AI companion and stats

`StatsFetchTool` / `StatsApplyTool` (`src/classes/ai/mcp/tools/`, both via the
shared `AbstractStatsTool` base) let the optional AI narrator read and apply
stat changes through the same `StatInvokerInterface`/`RolePlayService` pipeline
described above, so AI-driven scenes affect vitals exactly like menu-driven
ones. See [The AI Role-Play Companion](ai-companion.md).

### Extension points

- **New stat:** add a case to `StatTypeEnum`, a matching marker interface
  under `src/interfaces/modifiers/stats/`, and a `match` arm wherever a
  concrete `StatInvokerInterface` is constructed for it (e.g.
  `AbstractStatsTool::createStatInvoker(...)`).
- **New death cause:** add a case to `CauseTypeEnum` (and a `toValue()`/`toLabel()`
  arm if it needs a human-readable phrase), then tag the relevant
  `StatInvokerInterface`'s `getCause()` with it.
- **New timed modifier:** add a class under `src/classes/modifiers/` extending
  `AbstractProfileModifier` (or a more specific base) and apply/query it
  through `ProfileModifierService`.

See [System Design](system-design.md) for how this fits into the overall
architecture, [Interaction and Role-Play Lifecycle](interaction-lifecycle.md) for
the broader role-play event system stat changes are part of, and
[Reproduction and Genetics Lifecycle](reproduction-and-genetics.md) for how
essence specifically feeds into fluid exchange and conception.
