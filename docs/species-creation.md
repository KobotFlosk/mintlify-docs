# Creating a Species — Truebred, Hybrid & Composition Hybrid

How the in-world species-creation wizard works, and how new truebred, hybrid,
and composition-hybrid species are built and persisted.

- **🎮 End-User Documentation** — a guide for species creators using the
  wizard; no technical knowledge required.
- **🧑‍💻 Developer Documentation** — the wizard's implementation and the
  persistence rules behind it.

This document connects to [Species Compatibility](species-compatibility.md)
and [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md).

---

## 🎮 End-User Documentation

*A guide for species creators using the in-world creation wizard.*

This page walks you through making a new species and explains the three kinds you
can create. You don't need any technical knowledge — just follow the prompts.

---

## 1. The three kinds of species

What *kind* of species you end up with is decided by **how many member species you
add** to its recipe — you never set the "type" directly:

| Kind | Member species in the recipe | Example |
|------|------------------------------|---------|
| **Truebred** | none (it's its own species) | Fennec, Sergal, Kobold |
| **Hybrid** (true hybrid) | exactly **2** | Fenser = Sergal + Fennec |
| **Composition Hybrid** | **3 or more** | Fenserbold = Sergal + Fennec + Kobold |

> A recipe with a **single** member isn't a valid species, so the wizard won't let
> you finish until you've either added **zero** members (a truebred) or **two or
> more** (a hybrid). The **FINISH** button stays hidden until the recipe is valid.

> **Each hybrid must use a unique set of species.** If a hybrid — true *or*
> composition — already exists with the **exact same set** of member species, the
> wizard won't let you create another one. Only *which* species are in the mix
> matters; the percentages are ignored. The check runs the moment you press
> **FINISH**, and you'll be told which existing species already uses that
> combination so you can adjust the members.

Every member in a hybrid recipe has a **percentage** (its share of the mix), and
the shares always add up to **100%**.

---

## 2. Starting the wizard

When you begin, you're asked whether to **Clone** an existing species or start
from **Basic**.

- **Basic** — build a brand-new species from scratch (covered below).
- **Clone** — copy an existing species as a starting point, give it a new name,
  and confirm. Handy when your new species is a small tweak of one that already
  exists. (See §7.)

Choosing **Basic** next asks: **Purebred** or **Hybrid?**

- **Purebred** → make a truebred (§3).
- **Hybrid** → open the composition builder to add member species (§4 and §5).

> **AI presets (right after you name the species).** Once you've named a new
> species, the wizard asks the AI to **prefill best-guess fertility values** based
> on the name (and any descriptors), then shows them on a **review menu** — each
> value is its own button. Tap a value to change just that one (the wizard asks
> for the new number and drops you back on the menu), and press **FINISH** when
> you're happy with them. The suggestions are always sanity-clamped to valid
> ranges, and if the AI is unavailable the menu simply starts from sensible
> defaults, so creation is never blocked.

---

## 3. Creating a Truebred

A truebred is a species that stands on its own — it has no member species in its
recipe.

1. Choose **Basic → Purebred**.
2. **Name** the species.
3. On the **review menu**, tap any **species specifics** value to adjust it, then
   press **FINISH** (see §2 and §6).
4. Optionally **define descriptors** (appearance tags) — you can describe the
   look in your own words and let the AI turn it into tags, or **Skip**.
5. **Review** the summary and confirm.
6. **Name the founding Mother and Father** — these two become the species'
   original ancestors (its root lineage). See §6 "Founding pair".
7. Confirm — the species and its founding pair are created together.

---

## 4. Creating a Hybrid (two species)

A **true hybrid** blends **exactly two** species.

1. Choose **Basic → Hybrid** to open the composition builder.
2. **ADD** your **first** member species. The first member automatically holds
   the **remainder** of the mix, so you aren't asked for a percentage yet.
3. **ADD** your **second** member species. Now you're asked **what percentage**
   this species makes up — enter a whole number greater than 0 and less than the
   remaining amount. The first member's share shrinks automatically so the total
   stays 100%.
   - *Example:* add Sergal first, then add Fennec at **70%** → the recipe becomes
     **Sergal 30% / Fennec 70%** (Sergal takes the leftover 30%).
4. With two members in the recipe, the **FINISH** button appears. Press it.
   (If those two species already form an existing hybrid, the wizard sends you
   back to adjust the members — see the uniqueness rule in §1.)
5. **Name** the species, then **review/adjust** the AI-suggested fertility values
   on the menu and press **FINISH** (§2, §6); optionally add **descriptors**, and
   **review**.
6. **Name the founding Mother and Father.**

### What's special about a true hybrid's founding pair

For a true hybrid, the founding pair's **lineage (genes)** is **bred from the two
member species' own lineages** rather than starting fresh:

- **Mother** = member A's mother × member B's father
- **Father** = member A's father × member B's mother

You still **type the Mother and Father names** you want — only their ancestry is
derived automatically, so a Sergal+Fennec hybrid is genuinely descended from both
Sergals and Fennecs. The confirmation screen shows both the derived lineage and
the names you chose.

> If one of the two member species has no lineage of its own to breed from, the
> wizard will stop and tell you, rather than create an incomplete species.

---

## 5. Creating a Composition Hybrid (three or more species)

A **composition hybrid** blends **three or more** species. The steps are the same
as a true hybrid, you just keep adding members.

1. Choose **Basic → Hybrid**.
2. **ADD** the first member (it holds the remainder — no percentage asked).
3. **ADD** each additional member and give it a **percentage** (greater than 0,
   less than what's left). The first member keeps shrinking to hold the leftover
   so the total is always 100%.
   - *Example:* Sergal (first), then Fennec **50%**, then Kobold **20%** →
     **Sergal 30% / Fennec 50% / Kobold 20%**.
4. You can keep up to **9** members. Each member's button shows its current
   percentage so you can see the mix at a glance. Selecting a member **removes**
   it (and its share returns to the first member).
5. Press **FINISH** (available once you have at least two members). If this exact
   set of species already exists as a hybrid, you'll be sent back to adjust the
   members (see §1).
6. **Name** the species, then **review/adjust** the AI-suggested fertility values
   and press **FINISH** (§2, §6); optionally add **descriptors**, and **review**.
7. **Name the founding Mother and Father** — for a composition hybrid these are
   ordinary named root ancestors (a fresh lineage), just like a truebred.

---

## 6. The questions every species answers

Whichever type you make, the wizard collects the same core details. It enforces
sensible minimums/maximums for each and will re-ask if a value is out of range.
These are pre-filled with the AI's suggested values right after naming (§2); on
the review menu you can tap any one to change it, then press **FINISH**.

**Species specifics (reproductive profile):**

1. **Ovulation cycle** — how many days between cycles (minimum 4 days).
2. **Ovulation period** — the fertile window within the cycle.
3. **Ovulation count** — how many ova can be released.
4. **Gestation period** — how long a pregnancy lasts.
5. **Growth period** — how long offspring take to mature (at least the ovulation
   cycle length).
6. **Uterus size** — adult uterus volume in millilitres (an average adult human
   is ~60 ml, for reference).
7. **Embryo size** — the maximum volume an embryo can reach (within a min/max the
   wizard derives from the uterus size and ovulation count).
8. **Birth type** — how offspring are born:
   - **Live** (live birth)
   - **Ovum** (egg-laying)

**Descriptors (optional):** appearance/behavior tags. Describe the species in your
own words and the AI generates a tag list you can keep or skip.

**Founding pair (Mother & Father):** every species is seeded with two original
ancestors.

- **Truebred & Composition hybrid:** you name a Mother and a Father who become the
  species' fresh root lineage.
- **True hybrid:** you still name them, but their ancestry is bred from the two
  member species (see §4).

The species and its founding pair are always saved **together**, so a species is
never left without its lineage.

---

## 7. Cloning an existing species

If your new species is close to one that already exists:

1. Choose **Clone** at the start.
2. **Search and pick** the species to copy.
3. Give the clone a **new name** and confirm.

The clone copies the original's recipe and specifics as a starting point. (Note:
you can't base a new hybrid on an existing *composition* hybrid as a member —
composition hybrids aren't offered in the member search — but you can clone one
directly.)

---

## 8. Rules & tips at a glance

- **The type follows the recipe:** 0 members = truebred, 2 = hybrid, 3+ =
  composition hybrid. You never pick the type label directly.
- **AI presets save time.** Right after naming, accept the AI's suggested fertility
  values to skip the questions entirely, or customize them — the suggestions are
  always clamped to valid ranges.
- **Shares always total 100%.** The first member you add holds the leftover, so
  you only type percentages for the *additional* members.
- **Enter whole percentages** (e.g. `70`), greater than 0 and less than what's
  left. The first member can't drop to 0, so you can't give a later member the
  entire remaining share.
- **FINISH appears only when the recipe is valid** — i.e. two or more members for
  a hybrid.
- **Hybrids must be unique by their species set.** You can't FINISH a hybrid whose
  exact combination of member species already exists — percentages are ignored,
  only the set of species counts.
- **Up to 9 members** in a composition.
- **Remove a member** by selecting its button; its share returns to the first
  member.
- **Names matter:** always give real Mother and Father names — for a true hybrid
  these label a pair whose ancestry is bred from both member species.

---

*In short: pick Purebred or Hybrid, (for a hybrid) add two or more member species
with their percentages, answer the species' reproductive details, optionally tag
its appearance, and name its founding Mother and Father. The number of members
you add decides whether you've made a truebred, a hybrid, or a composition
hybrid.*

---

## 🧑‍💻 Developer Documentation

### The wizard

The whole flow lives in one dialog class,
`src/classes/prefabs/dialogs/wizards/SpeciesCreationWizardDialog.php`
(extends `DialogButtons`), driven step-by-step through named `menu_*` handler
methods chained via the framework's dialog/`CallableReference` machinery:

| Step | Method | Notes |
|---|---|---|
| Clone or Basic | `menu_step_init` | `ACTION_CLONE` opens `SpeciesSearchDialog`; `ACTION_BASIC` continues to purebred/hybrid choice. |
| Clone an existing species | `menu_clone_species` → `clone_naming_dialog` | Clones the entity (`clone $existingSpecies`), clears its id/fluids, rebuilds `hybridComposition` as fresh `SpeciesHybridModelImpl` entries so originals aren't re-parented. |
| Purebred vs Hybrid | `menu_breed_species` | Purebred goes straight to naming; Hybrid opens the composition loop (`dialogHybridSpecies`). |
| Composition loop | `menu_species_hybrid`, `menu_species_select`, `menu_species_probability` | `ACTION_ADD` opens `SpeciesSearchDialog` (composition hybrids excluded as candidate members); selecting an existing button removes that member. |
| Naming | `menu_species_name` | Rejects duplicate names via `SpeciesHelper::fetchSpeciesByName`. |
| AI presets review | `species_presets_dialog` / `species_presets_render` / `menu_species_presets` | `SpeciesHelper::generateFertilityPresets()` (AI) or `applyFertilityPresets($model, [])` (fallback defaults) seed the model; a `DialogButtonsDynamic` menu lets each field be edited individually via `SpeciesSpecificsHelper::valid*`/`adjustSpecies()` validators, returning to the same menu (`getReturnDialog()`). |
| Descriptors | `dialogDescriptorsPrompt`, `menu_species_descriptors_*` | Optional; `SpeciesHelper::generateDescriptors($description, $model)` turns free text into tags via AI. |
| Confirm | `menu_species_confirm`, `dialogSpeciesConfirm` | Renders `RenderHelper::renderSpeciesSpecifics()` and proceeds to founding-pair naming. |
| Founding pair naming | `dialogFoundingPairMother`, `menu_species_profile_mother`, `menu_species_profile_father` | Names are captured as **plain strings** (not transient entities) so they survive the dialog round-trip. |
| Final persistence | `menu_confirm_final` | See below. |

### Recipe → kind resolution

The wizard never sets a "type" field directly. `HybridTypeEnum` (truebred /
`TRUE_HYBRID` / composition) is resolved from the member count of
`SpeciesModelImpl::getHybridComposition()`:

- `dialogHybridSpecies()` hides the `ACTION_CON` (FINISH) button while
  `$composition->count() < 2`, and hides `ACTION_ADD` once `count() === 9`
  (the 9-member cap).
- `$this->getSpeciesModel()->getHybridType() === HybridTypeEnum::TRUE_HYBRID`
  is checked at `menu_species_profile_father` / `menu_confirm_final` time to
  branch into the true-hybrid-specific founding-pair breeding path.

### Percentage bookkeeping

`SpeciesHybridCompatibilityHelper` owns the remainder/share math used by the
wizard: `remainingShare()` (100% minus every explicit member's share),
`isValidMemberShare($share, $remaining)` (bounds check), and
`applyRemainderToFirst()` (re-pins the first member's `probability` so the
composition always totals exactly `1.0`), called after every add/remove.

### Hybrid-set uniqueness

`menu_species_hybrid`'s `ACTION_CON` branch calls
`SpeciesHelper::findDuplicateHybrid($this->getSpeciesModel())` immediately on
FINISH; if a hybrid with the identical member-species **set** (percentages
ignored) already exists, the user is told which one and sent back into the
composition loop rather than being allowed to create a duplicate.

### True-hybrid founding-pair breeding

On `menu_confirm_final`, when `getHybridType() === TRUE_HYBRID`:

1. `memberProgenitorsByGender()` resolves each of the two member species'
   named Mother/Father progenitors via
   `ProfileHelper::fetchProgenitorProfilesBySpecies()` (throws if a member has
   no lineage, aborting the transaction before anything is persisted).
2. `SpeciesHybridCompatibilityHelper::buildProgenitors()` constructs the new
   pair's **genes** as memberA.mother × memberB.father (mother) and
   memberA.father × memberB.mother (father).
3. The user-supplied Mother/Father **names** (captured earlier as strings)
   are applied on top of the bred genes, so the pair is never left defaulted
   to the species name.

Purebred and composition hybrids instead call `createParentProfile()` twice to
build two fresh, unrelated root progenitors (`GeneA`/`GeneB` both set to the
system's `rootProfile`).

### Persistence

The whole persist step runs inside `Application::getEntityManager()->wrapInTransaction(...)`:
the `SpeciesModelImpl` and its two progenitor `ProfileModelImpl` rows are
persisted together, so a species can never exist without a founding pair (this
mirrors the web API's species-create endpoint). On any failure the transaction
aborts and the user is told to try again rather than left with a partially
created species.

### Species specifics validation

`SpeciesSpecificsHelper` provides the min/max validators referenced by the
wizard's per-field editors (`validOvulationCycle`, `validOvulationPeriod`,
`validOvulationCount`, `validGestationPeriod`, `validMinimumGrowth`,
`validUterusSize`, `validEmbryoSize`, plus `minimumUterusSize`/`maximumUterusSize`,
`maximumOvulation`, `minimumGestationPeriod`, `minimumEmbryoSize`/`maximumEmbryoSize`)
and `adjustSpecies()` to re-derive any dependent bounds after each edit.
`EmbryoTypeEnum` (`EMBRYO_LIVE` / `EMBRYO_OVUM`) is the birth-type field.

### Key files

`src/classes/prefabs/dialogs/wizards/SpeciesCreationWizardDialog.php`,
`src/classes/prefabs/dialogs/wizards/SpeciesOverrideWizardDialog.php` (species
editing, not creation), `src/classes/helpers/SpeciesHelper.php`,
`SpeciesHybridHelper.php`, `SpeciesHybridCompatibilityHelper.php`,
`SpeciesSpecificsHelper.php`, `src/classes/models/SpeciesModelImpl.php`,
`SpeciesHybridModelImpl.php`, `src/classes/enums/HybridTypeEnum.php`,
`EmbryoTypeEnum.php`.

See [Species Compatibility](species-compatibility.md) for how the resulting
species' makeup is scored for breeding compatibility once created.
