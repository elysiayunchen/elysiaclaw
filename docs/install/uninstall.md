---
summary: "Uninstall ElysiaClaw completely (CLI, service, state, workspace)"
read_when:
  - You want to remove ElysiaClaw from a machine
  - The gateway service is still running after uninstall
title: "Uninstall"
---

# Uninstall

Two paths:

- **Easy path** if `elysiaclaw` is still installed.
- **Manual service removal** if the CLI is gone but the service is still running.

## Easy path (CLI still installed)

Recommended: use the built-in uninstaller:

```bash
elysiaclaw uninstall
```

Non-interactive (automation / npx):

```bash
elysiaclaw uninstall --all --yes --non-interactive
npx -y elysiaclaw uninstall --all --yes --non-interactive
```

Manual steps (same result):

1. Stop the gateway service:

```bash
elysiaclaw gateway stop
```

2. Uninstall the gateway service (launchd/systemd/schtasks):

```bash
elysiaclaw gateway uninstall
```

3. Delete state + config:

```bash
rm -rf "${OPENCLAW_STATE_DIR:-$HOME/.elysiaclaw}"
```

If you set `OPENCLAW_CONFIG_PATH` to a custom location outside the state dir, delete that file too.

4. Delete your workspace (optional, removes agent files):

```bash
rm -rf ~/.elysiaclaw/workspace
```

5. Remove the CLI install (pick the one you used):

```bash
npm rm -g elysiaclaw
pnpm remove -g elysiaclaw
bun remove -g elysiaclaw
```

6. If you installed the macOS app:

```bash
rm -rf /Applications/ElysiaClaw.app
```

Notes:

- If you used profiles (`--profile` / `OPENCLAW_PROFILE`), repeat step 3 for each state dir (defaults are `~/.elysiaclaw-<profile>`).
- In remote mode, the state dir lives on the **gateway host**, so run steps 1-4 there too.

## Manual service removal (CLI not installed)

Use this if the gateway service keeps running but `elysiaclaw` is missing.

### macOS (launchd)

Default label is `ai.elysiaclaw.gateway` (or `ai.elysiaclaw.<profile>`; legacy `com.elysiaclaw.*` may still exist):

```bash
launchctl bootout gui/$UID/ai.elysiaclaw.gateway
rm -f ~/Library/LaunchAgents/ai.elysiaclaw.gateway.plist
```

If you used a profile, replace the label and plist name with `ai.elysiaclaw.<profile>`. Remove any legacy `com.elysiaclaw.*` plists if present.

### Linux (systemd user unit)

Default unit name is `elysiaclaw-gateway.service` (or `elysiaclaw-gateway-<profile>.service`):

```bash
systemctl --user disable --now elysiaclaw-gateway.service
rm -f ~/.config/systemd/user/elysiaclaw-gateway.service
systemctl --user daemon-reload
```

### Windows (Scheduled Task)

Default task name is `ElysiaClaw Gateway` (or `ElysiaClaw Gateway (<profile>)`).
The task script lives under your state dir.

```powershell
schtasks /Delete /F /TN "ElysiaClaw Gateway"
Remove-Item -Force "$env:USERPROFILE\.elysiaclaw\gateway.cmd"
```

If you used a profile, delete the matching task name and `~\.elysiaclaw-<profile>\gateway.cmd`.

## Normal install vs source checkout

### Normal install (install.sh / npm / pnpm / bun)

If you used `https://elysiaclaw.ai/install.sh` or `install.ps1`, the CLI was installed with `npm install -g elysiaclaw@latest`.
Remove it with `npm rm -g elysiaclaw` (or `pnpm remove -g` / `bun remove -g` if you installed that way).

### Source checkout (git clone)

If you run from a repo checkout (`git clone` + `elysiaclaw ...` / `bun run elysiaclaw ...`):

1. Uninstall the gateway service **before** deleting the repo (use the easy path above or manual service removal).
2. Delete the repo directory.
3. Remove state + workspace as shown above.
