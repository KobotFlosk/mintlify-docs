---
audience: mixed
summary: Session startup, shared scenes, request acceptance, engagement stopping, and role-play events.
---

# Interaction & Role-Play Lifecycle

## For end-users

### Waking up and the main menu

When you attach the companion it "wakes up" and, if this is your first time, walks
you through creating a character. After that, touching it opens an interactive
menu where you reach your profile, settings, searches, the store, help, and any
add-ons you own. Between actions it sits in a calm, idle mode, quietly keeping
your character's biology and stats up to date.

### Being greeted and staying in the loop

Every time the companion "comes online" for you — attaching it, having it reset,
or moving between regions — it greets you by name and, if any of your characters
are currently fertile or pregnant, reminds you which ones. It also relays any
**community announcements** that are currently active (for example news from the
people running the experience), and can occasionally play a special seasonal
sound or look on notable dates as a small cosmetic touch — none of this affects
gameplay.

### Starting a scene with a partner

When another user of the system is nearby, you can begin a shared scene together.
The companion looks at **both** characters — their bodies, forms, and the personal
limits each of you set — and only offers actions that make sense for the two of
you. Scenes are organised into kinds of intimacy (for example oral, penetrative,
breeding, and egg-laying), each with its own set of moves.

### When a breeding request auto-accepts

When someone sends your character a breeding request, you are normally shown a
prompt to **accept, reject, or trust** them. Some situations, however, cause the
request to be **auto-accepted** for you (no prompt). These are the auto-acceptance
rules for engaging in copulation — they are about breeding as a whole, not just
about who you're related to. When more than one applies, the companion narrates
the single, most important reason ("*…is auto-accepting breeding request from …
because …*"), in this order of priority (highest first):

1. **You can't refuse** — your character is too weak/exhausted to defend
   themselves (low strength, defense, or stamina).
2. **Public access** — you've turned on public access in your settings.
3. **Partnership** — you are partnered with the requester.
4. **Trust** — you have marked the requester as trusted.
5. **Ownership bond** — the requester is your **Master** (you are their Slave),
   your **Owner** (you are their Pet), or your **Pet** (you are their Owner).

If none of these apply, you are prompted to accept, reject, or trust the request
as normal. (Trust and ownership bonds are set up from your character's profile —
see [Accounts & Profiles](account-and-profiles.md).)

When the dashboard is connected and supports notifications, an auto-accepted
request can also show a notice naming the requester and the reason, even when
your character is unconscious. A missing browser notice does not mean the
request was refused.

### During a scene

- You pick moves from a menu; your partner sees and responds to what happens.
  Supported prompts can also be answered in the browser; see
  [Answering scene choices](companion-dashboard.md#answering-scene-choices).
- Actions affect your **stats** — arousal builds, stamina drains, and so on.
- Reaching a climax can transfer **fluids** between characters, which is what makes
  conception possible (see
  [Reproduction & Genetics](reproduction-and-genetics.md)).
- If you have add-on devices or an AI companion enabled, they react in real time —
  narrating, buzzing a connected toy, or triggering special effects.
- A **Clothing** button lets you (and, with their permission, your partner) strip
  or redress outfit pieces mid-scene without leaving it, and a **Partner** menu
  offers a shortcut to your partner's clothing and any connected toy they have
  linked, if either supports it.
- Available stopping controls depend on who initiated the engagement and whether
  a story is active; see below rather than assuming both participants have the
  same controls.

### Stopping an engagement

In-world, the initiator's **Stop** control concludes the current story; **FINISH**
ends the engagement when no story is selected. A participant who did not
initiate it instead has a **Resist** option when their character is capable of
defending themselves. Resistance is a chance-based role-play action, not a
guaranteed exit.

Where the dashboard offers an **emergency stop**, the character who initiated
the engagement can end it without waiting for a turn, even while tied. Select
the intended partner: stopping that engagement leaves other partners' scenes
and pending choices intact. Ending the last engagement returns the companion
to idle. Restrictions still needed for another tied scene remain in effect.

If the dashboard reports that the engagement has ended or that you did not
initiate it, refresh the scene list. The current browser control does not give
the other participant the same emergency exit. These are game mechanics, not
a substitute for agreeing boundaries with other players.

### Choosing how turns are paced

Under your settings there is a **Stories → Interaction** option that controls how
turns move back and forth during ordinary physical scenes (it does not apply to
the branching, AI-narrated story — that one always alternates turns):

- **Free** — you (as the one who started the scene) can keep picking actions back
  to back, while your partner can still respond whenever a move is aimed at them.
  Nobody is forced to wait.
- **Turn** — you and your partner strictly alternate, and each side waits as long
  as it takes for the other to respond.
- **Timeout** — you and your partner alternate, but if whoever's turn it is
  doesn't respond within a preset time (a few short presets are offered), the
  turn automatically passes to the other person so the scene doesn't stall.

Whichever option is set by the person who starts the scene applies for that
scene; you can change your own preference any time from settings for the next
scene you start.

### Content limits and request acceptance

Everything offered during a scene is filtered by your body and by the content
limits you configure. If something isn't possible or isn't allowed for your
character, it simply won't be offered.

Action filtering is separate from the automatic request-acceptance rules above;
it does not mean every engagement begins with a confirmation prompt or that
every participant has an unconditional stop control.

---

## For developers

### The state loop

Interaction is governed by the state machine in `src/classes/states/` (summarised
in [Architecture](architecture.md)):

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

### Session start: greeting, announcements, and theming

`AbstractAneState::on_system_init()` runs on every fresh session (attach, script
reset, or region crossing) before any state-specific logic:

- Re-subscribes core services (`ApiService`, `PortalService`, `RolePlayService`)
  and refreshes the HUD's cosmetic **theme** via `ThemeHelper::updateTheme()`,
  which swaps textures/sounds for date-keyed easter-egg themes (e.g. an April 1
  and a "May the 4th" theme) based on the current date, cached per-account via
  the `AccountSettingHelper`-backed date-code setting; `ThemeHelper` also
  implements `CommandLineSubscriber` for an `update-theme` command that forces a
  re-check (or overrides the date code) on demand.
- Optionally sends a group-invite prompt (`SmartBotHelper::groupInvite(...)`),
  gated by a notification setting.
- Builds and sends the personalized greeting: an `hud.motd` message template
  (`[fullname]`/`[profiles]` placeholders) followed by a summary of the caller's
  fertile/pregnant profiles, then any currently-active
  `AnnouncementModelImpl` rows fetched via
  `AnnouncementHelper::fetchAnnouncementsActive()` — each rendered as an
  in-character "announces:" line, optionally attributed to the announcing
  account.
- Announcements are authored/scheduled (commence/conclude dates, title, message)
  through `ManageAnnouncementsDialog`, reached via the `/ane manage-announcements`
  chat command (admin/affiliate-gated), or broadcast immediately with
  `/ane announce` (see [Command-Line Interaction](command-line-tooling.md)).

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
events via `on_roleplay_event(...)`. `codeRole()`/`fetchRoleCode(...)` resolve
which side of the scene the active profile is currently playing
(`RoleCodeEnum::ROLE_PROVIDING` or `ROLE_RECEIVING`, from
`ProfileCopulationHelper::fetchCopulationByProfile(...)`), which is surfaced to
clients (including the AI companion and the web dashboard) as a plain
`providing`/`receiving` label.

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
| `ConsciousEvent`, `DeathEvent` | Consciousness/vitality thresholds crossed. See [Vitality & Stats](vitality-and-stats.md). |
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

### In-scene clothing & connected-toy shortcuts

`CopulateState` exposes a `Clothing` static button (hidden unless
`ClothingHelper::isClothingCapable()` is true for the active account) and a
`Partner` static button whose submenu conditionally offers `Clothing` and
`Lovense` entries (`ACTION_PARTNER_CLOTHING`/`ACTION_PARTNER_LOVENSE`), gated by
`ClothingHelper::isClothingCapable($targetAccount)` (or the target having a
`FullArrayPlugin` instance) and `LovenseApi::newInstance($targetAccount)->isEnabled()`
respectively. `ClothingHelper::clothingDialog(...)` dispatches to whichever
clothing system the account actually uses — a `FullArrayPlugin`-backed dialog for
full-array-style avatars it owns itself, or `RlvSharedFoldersModule`'s dynamic
clothing dialog otherwise — so the scene UI doesn't need to know which one
applies. This lets a scene participant adjust their own or (with the
partner's device support) their partner's outfit/toy state without leaving
`CopulateState`.

### Configurable story interaction pacing

Ordinary physical stories (`StoryAnal`, `StoryBreed`, `StoryOral`, and their
shared base) route turn-passing through a normalized `StoryInteractionPolicy`
value type (`src/classes/types/StoryInteractionPolicy.php`) with three modes:

- `free` — the initiator keeps a local dialog after each action
  (`nextInteractionDialog()`), while the partner can still act on dialogs
  delivered to them and simply relinquishes after responding.
- `turn` — the acting side always relinquishes and waits indefinitely for the
  other side's response.
- `timeout` (an `int` of seconds, from `TIMEOUT_PRESETS`) — behaves like `turn`,
  but the dialog is annotated with a countdown message
  (`interactionDialogMessage()`) and a viewer-side timer response
  (`ACTION_INTERACTION_TIMEOUT`) is handled by `interactionDialogTimedOut()`,
  which restores the local dialog without treating the timeout as a sexual
  action or touching stats.

`ChoiceStory` always overrides this to `StoryInteractionPolicy::turn()`
(`AbstractBaseStory::interactionPolicy()`), so the branching/AI-narrated story
stays strictly turn-based regardless of the account's setting.

**Configuration and snapshotting.** The account-level preference is stored
under `Constants::SETTING_STORY_INTERACTION_TIMEOUT` (default
`Constants::DEFAULT_STORY_INTERACTION_TIMEOUT`) and edited via
`StorySettingsDialog` (reached from `SettingsDialog`'s "Stories" entry).
`CopulateState` snapshots the **initiator's** setting onto the shared
copulation aggregate's metadata (`METADATA_INTERACTION_TIMEOUT`) the first time
either side enters the scene (`initializeInteractionTimeout()`), and both
participants read that shared snapshot for the rest of the scene — the
receiver's own personal setting is never consulted mid-scene. Switching stories
mid-scene (`clearStory()`) preserves this snapshot rather than re-reading
settings, so pacing stays stable for the whole encounter.

### Emergency-stop requests

`CopulationInteractionHelper::on_api()`
(`src/classes/helpers/CopulationInteractionHelper.php`) accepts POST at
`/api?class=CopulationInteractionHelper`, with body `action: stop` and a string
or integer `targetId` identifying the partner's profile, not their account key.
`AbstractAneState::on_initialized()` and `__unserialize()` register the helper
for new and restored sessions.

The helper requires `CopulateState`. `CopulateState::emergencyStop()` searches
the active profile's engagements and only matches one where the active profile
is the **initiator** and the target id matches. It deliberately bypasses story
focus, penetration, and knot restrictions, without trusting the currently
selected partner. The receiving participant cannot invoke this exit simply
because they are the owner of their own session.

On a match, `finishCopulationWith()`:

1. Retains the story's local engagement snapshot for cleanup, since the peer
   may already have deleted the shared record.
2. Removes and flushes an existing shared engagement, then sends
   `CONTROL_COMPLETE` to the explicitly selected partner. Persistence failures
   propagate to the surrounding request rather than reporting a successful stop.
3. Removes that partner's story and closes only its pending dialog. If no
   remaining story is knotted, it clears tie restrictions. If the active
   character was receiving, fluid draining resumes for the affected incubator
   unless another receiving story remains tied there.
4. Announces the end and clears stale target context. It returns to
   `RunningState` when no engagements remain; otherwise remaining engagements
   and their dialogs stay available.

Success returns `ok: true`. Unsupported verbs, malformed actions/targets, and
absent or non-initiated engagements return `ok: false` with an error. A repeated
stop is not a success acknowledgment and cannot silently stop another partner.
This endpoint differs from ordinary `ACTION_STOP`, which calls
`concludeStory()`, and `ACTION_FINISH`, which calls `finishCopulation()`.

`tests/e2e/cases/CopulationEmergencyStopLastTiedEngagementReturnsRunningTest.php`
covers a final tied engagement while the partner owns the turn, restored-session
routing, tie release, and fluid drainage.
`tests/e2e/cases/CopulationEmergencyStopPreservesOtherEngagementTest.php`
covers initiator gating, explicit target selection, duplicate stops, preserved
ties, and independent partner prompts. See
[Shared story dialogs](companion-dashboard.md#shared-story-dialogs) for their
request/recovery contract.

> **Maintainer question:** initiator-only emergency stopping is explicit in the
> implementation and tests. Confirm whether recipients should also have an
> unconditional emergency exit; documentation must not promise one until the
> behavior changes.

### Extension points

- **New scene type:** add a `StoryInterface` implementation (usually extending
  `AbstractBaseStory`) and expose it from `CopulateState`.
- **New reactive add-on:** implement `AbstractAnePlugin`, handle
  `on_roleplay_event`, and register it in the plugin factory closure in
  `Application::doInitialize()`.
- **New event:** add an `AbstractRolePlayEvent` subclass and publish it from the
  relevant story/state; subscribers opt in via `on_roleplay_event`.

### Breeding-request auto-acceptance rules

Before a scene can start, the receiver's request must be accepted, either
explicitly or by the automatic rules below.
`CopulateModule::on_action()` (handling `COPULATE_REQUEST`) decides whether to
prompt the receiver (accept/reject/trust dialog) or **auto-accept** on their
behalf. This is the auto-acceptance ruleset for engaging in copulation/breeding
as a whole — not a relations/adoption sub-feature; trust and adoption are only
two of its inputs.

`CopulateModule::resolveAutoApprovalReason()` returns the single, highest-priority
applicable reason as a `CopulateApprovalReasonEnum`
(`src/classes/enums/CopulateApprovalReasonEnum.php`). The enum cases are declared
highest-first and the resolver returns the first that applies, in this order:

1. `STATS` — the receiver is not `RolePlayService::isDefensible()` (too
   weak/exhausted — low strength, defense, or stamina — to refuse).
2. `PUBLIC_USE` — the receiver enabled `Constants::SETTING_ACCESS_PUBLIC`.
3. `PARTNERSHIP` — the receiver has a `RelationTypeEnum::PARTNER` relation with the
   requester.
4. `TRUST` — the receiver has trusted the requester (`ProfileModel::getTrusts()`).
5. `ADOPTION` — the requester holds a dominant/paired role over the receiver, read
   from the requester's adoption rows toward the receiver: `ADOPTION_TYPE_SLAVE`
   (requester is the receiver's Master), `ADOPTION_TYPE_PET` (requester is the
   receiver's Owner), or `ADOPTION_TYPE_OWNER` (requester is the receiver's Pet).

`CopulateApprovalReasonEnum::NONE` means no rule applies and the receiver is
prompted. When a rule applies, `on_action` auto-accepts and, if the receiver is
conscious, narrates the winning reason via
`CopulateApprovalReasonEnum::asReasonPhrase()`. The `STATS`/`PUBLIC_USE` facts are passed
into the resolver so the decision logic stays pure and unit-testable. The rules,
priority order, and narration are covered by
`tests/integration/modules/CopulateAutoApprovalTest.php`. Trust and adoption
storage are documented in [Accounts & Profiles](account-and-profiles.md).

After sending the automatic acceptance handshake, `CopulateModule::on_action()`
(`src/classes/modules/CopulateModule.php`) publishes an owner-routed Redis
notification through `RedisHelper::tryPublish()`, using
`Constants::REDIS_INTERACTION_EVENT`. The payload has `type: notification`,
`code: copulation.auto-accepted`, a translated title/message, `characterId`,
requester identity, and the selected reason. It targets the receiving
character's owner, not the requester, and is independent of the consciousness
gate on HUD narration. Delivery is best-effort: a Redis failure must not abort
acceptance. Manual acceptance and rejected requests do not emit this event.

`tests/e2e/cases/CopulateAutoAcceptancePublishesOwnerNotificationTest.php`
checks the routing and payload, unconscious receivers, non-auto-accepted
requests, and continued acceptance when Redis fails. The browser bridge itself
is outside this repository.
