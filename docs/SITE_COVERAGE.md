# Published documentation coverage

Reviewed on September 8, 2026 against all 19 feature documents in `docs/`.
This maps their end-user sections to the Starlight site. Developer implementation
sections remain engineering references in this folder, as specified in `README.md`.
They are not missing player-facing pages. `README.md`, `DOCS_STATE.md`, and this
coverage report are repository maintenance documents, not site content.

| Source | Published page | Review result |
| --- | --- | --- |
| [System design](system-design.md) | [System overview](../src/content/docs/system-guide/system-overview.mdx) | Covered; corrected dashboard/portal distinction and expanded related links. |
| [Accounts and profiles](account-and-profiles.md) | [Accounts and profiles](../src/content/docs/system-guide/accounts-and-profiles.mdx) | Account, character, relationships, trust, packs, roles, and settings covered. |
| [Interaction lifecycle](interaction-lifecycle.md) | [Interaction and role-play lifecycle](../src/content/docs/system-guide/interaction-and-roleplay.mdx) | Startup, partner scenes, actions, add-ons, and limits covered. |
| [Reproduction and genetics](reproduction-and-genetics.md) | [Reproduction and genetics lifecycle](../src/content/docs/system-guide/reproduction-and-genetics.mdx) | Added birth hand-off, acceptance/decline, and inherited pack membership. |
| [Species compatibility](species-compatibility.md) | [Species compatibility](../src/content/docs/system-guide/species-compatibility.mdx) | Lineage, shared-slice calculation, examples, and FAQ covered. |
| [Species creation](species-creation.md) | [Creating a species](../src/content/docs/system-guide/creating-a-species.mdx) | Wizard, recipes, AI presets, founding pairs, specifics, cloning, and uniqueness covered. |
| [Form shapeshifters](form-shapeshifters.md) | [Form shapeshifters](../src/content/docs/system-guide/form-shapeshifters.mdx) | Appearance/biology distinction, form acquisition, fertility, and lineage covered. |
| [Items and devices](attachable-items-and-devices.md) | [Attachable items and devices](../src/content/docs/system-guide/attachable-items-and-devices.mdx) | Consumables, devices, optional add-ons, and gradual effects covered. |
| [AI companion](ai-companion.md) | [AI role-play companion](../src/content/docs/system-guide/ai-companion.mdx) | Access, narration, choices, memory, costs, and limits covered. |
| [Companion dashboard](companion-dashboard.md) | [Companion web dashboard](../src/content/docs/system-guide/companion-dashboard.mdx) | Opening, panels, synchronization, and privacy covered. |
| [Web portal](web-portal.md) | [Web portal](../src/content/docs/system-guide/web-portal.mdx) | Linking and credential hand-off covered; made success/error outcomes explicit. |
| [Search and discovery](search-and-discovery.md) | [Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx) | Scopes, results, blocking, and garden registration covered. |
| [Packs and groups](packs-and-groups.md) | [Packs](../src/content/docs/getting-started/packs.mdx) | Replaced conflicting legacy rules: one Alpha, nine total members, first member Beta, succession, dissolution, and birth inheritance. |
| [Store and rewards](store-and-rewards.md) | [AnE Store](../src/content/docs/getting-started/operation/ane-store.mdx) | Added shared balance, browsing, purchase checks, free items, and reward claims/clearing. |
| [RLV and control](rlv-and-control.md) | [RLV outfits](../src/content/docs/optional-add-ons/rlv-outfits.mdx) | Added optional setup, Characters mode, scene attachment protection, and pregnancy size changes. |
| [Chat commands](command-line-tooling.md) | [Command Line](../src/content/docs/getting-started/command-line.mdx) | Added usage context, topic help, balance/OOC shortcuts, and admin access distinction. |
| [Third-party integrations](third-party-integrations.md) | [Third-party integrations and product compatibility](../src/content/docs/system-guide/third-party-integrations.mdx) | New sidebar page covering service connections and compatible accessories. |
| [Help and support](help-and-support.md) | [Help and support](../src/content/docs/overview/help-and-support.mdx) | New sidebar page covering all eight Help options and update/tutorial notes. |
| [Vitality and stats](vitality-and-stats.md) | [Vitality and stats](../src/content/docs/system-guide/vitality-and-stats.mdx) | New sidebar page covering each vital, recovery, unconsciousness, and permanent character death. |

## Scope of verification

This review checks coverage against the repository sources, not against a running
AnE backend. Existing price tables and older historical pages are not a fresh
verification of current game behavior. The primary Packs guide now follows the
source of truth instead of its contradictory legacy text.

Page and section titles, sidebar labels, and linked document names use **and**
instead of an ampersand. Existing page routes remain unchanged. Compatibility
anchors preserve the old section links where a heading change alters its slug.

Run `npm run validate` after content or navigation updates to check the build,
local links and anchors, and all original migrated routes.
