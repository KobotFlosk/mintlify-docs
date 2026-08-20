# Command-Line Interaction (Chat Commands)

How typed chat commands (a lightweight, admin- and power-user-facing "CLI"
built on top of ordinary in-world chat) are parsed, routed, and handled.

- **🎮 End-User Documentation** — the commands available to regular players.
- **🧑‍💻 Developer Documentation** — how commands are dispatched and how to
  add new ones.

---

## 🎮 End-User Documentation

### What it is

Alongside the menu-driven interface, the companion understands typed chat
commands — short, `/ane`-prefixed instructions you can type directly instead
of navigating menus. Most day-to-day play doesn't need them, but they're handy
shortcuts for things like changing outfits, checking your balance, or getting
quick reminders of available features. A separate, smaller set of admin-only
commands exists for people helping run and support the community, but those
require special permissions you won't have by default.

### How you use it

Type a command starting with `/ane` followed by the action, for example:
switching to a saved outfit, resetting your character's appearance, checking
your Credit balance, or asking for a reminder of the shared-folder layout
needed for outfit automation. Some actions read a following word as a
yes/no toggle (e.g. turning a feature on or off); others take free text (like
a status message).

You can also ask for built-in help — typing a help command followed by a
topic name shows relevant tips for that topic (for example, a list of chat
tags you can use in your profile description, or general chat-command usage
notes).

A couple of everyday examples of things you can do this way: swap to a
different outfit by name, temporarily mark yourself away with a custom
message and then mark yourself back, or toggle whether you're currently
speaking "out of character."

---

## 🧑‍💻 Developer Documentation

### Purpose

A decentralized command bus: any module, plugin, or service can register
itself as a listener and claim commands it recognises, without a central
registry of every command in one place. This keeps command handling next to
the feature it controls (RLV outfit commands live with the RLV module,
Telegram commands live with the Telegram module, and so on).

### Pieces

- **`CommandLineService`** (shared framework, `NueKryL\classes\services`) — the
  pub/sub bus. Anything implementing `CommandLineSubscriber` calls
  `CommandLineService::getInstance()->subscribe($this)` (typically in an
  `initialize()`/`on_plugin_attached()` method) and unsubscribes on teardown.
- **`CommandEvent`** (shared framework, `NueKryL\classes\events`) — the parsed
  command, exposing `shiftParams(bool $lowercase = true)` (pops and returns the
  next whitespace-delimited token, matched case-insensitively by default),
  `shiftBoolean()` (pops a token and parses it as a yes/no flag), and
  `flushParams(bool $lowercase = true)` (returns and clears everything
  remaining, for free-text arguments like a status message). `clone(bool
  $reset = false)` produces an independent copy so multiple subscribers can
  each try shifting parameters from the same command without interfering with
  one another.
- **`CommandLineSubscriber`** (shared framework, `NueKryL\interfaces\services`)
  — the interface implemented by every command handler:
  `on_command(CommandEvent $command): bool`. Returning `true` claims the
  command (stops it being offered to further subscribers); `false` lets it
  fall through.
- **`CommandHelpService`** / **`CommandHelpSubscriber`** — a parallel bus for
  the `/ane help ...` sub-system: `on_command_help(array $params): bool`,
  where `params` are the tokens after `help`. `CommandHelper::shiftParams(...)`
  is the array-based equivalent of `CommandEvent::shiftParams()` for this path.
- **`CommandHelper`** (shared framework, `NueKryL\classes\helpers`) — small
  parsing utilities shared by command handlers, e.g.
  `CommandHelper::filterBoolean(...)` (normalises a token to a boolean).

### Registered handlers in this codebase

| Handler | Notable commands |
|---|---|
| `CommandLineModule` (`src/classes/modules/`) | Admin-only (`on_command_admin`, gated by `AccountHelper::isAdmin()`): `endpoint`, `remote-command`, `owner-say`, `reset-session`/`delete-session`, `vend-product`, `vend-lindens`, `system-disable`, `send-message`, `debug`. State-scoped (`on_command_state`): `clear-restrictions`, `leave`/`logout`/`logoff`/`leave-profile`/`leave-character`, `follow`, `show-identifier`. General (`on_command_other`): `manage-announcements`, `announce`/`announce-now`/`announce-live`, `show-account`, `show-rewards`, `send-command`, `enable-attachments`, `show-attached`, `show-balance`, `close-browser`, `join-group`, `profile-id`, `detach`, `version`. |
| `RlvSharedFoldersModule` (`src/classes/modules/`) | `reset-character`, `change-outfit`, `reset-outfit`, `wear-outfit`/`dress-outfit`, `strip-outfit`, `wear-underwear`/`dress-underwear`, `strip-all`/`strip-underwear`/`strip-everything`, `enable-redressing`, `enable-characters`. Help topic: `folders`/`shared-folders`. See [RLV-Driven Character & Outfit Control](rlv-and-control.md). |
| `RolePlayerPlugin` (`src/classes/plugins/`) | `translate`, mood tag / `change-mood`, `ooc`/`toggle-roleplay`, `status-toggle`, `away`/`status-away`, `back`/`status-back`. Help topics: `tags`, `cli`. |
| `TelegramModule` (`src/classes/modules/thirdparty/`) | `telegram-chat <bool>`. See [Third-Party Integrations & Product Compatibility](third-party-integrations.md). |

Several commands additionally require an `AccountRoleEnum` (e.g.
`ADMINISTRATOR`, `TASKFORCE`, `AFFILIATE`) or an `AccountPermissionEnum` (e.g.
`PERM_CLI_SEND_COMMAND`) before they're allowed to execute — see
[Accounts & Profiles](account-and-profiles.md) for the role/permission model.

### Flow

```
player types: /ane <command> [args...]
        │
        ▼
in-world object sends chat to the backend ──▶ CommandLineService fan-out
        │
        ▼
each subscribed handler's on_command(CommandEvent) is invoked, in
subscription order, each on its own clone() of the event, until one
returns true (claims it) or all return false (unrecognised)
```

The `/ane help <topic> [sub-topic]` path works the same way through
`CommandHelpService`/`on_command_help(array $params)`, letting each module
document only the topics it owns.

### Extension points

- **New command:** implement `CommandLineSubscriber` on the relevant
  module/plugin/service, subscribe to `CommandLineService` during
  initialization, and add a `case` in `on_command()`. Remember to unsubscribe
  in `finalize()`/teardown.
- **New help topic:** implement `CommandHelpSubscriber` and add a `case` in
  `on_command_help()`; keep help text close to the feature it documents.
- **Gating a command:** check the appropriate `AccountRoleEnum`/
  `AccountPermissionEnum` at the top of the relevant `case`, matching the
  pattern used in `CommandLineModule::on_command_admin()`.

See [System Design](system-design.md) for how command handling fits into the
overall architecture.
