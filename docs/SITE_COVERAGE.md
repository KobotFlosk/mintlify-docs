# Published documentation coverage

Reviewed on September 16, 2026 against all 20 feature documents in `docs/`.
This maps their end-user sections to the Starlight site. Developer implementation
sections remain engineering references in this folder, as specified in `README.md`.
They are not missing player-facing pages. `README.md`, `DOCS_STATE.md`, and this
coverage report are repository maintenance documents, not site content.

| Source | Published page | Review result |
| --- | --- | --- |
| [System design](system-design.md) | [System overview](../src/content/docs/system-guide/system-overview.mdx) | Covered; corrected dashboard/portal distinction and expanded related links. |
| [Accounts and profiles](account-and-profiles.md) | [Accounts and profiles](../src/content/docs/system-guide/accounts-and-profiles.mdx) | Added profession titles, blocking, and relationship links to breeding auto-acceptance rules. |
| [Interaction lifecycle](interaction-lifecycle.md) | [Interaction and role-play lifecycle](../src/content/docs/system-guide/interaction-and-roleplay.mdx) | Added greetings, announcements, all five auto-acceptance conditions in priority order, Clothing/Partner controls, and Free/Turn/Timeout pacing. |
| [Reproduction and genetics](reproduction-and-genetics.md) | [Reproduction and genetics lifecycle](../src/content/docs/system-guide/reproduction-and-genetics.mdx) | Added birth hand-off, acceptance/decline, and inherited pack membership. |
| [Species compatibility](species-compatibility.md) | [Species compatibility](../src/content/docs/system-guide/species-compatibility.mdx) | Lineage, shared-slice calculation, examples, and FAQ covered. |
| [Species creation](species-creation.md) | [Creating a species](../src/content/docs/system-guide/creating-a-species.mdx) | Added the new-species 10,000-point stat budget, default-inclusive totals, and scope of the limit; existing wizard coverage retained. |
| [Abilities](abilities.md) | [Abilities](../src/content/docs/system-guide/abilities.mdx) | Added Transmute and Bite, eligibility, active-form behavior, target range, effects, and stale-target handling. Updated the older Character abilities page to point here. |
| [Form shapeshifters](form-shapeshifters.md) | [Form shapeshifters](../src/content/docs/system-guide/form-shapeshifters.mdx) | Appearance/biology distinction, form acquisition, fertility, and lineage covered; linked ability eligibility and connected outfits. |
| [Items and devices](attachable-items-and-devices.md) | [Attachable items and devices](../src/content/docs/system-guide/attachable-items-and-devices.mdx) | Added connected outfit profiles, alternative appearances, switching controls, and coverage/accessibility behavior; removed unavailable spunk extractor and Ovipositor examples. |
| [AI companion](ai-companion.md) | [AI role-play companion](../src/content/docs/system-guide/ai-companion.mdx) | Added Retry choices and touch-to-retry behavior while preserving scene progress. |
| [Companion dashboard](companion-dashboard.md) | [Companion web dashboard](../src/content/docs/system-guide/companion-dashboard.mdx) | Added Bite/Transmute links, attachment management, manual Override, and return to automation. |
| [Web portal](web-portal.md) | [Web portal](../src/content/docs/system-guide/web-portal.mdx) | Linking and credential hand-off covered; made success/error outcomes explicit. |
| [Search and discovery](search-and-discovery.md) | [Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx) | Scopes, results, blocking, and garden registration covered. |
| [Packs and groups](packs-and-groups.md) | [Packs](../src/content/docs/getting-started/packs.mdx) | Replaced conflicting legacy rules: one Alpha, nine total members, first member Beta, succession, dissolution, and birth inheritance. |
| [Store and rewards](store-and-rewards.md) | [AnE Store](../src/content/docs/getting-started/operation/ane-store.mdx) | Added shared balance, browsing, purchase checks, free items, and reward claims/clearing. |
| [RLV and control](rlv-and-control.md) | [RLV outfits](../src/content/docs/optional-add-ons/rlv-outfits.mdx) | Added optional setup, Characters mode, scene attachment protection, and pregnancy size changes. |
| [Chat commands](command-line-tooling.md) | [Command Line](../src/content/docs/getting-started/command-line.mdx) | Added usage context, topic help, balance/OOC shortcuts, and admin access distinction. |
| [Third-party integrations](third-party-integrations.md) | [Third-party integrations and product compatibility](../src/content/docs/system-guide/third-party-integrations.mdx) | Added dashboard attachment management and manual Override instructions. |
| [Help and support](help-and-support.md) | [Help and support](../src/content/docs/overview/help-and-support.mdx) | New sidebar page covering all eight Help options and update/tutorial notes. |
| [Vitality and stats](vitality-and-stats.md) | [Vitality and stats](../src/content/docs/system-guide/vitality-and-stats.mdx) | Vitals and recovery covered; linked Bite effects, stat-based auto-acceptance, and new-species stat budgets. |

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

## September 16 synchronization

Only one new feature source was found: `abilities.md`. The other 19 feature
sources were compared with their previously committed versions, including their
end-user sections and relevant behavior changes in the developer sections.
Sources whose only user-facing differences were ampersands, links, or formatting
did not require a content rewrite. Published titles continue to use "and".

Updated the website pages for abilities, accounts, interactions, breeding,
reproduction, AI narration, items/devices, the dashboard, integrations, forms,
species creation, vitality, and the system overview. The older character-abilities
URL remains available but now directs readers to the current rules. Removed
blanket assurances that every breeding request requires the player's acceptance;
the guide now explicitly documents the source's automatic acceptance conditions.

Backend-only API, persistence, permission, and retry implementation details remain
in the supplied sources. The stat creation budget and active-form ability rules
are explained in plain language because they affect player-visible behavior.
The retired Breeding Gardens and Forests implementation page remains removed.
This synchronization does not reinstate it.

The uploaded source files were preserved; their changes are separate from this
website synchronization. The only source-side edit made for this review is this
coverage report. Deployment requires committing and pushing the site changes.
