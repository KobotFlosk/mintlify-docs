# Reproduction & Genetics Lifecycle

The full chain from intimacy to a new character: fluids, fertility, conception,
pregnancy, birth, and how a child inherits its traits and species.

- **🎮 End-User Documentation** — what happens to your character and how you use it.
- **🧑‍💻 Developer Documentation** — how the chain is implemented.

This document connects to two companion pages:
[Species Compatibility](species-compatibility.md) and
[Creating a Species](species-creation.md).

---

## 🎮 End-User Documentation

### The life-cycle at a glance

1. **Fluids are exchanged.** During an intimate scene, reaching a climax can
   transfer fluids from one character to another.
2. **Fertility matters.** A carrier can become fertile on a cycle. When a fertile
   carrier receives the right fluids in the right place, conception may happen —
   it's a chance, not a certainty, and the odds depend on how compatible the
   partners are.
3. **Pregnancy begins.** If conception succeeds, the carrier becomes pregnant. The
   pregnancy grows over time and can be tracked.
4. **Birth.** When the pregnancy reaches term, the carrier gives birth. Depending
   on the species, this may be a live birth or an egg that hatches later.
5. **A new character is born.** The child inherits traits from **both** parents —
   its body form, lineage, and a blended **species makeup**. That child can be
   raised, named, and even adopted.

### Where things land

Your character's real anatomy decides where a deposit actually goes and whether it
can lead to a pregnancy. If a spot can't carry, the deposit simply passes through
without conceiving. This keeps outcomes believable regardless of appearance.

### Fertility, cycles, and control

- Carriers ovulate on a cycle; there's a fertile window when conception is
  possible.
- You can influence fertility with in-world consumables — for example items that
  boost fertility, and items that prevent conception. Barrier items reduce the
  chance of fluids reaching a fertile spot at all.
- You are always in control: you choose whether to pursue conception, and content
  limits and consent apply throughout.

### Inheriting a species

A child's **species makeup** is a blend of its parents' makeups. Purebred parents
tend to produce purebred children of the same species; mixed parents can produce
**hybrids**. How the blend works — and how "how compatible are we?" is
calculated — is explained in
[Species Compatibility](species-compatibility.md) and
[Creating a Species](species-creation.md).

---

## 🧑‍💻 Developer Documentation

### The chain of responsibility

Reproduction is a pipeline of cooperating helpers and one coordinating service.
Each stage persists its result through Doctrine entities:

```
climax → fluid emission ─▶ transfer between profiles ─▶ resolve incubator
   (StoryClimax)            (OpenTransferService)         (FluidsHelper)
        │                                                      │
        ▼                                                      ▼
  genetics recorded  ◀── ovulation / ovum ──▶ conception check ─▶ pregnancy
  (GeneticsHelper)       (OvumHelper,           (PregnancyHelper)   (ProfilePregnancy)
                          PregnancyHelper)                            │
                                                                      ▼
                                                                    birth
                                                              (BirthHelper, BirthingState)
```

### 1. Fluid emission & transfer

- A climax (`ClimaxEvent`, driven by `StoryClimax`) causes the emitting body to
  produce fluids. Which fluids a body emits is gated by **real** production
  biology (`FluidsHelper::getGenderFluids` / `isGenderFluid`), keyed by
  `FluidTypeEnum` (semen, nectar, milk, …).
- `OpenTransferService` mediates the cross-profile hand-off with hooks
  `on_transfer_fluids` / `on_received_fluids` (and the ovum equivalents),
  connecting the two in-world objects involved in the scene.
- Fluid identity/integrity is tracked with hashes
  (`FluidsHelper::createFluidHash` / `buildFluidHash` / `checkFluidHash`) and
  point-in-time snapshots (`FluidSnapshot…`).

### 2. Where a deposit lands (incubator resolution)

`FluidsHelper::resolveIncubator(ProfileModel $receiver, OrificeTypeEnum $apparentOrifice)`
maps the **apparent** orifice used to a real `IncubatorTypeEnum`:

- A vaginal deposit into a receiver without a real vagina silently reroutes to
  `INCUBATOR_COLON` (no pregnancy possible there).
- Otherwise the orifice maps to its incubator (`uterus`, `colon`, `stomach`).

This is the reproductive half of the apparent-vs-real split described in
[Form Shapeshifters](form-shapeshifters.md): apparent form gates *participation*;
real biology gates *reception and conception*.

### 3. Ovulation & the ovum

- `OvumHelper` and `PregnancyHelper::generateOvum(IncubatorTypeEnum)` manage the
  fertility cycle and produce a `ProfileOvumModelImpl` in an incubator.
- An ovum carries the gene-parent's traits (species, race, incubator) and is
  matched against a candidate breeder for compatibility
  (`OvumHelper::isCompatible`, `isCompatibleSpecies`,
  `calcCompatiblePercentageOf`).

### 4. Conception

Conception is a probabilistic check in `PregnancyHelper` combining two
compatibility factors:

- ovum ↔ **host** (carrier) compatibility, and
- ovum ↔ **breeder** (fluid provider) compatibility.

The two are multiplied and compared against a random draw scaled by
`Constants::COMPAT_PROBABILITY_MULTIPLIER`. On success a `ProfilePregnancyModelImpl`
is created (and the ovum consumed) inside a single transaction, with trait
inheritance fixed at conception:

| Pregnancy field | Inherited from |
|---|---|
| `host` | the carrier |
| `geneA` | the gene parent (carrier-side lineage) |
| `geneB` | the breeder (fluid provider) |
| `class` | the father/breeder (`ClassTypeEnum`) |
| `form` | the mother/gene parent (`FormTypeEnum`) |
| `race` | the ovum (mother side) |
| `gender` | randomly generated (`generateRandomGender`) |
| `species` | resolved via `SpeciesHybridHelper::fetchHybridSpeciesByProbability(...)`, falling back to the gene parent's species |
| `embryoType` | the resolved species (`EMBRYO_LIVE` or `EMBRYO_OVUM`) |
| `incubator` | the ovum's incubator (`IncubatorTypeEnum`) |

A `PregnancyConceiveEvent` marks success.

### 5. Genetics accounting

`GeneticsHelper` records and queries how much active genetic material a profile has
received, sliced by source profile, `OrificeTypeEnum`, and `FluidTypeEnum`
(`persistFluidGenetics`, `calcActiveGeneticsReceivedAmountFrom`,
`fetchActiveGeneticsReceived`, …). It also scores **form compatibility**
(`calcFormCompatibilityOf`, `formComplexity`) so cross-form pairings are weighted
sensibly. This is the data behind lineage, paternity testing, and compatibility
scoring.

### 6. Pregnancy progression & birth

- `PregnancyHelper` tracks pregnancies per incubator (`isPregnant`,
  `fetchPregnanciesByIncubator`, `fetchClosestPregnancy`) and progresses them from
  the conceived timestamp toward term (`PregnancyLaboringEvent`).
- When ready, `RunningState` transitions to `BirthingState`, which drives delivery
  and emits a `BirthEvent`. `BirthHelper` produces the resulting `BirthModelImpl`
  and its display labels (gender/class/form/full name/relation).
- `BirthStateEnum` tracks the birth record's lifecycle:
  `STATE_DEFAULT`, `STATE_LISTED`, `STATE_EXTERNAL`, `STATE_CONSUMED`.
  Egg-type births (`EMBRYO_OVUM`) become external eggs
  (`ItemObjectBirthEgg`) that hatch later; live births
  (`EMBRYO_LIVE`) resolve directly.
- Births can be publicised, adopted (`AdoptOfferModule`,
  `ProfileAdoptionHelper`), and turned into full profiles.

### 7. Species inheritance & compatibility

The child's **species makeup** is inherited as a weighted blend of the parents'
makeups and resolved to a concrete species (truebred, true hybrid, or composition
hybrid) by the species subsystem (`SpeciesHelper`, `SpeciesHybridHelper`,
`SpeciesHybridCompatibilityHelper`, `SpeciesAffinityHelper`,
`GeneticsHelper`). The player-facing math and creation flow are documented in:

- [Species Compatibility](species-compatibility.md) — how the compatibility
  percentage is computed from two species makeups.
- [Creating a Species](species-creation.md) — truebred vs hybrid vs composition
  hybrid and the creation wizard rules.

### Items that influence reproduction

Consumables registered via `ItemService::setItemClasses(...)` in `Application`
affect the chain:

| Item | Effect |
|---|---|
| `ItemObjectPillFertility` | Boosts fertility / ovulation. |
| `ItemObjectPillContraception` | Prevents conception. |
| `ItemObjectCondoms` | Barrier; reduces fluid reaching a fertile incubator. |
| `ItemObjectOvumAmpoule` | Introduces/handles ova. |
| `ItemObjectFluidSyringe`, `ItemObjectFluidContainer` | Handle stored fluids. |
| `ItemObjectPaternityTester` | Reads recorded genetics/lineage. |
| `ItemObjectBirthEgg` | The external egg produced by an ovum-type birth. |

### Key entities

`ProfileModelImpl`, `ProfileOvumModelImpl`, `ProfilePregnancyModelImpl`,
`BirthModelImpl`, `SpeciesModelImpl`, `SpeciesHybridModelImpl`,
`ProfileGeneticModelImpl`, `SpeciesFluidModelImpl`, `FluidSnapshotModelImpl` — each
paired with an interface in `src/interfaces/models` and a repository in
`src/classes/repos`.
