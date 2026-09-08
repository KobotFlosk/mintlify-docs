# RLV-Driven Character and Outfit Control

How the companion uses RLV (a viewer-side relay/automation protocol supported
by many compatible virtual-world viewers) to automatically dress, undress, and
switch bodies and outfits, and to prevent accidental removal during a scene.

- **🎮 End-User Documentation** — what this feature does and how to set it up.
- **🧑‍💻 Developer Documentation** — how the shared-folder convention and
  command handling are implemented.

---

## 🎮 End-User Documentation

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
   number of named outfits, each with its own underwear and clothing pieces.
   Once your outfits are organized that way, everything else is automatic.
4. **Switch outfits, redress, or strip** using the in-world menu or a typed
   command — the companion detaches what's no longer needed and attaches the
   new selection for you.
5. **During intimate scenes**, the companion can automatically remove and
   later restore clothing, and can prevent itself and your base body from
   being detached by accident.
6. **As your character's belly changes size** (for example during pregnancy),
   a matching belly attachment for that size is swapped in automatically, if
   you have one prepared for each size step.

If your folders aren't set up correctly, the companion lets you know instead
of guessing, so nothing gets left in a broken state.

---

## 🧑‍💻 Developer Documentation

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
- `.on_attach` / `.on_detach` subfolders are attached (not detached) whenever
  the parent folder is put on or taken off, letting a garment carry
  side-effect attachments (e.g. a jiggle physics layer) without extra domain
  logic.

### Command flow

Every domain-level action builds a list of RLV command objects and hands them
to `RlvService::handlePassive($commands, $accountModel, $handleNow)` (or
`handleExecute(...)`/`handleReturns(...)` for commands that read state back,
like `RlvGetInv`/`RlvGetInvWorn`). Representative commands used:
`RlvDetachAll`, `RlvAttachAllOver`, `RlvAttachOver`, `RlvDetach`,
`RlvDetachForce`, `RlvClear`, `RlvDetachMe`.

Key entry points, each gated by `checkSharedFoldersEnabled()` (throws
`SharedFoldersNotEnabledException` if the account hasn't enabled RLV +
"characters" mode):

| Method | Effect |
|---|---|
| `switchActiveOutfitTo(string $nextOutfit, ...)` | Validates the outfit folder exists, detaches the current underwear/base/outfit, re-attaches the new outfit's base + memorized garments (or everything, if nothing was memorized), and updates `ProfileModelImpl::setOutfit(...)`. |
| `resetCharacter(...)` | Full re-sync: prevents HUD detachment (unless the account allows it), recalculates and applies abdomen size (`RolePlayService::calculateAbdomenSize()`), and re-attaches the base body + current outfit. |
| `resetActiveOutfit(...)` | Detaches and re-attaches genitalia/underwear/outfit to fix a desynced state, and refreshes abdomen size. |
| `stripActiveOutfit(...)` / `stripActiveUnderwear(...)` | Detach the outfit (and/or underwear), attaching underwear or genitalia back as appropriate. |
| `dressActiveOutfit(...)` / `dressActiveUnderwear(...)` | The inverse — attach outfit/underwear, detaching whatever was covering the equivalent slot. |
| `updateAbdomenSize(float\|int $abdomenSize, ...)` | Detaches the current `.abdomen` folder and attaches the one matching the new size step, called after pregnancy/other stat changes. |
| `toggleOutfitGarmentFolder(...)` / `toggleOutfitsUnderwearGarmentFolder(...)` / `toggleFolderStatus(...)` | Attach-if-detached / detach-if-attached toggles used by the per-garment dialog (`render_clothing_garment()`, `dialog_clothing_garment()`). |
| `memorizeOutfit(...)` / `handledMemorizedOutfit(...)` | Reads/writes which garment folders were worn under an outfit (`ProfileSettingHelper` JSON setting `SETTING_RLV_CHARACTERS_OUTFITS`) so a partial garment selection survives an outfit switch. |
| `outfitOverride(...)` / `hasOutfitOverride(...)` | Per-outfit flag (memorized the same way) that makes an outfit manage its own genitalia folder instead of the profile-wide one — for outfits with a built-in body variant. |

`hasOutfitOverride()`/`outfitOverride()` and the memorized-outfit settings are
stored per-outfit under `ProfileSettingHelper`, keeping this state with the
profile rather than the RLV module.

### Chat commands and dialogs

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
- `on_api(ApiEvent)` (implements `ApiSubscriber`) exposes a read-only `GET`
  listing (`list=folders|outfits|garments|all`) of the character's folders,
  current outfit, and worn/unworn garments, each flagged with whether it is
  currently active — used by the web dashboard.
- Dialogs: `showCharacterOutfitsDialog()`/`returnCharacterOutfitsDialog()`
  (pick an outfit), `returnCharacterClothingDialogDynamic()`/
  `render_clothing_garment()`/`dialog_clothing_garment()` (toggle individual
  garments within the current outfit), and `render_clothing_options()`/
  `dialog_clothing_options()` (per-outfit options like override/memorize).

### Related settings and permissions

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

See [System Design](system-design.md) for how this module fits into the
overall architecture, [Command-Line Interaction](command-line-tooling.md) for
the full chat-command surface, and
[Reproduction and Genetics Lifecycle](reproduction-and-genetics.md) for how
abdomen size is calculated during pregnancy.
