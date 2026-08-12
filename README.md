# EduOS Teaching Components Atlas

Open [`index.html`](index.html) directly. The landing page explains the product and routes into nine subject pages: the original eight core subjects plus English language learning.

Every subject page now follows the same reading order:

```text
Content / Representation
  → Scaffolds & Diagnostic Probes
  → Lesson Routes
  → Worked Examples
  → Agent / Teacher Contracts
  → Coverage & Provenance
```

The hierarchy is shared; the classroom interfaces remain subject-native.

## Current coverage

- **History:** 12-component teacher workbench, 6 lesson routes, Red Cliffs replay, and 3 learner-facing Gold artifacts.
- **Mathematics:** all 127 tools from `math-viz-kit` are present as source assets; a separate 15-component scaffolding/diagnostic studio provides 6 M01–M15 routes and a six-phase worked-example fading replay. Per-asset route mapping is still in progress.
- **English:** the existing English Scaffold Studio with 30 scaffold skills, 1 regulation policy, diagnostics, teacher composer, and 3 pain-point route templates. It does not yet include an English content corpus or a Gold worked-example replay.
- **Biology:** 3 Gold learner artifacts plus catalog seeds.
- **Chinese, Civics, Physics, Chemistry, Geography:** 3 content records, 2 pedagogy records, 2 skill-contract previews, and 1 composed worked example per subject.

“Complete workbench” and “seed coverage” are shown explicitly on the landing page; the site does not imply equal maturity across subjects.

## Information architecture

```text
review-site/
├── index.html                         # purpose, usage and nine subject entrances
├── inspector.html                     # developer/search surface
├── subjects/                          # consistent subject pages
├── gold/
│   ├── history/                       # workbench + 3 learner artifacts
│   ├── mathematics/                   # scaffold studio
│   ├── english/                       # English Scaffold Studio
│   └── biology/                       # 3 learner artifacts
├── library/math-viz-kit/              # 127/127 content tools + searchable index
├── demos/                             # 48 catalog-linked standalone demos
├── catalog/                           # non-unified content/pedagogy/skill/example records
└── assets/                            # portal and subject-page renderers
```

## Important boundaries

- A content visualization is not automatically a scaffold.
- A scaffold is not automatically a lesson route.
- A route is conditional: success can stop it; failure can change it.
- English studio examples use replaceable sample language and are not a content corpus.
- The 127 mathematics tools are complete source coverage; the 15 studio components are a curated instructional layer, not a substitute for the full library.
- Skill records are contract previews, not installed `SKILL.md` packages.
- Catalog families retain different record shapes; the site does not force them into one ontology.

## Validation

Run:

```bash
python3 scripts/validate_site.py
```
