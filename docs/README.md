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

## Mixed audience — product and subsystem guides

Each guide below has separate end-user and developer sections. Start with
Architecture, then follow the topic links.

| Document | What it covers |
|---|---|
| [Architecture](architecture.md) | The major components and how they fit together. **Read this first.** |
| [Interaction & Role-Play Lifecycle](interaction-lifecycle.md) | Startup, scenes, turns, automatic acceptance, notifications, and engagement stopping. |
| [Vitality & Stats](vitality-and-stats.md) | Stat changes, consciousness, death, and species stat budgets. |
| [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md) | Conception, pregnancy, birth, inheritance, and history visibility. |
| [Species Compatibility](species-compatibility.md) | Inherited species composition and compatibility scoring. |
| [Creating a Species](species-creation.md) | Creation wizard, founding lineage, web attributes, and owner editing. |
| [Form Shapeshifters](form-shapeshifters.md) | Apparent form versus real biology. |
| [Abilities](abilities.md) | Shift and Bite eligibility, grants, and effects. |
| [Attachable Items & Devices](attachable-items-and-devices.md) | Consumables, attachable plugins, and timed effects. |
| [Accounts & Profiles](account-and-profiles.md) | Active characters, relationships, trust, and roles. |
| [Packs & Groups](packs-and-groups.md) | Group hierarchy, invitations, and birth inheritance. |
| [Search & Discovery](search-and-discovery.md) | Character searches and community locations. |
| [The AI Role-Play Companion](ai-companion.md) | Narration, tools, choices, memory, and resilience. |
| [Third-Party Integrations & Product Compatibility](third-party-integrations.md) | Optional service bridges and body add-on compatibility. |
| [The Web Portal](web-portal.md) | One-off hand-offs for linking outside services. |
| [The Companion Web Dashboard](companion-dashboard.md) | Tester entry, media controls, current location, character panels, and per-partner prompts. |
| [The Store & Rewards Economy](store-and-rewards.md) | In-world and browser purchases, Credits, rewards, and delivery/retry boundaries. |
| [RLV-Driven Character & Outfit Control](rlv-and-control.md) | Automated outfits, bodies, and attachment protection. |
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
- [This index](README.md) — document ownership and audience navigation.
