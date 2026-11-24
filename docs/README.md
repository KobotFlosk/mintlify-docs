---
audience: developer
summary: Audience-aware index and publication rules for the AnE documentation.
---

# Documentation Index

This folder documents the system that powers **AnE** — a fertility, biology, and
role-play companion experience for a 3D virtual world. The backend simulates the
whole life-cycle "from conception to character": attraction, intimacy, fluid
exchange, conception, pregnancy, birth, genetics, species inheritance, and the
role-play events that tie them together.

The code on `develop` is the source of truth. These documents support developers
and a downstream tool producing player-facing help. The coverage record below
identifies the revision examined in the latest pass.

---

## How these documents are organised

Every document starts with YAML front matter containing `audience` (`developer`,
`end-user`, or `mixed`) and a one-sentence `summary`. In mixed documents, content
belongs under exactly labelled `## For developers` or `## For end-users`
sections; topic headings are nested beneath them.

Publish only end-user documents or the end-user sections of mixed documents.
Do not publish developer sections, this index, or the coverage record. End-user
prose must not expose implementation identifiers, file paths/extensions, API
addresses, configuration, credentials, or infrastructure details. Documentation
links are navigation metadata: resolve them to the corresponding published
end-user topic, without exposing repository paths or including developer content.
Backend support alone does not verify a feature's deployed frontend presentation.

---

## Player guides

- [Oviposit rules](oviposit-rules.md) explains which forms can deposit eggs and how they do it.

## Mixed audience — product and subsystem guides

Each guide below has separate end-user and developer sections. Start with
Architecture, then follow the topic links.

| Document | What it covers |
|---|---|
| [Architecture](architecture.md) | The major components and how they fit together. **Read this first.** |
| [Interaction & Role-Play Lifecycle](interaction-lifecycle.md) | Startup, scenes, turns, automatic acceptance, notifications, and engagement stopping. |
| [Vitality & Stats](vitality-and-stats.md) | Stat changes, consciousness, death, and species stat budgets. |
| [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md) | Conception, pregnancy, birth, inheritance, and history visibility. |
| [Species Compatibility](species-compatibility.md) | Inherited composition, breeding compatibility, personal species attraction preferences, and gaze notices. |
| [Ancestry & Taxonomy Worked Guide](species-ancestry-and-taxonomy.md) | Diagrams and worked examples tracing species recipes and family trees into inherited percentages, weighted taxonomy, and compatibility. |
| [Creating a Species](species-creation.md) | Creation wizard, founding lineage, web attributes, and owner editing. |
| [Form Shapeshifters](form-shapeshifters.md) | Apparent form versus real biology. |
| [Abilities](abilities.md) | Shift and Bite eligibility, grant deployment, effects, and regression coverage. |
| [Attachable Items & Devices](attachable-items-and-devices.md) | Consumables, attachable plugins, and timed effects. |
| [Accounts & Profiles](account-and-profiles.md) | Active characters, native/browser identity editing and visibility, relationships, trust, roles, and explicit tester eligibility. |
| [Search & Discovery](search-and-discovery.md) | Saved filters, identity/activity, individual ancestry versus species definitions, compatibility explanations, and gardens. |
| [The AI Role-Play Companion](ai-companion.md) | Narration, tools, choices, memory, and resilience. |
| [Third-Party Integrations & Product Compatibility](third-party-integrations.md) | Optional service bridges and body add-on compatibility. |
| [The Web Portal](web-portal.md) | One-off hand-offs for linking outside services. |
| [The Companion Web Dashboard](companion-dashboard.md) | Signed entry, onboarding and browser restoration, character panels, discovery routing, media controls, and per-partner prompts. |
| [The Store & Rewards Economy](store-and-rewards.md) | In-world and browser purchases, Credits, rewards, and delivery/retry boundaries. |
| [RLV-Driven Character & Outfit Control](rlv-and-control.md) | Appearance automation, browser outfit/garment contracts, legacy controls, and attachment protection. |
| [Command-Line Interaction](command-line-tooling.md) | Chat shortcuts, dispatch, and help. |
| [Help & Support Menu](help-and-support.md) | Community support, manuals, updates, and language options. |

---

## Developer audience — documentation maintenance

This documentation set is regenerated on an interval to stay consistent with the
evolving codebase. Expect documents to be **added, reworked, renamed, or
removed** over time as the system grows and comprehensive coverage is filled in.
The [Architecture](architecture.md) document is the anchor; detailed topics are
broken out into their own files whenever a subsystem is large or complex enough to
warrant it.

- [Coverage record](DOCS_STATE.md) — the commit each pass covered, changelog,
  and deferred work.
- [Database cloning](database-cloning.md) — replace test from production or local from test.
- [This index](README.md) — document ownership and audience navigation.
