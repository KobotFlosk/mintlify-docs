# Species Compatibility — How It Works

How the system decides how compatible two characters are, species-wise — the
number you see when you check breeding/mating compatibility.

- **🎮 End-User Documentation** — a plain-language guide for players.
- **🧑‍💻 Developer Documentation** — the vector math behind the scenes.

This document connects to [Creating a Species](species-creation.md) and
[Reproduction & Genetics Lifecycle](reproduction-and-genetics.md).

---

## 🎮 End-User Documentation

*A plain-language guide for players.* No math background needed; if you can
read a pie chart, you're set.

---

## 1. Every character has a "species makeup"

Think of each character as a pie chart of what they're made of.

- A **purebred** is a single-flavor pie — 100% one species.
  - *Example:* a purebred Fennec is **100% Fennec**.
- A **hybrid** is a mixed pie — slices of two or more species.
  - *Example:* a "Fenser" might be **70% Fennec, 30% Sergal**.

That pie chart is the heart of everything below. We call it the character's
**species makeup**.

---

## 2. Where the makeup comes from: your family tree

A character's makeup isn't just a label someone typed in — it's **inherited from
the parents**, all the way back up the family tree.

The rule is simple:

> **You are 50% your mother's makeup and 50% your father's makeup.**

Apply that at every generation and it naturally blends down to the original
**purebred ancestors** at the top of the tree.

### A quick example

- **Mom** is a purebred Husky → her pie is **100% Husky**.
- **Dad** is a "Sledge" hybrid → his pie is **60% Husky, 40% Malamute**.
- **Their child** is half of each:
  - Husky: half of Mom's 100% (= 50%) **plus** half of Dad's 60% (= 30%) → **80% Husky**
  - Malamute: half of Dad's 40% → **20% Malamute**
  - **Child = 80% Husky, 20% Malamute.**

Notice the Husky slice grew past 50% because Husky came in from **both sides** of
the family. That stacking is exactly the point.

---

## 3. The kinds of species

You'll see species described one of three ways. It just depends on how many
ingredients are in the recipe:

| Kind | Ingredients | Example |
|------|-------------|---------|
| **Purebred** | 1 species | Fennec |
| **True Hybrid** | exactly 2 species | Fenser = Sergal + Fennec |
| **Composite Hybrid** | 3 or more species | Fenserbold = Sergal + Fennec + Kobold |

Each ingredient has a **percentage** (its slice of the pie), and the slices
always add up to 100%.

- **Fenser** (true hybrid): **30% Sergal, 70% Fennec**
- **Fenserbold** (composite): **30% Sergal, 50% Fennec, 20% Kobold**

---

## 4. How compatibility is scored: the "shared slices" rule

To compare two characters, we line up their pie charts and look at the species
they **both** have. For each shared species, we count **the smaller of the two
slices** — because compatibility is limited by whoever brings *less* of it. Then
we add those shared amounts up.

> **Compatibility = add up the overlapping slice of every species you share.**
> For each shared species, use the **smaller** of the two percentages.

That's it. The more species you share — and the bigger those shared slices —
the higher the score.

### Why "the smaller of the two"?

Imagine two cups of juice. One is 70% apple, the other 50% apple. How much apple
do they *truly have in common*? **50%** — you can only match up to the lesser
amount. The bigger cup's extra apple has nothing on the other side to pair with.
Taking the smaller slice keeps the score honest.

---

## 5. Worked examples

Let's use three characters:

- **A** = **30% Sergal, 70% Fennec** (a Fenser-type)
- **B** = **30% Sergal, 50% Fennec, 20% Kobold** (a Fenserbold-type)
- **C** = **100% Fennec** (a purebred Fennec)

### Example 1 — A with B

| Species | A | B | Shared (smaller) |
|---------|----|----|------------------|
| Sergal | 30% | 30% | **30%** |
| Fennec | 70% | 50% | **50%** |
| Kobold | — | 20% | 0% (A has none) |
| | | **Total** | **80% compatible** |

They share Sergal **and** Fennec, so the score is high. Kobold doesn't count —
only **B** has it.

### Example 2 — A with C

| Species | A | C | Shared (smaller) |
|---------|----|------|------------------|
| Sergal | 30% | — | 0% (C has none) |
| Fennec | 70% | 100% | **70%** |
| | | **Total** | **70% compatible** |

They only overlap on Fennec, so the score is just that overlap: **70%**.

### Example 3 — two mixed grandkids

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

## 6. Things that are good to know

- **Same species = perfectly compatible.** Two purebred Fennecs share 100%
  Fennec → **100%**.
- **No shared species = zero.** A pure Kobold and a pure Husky have nothing in
  common → **0%**.
- **It's mutual.** Compatibility of A with B is always the same as B with A.
- **The score can't go over 100%.** It's a percentage of genuine overlap.
- **More shared species helps.** Sharing two species (Example 1) beats sharing
  one (Example 2), even when the headline species is strong — that's the system
  rewarding a richer common ancestry.
- **Distant ancestry still counts.** Because makeup is inherited, a species far
  up your family tree still shows up as a slice of your pie and can create
  compatibility you might not expect from the character's label alone.

---

## 7. Quick FAQ

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

## 🧑‍💻 Developer Documentation

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
  vector: its own species decomposition blended with the average of its two
  parents' (`geneA`/`geneB`) affinity vectors, recursing down to the
  progenitor leaves (a profile with no `getBirth()`, or self-referential
  genes, terminates the walk). With the default `SELF_WEIGHT` of `0.0` this is
  **pure lineage** — exactly "50% mother's makeup + 50% father's makeup,"
  applied recursively. Raising `SELF_WEIGHT` (e.g. to `0.5`) would additionally
  fold in the node's own species label at each generation; that knob exists
  but is not currently exercised.
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

Both `decomposeInternal` and `affinityInternal` are cycle-guarded (`$visited`
sets keyed by species id / `spl_object_id`), so a malformed or
self-referential hybrid/lineage graph cannot cause infinite recursion.

### Related helpers

`SpeciesHelper`, `SpeciesHybridHelper`, and `SpeciesHybridCompatibilityHelper`
(`src/classes/helpers/`) handle the *construction* side (composition
building, remainder/percentage bookkeeping, duplicate-hybrid detection,
progenitor breeding) rather than the compatibility scoring itself — see
[Creating a Species](species-creation.md) for that half of the system. Every
input to `SpeciesAffinityHelper` (`getHybridComposition()`, `getGeneA()`,
`getGeneB()`, `getBirth()`) is a plain Doctrine entity accessor, so the helper
can be exercised in integration tests without booting the full `Application`.
