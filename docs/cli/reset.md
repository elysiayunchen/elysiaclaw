---
summary: "CLI reference for `elysiaclaw reset` (reset local state/config)"
read_when:
  - You want to wipe local state while keeping the CLI installed
  - You want a dry-run of what would be removed
title: "reset"
---

# `elysiaclaw reset`

Reset local config/state (keeps the CLI installed).

```bash
elysiaclaw backup create
elysiaclaw reset
elysiaclaw reset --dry-run
elysiaclaw reset --scope config+creds+sessions --yes --non-interactive
```

Run `elysiaclaw backup create` first if you want a restorable snapshot before removing local state.
