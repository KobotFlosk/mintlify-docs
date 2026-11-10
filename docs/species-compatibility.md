---
audience: mixed
summary: Species ancestry, taxonomy, inherited composition, and compatibility scoring.
---

# Species Compatibility — How It Works

Species compatibility has two independent components: the **lineage overlap**
explained below, and an optional **taxonomy** classification. The existing
lineage calculations and examples remain unchanged. Taxonomy adds compatibility
between separately named species that share a biological rank; see §8.

## For end-users

*A plain-language guide for players.* No math background needed; if you can
read a pie chart, you're set.

For a complete family-tree example with diagrams and both compatibility
components calculated step by step, see
[From Ancestry to Species Percentages to Compatibility](species-ancestry-and-taxonomy.md).

---

### 1. Every character has a "species makeup"

Think of each character as a pie chart of what they're made of.

- A **purebred** is a single-flavor pie — 100% one species.
  - *Example:* a purebred Fennec is **100% Fennec**.
- A **hybrid** is a mixed pie — slices of two or more species.
  - *Example:* a "Fenser" might be **70% Fennec, 30% Sergal**.

That pie chart is the heart of everything below. We call it the character's
**species makeup**.

---

### 2. Where the makeup comes from: your family tree

A character's makeup isn't just a label someone typed in — it's **inherited from
the parents**, all the way back up the family tree.

The rule is simple:

> **You are 50% your mother's makeup and 50% your father's makeup.**

Apply that at every generation and it naturally blends down to the original
**purebred ancestors** at the top of the tree.

#### A quick example

- **Mom** is a purebred Husky → her pie is **100% Husky**.
- **Dad** is a "Sledge" hybrid → his pie is **60% Husky, 40% Malamute**.
- **Their child** is half of each:
  - Husky: half of Mom's 100% (= 50%) **plus** half of Dad's 60% (= 30%) → **80% Husky**
  - Malamute: half of Dad's 40% → **20% Malamute**
  - **Child = 80% Husky, 20% Malamute.**

Notice the Husky slice grew past 50% because Husky came in from **both sides** of
the family. That stacking is exactly the point.

---

### 3. The kinds of species

You'll see species described one of three ways. It just depends on how many
ingredients are in the recipe:

| Kind | Ingredients | Example |
|------|-------------|---------|
| **Purebred** | 1 species | Fennec |
| **True Hybrid** | exactly 2 species | Fenser = Sergal + Fennec |
| **Composite Hybrid** | 3 or more species | Fenserbold = Sergal + Fennec + Kobold |

Recipe inputs are **relative weights**, which do not need to total 100.
Compatibility normalizes positive weights into **percentages** whose slices
add up to 100%. For example, weights 60 and 60 produce equal 50% slices. These
displayed percentages describe the comparison, not a roll to choose birth species.

- **Fenser** (true hybrid): **30% Sergal, 70% Fennec**
- **Fenserbold** (composite): **30% Sergal, 50% Fennec, 20% Kobold**

---

### 4. How compatibility is scored: the "shared slices" rule

To compare two characters, we line up their pie charts and look at the species
they **both** have. For each shared species, we count **the smaller of the two
slices** — because compatibility is limited by whoever brings *less* of it. Then
we add those shared amounts up.

> **Compatibility = add up the overlapping slice of every species you share.**
> For each shared species, use the **smaller** of the two percentages.

That's it. The more species you share — and the bigger those shared slices —
the higher the score.

#### Why "the smaller of the two"?

Imagine two cups of juice. One is 70% apple, the other 50% apple. How much apple
do they *truly have in common*? **50%** — you can only match up to the lesser
amount. The bigger cup's extra apple has nothing on the other side to pair with.
Taking the smaller slice keeps the score honest.

---

### 5. Worked examples

Let's use three characters:

- **A** = **30% Sergal, 70% Fennec** (a Fenser-type)
- **B** = **30% Sergal, 50% Fennec, 20% Kobold** (a Fenserbold-type)
- **C** = **100% Fennec** (a purebred Fennec)

#### Example 1 — A with B

| Species | A | B | Shared (smaller) |
|---------|----|----|------------------|
| Sergal | 30% | 30% | **30%** |
| Fennec | 70% | 50% | **50%** |
| Kobold | — | 20% | 0% (A has none) |
| | | **Total** | **80% compatible** |

They share Sergal **and** Fennec, so the score is high. Kobold doesn't count —
only **B** has it.

#### Example 2 — A with C

| Species | A | C | Shared (smaller) |
|---------|----|------|------------------|
| Sergal | 30% | — | 0% (C has none) |
| Fennec | 70% | 100% | **70%** |
| | | **Total** | **70% compatible** |

They only overlap on Fennec, so the score is just that overlap: **70%**.

#### Example 3 — two mixed grandkids

Breed A with C, and separately breed A with B, and you get two new characters:

- **D** (from A × C) = **15% Sergal, 85% Fennec**
- **E** (from A × B) = **30% Sergal, 60% Fennec, 10% Kobold**

| Species | D | E | Shared (smaller) |
|---------|----|----|------------------|
| Sergal | 15% | 30% | **15%** |
| Fennec | 85% | 60% | **60%** |
| Kobold | — | 10% | 0% |
| | | **Total** | **75% compatible** |

---

### 6. Things that are good to know

- **Same species = perfectly compatible.** Two purebred Fennecs share 100%
  Fennec → **100%**.
- **No shared species = zero lineage overlap.** A pure Kobold and a pure Husky
  have no shared species slices → **0%** for this component. An assigned taxonomy
  and the other breeding modifiers can still affect overall compatibility.
- **It's mutual.** Compatibility of A with B is always the same as B with A.
- **The score can't go over 100%.** It's a percentage of genuine overlap.
- **More shared species helps.** Sharing two species (Example 1) beats sharing
  one (Example 2), even when the headline species is strong — that's the system
  rewarding a richer common ancestry.
- **Distant ancestry still counts.** Because makeup is inherited, a species far
  up your family tree still shows up as a slice of your pie and can create
  compatibility you might not expect from the character's label alone.

---

### 7. Quick FAQ

**Q: My character is "a Fennec," so why isn't it 100% Fennec?**
Its *label* might say Fennec, but its **family tree** decides its makeup. If a
grandparent was a hybrid, some of that mix is baked in, so the pie isn't pure.

**Q: Why did sharing a second species only some of the time help?**
The system always rewards shared species. In Example 1 the second shared species
(Sergal) added a full 30%. If a shared species' slice is tiny on one side, it
adds only that tiny amount — but it never *hurts*.

**Q: Does a bigger slice always win?**
Only the **overlapping** part counts. Being 90% Fennec doesn't help against
someone with 0% Fennec — there's nothing to match. Compatibility is about what
you have **in common**, not how strong any one trait is on its own.

**Q: Can two very different characters still score high?**
Only if they genuinely share a lot. Two characters that are mirror opposites
(say, 90% Fennec / 10% Sergal vs. 10% Fennec / 90% Sergal) overlap only on the
small matching parts — about **20%** — which correctly reads as "not very
compatible," even though they technically contain the same two species.

---

*In one sentence: we turn each character into a pie chart of species, overlap
the two pies, and add up the shared slices — bigger and more numerous shared
slices mean higher compatibility.*

---

### Birth species uses the complete ancestry

After conception succeeds, the system collects **every truebred species** in
both parents' ancestry. Shared species appear once. It then expands registered
hybrid definitions the same way and looks for an **exact match**.

For example, Wolf/Sergal × Sergal/Dragon gives **Wolf + Sergal + Dragon**. A
hybrid missing Wolf or adding Fox does not match. A nested recipe can match,
but exactly one registered definition must fit the complete set. No match,
multiple matching definitions, or incomplete ancestry keeps the ovum donor's
species. A surrogate host does not change whose ancestry is used.

Birth matching includes every listed member, even one with weight zero. It
does not use composition weights as another probability roll. Compatibility
continues to use the weighted calculations above; its rules are unchanged.

### 8. Optional taxonomy compatibility

A purebred species creator can choose **Taxonomy** on the creation review menu.
The selector walks from domain through kingdom, phylum, class, order, family,
genus, and species. At each rank, select an existing entry or create one. A new
species can remain unclassified. Before creation is saved, its draft can still
be edited or cleared.

Saved classifications are immutable to users. An existing unclassified purebred
can be classified once by its owner through **Define taxonomy**, in the web
Species section or HUD species management. This requires all eight ranks and
cannot replace or clear any existing classification, including partial legacy
or dangling stored references. The normal species settings editor excludes
taxonomy entirely.

Sharing a taxonomy rank adds compatibility even when the species names differ.
For example, two different species in the same genus get a default 50% taxonomy
score. The closest shared rank wins; broader ranks are not added together.
This score fills part of the gap left by lineage overlap: 50% lineage overlap
and 50% taxonomy give a 75% base score. The usual breeding modifiers still apply.
Leaving taxonomy unset preserves the existing lineage-based calculation.

True hybrids and composition species have no taxonomy definition of their own.
Their taxonomy compatibility comes from the classifications of their member
species, following nested compositions and their weights. For example, a
50% fox / 50% unclassified composition compared with a canid that shares the
fox's family gets `50% × 25% = 12.5%` taxonomy compatibility. The unclassified
half contributes zero; it does not increase the fox's share.

For a character with parents, these taxonomy weights follow the character's
inherited makeup, including grandparents and earlier generations. The selected
species supplies a founding or parentless character's recipe; it does not add an
extra share on top of inherited ancestry. For example, a child of a pure fox and
a 60% fox / 40% wolf parent is 80% fox / 20% wolf for both species overlap and
taxonomy comparisons, whatever species name the child carries. Taxonomy measures
how related those ingredients are; it does not create additional ancestry.

The web **Species** section displays each defined rank and how many user
profiles share it. Counts include your current character, inactive characters,
and deceased characters, across all accounts; system progenitors and ownerless
profiles are excluded. A count includes descendants of that rank. A hybrid
profile counts once when any positive-weight member shares the classification,
even if several of its members share it. Counts are whole profiles, not weighted
population estimates, and overlapping rows must not be added together.

For hybrids, the display lists the purebred source branches and their inherited
percentages, including nested compositions. Unclassified or cyclic shares remain
unclassified. The separate rank compatibility percentages describe the closest
shared rank rule; they are not added to the population counts or to each other.

### 9. Garden and partner boosts

Garden activity and an established partnership can each close **up to half of
the remaining compatibility gap**. A missing bonus adds nothing. Increasing a
bonus helps until its 50% cap, and the two bonuses stack with diminishing returns.
The default partner bonus grows over 14 days to its full 50%; the garden bonus
uses the garden's share of active HUD sessions, capped at 50% when scoring.

| Base after lineage, taxonomy, and forced compatibility | No bonuses | One full bonus | Both full bonuses |
|---|---:|---:|---:|
| 0% | 0% | 50% | 75% |
| 20% | 20% | 60% | 80% |
| 50% | 50% | 75% | 87.5% |

These examples assume matching form and class. Form and class differences still
reduce the result after bonuses. This allows bonuses to help even unrelated
species without making a garden alone guarantee conception.

Character compatibility compares the two characters. Conception checks the
actual ovum, which can belong to a different donor: its donor supplies the
species inputs, its stored form and class supply the biological traits, and its
current host supplies garden and partner bonuses. A compatible host does not
make every ovum they carry equally compatible with the other character.

### 10. Species affinity and arousal

Species **affinity** uses the same inherited species overlap and taxonomy as
Matching, before garden/forest, partnership, forced compatibility, form, or
class modifiers. Taxonomy still includes biological class as a rank; the
excluded class modifier refers to character classes such as Living or Deity.

Looking toward a nearby character with compatible breeding organs can raise
arousal when affinity is **greater than 50%**. Each affinity percentage point
above 50% permits one arousal percentage point: 51% affinity permits 1%
arousal, 75% permits 25%, and 100% permits the maximum 50%. Affinity increases
arousal by up to five percentage points per HUD ping until that limit. It does
not lower arousal already above the limit or stack limits across nearby users.
The strongest eligible affinity applies, and the arousal message names the
character and species affinity as the reason. Gender interests are not applied.

---

## For developers

### Species taxonomy overview API

`GET MyCharacterHelper?section=species&characterId=<active profile UUID>` adds
an optional top-level `taxonomy` object alongside the existing `groups`:

- `mode`: `defined` for purebreds, `derived` for any nonempty composition.
- `scope`: `all-user-profiles`; `totalProfiles` counts every profile owned by a
  non-system account, including profiles without classification or species.
- `compatibility`: the same `{mode, unit, ranks}` payload as
  `TaxonomicHelper?do=compatibility`, using the current application settings.
- `branches`: classified purebred sources grouped by species ID. Each includes
  `speciesId`, `speciesName`, `sharePercent`, and domain-to-species `ranks`.
  A rank has `level` (the short key), `name`, UUID `taxonId`, and integer
  `profileCount`. Missing ranks are omitted; an actual zero count is `0`.
- `unclassifiedPercent`: the composition share without readable classification,
  including missing members and cyclic paths. A wholly unclassified species has
  no branches and an unclassified share of `100`.

Rank membership uses persisted UUID ancestry, never matching names. Only valid
contiguous ancestry is returned if a legacy tree is incomplete. Candidate
hybrids count once per taxonomy node when at least one positive-weight leaf
member reaches it; the percentages displayed for the current species do not
fractionally scale profile counts. This reports species classification, not
individual character genealogy or character-specific overrides.

`SpeciesTaxonomyOverviewHelper` uses three scalar queries: grouped user-profile
counts, species with composition rows, and taxonomy nodes. It expands the graph
in memory and memoizes acyclic distributions; it never hydrates the population's
profiles or performs per-rank/per-profile queries. The existing unrestricted
`countProfilesBySpecies()` used for saturation is unchanged. The view is
read-only and does not require species ownership. If the summary fails,
`taxonomy` is `null` while species details and permitted settings remain usable.

### Existing taxonomy context for AI suggestions

`TaxonomicHelper`'s `POST do=suggest` keeps its existing eight-name response.
It uses at most two plain AI calls: infer a complete lineage, then reconcile it
against existing classifications. The second call is skipped only when there
are no valid existing taxonomy paths. Both calls use a 40-second provider timeout
and a 4,096-token output limit. Invalid or failed reconciliation is a recoverable
error; it never falls back silently to the first, ungrounded proposal.

`TaxonomicSuggestionCatalogHelper` builds a deterministic catalog from scalar
taxonomy and public species-name rows. Exact draft and inferred matches at every
rank are prioritized before limiting, with ancestry agreement, near matches,
name/description relevance, and public species references guiding alternatives.
Provisional parent spellings do not exclude deeper matches, so inferred Eukaryota
can still retrieve Animalia under stored Eukarya. Remaining space is distributed
across parent/rank groups. Malformed, cyclic, and incomplete paths are excluded.

The serialized catalog is capped at 192 nodes and 65,536 UTF-8 JSON bytes. Nodes
carry canonical UUID, short rank, name, and parent UUID; a candidate and all its
ancestors are included together or omitted. Truncation is explicit. No profile
identities, account data, or unrelated private descriptions enter the prompt.
Configured compatibility metadata is supplied through the existing shared scorer.
Reuse is preferred among equally appropriate choices; correct biological or
fantasy classification wins over compatibility. Prompt suggestions never write
the database, and exact full-parent-chain matching remains the only mechanism
for canonicalizing returned names or reusing rows when the user saves.

### Restored taxonomy

The removal happened in April 2024:

- `5de6b374b97ef06bc7091a8edef131e2c3dc1eb1` (April 28) removed the
  eight rank-specific models/repositories, taxonomy helper and dialogs, and
  disconnected compatibility, rendering, and serialization.
- `2dc7a4d0b152f776854ee5598156cb7062263a9b` (April 29) removed more
  compatibility code and the interface discriminator map.
- `3ca8a4a7` (April 30) merged `feature/taxonomy-removal`.
- `dd4d03188c343d3b69cbd60a75ecb692c54576eb` (April 30) removed the
  rank setting keys and defaults in a broader cleanup.

The active implementation before removal used a separate table for each rank.
`SpeciesTaxonomicModelImpl` also existed as an unfinished single-table model:
its entity annotation was not converted to an attribute, its `type` was not
mapped, and species still referenced the rank-specific species entity.

The restoration completes that single-table model. `ane_species_taxonomies`
stores UUID `t_id`, `t_name`, `t_type` (the backed `TaxonomicTypeEnum` value), and
`t_parent` (a nullable self-reference). `ane_species.s_tax_id` is a nullable
many-to-one association: several game species may share one taxonomic species.
Species must link to the species rank; the wizard builds the eight-rank chain.
Taxonomy IDs and parent IDs remain UUID strings throughout the model, API, and
HUD selection. New nodes receive UUIDs in the application, matching the existing
database; interpreting these IDs as integers truncates them and breaks ancestry.
Parent reads are lazy and traversal stops at missing or malformed links.

Apply [the additive PostgreSQL migration](../ddl/SpeciesTaxonomies.sql) before
deploying the restored mappings, then regenerate Doctrine proxies and clear
metadata caches using the normal deployment process. The migration is intended
for a database without the taxonomy table/link. It preserves existing species
and leaves them unclassified. If an installation already has the abandoned
single table or legacy per-rank tables, inspect that schema before migration.
No legacy taxonomy data is automatically imported: old IDs are only unique
within each rank and require an explicit rank-to-new-ID mapping, including
parent and species references. The restoration does not run production DDL.

`TaxonomicHelper::compatibility()` finds the closest shared rank, comparing
persisted IDs or object identity for new nodes. Matching names, two null IDs,
and missing parents never imply shared ancestry. `SpeciesHelper` supplies the
historical `profile.compat.<rank>` application settings; invalid nonnumeric
values fall back to defaults and numeric weights are clamped to `[0, 1]`.

| Closest shared rank | Default score |
|---|---:|
| Species | 90% |
| Genus | 50% |
| Family | 25% |
| Order | 10% |
| Class | 5% |
| Phylum | 2% |
| Kingdom | 1% |
| Domain only, unrelated, or missing classification | 0% |

The UI reads current configured scores with authenticated
`GET /api?class=TaxonomicHelper&do=compatibility` (the backend dispatcher also
accepts the existing `taxonomic-helper` class alias). Its response data is:

```json
{
  "mode": "nearest-shared-rank",
  "unit": "percent",
  "ranks": [
    { "level": "domain", "type": "taxonomic.domain", "label": "Domain", "percentage": 0 },
    { "level": "kingdom", "type": "taxonomic.kingdom", "label": "Kingdom", "percentage": 1 },
    { "level": "phylum", "type": "taxonomic.phylum", "label": "Phylum", "percentage": 2 },
    { "level": "class", "type": "taxonomic.class", "label": "Class", "percentage": 5 },
    { "level": "order", "type": "taxonomic.order", "label": "Order", "percentage": 10 },
    { "level": "family", "type": "taxonomic.family", "label": "Family", "percentage": 25 },
    { "level": "genus", "type": "taxonomic.genus", "label": "Genus", "percentage": 50 },
    { "level": "species", "type": "taxonomic.species", "label": "Species", "percentage": 90 }
  ]
}
```

`ranks` are ordered domain to species. `percentage` is a number from 0 to 100,
not the scorer's 0-to-1 fraction. These example values are defaults; clients
must use the returned values because application settings can change them.
`TaxonomicHelper::compatibilityMetadata()` calls the same `rankCompatibility()`
used by actual scoring, including clamping and invalid-setting fallbacks.
Domain always contributes zero. Display each score as the compatibility when
that rank is the closest shared rank, not as an incremental bonus or a final
pregnancy chance. Reading this metadata creates no taxonomy entries and needs
no active species; the existing subscriber serves new and restored sessions.

`CompatibilityInterface::percentTaxonomicCompatible()` and the JSON field
`percentTaxonomicCompat` expose this component separately. Both
`ProfileHelper::calcCompatiblePercentageOf()` and
`OvumHelper::calcCompatiblePercentageOf()` pass their independently collected
components to the pure `CompatibilityHelper::calcCompatiblePercentage()`:

```text
base = 1 - (1 - lineage) * (1 - taxonomy)
species = max(base, (base + forced) / 2)
g = clamp(garden, 0, 0.5)
p = clamp(partner, 0, 0.5)
final = (1 - (1 - species) * (1 - g) * (1 - p)) * form * class
```

Nonfinite bonuses contribute zero. A garden with no active sessions also
contributes zero. Applying `1 - bonus` to the remaining incompatibility fixes
the former `max(0.5, bonus)` behavior, which gave absent bonuses a free 75%
combined boost and made garden scores above 50% reduce compatibility.

Profiles compare both characters' full ancestry for species overlap and taxonomy.
Ova compare their gene donor's full ancestry with the target character's full
ancestry for both components. The ovum still uses its stored form and class and
its host's garden/relationship context. Ovum eligibility uses these same
compositions; matching selected labels alone cannot grant eligibility. The
species-only ovum overload compares donor ancestry against the supplied recipe.

`SpeciesAffinityHelper` and `GeneticsHelper::calcSpeciesCompatibilityOf()` still
return the lineage component alone. `SpeciesHelper::calcTaxonomicCompatibility()`
uses `TaxonomicHelper::speciesCompatibility()` for both purebreds and hybrids.
`TaxonomicHelper::profileCompatibility()` and `profileSpeciesCompatibility()`
provide the corresponding ancestry-aware comparisons. Profile and ovum scorers
resolve both compositions once and pass them to `compositionCompatibility()`
and the species histogram scorer, sharing the same weights and entity graph.
For purebreds, the nearest shared rank of their own classifications is unchanged.
For a nonempty composition (including legacy single-member compositions), expand
its members recursively, multiplying normalized positive finite weights along
each path. Then compare every purebred pair from the two species:

`taxonomy(A, B) = sum(weightA[i] × weightB[j] × nearestSharedRank(i, j))`.

Shared leaves reached through different branches retain all their contributions.
Missing classifications and cyclic branches contribute zero without reallocating
their weights to known leaves. Invalid, nonpositive, or nonfinite member weights
are excluded before normalizing each composition. Obsolete direct taxonomy links
on hybrids are ignored, never silently deleted or used as a fallback. Purebred
classification values and configured rank weights remain the same. No profile
ancestry rules, lineage combination, forced-species rules, or breeding modifiers
are changed by this derivation.

Read endpoints are available through `taxonomic-helper` (`by=type&type=...`,
optionally `id=<parent ID>`, or `by=tree&id=<taxonomy species ID>`) and
`species-helper` (`by=id&as=tree&id=<game species ID>`). The tree retains the
historical leaf-with-nested-parents API shape. The species creation review menu
and species management menu expose **Taxonomy**; **Clear** removes the species
association without deleting shared ranks. New nodes persist with their species.

Coverage: `TaxonomicHelperTest` exercises every rank and malformed/missing
graphs. The `Taxonomy*Test.php` e2e cases cover persisted mappings, configured
weights, actual profile/ovum probabilities, serialization, selector creation
and reuse, cancellation/clearing, restored-session API routing, and the additive
DDL. The DDL test substitutes SQLite identity syntax; production PostgreSQL
execution remains part of deployment.

### `SpeciesAffinityHelper` (lineage-aware compatibility)

`src/classes/helpers/SpeciesAffinityHelper.php` is the pure (no `EntityManager`
access), unit-testable implementation of everything described above:

- **`decompose(SpeciesModel $species): array`** — expands a species into a
  normalized `{baseSpeciesId => weight}` vector by recursively walking its
  hybrid composition. A purebred (empty composition) yields `{species: 1.0}`;
  a hybrid sums `member.probability × decompose(member.species)` across its
  members. Cycle-guarded so a self-referential composition terminates on a
  base-species weight of `1.0` instead of looping.
- **`affinity(ProfileModelImpl $profile): array`** — a character's ancestry
  vector: 50% of each parent's (`geneA`/`geneB`) composition, recursively.
  A single known parent contributes its full distribution. Founders (no birth)
  and parentless profiles use their selected species recipe; self-references
  are not parents. This preserves a hybrid founder's declared recipe even when
  its descriptive gene links would otherwise imply a different ratio.
- **`compatibility(array $a, array $b): float`** — histogram intersection:
  `Σ min(a[species], b[species])` over every species key present in both
  vectors, clamped to `[0, 1]`. This is the "smaller of the two shared slices,
  summed" rule verbatim.
- **`compatibilityOfProfiles(ProfileModelImpl $a, ProfileModelImpl $b): float`**
  — `compatibility(affinity($a), affinity($b))`; the two-character score shown
  to players.
- **`compatibilityWithSpecies(ProfileModelImpl $profile, SpeciesModel $species): float`**
  — a character's lineage affinity intersected with a candidate species'
  decomposition (used, for example, when matching an ovum's gene-parent
  against a candidate breeder species; see
  [Reproduction & Genetics Lifecycle](reproduction-and-genetics.md)).

### Composition resolution and cost

`SpeciesCompositionHelper` is the shared resolver for species recipes and
character ancestry. It returns species references and fractional weights;
`SpeciesAffinityHelper::weights()` exposes the ID-to-fraction view. Persisted
IDs remain positive; transient species use negative object IDs to avoid identity
collisions. Percentages are these fractions multiplied by 100; calculations keep
full floating-point precision, including tiny ancestral shares.

Each comparison owns a resolver that memoizes shared ancestors and species.
An acyclic ancestor is expanded once per calculation, even if many family paths
reach it. Intermediate species labels that contribute no ancestry are not
decomposed, and founders' descriptive parents are not loaded. Recursion guards
terminate cycles; results that encounter cycles are not memoized because they
depend on the entry path. An unresolved hybrid branch contributes zero taxonomy
without enlarging the other shares.

There is no new persisted composition table. Doctrine may lazily load ancestors,
recipes, and taxonomy on the first comparison; subsequent comparisons against
the same managed graph reuse loaded entities. The resolver's cache ends with
the calculation, so later edits are reflected without invalidation machinery.
This bounds repeated computation but does not eliminate first-read database
cost for deep pedigrees. A persistent table should follow production profiling
and would need versioned recomputation for ancestry/recipe changes, descendant
invalidation, and backfilling existing characters. Taxonomy rank settings should
remain live inputs rather than cached compatibility scores.

### Complete ancestry membership for birth selection

`SpeciesAncestryMembershipHelper` is a separate pure resolver for membership,
without probabilities or normalized weights. It takes a scalar species graph,
recursively expands complete parent pedigrees, and returns sorted unique
truebred IDs. `matchingSpecies()` returns every registered hybrid whose entire
expanded set equals the required set; the caller selects only a unique match.

The resolver rejects unknown, malformed, dangling, incomplete, and cyclic
branches instead of returning a partial set. Founders and parentless profiles
use their declared recipes. Born profiles with both parents use their actual
ancestry, regardless of the selected species label. Memoized subtree heights,
a depth bound, and a visit budget limit traversal. The stored member weights,
including zeros, do not affect membership or cause a second selection roll.
`PregnancyHelper` retains the ovum donor's species when no unique complete
match can be established. Existing weighted compatibility behavior remains
in `SpeciesCompositionHelper`.

### Related helpers

`SpeciesHelper`, `SpeciesHybridHelper`, and `SpeciesHybridCompatibilityHelper`
(`src/classes/helpers/`) handle the *construction* side (composition
building, relative-weight validation, duplicate-hybrid detection,
progenitor breeding) rather than the compatibility scoring itself — see
[Creating a Species](species-creation.md) for that half of the system. Every
input to `SpeciesAffinityHelper` (`getHybridComposition()`, `getGeneA()`,
`getGeneB()`, `getBirth()`) is a plain Doctrine entity accessor, so the helper
can be exercised in integration tests without booting the full `Application`.
