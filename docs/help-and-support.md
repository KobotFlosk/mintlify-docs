# Help and Support Menu

The always-available "Help" entry on the main menu: joining the community
group, finding the manual and community chat, checking for updates, watching
tutorial videos, reading recent changes, and choosing your display language.

- **🎮 End-User Documentation** — what each Help option does and how to use it.
- **🧑‍💻 Developer Documentation** — how the menu and its options are built.

---

## 🎮 End-User Documentation

### What it is

Every profile has a "Help" option on its main menu that gathers together the
things you need when you're not sure what to do next, want to learn more, or
want to check you're up to date. It's always available, regardless of what
else your character can do.

### What you'll find there

- **Join Group** — sends you an invite to the companion's community group
  in-world, so you can chat with other players and get support.
- **Manual** — opens the published documentation in your viewer's built-in
  browser and also posts a link in local chat, in case you'd rather read it on
  another device.
- **Discord** — gives you a link to the community's Discord server.
- **Changes** — shows a short, numbered list of the most recent updates that
  have shipped, newest first. Picking one shows a bit more detail about that
  change and a link to read the full write-up online.
- **Update** — only appears when a newer version is available. Choosing it
  delivers a fresh copy of the companion to you, ready to wear.
- **Videos** — a menu of short video tutorials covering specific features
  (for example, automated outfit control or general customization). Picking
  one opens it in your viewer's built-in browser.
- **About** — a short blurb about the project and its creators.
- **Locale** — lets you choose which language the companion's menus and
  messages are shown in.

### Things to keep in mind

- The "Update" option only shows up when you're actually behind the latest
  version — if you don't see it, you're already current.
- Some tutorial videos may briefly show nudity or suggestive content for
  demonstration purposes; this is called out on the video menu itself.

---

## 🧑‍💻 Developer Documentation

### Where it plugs in

The menu is `HelpDialog` (`src/classes/prefabs/dialogs/HelpDialog.php`), a
`DialogButtons` reached from the main menu offered by the active state (see
[System Design](system-design.md)). Each button is keyed by a `HelpDialog::ACTION_*`
/ `GROUP_INVITE` constant and handled in `menu_help(DialogButtons $dialogButtons)`:

| Button | Constant | Behaviour |
|---|---|---|
| Join Group | `GROUP_INVITE` | Calls `SmartBotHelper::groupInvite(...)` with the caller's agent key and the companion's group UUID (`Constants::SECONDLIFE_GROUP_ANE`), which posts to a third-party in-world bot API (`ClientHelper::httpPost` against `Constants::HTTPS_MYSMARTBOTS_API`, authenticated via `API_BOT_KEY`/`API_BOT_SECRET`/`API_BOT_NAME` settings) to send the invite. |
| Manual | `ACTION_DOCS` | `MediaModule::getInstance()->openMediaBrowserAndDialog(Constants::HTTPS_ANEHUD_DOCS, ...)` opens the published docs site in the in-world media browser and echoes the link via `CommOwnerSay`. |
| Discord | `ACTION_DISCORD` | Returns a `DialogWebsite` pointed at `Constants::HTTPS_DISCORD_INVITE`. |
| Changes | `ACTION_CHANGES` | Returns a `GithubChangesDialog` (`src/classes/prefabs/dialogs/thirdparty/GithubChangesDialog.php`) — see below. |
| Update | `ACTION_UPDATE` | Only offered when `VersionHelper::isVersionLessThan(currentParams, VersionHelper::getLatestVersion())`; calls the shared framework's `VendorHelper::getInstance()->vendProduct()` to rez an updated copy of the product to the caller. |
| Videos | `ACTION_VIDEOS` | A small hard-coded `DialogButtons` (YouTube video IDs → labels); `menu_help_videos(...)` opens the chosen video (embed URL) via `MediaModule`. |
| About | `ACTION_ABOUT` | Loads a JSON text resource (`ResourceHelper::loadJsonResource(['text', 'HelpAbout'])`) and appends a few creator profile links (`AccountHelper::buildAgentUrlByKey(...)`). |
| Locale | `ACTION_LOCALE` | Returns the shared framework's `AccountLocaleSettingDialog`, wired back to `menu_help_locale(...)` via a `CallableReference`. |

### The "Changes" dialog

`GithubChangesDialog` (`src/classes/prefabs/dialogs/thirdparty/GithubChangesDialog.php`)
uses `GitHubChangesHelper::newInstance()` to fetch recent history from the
project's GitHub repository:

- `getMergedCommitsToBranch(11, 'release')` — the primary path: the 11 most
  recent pull requests merged into the `release` branch, resolved via the
  GitHub Pull Requests API (`state=closed`, `base=<branch>`, filtered to
  `merged_at !== null`).
- Falls back to `getCommits(11)` (raw commit history, merge commits only by
  default) if the PR-based lookup returns nothing (e.g. no base branch
  configured).

Each result becomes a `GitCommit` value object (`src/classes/models/github/GitCommit.php`:
`sha`, `htmlUrl`, `message`, `authorName`, `committedDate`) and is rendered as
a numbered button labelled with a timestamp prefix and a truncated commit/PR
title. Selecting one (`menu_help_changes(...)`) re-fetches the single commit by
SHA (`getCommitBySha(...)`) and posts its full message, author, date, and a
link back to GitHub via `CommOwnerSay`.

`GitHubChangesHelper` (`src/classes/helpers/GitHubChangesHelper.php`) wraps the
`knplabs/github-api` client over a PSR-18 HTTP client. Repository coordinates
come from the `GITHUB_OWNER`/`GITHUB_REPO`/`GITHUB_BRANCH` application
settings; an optional `GITHUB_TOKEN` setting (or a `github-token.txt` file at
the project root as a fallback) authenticates the client to raise GitHub's
unauthenticated rate limit and allow access to private repositories. Network
or API failures are logged and degrade to an empty result rather than
throwing, so a misconfigured or unreachable GitHub falls back gracefully (the
dialog will simply show no entries, and picking one reports it couldn't load
commit details).

> **Note:** an older, unrelated static page, `ui/changelog.phtml`, also exists
> in the repository. It queries a legacy Bitbucket repository's merged pull
> requests directly from PHP embedded in HTML and is not linked from anywhere
> in the application or referenced by `GitHubChangesHelper`. It appears to be
> orphaned leftover from before the project moved to GitHub and is not part of
> the "Changes" feature described above.

### Extension points

- **New Help option:** add a `HelpDialog::ACTION_*` constant, a label in the
  `Application::translateBatch(...)` call in the constructor, and a `case` in
  `menu_help(...)`.
- **New changelog source:** `GitHubChangesHelper` could be swapped or extended
  for a different forge/API by implementing the same `GitCommit[]`-returning
  methods `GithubChangesDialog` relies on.

See [System Design](system-design.md) for how dialogs and the main menu fit
into the overall request/state flow, and
[Command-Line Interaction](command-line-tooling.md) for the separate,
typed `/ane help <topic>` chat-command help system (a different feature from
this touch-menu).
