# EduOS Teaching Design Gallery

A static, directly operable gallery of subject-native teaching tools, gold lesson artifacts, and developer-facing design records. The current focus is a 12-tool History Teaching Studio, a 15-component Math Scaffold Studio, and six learner-facing history and biology experiences.

## Open the site

- GitHub Pages: `https://edu-ai-builders.github.io/eduos-teaching-design-gallery/`
- Start at `index.html` when browsing locally.

The teacher workbenches expose classroom UI, trigger conditions, success evidence, fade rules, agent contracts, reusable lesson routes, and worked-example replays.

Open [`index.html`](index.html) directly in a browser. The site uses no framework, build step, remote font, network request, or runtime dependency. Relative scripts and iframe pages also work from `file://`.

For a local HTTP preview from the experiment directory:

```bash
python3 -m http.server 8000 --directory review-site
```

Then open `http://localhost:8000/`.

The root page is now a teacher-facing gallery of six learner-ready gold artifacts. The former catalog dashboard remains available at [`inspector.html`](inspector.html); it is intentionally a separate developer/substrate surface.

## Information architecture

```text
review-site/
├── index.html                       # teacher-facing six-artifact gallery
├── inspector.html                   # developer search + legacy iframe evaluator
├── gold/
│   ├── history/                     # history teaching studio + three gold artifacts
│   ├── mathematics/                 # math content × scaffolding workbench
│   ├── biology/                     # three mechanism-specific biology artifacts
│   └── assets/base.css              # shared chrome only, not a universal demo engine
├── subjects/                        # eight standalone subject HTML files
├── demos/
│   ├── content/                     # 24 directly operable HTML results
│   ├── pedagogy/                    # 16 pedagogy state-machine HTML results
│   └── worked-examples/             # 8 composed content→skill runtimes
├── assets/
│   ├── site.css                     # shared visual system
│   ├── app.js                       # hub search, filters, iframe routing
│   └── subject.js                   # shared subject-page renderer
├── catalog/
│   ├── content/records.js           # RP / RC candidates
│   ├── pedagogy/records.js          # domain-native PI candidates
│   ├── skills/records.js            # searchable PS contract previews
│   └── worked-examples/records.js   # eight WE gold seeds
└── scripts/validate_site.py
```

The four catalog files remain the searchable data layer. The six `gold/` pages are instructional artifacts, not prose previews of those records. Their central interfaces are deliberately separate implementations: a decision room, source desk, causal graph, time-series lab, pedigree model competition, and physical experiment bench.

`gold/history/history-teaching-studio.html` is the first subject-native teacher workbench. It contains 12 operable historical teaching tools, six lesson pathway templates, a lightweight lesson composer, and a worked-example replay. Its persona tool is evidence-bounded: characters cannot know later outcomes or invent unsupported private thoughts.

`gold/mathematics/math-scaffold-studio.html` separates content primitives from instructional scaffolds. It contains 15 operable components, six evidence-routed pathways, and a six-phase worked-example fading replay. The content layer is informed by `edu-ai-builders/math-viz-kit`; the exact, data-driven solution-page pattern is informed by `wy51ai/edulab`. New work focuses on prediction, self-explanation, first-invalid-step diagnosis, subgoals, strategy comparison, counterexamples, proof skeletons, monitoring, and explicit fade conditions.

Each content and pedagogy record still has a legacy standalone HTML result under `demos/`. These are retained for substrate review and comparison, but are not labeled as gold classroom artifacts.

## Surface boundary

- **Learner/classroom artifact:** the six pages under `gold/`; the mechanism is visible and operable by default.
- **Teacher controls:** a concealed drawer inside each artifact for reset, pacing, and intentional reveal.
- **Developer/substrate inspector:** `inspector.html`, catalogs, legacy demos, provenance and skill contracts.

Example searches:

```bash
rg -n "teacher_defined|near miss|宏观|无学生设备" review-site/catalog
rg -n "subject:\"chemistry\"" review-site/catalog
rg -n "role:\"PS\"" review-site/catalog/skills
```

## Boundaries

- Skill records are contract previews, not installed `SKILL.md` packages.
- Content, pedagogy, skill, and worked-example directories retain different record shapes.
- The browser combines them for search but does not assert one canonical ontology.
- All records remain `pending_review`; subject and classroom review is still required.
