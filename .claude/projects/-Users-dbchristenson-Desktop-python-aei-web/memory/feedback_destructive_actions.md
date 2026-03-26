---
name: Don't delete local dev assets
description: User wants to keep local files like videos for development — use ignore files instead of deleting
type: feedback
---

When asked to "remove" large files from deployments, use ignore files (.vercelignore, .gitignore) rather than deleting the files. The user keeps assets locally for development even when they're hosted externally in production.

**Why:** Videos and other large assets are needed locally for dev but hosted on a cloud service in production. Deleting them would break the local dev experience.

**How to apply:** Default to ignore-based solutions for deployment size issues. Only delete files if the user explicitly says "delete" and confirms.
