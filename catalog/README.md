# Agent-search Catalog

This directory is the static site's source catalog. Each family keeps a shape appropriate to its function.

| Family | Primary role | Agent-relevant fields |
|---|---|---|
| `content/records.js` | `RP` / `RC` | target, representation, domain move, coding surface, when, not |
| `pedagogy/records.js` | `PI` | mechanism, domain-native reason, activation conditions, not-when, adaptation |
| `skills/records.js` | `PS` | trigger, refusal, input, output, searches |
| `worked-examples/records.js` | `WE` | authority, state flow, learner evidence, anti-example, minimal fix, conditions |

Every record has a single `role`. Connections across families are discovered through `subject`, `keywords`, and explicit search hints rather than by turning the entire worked example into every asset type at once.

## Provenance

- `conversation_given`: the named design or distinction appeared in the prior discussion.
- `v0_inference`: the record was concretized in this run.
- `mixed`: a discussion seed plus V0 implementation detail.

These are review labels, not quality scores.

