---
audience: mixed
summary: Optional appearance automation, browser outfit controls, and attachment protection.
---

# RLV-Driven Character & Outfit Control

## For end-users

### What it is

If your viewer supports RLV (a widely-used automation protocol many virtual
world viewers support, sometimes needing to be enabled in preferences), the
companion can manage your appearance for you: automatically attaching your
character's body, swapping outfits, taking underwear on/off, and resizing
belly attachments as your character's pregnancy grows — all without you
manually attaching or detaching pieces one at a time. It can also stop your
companion itself from being accidentally removed during an active scene, and
restore your everyday look automatically afterward.

This feature is entirely **optional** — everything still works if RLV support
isn't available; you'll just manage your outfits by hand.

### How you use it

1. **Enable RLV** in your viewer's preferences (this is a viewer-level
   setting, not something the companion controls).
2. **Turn on "Characters" mode** for your account. This tells the companion it
   is allowed to manage attachments for you.
3. **Set up your folders.** The companion tells you the exact folder structure
   it expects (ask it, or check its help) — a top-level folder for the system,
   one per character, and inside each character folder a base body and any
   number of named outfits with clothing pieces, plus a shared underwear
   collection for that character.
4. **Switch outfits, redress, or strip** using the in-world menu or a typed
   command — the companion detaches what's no longer needed and attaches the
   new selection for you.
5. **During intimate scenes**, the companion can automatically remove and
   later restore clothing, and can prevent itself and your base body from
   being detached by accident.
6. **As your character's belly changes size** (for example during pregnancy),
   a matching belly attachment for that size is swapped in automatically, if
   you have one prepared for each size step.

If an outfit cannot be found, check your setup and refresh the available choices.
Sending a clothing command does not guarantee that your viewer has finished
changing your appearance.

### Using browser outfit controls

Where available in the [companion dashboard](companion-dashboard.md), outfit
controls show your available outfits, the selected outfit, and which clothing
pieces are worn. A partially worn piece also counts as worn.

1. Keep the companion worn, activate your character, and enable the appearance
   controls described above. If FullArray manages your appearance, use its own
   companion controls instead.
2. Choose an outfit. You can then put on or remove individual clothing or
   underwear pieces, dress the outfit, change to underwear, or reset the outfit
   to its remembered selection (or its full contents if none was remembered).
3. Check the scope before using a bulk control: changing to underwear removes
   your outer clothing, and stripping underwear removes both outer clothing and
   underwear. Dressing the whole outfit removes the shared underwear selection.
   Individual-piece controls affect the selected piece instead.
4. After a command is sent, allow the viewer to respond and refresh to check
   what is actually worn. Repeating an individual put-on or remove request keeps
   the same direction rather than reversing it.

If your character or outfit changed while the page was open, refresh before
trying again. A choice that is no longer available must be selected again from
the refreshed list. If controls remain unavailable, check that a character is
active and that your viewer and companion appearance controls are enabled.

---

## For developers

### Purpose

`RlvSharedFoldersModule` (`src/classes/modules/RlvSharedFoldersModule.php`) is
the bridge between the domain model (a `ProfileModelImpl`'s current outfit,
base body, and abdomen size) and the shared framework's RLV command layer
(`NueKryL\classes\services\RlvService` and the `NueKryL\classes\types\rlv\*`
command value objects). It owns the **folder naming convention** RLV-capable
viewers must follow and translates domain state changes into batches of RLV
attach/detach commands.

### The shared-folder convention

Folders live under a fixed root inside the viewer's `#RLV` shared folder:

```
.AnE
.AnE/{Character}
.AnE/{Character}/base
.AnE/{Character}/base/.genitalia
.AnE/{Character}/base/.abdomen/{size}      (per abdomen-size step)
.AnE/{Character}/outfits
.AnE/{Character}/outfits/.underwear
.AnE/{Character}/outfits/{Outfit}
.AnE/{Character}/outfits/{Outfit}/.base
.AnE/{Character}/outfits/{Outfit}/.on_attach
.AnE/{Character}/outfits/{Outfit}/.on_detach
.AnE/{Character}/outfits/{Outfit}/{Clothing}
.AnE/{Character}/outfits/{Outfit}/{Clothing}/.on_attach
.AnE/{Character}/outfits/{Outfit}/{Clothing}/.on_detach
```

- `{Character}` is either the profile's full display name, or — if
  `Constants::SETTING_RLV_CHARACTERS_HASHED` is enabled — an opaque hash
  (`profileHash()`, a `Hashids`-encoded CRC32 of the profile id keyed by the
  account's agent key) so folder names don't leak the character's real name.
- `getRootFolder()`, `getProfileFolder()`, `getProfileBaseFolder()`,
  `getProfileGenitaliaFolder()`, `getProfileAbdomenFolder()`/
  `getProfileAbdomenSizeFolder(int $size)`, `getOutfitsFolder()`,
  `getOutfitFolder()`, `getOutfitBaseFolder()`, `getOutfitGenitaliaFolder()`,
  `getOutfitsUnderwearFolder()`, `getOutfitGarmentFolder()`, and the
  `.on_attach`/`.on_detach` variants (`getFolderOnAttach()`/
  `getFolderOnDetach()`) all build these paths from a `ProfileModelImpl`.
- For explicit garment wear, `setFolderWorn()` first detaches `.on_attach`
  recursively, then attaches the parent recursively. For removal, it detaches
  the parent recursively, then attaches `.on_detach` recursively. These
  side-effect folders therefore have different command sequences, not identical
  attach-on-every-change behavior.

### Command flow

Every domain-level action builds a list of RLV command objects and hands them
to `RlvService::handlePassive($commands, $accountModel, $handleNow)` (or
`handleExecute(...)`/`handleReturns(...)` for commands that read state back,
like `RlvGetInv`/`RlvGetInvWorn`). Representative commands used:
`RlvDetachAll`, `RlvAttachAllOver`, `RlvAttachOver`, `RlvDetach`,
`RlvDetachForce`, `RlvClear`, `RlvDetachMe`.

Domain-level dress, strip, switch, and reset entry points call
`checkSharedFoldersEnabled()` (throws `SharedFoldersNotEnabledException` if the
account hasn't enabled RLV + "characters" mode). Low-level folder methods such
as `setFolderWorn()` do not perform that check themselves:

| Method | Effect |
|---|---|
| `switchActiveOutfitTo(string $nextOutfit, ...)` | Validates the outfit folder exists, detaches the current underwear/base/outfit, re-attaches the new outfit's base + memorized garments (or everything, if nothing was memorized), and updates `ProfileModelImpl::setOutfit(...)`. |
| `resetCharacter(...)` | Full re-sync: prevents HUD detachment (unless the account allows it), recalculates and applies abdomen size (`RolePlayService::calculateAbdomenSize()`), and re-attaches the base body + current outfit. |
| `resetActiveOutfit(...)` | Detaches genitalia and shared underwear, refreshes abdomen size, then restores memorized garments or attaches the whole outfit and its base. |
| `stripActiveOutfit(...)` / `stripActiveUnderwear(...)` | Detach the outfit (and/or underwear), attaching underwear or genitalia back as appropriate. |
| `dressActiveOutfit(...)` / `dressActiveUnderwear(...)` | The inverse — attach outfit/underwear, detaching whatever was covering the equivalent slot. |
| `updateAbdomenSize(float\|int $abdomenSize, ...)` | Detaches the current `.abdomen` folder and attaches the one matching the new size step, called after pregnancy/other stat changes. |
| `toggleOutfitGarmentFolder(...)` / `toggleOutfitsUnderwearGarmentFolder(...)` / `toggleFolderStatus(...)` | Attach-if-detached / detach-if-attached toggles used by the per-garment dialog (`render_clothing_garment()`, `dialog_clothing_garment()`). |
| `setFolderWorn(...)` | Sends an explicit wear/remove command sequence without reading and inverting current wear state; also used by the native toggle after its inventory read. |
| `memorizeOutfit(...)` / `handledMemorizedOutfit(...)` | Reads/writes which garment folders were worn under an outfit (`ProfileSettingHelper` JSON setting `SETTING_RLV_CHARACTERS_OUTFITS`) so a partial garment selection survives an outfit switch. |
| `outfitOverride(...)` / `hasOutfitOverride(...)` | Per-outfit flag (memorized the same way) that makes an outfit manage its own genitalia folder instead of the profile-wide one — for outfits with a built-in body variant. |

`hasOutfitOverride()`/`outfitOverride()` and the memorized-outfit settings are
stored per-outfit under `ProfileSettingHelper`, keeping this state with the
profile rather than the RLV module.

Outfit switching resolves names case-insensitively but preserves the spelling
returned by viewer inventory in `ProfileModelImpl::setOutfit()`. When the prior
outfit is null or empty, it skips the old outfit/base detach commands and the
old outfit's removal hook rather than interpreting the missing name as the
entire outfits directory.
Shared underwear is still detached before the new outfit is attached.

### Browser outfit requests

`OutfitsHelper` (`src/classes/helpers/OutfitsHelper.php`) owns the browser
contract; it reuses `RlvSharedFoldersModule` rather than maintaining a separate
wardrobe. Direct requests use `/api?class=OutfitsHelper`; `ApiHelper` also
delegates its `outfits` segment here, except that all profile-specific segments
return null in `InitialState`. Direct GET can instead report an inactive mode.

GET resolves the current account's active profile, never a browser-supplied
target. It returns `mode` and the arrays `outfits`, `garments`, and
`undergarments`:

| Mode | Behavior |
|---|---|
| `fullarray` | Checked first when `FullArrayPlugin::hasInstance()` is true; arrays remain empty and POST directs the caller to the FullArray HUD. |
| `inactive` | No active profile; arrays remain empty and POST asks for character activation. |
| `disabled` | Active profile without both RLV and shared-character support; arrays remain empty and POST asks for those capabilities. |
| `rlv` | Reads available outfits and shared underwear; reads current-outfit garments only if the outfit name passes validation. |

The last two modes also include `profileId`, nullable `outfit`, and `folder`
(the computed outfits root prefixed with `#RLV/`). FullArray and inactive
responses do not supply these fields. Outfit entries carry `name` and `active`
(case-insensitive comparison with the current outfit); garment entries carry
`name` and `worn`. Lists are naturally sorted without case sensitivity.
`serializeGarments()` interprets either inventory status digit of 2 or 3 as
worn, including partial wear or items in subfolders, rather than promising that
every item in a garment folder is attached.

POST requires body fields `profileId` and `outfit` to exactly match the current
context, plus `action` and, for a named selection, `name`. These values guard
against a stale page; they do not select a different profile or inventory root.

| Action | Delegated operation |
|---|---|
| `switch-outfit` | Switch to an exact name from a fresh available-outfit listing. |
| `dress-garments` | Dress the current outfit, removing shared underwear and genitalia attachments first. |
| `dress-undergarments` | Remove the current outfit and genitalia attachments, then attach shared underwear. |
| `strip-undergarments` | Remove both the current outfit and shared underwear, then restore the applicable genitalia attachments. |
| `reset-outfit` | Restore the current outfit through `resetActiveOutfit()`. |
| `wear-garment`, `remove-garment` | Explicitly wear/remove one listed current-outfit garment. |
| `wear-undergarment`, `remove-undergarment` | Explicitly wear/remove one listed shared-underwear garment. |

All actions except switching require a valid selected outfit, including
underwear actions. Named actions re-read the relevant inventory and require an
exact name match. `isFolderName()` rejects nonstrings, blank names, dot-prefixed
names, slashes/backslashes, commas, colons, equals signs, at signs, pipes, and
ASCII control characters. Reads filter out these names too, so hidden control
folders and path/command fragments cannot become selectable entries.

The helper builds paths from the resolved profile and validated inventory name,
and executes with that profile's account and `handleNow: true`. Success returns
`ok: true` and a message acknowledging command dispatch, not viewer completion.
Expected validation failures and unsupported verbs return `ok: false` with an
error; inventory or dispatch exceptions are not caught inside this helper.
There is no helper-level tester check, idle-state restriction, delivery
acknowledgement, transaction, or deduplication record. Explicit wear/remove
preserves direction on repetition but still dispatches another command batch.

> **Verification boundary:** `AbstractAneState::on_initialized()` registers
> the direct subscriber, but `__unserialize()` does not explicitly add it to
> older sessions. Restored-session discovery and exception-to-response handling
> depend on the shared framework. Authentication must establish the account
> before dispatch; the helper's local scope checks do not verify that bridge.

Coverage resides in `tests/unit/OutfitsHelperTest.php` (modes, dispatch,
validation, worn status), `tests/integration/helpers/OutfitsApiWiringTest.php`
(routing and switch guards), and
`tests/e2e/cases/OutfitFoldersExplicitWearAndRemovePreserveHooksTest.php`
(owner profile resolution and repeated explicit command sequences).

### Chat commands & dialogs

- `on_command(CommandEvent)` (implements `CommandLineSubscriber`) recognises,
  while in `RunningState`: `reset-character`, `change-outfit <name>`,
  `reset-outfit`, `wear-outfit`/`dress-outfit`, `strip-outfit`, and
  `wear-underwear`/`dress-underwear`, `strip-all`/`strip-underwear`/
  `strip-everything`. Outside that state, it also recognises
  `enable-redressing <bool>` and `enable-characters <bool>` (account
  settings). See [Command-Line Interaction](command-line-tooling.md).
- `on_command_help(array $params)` (implements `CommandHelpSubscriber`)
  answers `folders`/`shared-folders` by printing the expected folder layout
  (`saySharedFolders()`).
- The older `on_api(ApiEvent)` surface is **not read-only**. GET accepts
  `list=folders|outfits|garments|undergarments|all` and returns name-to-boolean
  maps. POST uses query parameters `action` and, when needed, `name` for
  `reset`, `reset-outfit`, `switch-outfit`, `dress-garments`, `strip-garments`,
  `dress-undergarments`, `strip-undergarments`, `toggle-garment`, and
  `toggle-undergarment`. It resolves `ApiEvent::getTarget()` and does not apply
  the new helper's stale-view, name-filter, or FullArray guards. Its response
  is an empty value object rather than the new success/error contract.
  Browser integrations should use the dedicated helper described above;
  authorization of this legacy target-based surface needs verification at the
  shared API boundary.
- Dialogs: `showCharacterOutfitsDialog()`/`returnCharacterOutfitsDialog()`
  (pick an outfit), `returnCharacterClothingDialogDynamic()`/
  `render_clothing_garment()`/`dialog_clothing_garment()` (toggle individual
  garments within the current outfit), and `render_clothing_options()`/
  `dialog_clothing_options()` (per-outfit options like override/memorize).

### Related settings & permissions

- `Constants::SETTING_RLV_CHARACTERS` — account opt-in to folder-driven
  character management (`enable-characters`).
- `Constants::SETTING_RLV_CHARACTERS_HASHED` — hash character folder names
  instead of using the display name.
- `Constants::SETTING_RLV_DETACHABLE` — whether the HUD itself may be
  detached (otherwise `resetCharacter()` re-locks it via `RlvDetach(null, false)`).
- `SettingConstants::SETTING_RLV_ENABLED` (shared framework) — whether the
  session has detected/negotiated RLV support at all;
  `isCharactersCapable()` requires both this and the account's "characters"
  opt-in.

### Extension points

- **New folder concept:** add a `get…Folder()` helper following the existing
  naming convention, and reference it from the relevant dress/strip/reset
  method.
- **New RLV-triggered behaviour:** implement the `RlvSubscriber` hooks
  (`on_rlv_enabled`, `on_rlv_enforce_command`, `on_rlv_release_command`,
  `on_rlv_handled_command`) — currently stubbed placeholders in this module —
  or add another subscriber module.

See [Architecture](architecture.md) for how this module fits into the
overall architecture, [Command-Line Interaction](command-line-tooling.md) for
the full chat-command surface, and
[Reproduction & Genetics Lifecycle](reproduction-and-genetics.md) for how
abdomen size is calculated during pregnancy.
