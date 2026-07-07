# Form Shapeshifters

How a shifted appearance is kept separate from a character's real biology, so a
disguise can change what a character *appears* to be able to do without ever
changing what their body actually produces or can conceive.

- **🧑‍💻 Developer Documentation** — how apparent form and real biology are
  split in code.
- **🎮 End-User Documentation** — what shifting looks and feels like as a
  player.

This document connects to
[Reproduction & Genetics Lifecycle](reproduction-and-genetics.md) (real biology
gates reception/conception) and
[Interaction & Role-Play Lifecycle](interaction-lifecycle.md) (apparent form
gates participation in a scene).

---

## 🧑‍💻 Developer Documentation

### The three-axis model

Before this feature, shifting only swapped cosmetic attributes (class, race,
form, height, weight, species, pack role) — everything else, including
**gender**, stayed hardwired to the base profile. A shifter who took a male
form still failed every participation check gated on having a penis, because
those checks resolved against the unchanged real biology.

The gender axis is now split in two, with a third axis derived on demand:

| Axis | What it gates | Source |
|---|---|---|
| **Apparent gender** | Participation: which roles, orifices, and stimulators are offered; pronouns; attach-eligibility for body-modifying items/plugins | `ProfileModel::getApparentGender()` — returns the shifted form's gender on a `ShiftProfileModel` wrapper; on a raw `ProfileModelImpl` it aliases real gender |
| **Real production** | Which fluids the body actually emits at climax; ovum cycles; fertility window | `ProfileModel::getGender()` — always the base profile, even when shifted |
| **Real reception** | Where a deposit physically lands; whether pregnancy is possible | `FluidsHelper::resolveIncubator($receiver, $apparentOrifice)` — derived from the apparent orifice + real anatomy at the moment of deposit, never persisted |

For a non-shifted profile the apparent and real axes are identical by
construction, so non-shifted behavior is unchanged.

### Foundation accessors

- `ProfileModel::getApparentGender(): GenderTypeEnum` — declared on the
  interface.
- `ProfileModelImpl::getApparentGender()` — base implementation aliases
  `getGender()`; the base entity has no shift awareness.
- `ShiftProfileModel::getApparentGender()` — overrides to return
  `self::call($this->shiftProfile, 'getGender')` (the active shifted form's
  gender), using the same delegation pattern that already powers
  class/race/form/height/weight/species/pack-role.

### The apparent-gender resolver (`ProfileHelper::resolveApparentGender`)

`AccountHelper::fetchActiveProfile()` returns the raw `ProfileModelImpl`
directly — it is never wrapped in `ShiftProfileModel` — so calling
`getApparentGender()` on it directly would alias real gender and defeat the
split. The private `ProfileHelper::resolveApparentGender(ProfileModel)`
resolver is what every apparent-gating helper in `ProfileHelper` routes
through instead:

- An already-wrapped `ShiftProfileModel` answers its own
  `getApparentGender()` directly.
- A raw `ProfileModelImpl` whose form is `FormTypeEnum::FORM_SHIFT` is wrapped
  in a **transient** `ShiftProfileModel` solely to read the apparent gender;
  any construction failure falls through to the base model's own answer.
- Any other profile returns its own `getApparentGender()`.

The wrap never escapes the resolver, so raw profiles keep flowing through the
rest of the codebase and identity comparisons elsewhere (e.g.
`$this->getActiveProfile() === $copulationModel->getProfile()`) keep working
against raw Doctrine entities.

Call sites routed through the resolver (`src/classes/helpers/ProfileHelper.php`):
`getSubjectivePronoun`, `getObjectivePronoun`, `getReflexivePronoun`,
`getPossessivePronoun`, `getPossessiveAdjective`, `apparentlyHasVagina`,
`apparentlyHasPenis`, `apparentlyHasBreasts`, and (via `getGenderLabel($profileModel, $apparentGender = true)`)
the profile's displayed gender label. `apparentlyIsHerm`,
`filterOrificesApparent`, `filterStimulatorsApparent`, and
`hasStimulatorApparent` compose on top of those and inherit the resolver path
automatically.

### Parallel anatomy helpers

Every real-biology check in `ProfileHelper` has a parallel apparent variant.
Booleans use an `apparently*` prefix; collection-style helpers keep a
trailing `*Apparent` suffix:

| Real (biology) | Apparent (form) |
|---|---|
| `hasVagina` | `apparentlyHasVagina` |
| `hasPenis` | `apparentlyHasPenis` |
| `hasBreasts` | `apparentlyHasBreasts` |
| `isHerm` | `apparentlyIsHerm` |
| `hasStimulator` | `hasStimulatorApparent` |
| `filterOrifices` | `filterOrificesApparent` |
| `filterStimulators` | `filterStimulatorsApparent` |

The vagina/penis/breast truth tables are shared by both paths through private
`genderHasVagina()` / `genderHasPenis()` / `genderHasBreasts()` helpers.

`ProfileHelper::unwrap(ProfileModel): ProfileModelImpl` strips a
`ShiftProfileModel` wrapper down to the base `ProfileModelImpl`, for the rare
call sites that need genuine identity regardless of shift (snapshot hashing,
genetic lookups). `FluidsHelper::fetchFluidSnapshot()` calls it defensively on
entry as a belt-and-suspenders guard.

### Fluid rerouting

`FluidsHelper::resolveIncubator(ProfileModel $receiver, OrificeTypeEnum $apparentOrifice): IncubatorTypeEnum`
is the only new piece of biology-aware logic in the fluid pipeline, wired into
`FluidsHelper::persistFluid()` in place of a direct
`$orificeType->toIncubatorType()` call:

- If the apparent orifice is `ORIFICE_VAGINA` and the receiver has no real
  vagina, the deposit reroutes to `INCUBATOR_COLON` — silently, with no
  narrative signal.
- Otherwise the apparent orifice maps to its incubator unchanged, falling
  back to `INCUBATOR_COLON` if the apparent orifice has no incubator mapping
  at all.

Downstream conception logic (`PregnancyHelper::attemptPregnancy()`,
`OvumHelper::fetchOvumByIncubator()`) is already incubator-keyed, so it
correctly finds no ovum in a rerouted colon and no pregnancy fires. The real
incubator is derived at the moment of deposit rather than persisted, since
every input (the copulation row's apparent orifice + the receiver's current
biology) is already available at call time.

### Call-site classification

The rule for classifying a new touchpoint: if the check gates **what the
character can do or appear to do**, use the apparent variant; if it gates
**what the character's body produces or whether conception happens**, use the
real variant.

**Switched to apparent (participation/UI):** `OrificeHelper` orifice listing;
`StoryBreed`, `StoryAnal`, `StoryOral` compatibility/menu gates;
`ProfileHelper` pronoun helpers; `ProfileSexualDetailsDialog` knot-setting
visibility; `ProfileDialog` fertility-line visibility (see limitation below);
`RunningState` region-search penis filter; `OvipositionPlugin`,
`NectarExtractorPlugin`, `SpunkExtractorPlugin` attach-eligibility;
`ItemObjectCondoms` use-eligibility.

**Kept on real biology (consequences):** `ProfileHelper::isFertile`,
`maybeFertile`, `maybeFertileAs`, `ofFertileAge`; `StatsHelper` arousal
physiology; `ItemObjectPillFertility`, `ItemObjectPillContraception`;
`RolePlayService::on_system_ping` ovum generation; `FluidsHelper::getGenderFluids`,
`isGenderFluid`.

Extractor plugins (`SpunkExtractorPlugin`, `NectarExtractorPlugin`) guard
their fluid-**collection** branch on real biology so no-output stays a clean
no-op, but leave essence drain unguarded so the device visibly keeps running
even when the body has nothing to give — preserving the cover story at the
cost of a reservoir that never fills.

### Fluid emission by real biology

`FluidsHelper::isGenderFluid(GenderTypeEnum, FluidTypeEnum)` is the canonical
check for whether a real gender can produce a fluid type:

| Fluid | Female | Male | Herm | Andromorph | Gynomorph | Neutral |
|---|---|---|---|---|---|---|
| Blood / Saliva / Urine | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Nectar / Milk | ✓ | — | ✓ | — | ✓ | — |
| Semen | — | ✓ | ✓ | ✓ | — | — |

Because `ShiftProfileModel::getGender()` always returns the base profile's
gender, production never follows the disguise.

### Shapeshifter fluid copying

`FormShiftHelper` owns how shifters acquire new disguises by sampling other
characters' fluids. `FormShiftHelper::FLUID_TYPES` lists which fluid types are
valid copy sources: `FLUID_SEMEN`, `FLUID_BLOOD`, and `FLUID_MILK` (each
carries the source's genetics — paternal, full, and maternal lineage
respectively). `FormShiftHelper::isCopyableFluidType(?FluidTypeEnum)`
delegates to a simple `in_array` check against that constant.

> The doc-comment on `isCopyableFluidType` in `FormShiftHelper.php` still
> reads "Only Blood and Semen are permitted as copy sources" — stale, since
> `FLUID_MILK` was added to the constant. Worth fixing next time that file is
> touched.

Two acquisition paths exist, both filtering out snapshots whose form is
`FORM_SHIFT` (a shifter cannot copy another shifter's disguise, only the real
biology underneath):

- `FormShiftHelper::fetchHoldingFluidSnapshots` — scans the shifter's own
  stomach (`INCUBATOR_STOMACH`) and uterus (`INCUBATOR_UTERUS`) holdings.
- `FormShiftHelper::fetchGeneticFluidSnapshots` — queries the genetic
  encounter log for snapshots recorded against the mouth and vagina orifices.

A second filter, `FormShiftHelper::isCopyableClass($shifterClass, $sourceClass)`
(implemented as `ProfileHelper::canCopyFrom`), restricts which classes a
shifter may copy from:

| Shifter class | Can copy from |
|---|---|
| Living | Living |
| Demon | Demon, Daemon, Living |
| Daemon | Demon, Daemon, Living |
| Deity | Demon, Daemon, Deity, Living |
| Synth | Demon, Daemon, Living, Synth |
| Digital | All except Deity |

### Files most involved

`src/interfaces/models/ProfileModel.php`,
`src/classes/models/ProfileModelImpl.php`,
`src/classes/types/ShiftProfileModel.php`,
`src/classes/helpers/ProfileHelper.php`,
`src/classes/helpers/FluidsHelper.php`,
`src/classes/helpers/FormShiftHelper.php`,
`src/classes/helpers/OrificeHelper.php`,
`src/classes/stories/StoryBreed.php`, `StoryAnal.php`, `StoryOral.php`,
`src/classes/prefabs/dialogs/ProfileDialog.php`,
`ProfileSexualDetailsDialog.php`, `src/classes/states/RunningState.php`,
`src/classes/plugins/OvipositionPlugin.php`, `NectarExtractorPlugin.php`,
`SpunkExtractorPlugin.php`, `src/classes/items/ItemObjectCondoms.php`.

Coverage: `tests/integration/helpers/FormBiologySplitTest.php`, registered in
`tests/integration/run.php` — pins the contract for non-shifted profiles, a
stub-shifted profile in both directions, the incubator-rerouting resolver, and
`unwrap()`.

### Known limitations

- **`ProfileDialog` fertility line.** Its *visibility* follows
  `apparentlyHasVagina`, but the displayed text ("Likely fertile" / "Not
  fertile") still comes from real-biology `maybeFertile()`. A male-real /
  female-shifted character therefore shows as an infertile female rather than
  hiding the fertility line entirely — plausible, but a persistent observer
  comparing profiles side-by-side could notice.
- **Extractor reservoirs on a shifted-only body.** The device visibly runs
  (essence still drains) but the fluid reservoir stays empty for the whole
  session, which a nosy observer could notice over time. Substituting a
  different fluid type through the tube was considered and rejected — it
  creates worse contradictions (color, viscosity, conception capability).
- **Herm intersections are under-tested.** Male↔female shifts in both
  directions are pinned by tests; a herm-real / single-sex-shifted character
  (where both real organs are present, so nothing reroutes) is only exercised
  implicitly. Manual play-testing is recommended before relying on it.
- **`StoryClimax` orifice gating.** The vagina/anus/mouth buttons in
  `StoryClimax::menu_initial_render` gate on scene state but not on whether
  the target has that orifice at all, apparent or real. Pre-existing, not
  introduced by this work.
- **Lineage stays on the shifted form.** `getGeneA()` / `getGeneB()` still
  route to the shifted form on `ShiftProfileModel` — intentional, since a
  displayed parent species is part of the cover story a shifter is trying to
  maintain. `getPackRole()` is in the same bucket.

---

## 🎮 End-User Documentation

### What shifting does

A shapeshifting character can wear a body that looks and behaves differently
from their true self. Their **appearance** decides what they can offer and
receive in a scene — a character presenting as male can act the part, and a
character presenting as female can be approached that way. Their **true body**
still quietly decides what actually happens underneath:

- A character who *looks* male but is really female won't produce anything
  when reaching a climax as a male would.
- A character who *looks* female but is really male can still be approached
  as one, but nothing they receive that way can ever lead to a pregnancy — it
  simply passes through unnoticed.

This means a shapeshifter can wear a disguise convincingly during a scene
without their body ever betraying — or fully committing to — the part they're
playing.

### Building a disguise

Shapeshifters can pick up new forms by sampling certain fluids from other
characters — a taste, a touch, or a stored sample — provided the source is a
kind of character close enough to their own nature. Copying from a fluid also
quietly carries a trace of that character's lineage, which can matter later
for family and parentage questions.

### Things to keep in mind

- Fertility shown on a profile always reflects the true body, even while a
  disguise is worn.
- Devices that capture fluid samples will still run while worn, but won't
  collect anything a shifted body can't truly produce.
- A shifted character's displayed parentage and lineage follow the disguise,
  not the true self — that part of the cover story is intentional.
