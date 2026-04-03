---
summary: "CLI reference for `elysiaclaw uninstall` (remove gateway service + local data)"
read_when:
  - You want to remove the gateway service and/or local state
  - You want a dry-run first
title: "uninstall"
---

# `elysiaclaw uninstall`

Uninstall the gateway service + local data (CLI remains).

```bash
elysiaclaw backup create
elysiaclaw uninstall
elysiaclaw uninstall --all --yes
elysiaclaw uninstall --dry-run
```

Run `elysiaclaw backup create` first if you want a restorable snapshot before removing state or workspaces.
