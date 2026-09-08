# Documentation Index

This folder documents the system that powers **AnE** — a fertility, biology, and
role-play companion experience for a 3D virtual world. The backend simulates the
whole life-cycle "from conception to character": attraction, intimacy, fluid
exchange, conception, pregnancy, birth, genetics, species inheritance, and the
role-play events that tie them together.

These documents are the **source of truth** that a downstream tool uses to
generate published, player-facing help. Because of that, every document follows a
strict convention so the two audiences never get mixed up.

---

## How these documents are organised

Each document is split into clearly labelled sections:

- **🧑‍💻 Developer Documentation** — how the implementation actually works:
  architecture, class and interface names, data flow, persistence, enums, and
  extension points. This is for engineers working on the codebase.
- **🎮 End-User Documentation** — how the feature is experienced and used by
  players and creators, in plain language.

> **Rules for the End-User sections (must be honoured by every document):**
> - No exact class, interface, or file-type names. Use relatable, descriptive
>   names for a concept if one is needed (e.g. "the interaction engine", "the
>   species recipe").
> - No configuration keys, environment variables, endpoints, credentials, or
>   anything that could raise a security concern.
> - No implementation-internal jargon that a player would never see.
>
> Everything that references code (class names, enums, file types,
> configuration, infrastructure) belongs **only** in a Developer section.

When a document is entirely aimed at one audience, it says so at the top and is
still safe to read on its own.

---

## Start here

| Document | Audience | What it covers |
|---|---|---|
| [System Design](system-design.md) | Both | The high-level architecture of the whole system and how the parts fit together. **Read this first.** |
| [Interaction and Role-Play Lifecycle](interaction-lifecycle.md) | Both | The core gameplay loop: how a device wakes up, how intimate scenes are driven, and how role-play events flow. |
| [Reproduction and Genetics Lifecycle](reproduction-and-genetics.md) | Both | Fluids, conception, pregnancy, birth, and how a child inherits its genetics and species. |
| [Species Compatibility](species-compatibility.md) | Both | How the compatibility percentage between two characters is calculated. |
| [Creating a Species](species-creation.md) | Both | Using the in-world wizard to make truebred, hybrid, and composition-hybrid species. |
| [Form Shapeshifters](form-shapeshifters.md) | Both | How apparent form and real biology are split for shapeshifting characters. |
| [Attachable Items and Devices](attachable-items-and-devices.md) | Both | Consumable items (pills, potions, fluid containers) and attachable plugins/devices (extractors, ovipositors, connected toys). |
| [Accounts and Profiles](account-and-profiles.md) | Both | The account/character split, switching characters, relationships, trust, and access roles. |
| [Packs and Groups](packs-and-groups.md) | Both | Forming a named group of characters with an internal hierarchy, invites, and birth inheritance. |
| [The AI Role-Play Companion](ai-companion.md) | Both | The optional AI-narrated scene mode and how the pluggable AI/tool-calling layer is built. |
| [Third-Party Integrations and Product Compatibility](third-party-integrations.md) | Both | Linkable outside services (messaging, connected toys, character directory, game platform) and compatibility with third-party body add-ons. |
| [The Web Portal](web-portal.md) | Both | The browser-based hand-off page used to securely link outside accounts. |
| [The Store and Rewards Economy](store-and-rewards.md) | Both | The Credit-based shop, purchases, and one-off reward grants. |
| [RLV-Driven Character and Outfit Control](rlv-and-control.md) | Both | Automated outfit/body attachment and detachment, and protecting the companion from accidental removal. |
| [Command-Line Interaction](command-line-tooling.md) | Both | The typed chat-command shortcuts layered on top of the menu system. |

---

## Documentation maintenance

This documentation set is regenerated on an interval to stay consistent with the
evolving codebase. Expect documents to be **added, reworked, renamed, or
removed** over time as the system grows and comprehensive coverage is filled in.
The [System Design](system-design.md) document is the anchor; detailed topics are
broken out into their own files whenever a subsystem is large or complex enough to
warrant it.
