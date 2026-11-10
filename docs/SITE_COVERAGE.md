# Published documentation coverage

Reviewed on November 9, 2026 against all 24 Markdown files in
`/Volumes/Shared_Drive/docs`. All supplied files are preserved byte-for-byte in
`docs/`. The supplied `DOCS_STATE.md` dates its pass November 10, 2026 and records
covered backend revision `6401199269d330643a0eb9b29b30cff4272b418d`, compared with
baseline `dce81e73b31f74d193867acbaff2b9c5d99cacf2`. These are source metadata,
not an independent verification of that backend checkout or deployed behavior.

Compared with the previous repository snapshot:

- 11 existing files changed: `DOCS_STATE.md`, `README.md`, `abilities.md`,
  `account-and-profiles.md`, `architecture.md`, `companion-dashboard.md`,
  `rlv-and-control.md`, `search-and-discovery.md`, `species-compatibility.md`,
  `species-creation.md`, and `store-and-rewards.md`.
- Two files are new here: `species-ancestry-and-taxonomy.md` and
  `database-cloning.md`. The supplied changelog's “Added / renamed: none” refers
  to its own backend baseline, not to this site's older snapshot.
- The other 11 supplied files are unchanged.
- `species-abilities.md` was removed from the source set. Its schema, operations,
  and regression details were consolidated into `abilities.md`; its public
  Abilities route and feature remain available. No public page was removed.
- `system-design.md` remains a project-local compatibility link to architecture.
  This coverage report also remains project-local.

## Topic mapping

Only player guidance is published. Developer APIs, migrations, locking and
transaction internals, signed demo context, semantic button metadata, database
cloning, deployment commands, and regression details remain in the source
references. The index and coverage records are maintenance documents.

| Source | Published page | Review result |
| --- | --- | --- |
| [Architecture](architecture.md) | [System overview](../src/content/docs/system-guide/system-overview.mdx) | Added identity, ancestry, taxonomy distinctions, current dashboard entry, and dedicated garden routing. |
| [Accounts and profiles](account-and-profiles.md) | [Accounts and profiles](../src/content/docs/system-guide/accounts-and-profiles.mdx) | Added optional identity, shared visibility, atomic rejection and stale-save guidance; corrected blocking scope. |
| [Abilities](abilities.md) | [Abilities](../src/content/docs/system-guide/abilities.mdx) | Retained exact eligibility and percentage-point Bite effects; added unavailable dashboard entries and recent owner-location requirements. |
| [Search and discovery](search-and-discovery.md) | [Search and discovery](../src/content/docs/system-guide/search-and-discovery.mdx) | Separated recipes, personal ancestry, uncertain definition matches, and pair-specific contributions; corrected garden ownership, area, privacy, arrival, and browser controls. |
| [Companion dashboard](companion-dashboard.md) | [Companion dashboard](../src/content/docs/system-guide/companion-dashboard.mdx) | Removed advertised Tree access; added identity, fluid/compartment summaries, taxonomy, gardens, and outfits with links to their owning guides. |
| [Species compatibility](species-compatibility.md) | [Species compatibility](../src/content/docs/system-guide/species-compatibility.mdx) | Added relative weights, complete-ancestry birth matching, taxonomy, capped garden/partner boosts, and affinity/arousal; distinguished overlap from final match. |
| [Species creation](species-creation.md) | [Creating a species](../src/content/docs/system-guide/creating-a-species.mdx) | Replaced remainder-based percentages with independent weights; added nested members, birth rules, and immutable saved taxonomy. Retained stat-budget guidance. |
| [Ancestry and taxonomy](species-ancestry-and-taxonomy.md) | [Ancestry and taxonomy](../src/content/docs/system-guide/ancestry-and-taxonomy.mdx) | New player guide in System Guide navigation; preserves worked inheritance, taxonomy, and scoring tables. All seven source Mermaid flowcharts render as static, theme-aware SVGs alongside the worked tables. The renderer reads the end-user diagrams directly from the supplied reference; long labels wrap without changing their content. Charts support horizontal scrolling and keyboard focus on narrow screens, with accessible text descriptions. |
| [RLV and control](rlv-and-control.md) | [RLV outfits](../src/content/docs/optional-add-ons/rlv-outfits.mdx) | Added browser outfit controls, shared underwear, bulk-action scope, stale choices, and command-dispatch versus actual wear state. |
| [Store and rewards](store-and-rewards.md) | [AnE Store](../src/content/docs/getting-started/operation/ane-store.mdx) | Changed source text is developer-only; existing player guidance already reflects access for every account. |
| [Database cloning](database-cloning.md) | None | New developer-only operations reference; intentionally excluded from public navigation and search. |
| [Reproduction and genetics](reproduction-and-genetics.md) | [Reproduction and genetics](../src/content/docs/system-guide/reproduction-and-genetics.mdx) | Source unchanged; linked the newer complete-ancestry birth selection rules from the species guides. |
| [Interaction lifecycle](interaction-lifecycle.md) | [Interaction and role-play](../src/content/docs/system-guide/interaction-and-roleplay.mdx) | Source unchanged; existing coverage retained. |
| [Form shapeshifters](form-shapeshifters.md) | [Form shapeshifters](../src/content/docs/system-guide/form-shapeshifters.mdx) | Source unchanged; existing coverage retained. |
| [Items and devices](attachable-items-and-devices.md) | [Attachable items and devices](../src/content/docs/system-guide/attachable-items-and-devices.mdx) | Source unchanged; existing coverage retained. |
| [AI companion](ai-companion.md) | [AI companion](../src/content/docs/system-guide/ai-companion.mdx) | Source unchanged; existing coverage retained. |
| [Web portal](web-portal.md) | [Web portal](../src/content/docs/system-guide/web-portal.mdx) | Source unchanged; existing coverage retained. |
| [Packs and groups](packs-and-groups.md) | [Packs](../src/content/docs/getting-started/packs.mdx) | Source unchanged; existing coverage retained. |
| [Chat commands](command-line-tooling.md) | [Command line](../src/content/docs/getting-started/command-line.mdx) | Source unchanged; existing coverage retained. |
| [Third-party integrations](third-party-integrations.md) | [Third-party integrations](../src/content/docs/system-guide/third-party-integrations.mdx) | Source unchanged; existing coverage retained. |
| [Help and support](help-and-support.md) | [Help and support](../src/content/docs/overview/help-and-support.mdx) | Source unchanged; existing six-month history guidance retained. |
| [Vitality and stats](vitality-and-stats.md) | [Vitality and stats](../src/content/docs/system-guide/vitality-and-stats.mdx) | Source unchanged; existing coverage retained. |

## Cross-page consistency and source conflicts

Updated the older operation species-compatibility page and conception
character-compatibility page. They incorrectly limited hybrids to their own
species or assigned fixed 100/50/25 scores. Corrected the conception-probability
page's extra hybrid-selection roll and the old example applying bonuses after
form/class penalties. Retained the routes, anchors, and historical illustrations,
with explanatory labels where an illustration may reflect older scoring.

The species creation source still has an older paragraph allowing taxonomy
changes/clearing after creation. Its newer introductory rule and dedicated
one-time-definition section, reinforced by the compatibility guide, explicitly
prohibit changing saved classifications. Published guidance follows that newer
contract. The source copies remain unchanged. Taxonomy suggestion limits and
failure behavior also differ between developer sections; those internals are not
published and still need upstream reconciliation.

The taxonomy overview source describes inherited branch percentages in its
player section but says the overview reports species classification, rather
than individual genealogy, in its developer contract. Published overview wording
uses species recipe percentages; individual ancestry is explained separately
under discovery and the worked guide.

Backend capability does not verify a deployed frontend. Conditional dashboard
wording is retained. The source's deferred topics and privacy questions remain
in `DOCS_STATE.md`; this pass does not claim a complete backend or live-game audit.

## November 9 verification

- All 24 supplied Markdown files match their local copies byte-for-byte.
- Source links to sibling Markdown documents resolve; backend code/DDL links
  intentionally point outside this documentation-only checkout.
- `npm run validate` passed: zero type errors, warnings, or hints; 78 HTML pages;
  6,490 local links/assets checked; all 69 retained migrated routes exist.
- Compared every rendered page and ID with a fresh pre-edit build: no missing
  pages or anchors. The ancestry guide is the only new public route.
- Ran `npm run dev`; the updated species page returned HTTP 200 and contained
  the revised relative-weight guidance.
- Ran `npm run preview`; the new ancestry page returned HTTP 200. Queried the
  HTTP-served Pagefind index for `Aster`, `relative weights`, `sexuality`,
  `arrival point`, `underwear`, and `percentage points`; all found their expected
  updated guides.
- Visual browser inspection was unavailable: the dedicated browser host could
  not connect, and automatic approval review rejected access to existing Chrome
  windows because unrelated private tabs could be exposed. HTTP and search
  checks do not establish visual layout or search-dialog behavior.
- The sandboxed build crashed with macOS `SecItemCopyMatching failed -50`;
  the baseline build and validation succeeded outside the sandbox.
- No commit, push, deployment, or live-game verification was performed.

## Flowchart restoration

Restored all seven player-facing Mermaid diagrams to the ancestry guide after
reviewing the supplied taxonomy screenshot. The new build-time component reads
the original source blocks directly and emits inline SVG without client-side
JavaScript or external font requests. Theme colors follow Starlight, long labels
wrap, and wide charts scroll within a keyboard-accessible container. Each chart
has a caption and a descriptive text alternative. SVG marker IDs are unique.
The scoring diagram routes its direct overlap-to-base arrow above the other
nodes so it does not cross the taxonomy box.

Verification: all 51 source nodes and 47 directed edges, including their labels,
are preserved across seven rendered charts. Light and dark SVG rasterizations
were inspected. The dev and production previews serve all seven charts, and
production Pagefind still returns the updated guide. `npm run validate` passes
with 78 HTML pages, 6,490 checked local links/assets, and all 69 retained routes.
The dedicated browser connection remains unavailable, so full-page browser
layout and live theme switching were not visually verified.

## Historical synchronization records

The records below describe earlier snapshots and their verification results.
They do not override the current mapping above.

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
