---
description: Summarize the current project
---

Give me a brief overview of this project.

Gather context by looking at the following:
!`cat package.json | head -30`
!`ls src/app/`
!`ls src/app/core/ 2>/dev/null; ls src/app/pages/ 2>/dev/null`
!`cat AGENTS.md`

Include in the overview:
- What the project is and what framework it uses.
- The main directories and what they contain.
- Key dependencies and tools.
- Any notable architecture decisions (standalone components, lazy routes, auth pattern, etc.).
