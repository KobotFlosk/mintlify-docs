---
audience: mixed
summary: Creating species and their founding lineages, and editing base species settings.
---

# Creating a Species — Truebred, Hybrid & Composition Hybrid

## For end-users

*A guide for species creators using the in-world creation wizard.*

This page walks you through making a new species and explains the three kinds you
can create. You don't need any technical knowledge — just follow the prompts.

---

### 1. The three kinds of species

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
> matters; the weights are ignored. The check runs the moment you press
> **FINISH**, and you'll be told which existing species already uses that
> combination so you can adjust the members.

Every member has a **relative composition weight** from **0 to 100**. The
weights do not need to total 100: **60 Sergal and 60 Dragon** compares as equal
parts, or 50% each, when the species recipe is used for compatibility. Stored
values stay as entered; positive weights are normalized during comparison.

After conception succeeds, the child's species is selected by matching the
complete set of truebred ancestors from both parents to a registered hybrid's
expanded recipe. Exactly one matching definition selects that hybrid. No match,
multiple matches, or incomplete ancestry retains the ovum donor's species.
There is no additional maternal-species probability roll. A listed member with
weight zero still belongs to the set used for birth matching.

Only purebreds define their own taxonomy. Once a species classification is saved,
users cannot change or clear it. An existing unclassified purebred's owner can
use **Define taxonomy** to set all eight ranks exactly once. True hybrids and composition hybrids
derive taxonomy from their member species, including nested compositions.
Species overlap and taxonomy keep their existing normalized-weight calculations;
birth matching uses complete membership separately. See
[taxonomy compatibility](species-compatibility.md#8-optional-taxonomy-compatibility)
for the weighting rules and examples.

---

### 2. Starting the wizard

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

### 3. Creating a Truebred

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

### 4. Creating a Hybrid (two species)

A **true hybrid** blends **exactly two** species.

1. Choose **Basic → Hybrid** to open the composition builder.
2. **ADD** your **first** member species and enter its relative composition
   weight from **0 to 100**.
3. **ADD** your **second** member species and enter its weight. Changing
   one value does not change the other.
   - *Example:* Sergal **60** / Dragon **40** gives a species recipe of 60%
     Sergal and 40% Dragon for compatibility. A born character's makeup still
     follows their actual parents; the recipe weights do not choose birth species.
4. With two members in the recipe, the **FINISH** button appears. Press it.
   (If those two species already form an existing hybrid, the wizard sends you
   back to adjust the members — see the uniqueness rule in §1.)
5. **Name** the species, then **review/adjust** the AI-suggested fertility values
   on the menu and press **FINISH** (§2, §6); optionally add **descriptors**, and
   **review**.
6. **Name the founding Mother and Father.**

#### What's special about a true hybrid's founding pair

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

### 5. Creating a Composition Hybrid (three or more species)

A **composition hybrid** blends **three or more** species. The steps are the same
as a true hybrid, you just keep adding members.

1. Choose **Basic → Hybrid**.
2. **ADD** the first member and enter its relative composition weight.
3. **ADD** each additional member and enter a weight from **0 to 100**. For
   example, Sergal **60**, Fennec **50**, and Kobold **20** are valid; comparison
   normalizes these proportions to about 46.2%, 38.5%, and 15.4%.
4. You can keep up to **9** members. Each member's button shows its weight.
   Selecting a member **removes** it without changing the other members.
5. Press **FINISH** (available once you have at least two members). If this exact
   set of species already exists as a hybrid, you'll be sent back to adjust the
   members (see §1).
6. **Name** the species, then **review/adjust** the AI-suggested fertility values
   and press **FINISH** (§2, §6); optionally add **descriptors**, and **review**.
7. **Name the founding Mother and Father** — for a composition hybrid these are
   ordinary named root ancestors (a fresh lineage), just like a truebred.

---

### 6. The questions every species answers

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

**Taxonomy (optional):** choose **Taxonomy** on the review menu to select or
create each rank from domain through species. A shared classification adds
compatibility alongside lineage overlap. You can also assign or change it in
species management, or use **Clear** to leave the species unclassified. New
ranks are saved with the species; existing ranks can be shared. Cloning a
species also retains its classification. See
[Species Compatibility](species-compatibility.md) for rank weights and scoring.

**Founding pair (Mother & Father):** every species is seeded with two original
ancestors.

- **Truebred & Composition hybrid:** you name a Mother and a Father who become the
  species' fresh root lineage.
- **True hybrid:** you still name them, but their ancestry is bred from the two
  member species (see §4).

The species and its founding pair are always saved **together**, so a species is
never left without its lineage.

---

### 7. Cloning an existing species

If your new species is close to one that already exists:

1. Choose **Clone** at the start.
2. **Search and pick** the species to copy.
3. Give the clone a **new name** and confirm.

The clone copies the original's recipe and specifics as a starting point.
You can also use an existing truebred, true hybrid, or composition hybrid as a
member when building a new hybrid; nested recipes are supported.

---

### 8. Rules & tips at a glance

- **The type follows the recipe:** 0 members = truebred, 2 = hybrid, 3+ =
  composition hybrid. You never pick the type label directly.
- **AI presets save time.** Right after naming, accept the AI's suggested fertility
  values to skip the questions entirely, or customize them — the suggestions are
  always clamped to valid ranges.
- **Weights are relative.** Enter a number from **0 to 100** for every member.
  They do not need to total 100; decimals are allowed. Positive values are
  normalized when calculating compatibility.
- **Birth matching uses every member**, including a zero-weight member. It
  requires one registered hybrid with exactly the child's complete ancestry.
- **FINISH appears only when the recipe is valid** — i.e. two or more members for
  a hybrid.
- **Hybrids must be unique by their species set.** You can't FINISH a hybrid whose
  exact combination of member species already exists — weights are ignored,
  only the set of species counts.
- **Up to 9 members** in a composition.
- **Remove a member** by selecting its button; other weights stay unchanged.
- **Names matter:** always give real Mother and Father names — for a true hybrid
  these label a pair whose ancestry is bred from both member species.

---

*In short: pick Purebred or Hybrid, (for a hybrid) add two or more member species
with their relative weights, answer the species' reproductive details, optionally tag
its appearance, and name its founding Mother and Father. The number of members
you add decides whether you've made a truebred, a hybrid, or a composition
hybrid.*

---

### Editing a species you own

In the dashboard's species details, the species owner can change reproductive
timing, sizes, birth type, and descriptive traits. This edits the **shared base
species**, not just the current character, and may change other characters'
values and pregnancy estimates.

Review the values, acknowledge their impact on everyone using the species, and
confirm the update. If the page says the settings changed while you were editing,
refresh and review the latest values before saving again. Character-specific
overrides remain separate and are managed from the in-world character menu.

## For developers

### Identifying a born character as a new hybrid

Character → Species offers **Identify as a hybrid** when two different parent
species have no registered hybrid for the child's complete ancestry. Either
parent may be a truebred, a true hybrid, or a composition hybrid. The parent
species must have valid definitions and complete canonical founding pairs.

When no hybrid is selected at conception, the child keeps the ovum donor's
species. If that maternal species is already a hybrid, its existing recipe does
not prevent the child from defining the new parent combination. An already
defined, different hybrid assigned to the child cannot be replaced through this
action. Legacy hybrids with missing composition remain eligible for the
existing completion flow.

The user names the new species, supplies a relative composition weight for
each fixed parent species, and explicitly identifies the character as a hybrid.
Saving creates a new user-owned species with those two direct members. The
stored recipe does not flatten hybrid parents into their underlying members.
Birth matching expands the complete ancestry separately and ignores weights.

The species' new founding mother is member A's founding mother × member B's
founding father; its founding father is member A's founding father × member B's
founding mother. The character retains its actual birth parents. Existing
species definitions and other characters remain unchanged.

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
| Composition loop | `menu_species_hybrid`, `menu_species_select`, `menu_species_probability` | `ACTION_ADD` opens `SpeciesSearchDialog` (including composition hybrids as candidate members); selecting an existing button removes that member. |
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

### Relative-weight validation and storage

The existing `probability` names remain in the storage and API contract.
`SpeciesHybridCompatibilityHelper::probabilityIsValid()` accepts finite numeric
weights from `0.0` to `1.0`, inclusive. `probabilitiesAreValid()` also requires
at least two member species. There is no sum constraint, remainder, or automatic
redistribution. `buildComposition()` preserves valid inputs and rejects invalid
ones instead of clamping them. The HUD and hybrid-identification form use a
0–100 input scale; storage keeps the corresponding 0–1 values. When API values
are omitted, `defaultProbabilities()` assigns `0.5` to every member. Existing
stored values are not migrated or rewritten.

### Birth species from complete ancestry

After conception, `PregnancyHelper::resolveOffspringSpecies()` uses the ovum
donor and father, including their actual ancestors. `SpeciesAncestryMembershipHelper`
recursively expands both parent lineages and each registered hybrid recipe into
sorted truebred-ID sets. Founders and parentless profiles use their selected
species recipe; born profiles with both parents use their actual pedigree.

The union must equal a hybrid's entire expanded set: no missing or extra species.
Wolf/Sergal × Sergal/Dragon produces `{Wolf, Sergal, Dragon}`. A matching flat or
nested definition qualifies, but two equivalent definitions are ambiguous.
Exactly one complete match selects the hybrid; otherwise the ovum donor's
species is retained. Unknown, dangling, incomplete, cyclic, or excessively deep
ancestry also falls back. Surrogate hosts do not replace the genetic donor.

All listed members count, including zero-weight members. There is no additional
selection roll using the stored weights. This matching path is separate from
the existing weighted species-overlap and taxonomy calculations.

### Hybrid-set uniqueness

`menu_species_hybrid`'s `ACTION_CON` branch calls
`SpeciesHelper::findDuplicateHybrid($this->getSpeciesModel())` immediately on
FINISH; if a hybrid with the identical member-species **set** (weights
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

### Web creation attributes

`InitialState::apiSpeciesCreate()` (`src/classes/states/InitialState.php`) accepts
new species only in `InitialState` with no active profile. Its overview includes
`speciesAttributes` from `SpeciesDefinitionHelper::defaults()`
(`src/classes/helpers/SpeciesDefinitionHelper.php`), built from detached models
without writing defaults to the database.

Optional `stats` and `fluids` inputs are validated before species creation.
Stats are base quantities rather than character percentages; their budget and
omitted-default handling are described in [Vitality & Stats](vitality-and-stats.md#new-species-stat-budget).
For each supplied fluid, all six attributes are required: a six-digit hex
`color`, nonblank `scent` and `flavor` of at most 255 characters, `acidity`
between 0 and 14, nonnegative `viscosity`, and `translucency` between 0 and 1.
Unknown fluid types/attributes and nonfinite numbers are rejected.

`SpeciesDefinitionHelper::apply()` stores supplied values inside the same
transaction as the species and founding lineage. Omitted fluids retain the
usual defaults. Uterus and embryo volumes accept fractional values; the
overview's default embryo size is derived from the minimum size multiplier
rather than a fixed literal.

### AI taxonomy suggestions

The web taxonomy editor accepts optional **reference species**: real or fictional
creatures the user feels resemble their species. The guidance accompanies both
AI passes and helps retrieve relevant existing database branches.

With one to seven populated ranks, the action completes the missing ranks using
the supplied entries as fixed anchors. It does not replace an authored taxon with
a different name or synonym. Case and whitespace may be canonicalized. An empty
draft or all eight populated ranks requests a fresh complete classification; the
previous complete tree is discarded before lookup, inference, and catalog search.
An initial AI reply that contradicts a supplied anchor is rejected, rather than
spliced into a potentially unrelated hierarchy.

The prompt prefers established scientific classification for real species,
appropriate existing database taxonomy, and then a fitting inferred lineage.
For fictional species, it uses the user's reference species and available online
descriptions to infer a biological analogue or coherent fantasy classification.
Provider-independent Wikipedia searches supply a small, bounded collection of
actual reference excerpts before inference. Their titles and links are returned
separately from the AI proposal; the model cannot invent source links. A failed or
empty lookup is explicitly marked and does not prevent draft-only inference.
Online descriptions are evidence about a creature, not proof of scientific taxonomy.

The initial proposal is compared with relevant existing database branches. New
names are appropriate when existing choices do not fit or another classification
is more correct. Scientific or worldbuilding fit takes priority over maximizing
compatibility, and catalog reuse cannot override the user's partial draft.
Candidate parent chains must agree with every authored rank they contain; an
invented fixed domain with no saved match therefore skips database reconciliation.
Inferred names remain flexible so existing scientific synonyms can still be
considered. The catalog retains complete ancestry and is limited to 64 nodes and
24 KiB; relevant matches are not padded with unrelated branches. Broad fallback
context is only used when there are neither authored anchors nor relevant matches.

Real species use scientific classification; fictional species may use a suitable
biological analogue or a coherent invented lineage. The result is an editable
proposal. Neither lookup nor either AI step creates or changes taxonomy rows; saving the species
still reuses only exact normalized names under the selected parent chain.
If the database comparison fails or contradicts a supplied anchor, the editor
returns the validated first proposal with an explicit warning to review it before
saving. Failure of the initial inference still reports an error.

### Defining an existing species taxonomy once

An existing purebred with no saved taxonomy offers its owner **Define taxonomy**
in the web Species section. The modal accepts all eight ranks, with the same
existing-entry selection and AI assistance as creation. Saving is permanent:
users cannot edit or clear the classification afterward. Partial historical
classifications and dangling stored references count as existing definitions.
Hybrids continue to derive taxonomy from their members.

The separate `define-species-taxonomy` action uses `targetId`, `version`, and
`values` containing exactly the eight `taxonomy.<rank>` strings. The server
locks and reloads the species, then rechecks ownership, species identity, its
purebred status, the absence of a saved taxonomy, and the form version before
resolving canonical entries. A stale or concurrent second submission cannot
replace the first definition. The HUD uses this same guarded save path.

Taxonomy remains editable while creating a new species, before its first save.
The ordinary `save-species-settings` action has no taxonomy fields and rejects
submitted taxonomy keys, including requests from older editors.

### Viewing species taxonomy

The read-only taxonomy overview in the web Species section is available to every
account viewing its active character, including accounts that do not own that
species. It shows the purebred's classification, or the weighted purebred source
branches for a hybrid, together with global user-profile counts at each rank.
See [taxonomy compatibility](species-compatibility.md#8-optional-taxonomy-compatibility)
for count scope and hybrid behavior.

### Editing base species settings

`SpeciesSettingsHelper` (`src/classes/helpers/SpeciesSettingsHelper.php`) owns the
editable panel and save operation exposed through `MyCharacterHelper`'s
`species` section. Only the species-owning account sees the panel. Its action
includes the species `targetId`, field metadata, and a hash-based `version`
of the current editable values.

On save, a transaction reloads and pessimistically locks the species before
checking ownership, the target, and the version. The submitted `values` must
include boolean `acknowledgeImpact: true`. The numeric reproductive fields are
required, positive, finite, and integral except for the two volumes; dependent
bounds are checked through `SpeciesSpecificsHelper`. A detached clone is
validated first so a rejected request cannot leave dirty managed values for a
later flush.

The operation also requires a valid `embryoType` and a `descriptors` string of
at most 4000 characters. Descriptors are split on commas or newlines, trimmed,
deduplicated, and emptied entries removed. Unknown keys are rejected. Only after
all checks pass are values copied to the managed species. It does not edit
per-character species overrides or creation-time stat/fluid attributes.

`tests/e2e/cases/SpeciesSettingsOwnerEditsAreValidatedAndScopedTest.php` and
`SpeciesCreationInitialStatsAndFluidsPersistWithLineageTest.php` in that directory
cover owner/stale-page guards, invalid values, and transactional persistence.
