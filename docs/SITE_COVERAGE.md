# Published documentation coverage

Reviewed on October 3, 2026 against all 20 feature documents supplied in
`/Volumes/LTS/docs`. The source coverage record is dated September 26, 2026
and covers backend commit `74d1a6116c395ca0a4975c981447eee9d081e0e3`.
This maps their end-user sections to the Starlight site. Developer implementation
sections remain engineering references in this folder, as specified in `README.md`.
They are not missing player-facing pages. `README.md`, `DOCS_STATE.md`, and this
coverage report are repository maintenance documents, not site content.

| Source | Published page | Review result |
| --- | --- | --- |
| [Architecture](architecture.md) | [System overview](../src/content/docs/system-guide/system-overview.mdx) | Updated the supported-dashboard scope and persistence limits; retained the existing published route. |
| [Accounts and profiles](account-and-profiles.md) | [Accounts and profiles](../src/content/docs/system-guide/accounts-and-profiles.mdx) | Added profession titles, blocking, and relationship links to breeding auto-acceptance rules. |
| [Interaction lifecycle](interaction-lifecycle.md) | [Interaction and role-play lifecycle](../src/content/docs/system-guide/interaction-and-roleplay.mdx) | Added browser auto-acceptance notices and scene choices; corrected Stop, FINISH, Resist, and initiator-only emergency-stop behavior, including other engagements. |
| [Reproduction and genetics](reproduction-and-genetics.md) | [Reproduction and genetics lifecycle](../src/content/docs/system-guide/reproduction-and-genetics.mdx) | Added history visibility by character type, six-calendar-month limits, pregnancy visibility from 10%, and stale-view recovery. Existing birth and inheritance coverage retained. |
| [Species compatibility](species-compatibility.md) | [Species compatibility](../src/content/docs/system-guide/species-compatibility.mdx) | Lineage, shared-slice calculation, examples, and FAQ covered. |
| [Species creation](species-creation.md) | [Creating a species](../src/content/docs/system-guide/creating-a-species.mdx) | Added owner editing of shared base species, impact acknowledgement, stale edits, and the distinction from character overrides. Existing wizard and stat-budget coverage retained. |
| [Abilities](abilities.md) | [Abilities](../src/content/docs/system-guide/abilities.mdx) | Added Transmute and Bite, eligibility, active-form behavior, target range, effects, and stale-target handling. Updated the older Character abilities page to point here. |
| [Form shapeshifters](form-shapeshifters.md) | [Form shapeshifters](../src/content/docs/system-guide/form-shapeshifters.mdx) | Appearance/biology distinction, form acquisition, fertility, and lineage covered; linked ability eligibility and connected outfits. |
| [Items and devices](attachable-items-and-devices.md) | [Attachable items and devices](../src/content/docs/system-guide/attachable-items-and-devices.mdx) | Added connected outfit profiles, alternative appearances, switching controls, and coverage/accessibility behavior; removed unavailable spunk extractor and Ovipositor examples. |
| [AI companion](ai-companion.md) | [AI role-play companion](../src/content/docs/system-guide/ai-companion.mdx) | Added Retry choices and touch-to-retry behavior while preserving scene progress. |
| [Companion dashboard](companion-dashboard.md) | [Companion web dashboard](../src/content/docs/system-guide/companion-dashboard.mdx) | Updated tester Web/Start UI access, separate Tree view, media controls, current location, relationships, histories, species settings, Store, partner-specific prompts, and stale views. |
| [Web portal](web-portal.md) | [Web portal](../src/content/docs/system-guide/web-portal.mdx) | Aligned linking instructions with the source and removed unsupported credential-encryption assurances. |
| [Search and discovery](search-and-discovery.md) | [Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx) | Scopes, results, blocking, and garden registration covered. |
| [Packs and groups](packs-and-groups.md) | [Packs](../src/content/docs/getting-started/packs.mdx) | Replaced conflicting legacy rules: one Alpha, nine total members, first member Beta, succession, dissolution, and birth inheritance. |
| [Store and rewards](store-and-rewards.md) | [AnE Store](../src/content/docs/getting-started/operation/ane-store.mdx) | Added browser purchases, changed-price handling, reward clearing without payout, and interrupted-purchase recovery. Marked old price tables as reference and linked the legacy route to the current guide. |
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


## October 3 synchronization

All 22 supplied Markdown files (20 mixed-audience feature guides plus the index
and coverage record) were copied byte-for-byte into `docs/`. `architecture.md`
replaces the former `system-design.md` reference; the old file is now a short
compatibility link. `SITE_COVERAGE.md` remains a project-local maintenance report.
No new feature topic or public route was needed. The retired Breeding Gardens
and Forests implementation page remains retired.

Compared all 20 end-user sections against the previous repository sources,
normalizing audience and heading-level changes. Seven sections changed:
architecture, dashboard, interactions, reproduction, species creation, Store,
and portal. The other 13 retain the same player guidance. Their source files
still receive the supplied audience metadata and developer-reference updates.
The existing public species guides already contained the sections that moved
under explicit end-user headings in the supplied source.

Updated the seven corresponding published guides and the legacy Store page.
Preserved existing page paths and explicit anchor IDs, including an alias for
`your-limits-are-always-in-charge` after correcting that heading. New source
links resolve to the existing public topic routes. Developer-only API contracts,
code identifiers, transaction internals, and unverified frontend implementation
details remain outside the published pages. Browser controls are described as
conditional on dashboard support, as required by the supplied source.

Validation covers the documentation build, rendered local links/assets, retained
routes and anchors, development preview, and production Pagefind search. It does
not verify the deployed game's dashboard panels or backend behavior.


### Verification results

- All 22 supplied files match their project copies byte-for-byte.
- All relative source-document links resolve to existing files.
- `npm run validate` passed: zero type errors, warnings, or hints; 77 rendered
  HTML pages; 6,228 checked local links/assets; all 69 retained migrated routes.
  The build also emitted notices for the absent optional i18n collection and
  custom 404 entry; the default 404 page was generated successfully.
- Compared all pre-update rendered page IDs with the new build: no missing pages
  or anchors.
- Opened the dashboard guide in `npm run dev` and inspected its rendered layout.
- Ran `npm run preview` and verified that Pagefind finds the new browser Store
  section, with matching results in the Store and dashboard guides.
