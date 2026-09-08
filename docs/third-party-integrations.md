# Third-Party Integrations and Product Compatibility

How the system talks to services and products outside itself: connectable
online services (a messaging bridge, a connected-toy bridge, a character
directory, a game platform), and compatibility with popular third-party
in-world body add-ons and gadgets.

- **🎮 End-User Documentation** — what you can connect and what it adds.
- **🧑‍💻 Developer Documentation** — how each integration is implemented.

---

## 🎮 End-User Documentation

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

---

## 🧑‍💻 Developer Documentation

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
| Character directory (F-List) | `FlistModule` (`src/classes/modules/thirdparty/FlistModule.php`), `FlistApi` + the `FlistTrait`/`FlistService`, and a large value-object set under `src/classes/thirdparty/services/flist/` (kinks, info tags, character, images, mappings) | Authenticates via the portal flow (`on_authorize`), fetches and caches the linked F-List character (`getCharacter()`/`setCharacter()`), and maps F-List's kink/info-tag vocabulary onto the system's own enums (`FlistMappingKink`, `FlistMappingInfoTag`, …) so external kink preferences can inform in-scene eligibility (see [Interaction and Role-Play Lifecycle](interaction-lifecycle.md)). Per-profile visible "info tag groups" are toggled via `getEnabledInfoTagGroups()`/`setEnabledInfoTagGroup()`. |
| Game platform (Steam) | `SteamModule` (`src/classes/modules/thirdparty/SteamModule.php`), `SteamApi`, `GetPlayerSummaries`, `ResolveVanityURL`, `PlayerSummary` | Resolves a linked Steam username to a Steam ID (`getSteamId()`) and fetches player summaries (`getPlayerSummaries()`/`getPlayerSummary()`) for friend/profile lookups. |
| Code-changes feed (GitHub) | `GitCommit` (`src/classes/models/github/GitCommit.php`), `GitHubChangesHelper` | Fetches recent commits for the changelog surfaced in `ui/changelog.phtml`. |

All of these are optional per account/profile: modules typically expose an
`isLinked()`/`isEnabled()`-style guard backed by an account or profile setting,
and are only activated when the corresponding link has been authorized.
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
(`callControlMethod()`, `controls()`, surfaced via `jsonSerialize()`).

Attachments are represented at the domain level by `AttachmentModelImpl`
(`a_type`/`a_name`/`a_class`) and linked to a profile through
`ProfileAttachmentModelImpl`/the profile's `attachments` collection (see
[Accounts and Profiles](account-and-profiles.md)). `AttachmentService`
(`src/classes/services/AttachmentService.php`, extending the shared
framework's `AbstractAttachmentService`) resolves the currently worn
`GenitalsAttachmentInterface`/`CoversAttachmentInterface` for a profile
(`withGenitalsAttachment()`/`withCoversAttachment()`), which is how stories and
plugins query "what body parts/effects does this character actually have
attached" without depending on any specific product's class directly.

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

See [System Design](system-design.md) for how the third-party layer fits into
the overall architecture.
