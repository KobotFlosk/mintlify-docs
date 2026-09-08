# The AI Role-Play Companion

How the optional AI-narrated scene mode works: what it does for a player, and
how it is wired up as a pluggable AI backend with tool-calling.

- **🎮 End-User Documentation** — what the AI narrator does and how to use it.
- **🧑‍💻 Developer Documentation** — how the AI integration is built.

---

## 🎮 End-User Documentation

### What it is

Alongside the regular menu-driven scenes (see
[Interaction and Role-Play Lifecycle](interaction-lifecycle.md)), some characters
can start a **freeform, narrated** scene where an AI companion writes the
in-character narration, offers you choices, and reacts to what happens — much
like a live game master. This is an optional, access-gated feature rather than
part of the default experience.

### How you use it

- If your account has been granted access, a narrated scene type appears
  alongside the other scene options when you start an interaction with a
  partner.
- During the scene, the companion describes what's happening in character,
  offers you a small set of choices to pick from (or lets you type something of
  your own), and keeps the story moving — including handling dialogue, stat
  changes, and climaxes as the scene calls for them.
- The companion can also form a short **memory** of a scene afterwards — a
  first-person summary with a few tags — so meaningful moments can be recalled
  later rather than being forgotten the moment the scene ends.
- Long scenes are periodically condensed behind the scenes so the narration
  stays coherent without needing you to do anything.
- Using the AI narrator can draw on a limited, account-tied resource (similar
  to the credits used elsewhere in the system), since generating each turn of
  narration has a real cost.

### Things to keep in mind

- The AI companion only ever offers actions that your character and your
  partner's character could actually do — it respects the same body and
  content-limit rules as every other scene.
- Access to this feature is granted per-account; not everyone will see it, and
  that's expected — it's an experimental, opt-in addition rather than a
  replacement for the standard scenes.

---

## 🧑‍💻 Developer Documentation

### Where it plugs in

The AI-narrated scene is a **story** like any other, `ChoiceStory`
(`src/classes/stories/ChoiceStory.php`), listed alongside `StoryClimax`,
`StoryBreed`, `StoryAnal`, and `StoryOral` in `CopulateState::STORIES`. Its
availability is gated: it checks
`AccountHelper::hasRole(AccountRoleEnum::AI_PRIVILEGED)` (see
[Accounts and Profiles](account-and-profiles.md)) before offering itself as a
scene option.

### `AiService` — the façade

`AiService` (`src/classes/services/AiService.php`, extending the shared
framework's `AbstractBaseService`) is the single entry point stories use to
talk to an AI backend:

- `chat(...)` / `chatWithHistory(...)` — send a system prompt + message
  history to the active platform and get an `AiResponse` back.
- `chatWithTools(...)` / `chatWithResult(...)` — the same, but also expose a set
  of callable **tools** (MCP-style function-calling) and dispatch any tool
  calls the model makes back into the game engine (see below).
- `getPlatform()` / `setPlatform(...)` / `useAnthropic(...)` / `useGoogle(...)`
  / `useSelfHosted(...)` — platform selection.
- `enablePromptCaching(...)` — toggles Anthropic prompt-caching for the
  (potentially large) system prompt.
- `calculateCreditCost(...)` / `getAndResetCost()` — token-usage-based credit
  accounting (see Billing, below).

### Pluggable platforms

`AiPlatformInterface` / `AbstractAiPlatform` (`src/classes/ai/`) define the
contract; concrete adapters live in `src/classes/ai/platforms/`:

| Platform | Notes |
|---|---|
| `AnthropicPlatform` | Claude models via the Messages API; supports prompt caching. |
| `GoogleAiPlatform` | Gemini models via the Generative Language API. |
| `SelfHostedPlatform` | Generic OpenAI-compatible self-hosted endpoint. |
| `KoboldCppPlatform`, `Hermes3Llama3Platform`, `Dolphin3Platform`, `QwenPlatform`, `GlmPlatform`, `MinimaxPlatform`, `NemotronMiniPlatform` | Adapters tuned for specific locally-served open models, each with its own default context/token limits and tool-call parsing quirks. |

`AiService::createDefaultPlatform()` picks a platform from the `ai.provider`
application setting (defaulting to `anthropic`), and can configure a second
**fallback platform** (`ai.provider.fallback`) that `chatWithPlatform(...)`
falls back to if the primary call throws. Each platform's API key/base URL
comes from its own `ai.<provider>.*` setting.

`AbstractAiPlatform` centralises cross-cutting concerns every adapter needs:
a shared/injectable HTTP client (`httpClient()`), a resolved per-call timeout
(`resolveTimeout()`, priority: per-call option → `ai.timeout` setting →
platform default), optional stripping of `<think>...</think>` reasoning blocks
(`stripThinkingTags()`, gated by the `ai.strip.thinking.tags` setting), and two
fallback tool-call parsers (`parseToolCallTags()` for `<tool_call>{json}</tool_call>`
blocks, `parseYamlToolCalls()` for a YAML-ish `tool_name:\n  arg: value` shape)
for backends that don't return a structured tool-call field.

### Tools (MCP-style function calling)

`AbstractTool` (`src/classes/ai/mcp/tools/AbstractTool.php`) is the base for a
callable tool the AI model can invoke; `ToolSchemaConverter` renders registered
tools into the OpenAI-style function-calling schema. `AiService` registers a
default tool set on `on_commence()`:

| Tool name | Purpose |
|---|---|
| `create_dialog` (`DialogTool`) | Present an in-world dialog menu. |
| `send_output` (`OutputTool`) | Push arbitrary structured output/actions. |
| `fetch_stats` (`StatsFetchTool`) | Read a profile's current stats. |
| `apply_stats` (`StatsApplyTool`) | Adjust a profile's stats. |
| `speak` (`SpeakTool`) | Have a character say something in-character. |
| `choice_penetrate` (`ChoiceStoryPenetrateTool`) | Drive a penetration beat within `ChoiceStory`. |
| `choice_climax` (`ChoiceStoryClimaxTool`) | Drive a climax beat within `ChoiceStory`. |
| `choice_speak` (`ChoiceStorySpeakTool`) | Narration/dialogue specific to `ChoiceStory`. |
| `choice_dialog` (`ChoiceStoryDialogTool`) | Present `ChoiceStory`'s choice menu. |
| `choice_event` (`ChoiceStoryEventTool`) | Publish a role-play event from `ChoiceStory`. |
| `create_memory` (`CreateMemoryTool`) | Persist a `ProfileMemoryModelImpl` (first-person summary, tags, sentiment) for later recall. |

`trigger_event` (`EventTool`) and `speak`-adjacent `TranslateSpeakTool` also
exist for broader event dispatch and localized narration. Additional tools can
be registered at runtime via `AiService::registerTool(...)`; a scene-specific
subset can be scoped with `AiChatContext` (`createContextWithTools([...])`).

`AiService::parseToolCalls(...)` walks a model's `AiResponse` and, for each
tool call, resolves the matching registered tool and calls
`AbstractTool::handleParams(...)`, translating the model's structured call into
an `AbstractBaseAction` the game engine actually executes.

### Conversation context

`AiChatContext` carries the running message history (optionally a segmented
`[cacheable-prefix, ...tail]` system prompt for providers that support prompt
caching), plus any scene-scoped tool set. `ChoiceStory` periodically condenses
older turns into an "[Earlier-scene summary]" entry (`CONDENSE_AFTER_TURNS` /
`KEEP_RECENT_TURNS` constants) to keep token usage bounded across long scenes.

### Memory

`create_memory` persists a `ProfileMemoryModelImpl` (`pm_summary`, `pm_tags`,
`pm_sentiment`, `pm_created`) attached to the active profile, giving the
companion a lightweight long-term memory store that can be searched/recalled
in later scenes.

### Billing

AI usage is optionally billed against an account: `AiService::chat*(...)`
accepts an `$accountBillable` argument; `deductTokenUsage(...)` computes a
credit cost from the response's token usage
(`calculateCreditCost()`, driven by the `ai.token.credit-ratio` setting) and
debits it via `TransactionHelper`. `AiService::getAndResetCost()` lets a caller
(e.g. `ChoiceStory`) read back and reset the accumulated cost for the current
turn.

### Extension points

- **New platform:** add a class under `src/classes/ai/platforms/` extending
  `AbstractAiPlatform`, implement `AiPlatformInterface::chat(...)`, and wire it
  into `AiService::createPlatformByName(...)`.
- **New tool:** add a class under `src/classes/ai/mcp/tools/` extending
  `AbstractTool`, implement `getName()`, `getDescription()`,
  `getInputSchema()`, `handleParams(...)`, and `handlesAction(...)`, then
  register it via `AiService::registerTool(...)` (globally) or an
  `AiChatContext` (scene-scoped).
- **New AI-driven scene:** follow the `ChoiceStory` pattern — implement
  `StoryInterface`, call `AiService::getInstance()->chatWithTools(...)` /
  `chatWithResult(...)` with a scene-scoped `AiChatContext`, and gate
  availability behind an appropriate role/permission.

See [System Design](system-design.md) for how the AI layer fits into the
overall architecture, and
[Interaction and Role-Play Lifecycle](interaction-lifecycle.md) for how stories
in general drive scenes.
