# Review request: EduOS visual teaching objects

You are reviewing a static web prototype for EduOS. The selected packet contains:

- the cross-subject home page;
- the complete History subject page;
- the complete Biology subject page;
- shared visual and interaction code;
- the content, pedagogy, skill, and worked-example records needed to render those pages;
- every standalone History and Biology demo HTML.

## Why this review is needed

The owner’s current judgment is that the web coding is visually weak and has not captured the intended product. Earlier versions over-described what AI should build without providing finished results. The current version now has executable demos, but it may still be producing generic UI mockups rather than convincing content representations or pedagogy-native learning experiences.

Please be direct and specific. Do not merely suggest polishing colors or spacing.

## Questions to answer

1. What do you think the owner is actually trying to build, based on these files?
2. Where does the current homepage misunderstand that intent structurally—not just aesthetically?
3. For the History page, which items are genuine content representations, which are merely diagrams/cards, and which should be removed or rebuilt?
4. For the Biology page, which visual models genuinely expose a biological mechanism, and which are only generic boxes, sliders, or circles wearing a biology label?
5. Do the pedagogy HTML demos instantiate a real learning mechanism, or do they merely add a generic “choose → reveal” shell around content?
6. Does the worked-example runtime make the relationship among content, pedagogy, learner observation, agent skill, and next probe understandable? If not, propose a better concrete screen/state sequence.
7. Which three History deliverables and which three Biology deliverables should be rebuilt first as gold examples?
8. For each priority example, provide:
   - what the learner should literally see;
   - what the learner should literally manipulate or commit;
   - what visual state should change;
   - what learner evidence should be captured;
   - what the skill should do with that evidence;
   - one plausible-but-bad implementation to avoid.
9. Identify visual-design problems that prevent evaluation: hierarchy, density, framing, use of iframes, typography, interaction discoverability, or excess explanatory text.
10. Give a targeted redesign brief that Codex could execute without interpreting it as “make another dashboard.”

## Important conceptual boundaries

- Content representation may be independently useful without diagnosis.
- Pedagogy is not just a backend skill; it may require learner-facing UI and interaction.
- A pedagogy pattern is a mechanism, not a fixed widget.
- A worked example should show how content, pedagogy, skill judgment, and workflow connect.
- Learner observation must remain separate from interpretation.
- If the teacher already authored the pedagogy, AI should implement it rather than substitute another design.
- Please distinguish “the concept is wrong” from “the current implementation is weak.”

## Desired output format

1. One-paragraph diagnosis.
2. Five most consequential misunderstandings.
3. Homepage critique.
4. History critique and three gold rebuilds.
5. Biology critique and three gold rebuilds.
6. Pedagogy/skill/worked-example architecture critique.
7. Concrete redesign instructions for the next Codex pass.

