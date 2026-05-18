---
description: Write a concise pull request description
---

Write a concise pull request description detailing the changes made in the current branch.

Gather context on what changed:
!`git log main..HEAD --oneline`
!`git diff main --stat`
!`git diff main -- src/ | head -200`

Rules:
- Start the description with "This PR...".
- Keep it to 2-3 sentences.
- Do not use em dashes.
- Use simple, direct language.
- Mention the key files and components that changed.
- Do not include a changelog list, just a short narrative.
