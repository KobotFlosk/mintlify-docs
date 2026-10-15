# Published documentation coverage

Reviewed on October 15, 2026 against all 23 Markdown files supplied in
`/Volumes/LTS/docs`: 20 existing feature guides, one new technical abilities
reference, and two maintenance documents. The unchanged source coverage record
still reports September 26, 2026 and backend commit
`74d1a6116c395ca0a4975c981447eee9d081e0e3`; it does not identify the revision
behind the newly supplied changes.
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
| [Species abilities](species-abilities.md) | [Abilities](../src/content/docs/system-guide/abilities.mdx) | New technical reference retained in the project. Expanded the existing player guide with exact-species precedence, eligibility rules, target freshness/range, and precise Bite effects. |
| [Form shapeshifters](form-shapeshifters.md) | [Form shapeshifters](../src/content/docs/system-guide/form-shapeshifters.mdx) | Appearance/biology distinction, form acquisition, fertility, and lineage covered; linked ability eligibility and connected outfits. |
| [Items and devices](attachable-items-and-devices.md) | [Attachable items and devices](../src/content/docs/system-guide/attachable-items-and-devices.mdx) | Added connected outfit profiles, alternative appearances, switching controls, and coverage/accessibility behavior; removed unavailable spunk extractor and Ovipositor examples. |
| [AI companion](ai-companion.md) | [AI role-play companion](../src/content/docs/system-guide/ai-companion.mdx) | Added Retry choices and touch-to-retry behavior while preserving scene progress. |
| [Companion dashboard](companion-dashboard.md) | [Companion web dashboard](../src/content/docs/system-guide/companion-dashboard.mdx) | Updated Web/Start UI access for every account and automatic onboarding for accounts without profiles; retained the separate Tree view and existing panel guidance. |
| [Web portal](web-portal.md) | [Web portal](../src/content/docs/system-guide/web-portal.mdx) | Aligned linking instructions with the source and removed unsupported credential-encryption assurances. |
| [Search and discovery](search-and-discovery.md) | [Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx) | Scopes, results, blocking, and garden registration covered. |
| [Packs and groups](packs-and-groups.md) | [Packs](../src/content/docs/getting-started/packs.mdx) | Replaced conflicting legacy rules: one Alpha, nine total members, first member Beta, succession, dissolution, and birth inheritance. |
| [Store and rewards](store-and-rewards.md) | [AnE Store](../src/content/docs/getting-started/operation/ane-store.mdx) | Added browser purchases, changed-price handling, reward clearing without payout, and interrupted-purchase recovery. Marked old price tables as reference and linked the legacy route to the current guide. |
| [RLV and control](rlv-and-control.md) | [RLV outfits](../src/content/docs/optional-add-ons/rlv-outfits.mdx) | Added optional setup, Characters mode, scene attachment protection, and pregnancy size changes. |
| [Chat commands](command-line-tooling.md) | [Command Line](../src/content/docs/getting-started/command-line.mdx) | Added usage context, topic help, balance/OOC shortcuts, and admin access distinction. |
| [Third-party integrations](third-party-integrations.md) | [Third-party integrations and product compatibility](../src/content/docs/system-guide/third-party-integrations.mdx) | Added dashboard attachment management and manual Override instructions. |
| [Help and support](help-and-support.md) | [Help and support](../src/content/docs/overview/help-and-support.mdx) | Updated Changes to cover six months of history with pagination, full entry details, and a short reference when a summary is unavailable. |
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


## October 15 synchronization

Compared every supplied file with the October 3 snapshot at `b61c4d9`:

- Added `species-abilities.md`.
- Updated `companion-dashboard.md` and `help-and-support.md`.
- The remaining 20 supplied files are byte-for-byte unchanged. No source file
  was removed. `SITE_COVERAGE.md` and the `system-design.md` compatibility link
  remain project-local files.

All 23 supplied files are preserved byte-for-byte in `docs/`. The new abilities
reference is implementation-oriented and lacks the audience metadata required by
the supplied index. Its schema, API, deployment commands, and test details remain
in the source references. Its player-visible eligibility and Bite clarifications
are covered by the existing Abilities page, so no duplicate route or sidebar
entry is needed.

### Source inconsistencies resolved for publication

The updated dashboard implementation section explicitly replaces tester-only
Web/UI access with access for every account and adds automatic onboarding when
an account has no profiles. Its end-user opening instructions and the unchanged
source index still describe tester-only access. The published dashboard guide
follows the newly changed implementation description. This is source-based
coverage, not a live test of the game's frontend.

The Help implementation section now documents a six-month history with paging,
rather than eleven recent changes. The published Help guide explains that visible
behavior without exposing configuration or internal code names.

The new abilities reference clarifies that Bite drains percentage points, rather
than a percentage of the current balance. The public guide now gives the exact
5-point health and 10-point defense changes, the zero floor, a 60%-to-55% example,
and the 1 ml blood transfer. It also explains exact-species eligibility and the
lack of fallback to general rules when species-specific rules exist.

`README.md` and `DOCS_STATE.md` in the supplied folder were not updated with the
new reference or changed access rules. This report records the new source mapping
and discrepancies without silently rewriting the supplied snapshot.


### October 15 verification

- All 23 supplied Markdown files match the project copies byte-for-byte.
- `npm run validate` passed: zero type errors, warnings, or hints; 77 HTML pages;
  6,228 checked local links/assets; all 69 retained migrated routes.
- The build emitted the same optional i18n/custom-404 notices as the previous
  pass and generated the default 404 successfully.
- Compared rendered IDs with the pre-update build: no missing pages or anchors.
- Ran `npm run dev` and verified the updated Abilities page over HTTP.
- Ran `npm run preview` and exercised Pagefind against its HTTP-served index:
  `percentage points`, `eleven`, and `every account` returned the updated
  Abilities, Help, and dashboard guides respectively.
- Browser automation was unavailable, so this pass did not include visual or
  search-dialog interaction checks. No layout or navigation changes were made.
