---
audience: mixed
summary: Optional service connections and compatibility with third-party in-world products.
---

# Third-Party Integrations & Product Compatibility

## For end-users

### Connected online services

From your settings you can optionally link a few outside services to your
account:

- **Messaging bridge** — link a messaging app account so the companion can
  send you notifications, and (if you enable it) relay chat between you and the
  virtual world even while you're away from it.
- **Connected-toy bridge** — pair a supported connected toy so it can react in
  real time to what's happening during a scene.
- **Character directory link** — connect an external character-profile/kink
  directory account so your declared preferences and kinks there can inform
  what the companion offers you, and so your character info can be shared back
  to it.
- **Game-platform link** — link your game-platform identity for things like
  friend lookups tied to that identity.
- These links are entirely optional, are authorized through a small,
  clearly-labelled linking page, and can be turned off at any time from your
  settings.

### Compatible body add-ons and gadgets

The companion is also built to recognize and cooperate with a number of
popular third-party mesh body add-ons and accessories — realistic body parts,
body-fluid effects, reactive vocal add-ons, touch-reactive systems, and a
couple of compatible mini-games. When you wear a supported product alongside
the companion, it can automatically pick up on relevant moments (a climax, a
touch, a birth) and react appropriately, without you having to configure
anything beyond wearing both.

From the [companion web dashboard](companion-dashboard.md)'s Attachments
panel you can also see which of these products the companion currently
manages, add or remove one, and — if you'd rather drive a device by hand for
a while — switch it to manual **Override**, which pauses its automatic
reactions and lets you send its individual controls/commands yourself. Turn
Override back off to return the device to reacting on its own.

---

## For developers

Third-party integration code is split into two distinct concerns under
`src/classes/thirdparty/` and `src/classes/modules/thirdparty/`:

1. **External service integrations** — outbound/inbound HTTP integrations with
   real online services, each wrapped in a module/service and gated per
   account/profile setting.
2. **Attachment compatibility layer** — in-world link-message ("comm channel")
   bridges to specific third-party mesh body products and gadgets, letting them
   observe and react to the same role-play events everything else in the
   system does.

### External service integrations

| Service | Key classes | What it does |
|---|---|---|
| Messaging bridge (Telegram) | `TelegramModule` (`src/classes/modules/thirdparty/TelegramModule.php`) | Wraps the Telegram Bot API client; `sendMessage(...)` pushes notifications to a linked chat ID stored in an account setting; `on_command(...)` handles a `telegram-chat` command line toggle that also flips `RolePlayerPlugin::enableTelegram(...)` so region chat can be relayed both ways via `RlvRedirectService`. Gated by `isLinked()` / `isChatEnabled()`, both backed by `AccountSettingHelper`. |
| Connected-toy bridge (Lovense) | `LovenseApi`, `LovenseModule` (referenced from `RolePlayService`), plus `LovenseRequest`/`LovenseCommandEnum`/`LovenseFunctionEnum`/`LovensePresetEnum`/`LovenseToy` value objects (`src/classes/thirdparty/services/lovense/`) | `LovenseApi` (a per-account singleton) posts signed commands to the Lovense LAN/cloud API (`sendPreset()`, `sendPattern()`, `sendFunction()`) to buzz a paired toy, and exposes QR-code-based device pairing (`getQR(...)`). `LovenseCallback` handles the provider's webhook. Implements `PortalSubscriber::on_authorize(...)` for the web-based linking flow (see [The Web Portal](web-portal.md)). |
| Character directory (F-List) | `FlistModule` (`src/classes/modules/thirdparty/FlistModule.php`), `FlistApi` + the `FlistTrait`/`FlistService`, and a large value-object set under `src/classes/thirdparty/services/flist/` (kinks, info tags, character, images, mappings) | Authenticates via the portal flow (`on_authorize`), fetches and caches the linked F-List character (`getCharacter()`/`setCharacter()`), and maps F-List's kink/info-tag vocabulary onto the system's own enums (`FlistMappingKink`, `FlistMappingInfoTag`, …) so external kink preferences can inform in-scene eligibility (see [Interaction & Role-Play Lifecycle](interaction-lifecycle.md)). Per-profile visible "info tag groups" are toggled via `getEnabledInfoTagGroups()`/`setEnabledInfoTagGroup()`. |
| Game platform (Steam) | `SteamModule` (`src/classes/modules/thirdparty/SteamModule.php`), `SteamApi`, `GetPlayerSummaries`, `ResolveVanityURL`, `PlayerSummary` | Resolves a linked Steam username to a Steam ID (`getSteamId()`) and fetches player summaries (`getPlayerSummaries()`/`getPlayerSummary()`) for friend/profile lookups. |
| Code-changes feed (GitHub) | `GitCommit` (`src/classes/models/github/GitCommit.php`), `GitHubChangesHelper` | Fetches recent merged-PR commits from the project's GitHub repository (`getMergedCommitsToBranch(...)`, falling back to `getCommits(...)`) so `GithubChangesDialog` (`src/classes/prefabs/dialogs/thirdparty/GithubChangesDialog.php`) can list them as an in-world "Changes" menu, reached from the [Help menu](help-and-support.md). Unlike the other rows in this table, this isn't a per-account link — it's a shared, read-only feed. Note: the unrelated legacy file `ui/changelog.phtml` (a static Bitbucket-backed page) is orphaned/unused and is not part of this feature. |

All of the *linkable* integrations above are optional per account/profile:
modules typically expose an `isLinked()`/`isEnabled()`-style guard backed by an
account or profile setting, and are only activated when the corresponding link
has been authorized.
Authorization for the browser-based links (Telegram chat ID capture, Lovense
pairing, F-List login) goes through the shared portal flow — see
[The Web Portal](web-portal.md).

### Attachment compatibility layer

Third-party mesh body products and gadgets are bridged through
`src/classes/thirdparty/attachment/`, organised by kind:

| Kind | Location | Interface | Purpose |
|---|---|---|---|
| Genitals | `attachment/genitals/{OrangeNova,PsiCorp,Sensations,Sknk,Vagoo,Zaf}/…` | `GenitalsAttachmentInterface` (`AbstractLowerGenitalsAttachment` base) | One class per compatible mesh genital product/brand; subscribes to `RolePlayService` and `OpenTransferService`, tracks penetration/climax/fluid state (`pissing`, `cumming`, `throbbing`, …), and drives the product's own in-world animations/effects in step with the shared role-play events (`PenetrationEvent`, `ClimaxEvent`, `StatChangeEvent`). |
| Covers | `attachment/covers/Spunked/Spunked.php` | `CoversAttachmentInterface` | Reacts to fluid transfer (`OpenTransferSubscriber`) to trigger a body-fluid visual-effects product. |
| Vocals | `attachment/vocals/GoodMoaning/GoodMoaningVocals.php` | `RolePlaySubscriber` | Drives a reactive voice/moan HUD product over its own comm channel in response to penetration, stat changes, birth, and death events. |
| Touch/interact systems | `attachment/interacts/GoodMoaning/InteractSystems.php` | — | Bridges touch-reactive body zones (slaps, rubs, hair-pulls, arousal pokes) between the companion and the third-party interact HUD. |
| Mini-games | `attachment/games/jasx/StripFight.php` | — | Bridges a compatible combat/strip mini-game's damage/state events into the system's stat and stimulator model. |
| Voice packs | `thirdparty/tayamus/sounds/` (`TayamusBase`, `KoukiVoice`) | `VocalizedSoundsInterface` | Maps in-character actions to a licensed voice-actor sound-asset pack. |

All attachment classes extend `AbstractAttachmentBase`
(`src/classes/thirdparty/attachment/AbstractAttachmentBase.php`, itself
extending the shared framework's attachment base), which provides a shared
in-world link-message channel (`createListen()`/`command_listen()`), a
cooldown helper (`canAffect()`), and reflection-driven `#[ControlMethod]`
discovery so a product's exposed controls can be listed/driven generically
(`callControlMethod()`, `controls()`, surfaced via `jsonSerialize()`). Each
`#[ControlMethod]` attribute (`src/classes/attributes/ControlMethod.php`)
declares a `ControlMethodTypeEnum` kind — `SLIDER` (a bounded `min`/`max`
range, both required in the attribute), `ACTION` (a one-shot trigger, bounds
fixed to `0`/`0`), or `TOGGLE` (an on/off switch, bounds fixed to `0`/`1`) —
which is how a generic client (like the
[companion web dashboard](companion-dashboard.md)) knows how to render a
given product's control without knowing about the product itself. The
attribute validates its own arguments at construction time (a `SLIDER`
declared without both bounds, or any other unsupported kind, throws
`InvalidArgumentException`), so a malformed `#[ControlMethod]` declaration
fails as soon as the attachment class is reflected rather than producing a
bad control entry.

#### Attachment protocol audit — 2026-11-14

The command wrappers were checked against the primary sources below. Tests
verify emitted messages, channels, callback handling and state transitions;
they do not execute the receiving scripts in Second Life. Match the adapter
to the product generation: commands supported by one model are not necessarily
supported by another model from the same vendor.

| Family | Transport | Sources and implemented coverage |
|---|---|---|
| SKNK Heracles | Channel `71`, `dong-` prefix | [Heracles manual](https://wiki.sknk.pw/slmanuals/heracles_cock): states, angles, swinging, fluid effects, visibility, parts, foreskin, shaft/glans, length/offset, options, textures, state requests, and the documented physics/bed workarounds. `doBallRotation()` uses the `brot` spelling from the 1.1 changelog; `doBalls()` preserves the older spelling. |
| PsiCorp v6 | Channel `5`; vaginal commands use `vag ` | [Anthro manual](https://psicorp.freshdesk.com/support/solutions/articles/4000054233-anthro-penis) and each concrete class's `@see` manual: state/effect commands plus color, materials, glow, autohide, intensity, tilt, physics and fractional ball scaling. |
| PsiCorp Animesh | Channel `5` | Product manuals, including [Equine](https://psicorp.freshdesk.com/support/solutions/articles/4000143063-animesh-equine-penis), [Dragon](https://psicorp.freshdesk.com/support/solutions/articles/4000143064-animesh-dragon-penis), [Natural Canine](https://psicorp.freshdesk.com/support/solutions/articles/4000176419-animesh-natural-canine-penis) and [Bento Sergal Vagina](https://psicorp.freshdesk.com/support/solutions/articles/4000229480-bento-vagina-sergal): motion, effects and model-specific knot, flare, girth, length, barbs and sheath commands. Throb toggles/modes and `raised_high`/`raisedhigh` spellings follow the individual manuals; Animesh cleanup uses `mess off`. Sergal toy arguments are space-separated and oviposition is `vag ovi`. Its documented `pre` and `effects off` commands have no `vag` prefix. |
| PsiCorp CCS | Channel `-555`, directed to the registered HUD object | [CCS developer API](https://psicorp.freshdesk.com/support/solutions/articles/4000054298-chastity-control-system-ccs-api-developer-documentation): discovery, registration, removal and `doCcsCommand()` for the documented lock, state, outfit, pregnancy, sample, climax and child commands. Arguments are CSV-encoded. `getCcsReply()` retains valid pregnancy-status and sample responses from the registered target. Unregister uses the AnE controller's object UUID. |
| Sensations | Bento/legacy channel `9`; current Animesh cock channel `8` | [Legacy cock help](https://www.buysensations.com/helpview.php?type=cock2), supplied [Cock notecard](<thirdparty/Sensations/Sensations (Cock).raw>) and [Vagina notecard](<thirdparty/Sensations/Sensations (Vagina).raw>): menus, poses, fluid toggles, moisture, bending/animation, knot/throb, vaginal states, BoM and material commands. `BentoCock`, `AnimeshCock` and `Vagina` select the current documented protocols; the existing named cock classes retain their legacy dialects. |
| ZAF | Channel `55` or secondary `-55`; masturbation routine on `1` | Supplied [Feline/Canine Animesh notecard](<thirdparty/ZAF/ZAF (Feline Canine Animesh).raw>) and [Dragon Animesh notecard](<thirdparty/ZAF/ZAF (Dragon Animesh).raw>): states through 18, speed/special poses, effects, sound, customization, particles, textures and channel switching. Hide and piercing layouts differ by model. Texture helpers preserve the alpha/specular/final face slots; `doZedit()` also accepts comma-separated face lists. |
| Good Moaning Interact | Input `1482784366`, notices `1482784365`, directed to the wearer | [Interact API](https://goodmoaning.bdx9.com/dev/interact/interact) and [gesture API](https://goodmoaning.bdx9.com/dev/gestures/create): arousal query/update and slap inputs; owned arousal, slap, rub, hair-pull and climax notices are validated and cached for callers/dashboard serialization. These cached values do not automatically overwrite AnE's arousal stat. |
| Good Moaning vocals | Existing remote-drive transport | [Remote-drive API](https://goodmoaning.bdx9.com/dev/voice-huds/remote-drive): the existing implementation and unit coverage already include its documented command set; no protocol change was needed. |
| JASX BARE / StripFight | Owner-derived private channel from the vendor plugin | [Official plugin source](https://github.com/without-ordinary/stripfight/blob/master/stripfight_plugin.lsl): duel acceptance, buttons, quit, punishment, abilities, style, status and camera tasks use JSON objects. Incoming JSON damage updates AnE stats; history keeps the newest ten events. Server tasks must be spaced at least five seconds apart by the caller, as required by the vendor. Deprecated preference tasks `0`–`2` are not reintroduced. |

The audit also searched for Spunked, Orange Nova Skadi and Snaggletooth Vagoo
command documentation, but did not locate a public primary API reference.
Their existing wire protocols remain the basis of their adapters:

- Spunked keeps channel `4953` and `Request*…` messages. The previously empty
  cover callbacks now delegate to existing region commands. Belly maps to
  chest, and butt/thigh map to groin as coarse application-level fallbacks;
  these are not additional vendor commands. Custom color/glow support remains
  unverified.
- Orange Nova keeps channel `-1246875312`; its listener now recognizes the
  `particles,cumin`/`cumout` and heavy variants already emitted by its adapter.
- Vagoo keeps channel `-623`, including the first initialization command.
  Existing `vagoo cumstate` and `vagoo texturechange` constants now have
  callable wrappers.

Additional notecards are still needed to certify those three protocols and
the older ZAF variants. The supplied Sensations Ass/Anus/Clit notecards are
reference material; this audit covers the attachment types already represented
here, plus concrete adapters for the existing Sensations penis/vagina bases.
New concrete adapters must be added to the deployment's attachment catalog
(`a_class`) before users can select them; this change does not migrate catalog
rows or switch existing users to another product generation.

Regression coverage lives in `tests/unit/AttachmentProtocolCommandsTest.php`,
`tests/integration/thirdparty/AttachmentCommandMetadataTest.php`, and the
`AttachmentCommandsInitializedRouteToDocumentedChannelsTest` /
`AttachmentNoticesOwnedAndMalformedPreserveStateTest` e2e cases. It covers
command payloads, invalid inputs, initialization, ownership, scoped echo
suppression, CCS replies, channel changes, override behavior and detach cleanup.

#### Manual override (user-driven control)

Every attachment can be switched into a per-session **user override**
(`isUserOverrideEnabled()` / `setUserOverride(bool)` on
`AbstractAttachmentBase`) that pauses its own automatic reactions so a person
can drive its `#[ControlMethod]`/test-method commands directly instead:

- While override is enabled, the instance unsubscribes itself from
  `RolePlayService`/`OpenTransferService` (if it implements
  `RolePlaySubscriber`/`OpenTransferSubscriber`), so role-play events no
  longer trigger its automatic commands, and its outbound `doWhisper()`/
  `doSayTo()` calls are silently dropped (`mayEmitAttachmentCommand()`)
  *unless* they happen inside an explicit `runUserCommand(callable)` call.
  Disabling override resubscribes it and lets automatic commands flow again.
- The override flag is deliberately **not persisted** — it lives only on the
  live attachment instance for the current HUD session, so a HUD
  reset/reattach always starts back in automatic mode.
- `jsonSerialize()` reports the current flag as `overridden`, alongside the
  `controls` list, so a client can show whether a device is currently under
  manual control.

This is what backs the companion web dashboard's Attachments panel
(`AttachmentsHelper`, see [The Companion Web Dashboard](companion-dashboard.md)):
its `override` action flips the flag, and its `control`/`method` actions are
rejected with an error unless override is already enabled for that
attachment, then invoke `callControlMethod()`/the test-method call through
`runUserCommand()` so the manual command still reaches the device even while
its own automation is paused.

`AbstractLowerGenitalsAttachment` also debounces climax notices coming from a
product: once a "cum event" is accepted it stamps a per-profile timestamp
setting (`CLIMAX_TIMESTAMP_SETTING`), and any further notice received within
`CLIMAX_BACKOFF_SECONDS` (30s) is ignored (`isClimaxBackoffActive()`) so a
single physical climax cannot be reported multiple times by chatty hardware and
re-trigger `RolePlayService::doClimax()`/arousal effects repeatedly.

Attachments are represented at the domain level by `AttachmentModelImpl`
(`a_type`/`a_name`/`a_class`) and linked to a profile through
`ProfileAttachmentModelImpl`/the profile's `attachments` collection (see
[Accounts & Profiles](account-and-profiles.md)). `AttachmentService`
(`src/classes/services/AttachmentService.php`, extending the shared
framework's `AbstractAttachmentService`) resolves the currently worn
`GenitalsAttachmentInterface`/`CoversAttachmentInterface` for a profile
(`withGenitalsAttachment()`/`withCoversAttachment()`), which is how stories and
plugins query "what body parts/effects does this character actually have
attached" without depending on any specific product's class directly.
`AttachmentService::on_api()` itself just delegates to `AttachmentsHelper`
(kept as its own resolvable endpoint, `/api?class=AttachmentService`, for
compatibility with HUD sessions serialized before the Attachments panel
existed) — see [The Companion Web Dashboard](companion-dashboard.md) for the
actual attach/detach/override/control contract.

`AttachmentTypeEnum` (`genitals.anus`, `genitals.penis`, `genitals.vagina`,
`genitals.breasts`, `covers.body`, `games`) is the shared vocabulary used to
classify attachments regardless of which third-party product implements them.

### Extension points

- **New external service:** add a module/service under
  `src/classes/modules/thirdparty/` or `src/classes/thirdparty/services/`,
  gate it behind an account/profile setting, and (if it needs browser-based
  authorization) implement `PortalSubscriber::on_authorize(...)` — see
  [The Web Portal](web-portal.md).
- **New compatible body product:** add a class under
  `src/classes/thirdparty/attachment/<kind>/<Brand>/` extending
  `AbstractAttachmentBase` and implementing the relevant interface
  (`GenitalsAttachmentInterface`, `CoversAttachmentInterface`, or a custom
  `RolePlaySubscriber`), then register it wherever attachments of that kind are
  resolved (see `AttachmentService`).

See [Architecture](architecture.md) for how the third-party layer fits into
the overall architecture.
