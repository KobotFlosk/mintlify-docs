# Interaction & Role-Play Lifecycle

How the companion comes to life, how shared intimate scenes are driven, and how
role-play events flow through the system.

- **🎮 End-User Documentation** — how scenes are experienced.
- **🧑‍💻 Developer Documentation** — how they are implemented.

---

## 🎮 End-User Documentation

### Waking up and the main menu

When you attach the companion it "wakes up" and, if this is your first time, walks
you through creating a character. After that, touching it opens an interactive
menu where you reach your profile, settings, searches, the store, help, and any
add-ons you own. Between actions it sits in a calm, idle mode, quietly keeping
your character's biology and stats up to date.

### Starting a scene with a partner

When another user of the system is nearby, you can begin a shared scene together.
The companion looks at **both** characters — their bodies, forms, and the personal
limits each of you set — and only offers actions that make sense for the two of
you. Scenes are organised into kinds of intimacy (for example oral, penetrative,
breeding, and egg-laying), each with its own set of moves.

### During a scene

- You pick moves from a menu; your partner sees and responds to what happens.
- Actions affect your **stats** — arousal builds, stamina drains, and so on.
- Reaching a climax can transfer **fluids** between characters, which is what makes
  conception possible (see
  [Reproduction & Genetics](reproduction-and-genetics.md)).
- If you have add-on devices or an AI companion enabled, they react in real time —
  narrating, buzzing a connected toy, or triggering special effects.
- You can stop at any time; consent and your personal limits are always respected,
  and the scene ends cleanly, returning you to the idle mode.

### Your limits are always in charge

Everything offered during a scene is filtered by your body and by the content
limits you configure. If something isn't possible or isn't allowed for your
character, it simply won't be offered.

---

## 🧑‍💻 Developer Documentation

### The state loop

Interaction is governed by the state machine in `src/classes/states/` (summarised
in [System Design](system-design.md)):

```
InitialState ──▶ RunningState ──▶ CopulateState ──▶ RunningState
   (onboarding,     (idle: watch      (active scene)   (back to idle)
    menu, admin)     for partners
                     & birth)     └──▶ BirthingState ──▶ RunningState
```

- **`RunningState`** is the idle heartbeat. It scans for nearby eligible partners
  and for birth readiness, and calls `self::nextState(new CopulateState())` or
  `new BirthingState()` when appropriate.
- **`CopulateState`** (the largest state, `src/classes/states/CopulateState.php`)
  owns an active scene: it selects and renders the current **story**, applies its
  actions, publishes role-play events, and returns to `RunningState` when the
  scene ends.
- **`AbstractAneState`** provides shared menu scaffolding, transitions
  (`nextState`), and a default `on_roleplay_event` hook.

### Stories = intimate scenes

Each kind of scene is a **story** in `src/classes/stories/`, implementing
`StoryInterface` (which extends the role-play subscriber contract) and typically
extending `AbstractBaseStory`:

| Story | Purpose |
|---|---|
| `StoryOral` | Oral interaction. |
| `StoryAnal` | Anal interaction. |
| `StoryBreed` | Penetrative/breeding interaction (mount, straddle, ride, knot, climax, …). |
| `StoryOviposit` | Egg-laying interaction. |
| `StoryClimax` | Climax resolution and fluid emission. |
| `ChoiceStory` | Branching/choice-driven flow. |
| `AbstractBaseStory` | Shared scene machinery: eligibility, action constants, dialog building, event publishing. |

A story exposes a label (`getLabel()`), a set of action constants (e.g.
`StoryBreed::ACTION_THRUST_INTO`, `ACTION_KNOT`, `ACTION_CLIMAX`), touch handling
(`on_event_touch()`), resist handling (`on_attempt_resist(bool)`), and reacts to
events via `on_roleplay_event(...)`.

### Eligibility gating

What a story offers is filtered by **who the two profiles are**:

- **Apparent form** gates participation — which roles, orifices, and stimulators
  are offered — via `ProfileModel::getApparentGender()` /
  `ProfileHelper::resolveApparentGender()`.
- **Real biology** gates production and reception (what a body emits, where a
  deposit lands). See [Form Shapeshifters](form-shapeshifters.md) for the
  apparent-vs-real split.
- **Personal limits** are read from profile settings (`ProfileSettingHelper`) and,
  where configured, an external kink directory (F-List) module.
- Orifices/stimulators in play are tracked on the copulation aggregate via
  `ProfileCopulationHelper` and `ProfileCopulationModelImpl`.

Stories raise story-specific exceptions (e.g. `OrificeReceiveException`,
`StoryCriteriaException`, `StoryStateException`) when an attempted action is not
valid for the current bodies/state.

### Role-play events

During a scene, stories and states publish `AbstractRolePlayEvent` subclasses from
`src/classes/events/`:

| Event | Fired when |
|---|---|
| `PenetrationEvent`, `OrificePenetratedQueryEvent`, `StimulatorPenetratedQueryEvent` | Penetration occurs or is queried. |
| `ClimaxEvent` | A character climaxes (drives fluid emission). |
| `StatChangeEvent` | A stat (arousal, stamina, …) changes. |
| `ConsciousEvent`, `DeathEvent` | Consciousness/vitality thresholds crossed. |
| `PregnancyConceiveEvent`, `PregnancyLaboringEvent`, `BirthEvent` | Reproductive milestones. |
| `AbilityShiftEvent` | A shapeshift ability toggles. |

Subscribers implement `on_roleplay_event(AbstractRolePlayEvent $event)` via the
`RolePlaySubscriber` contract. Subscribers include the active state, the current
story, attached plugins/devices (`AbstractAnePlugin`), and integration modules
(e.g. `LovenseModule`). `RolePlayService` (`src/classes/services/`) coordinates
dispatch and the optional AI companion.

### Routing output between characters

A scene involves two accounts on two separate in-world objects. `InteractionService`
routes messages between them:

- `listen_actionable(...)` turns inbound region chat into actions.
- `outputTarget(...)`, `outputRegion(...)`, `outputNearby(...)` push a
  `ValueObject`/array payload to a specific partner, the region, or nearby
  listeners.

Fluid/ovum exchange between the two sides is mediated by `OpenTransferService`
(hooks such as `on_transfer_fluids`, `on_received_fluids`, `on_transfer_ovum`,
`on_received_ovum`), which hands off to the reproduction chain documented in
[Reproduction & Genetics](reproduction-and-genetics.md).

### Add-ons participate in scenes

Attachable **plugins** and **devices** (`AbstractAnePlugin` /
`AbstractDevicePlugin`, registered through the plugin factory in
`Application::doInitialize()`) subscribe to role-play events and can contribute
menus (`use_dialog(...)`) and rendered output (`use_render(...)`). This is how
optional toys (ovipositors, extractors, projectile devices, connected hardware,
etc.) plug new behaviour into an ongoing scene without the core states knowing
about them.

### Extension points

- **New scene type:** add a `StoryInterface` implementation (usually extending
  `AbstractBaseStory`) and expose it from `CopulateState`.
- **New reactive add-on:** implement `AbstractAnePlugin`, handle
  `on_roleplay_event`, and register it in the plugin factory closure in
  `Application::doInitialize()`.
- **New event:** add an `AbstractRolePlayEvent` subclass and publish it from the
  relevant story/state; subscribers opt in via `on_roleplay_event`.
