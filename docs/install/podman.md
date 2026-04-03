---
summary: "Run ElysiaClaw in a rootless Podman container"
read_when:
  - You want a containerized gateway with Podman instead of Docker
title: "Podman"
---

# Podman

Run the ElysiaClaw gateway in a **rootless** Podman container. Uses the same image as Docker (build from the repo [Dockerfile](https://github.com/elysiaclaw/elysiaclaw/blob/main/Dockerfile)).

## Requirements

- Podman (rootless)
- Sudo for one-time setup (create user, build image)

## Quick start

**1. One-time setup** (from repo root; creates user, builds image, installs launch script):

```bash
./setup-podman.sh
```

This also creates a minimal `~elysiaclaw/.elysiaclaw/elysiaclaw.json` (sets `gateway.mode="local"`) so the gateway can start without running the wizard.

By default the container is **not** installed as a systemd service, you start it manually (see below). For a production-style setup with auto-start and restarts, install it as a systemd Quadlet user service instead:

```bash
./setup-podman.sh --quadlet
```

(Or set `OPENCLAW_PODMAN_QUADLET=1`; use `--container` to install only the container and launch script.)

Optional build-time env vars (set before running `setup-podman.sh`):

- `OPENCLAW_DOCKER_APT_PACKAGES` — install extra apt packages during image build
- `OPENCLAW_EXTENSIONS` — pre-install extension dependencies (space-separated extension names, e.g. `diagnostics-otel matrix`)

**2. Start gateway** (manual, for quick smoke testing):

```bash
./scripts/run-elysiaclaw-podman.sh launch
```

**3. Onboarding wizard** (e.g. to add channels or providers):

```bash
./scripts/run-elysiaclaw-podman.sh launch setup
```

Then open `http://127.0.0.1:18789/` and use the token from `~elysiaclaw/.elysiaclaw/.env` (or the value printed by setup).

## Systemd (Quadlet, optional)

If you ran `./setup-podman.sh --quadlet` (or `OPENCLAW_PODMAN_QUADLET=1`), a [Podman Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html) unit is installed so the gateway runs as a systemd user service for the elysiaclaw user. The service is enabled and started at the end of setup.

- **Start:** `sudo systemctl --machine elysiaclaw@ --user start elysiaclaw.service`
- **Stop:** `sudo systemctl --machine elysiaclaw@ --user stop elysiaclaw.service`
- **Status:** `sudo systemctl --machine elysiaclaw@ --user status elysiaclaw.service`
- **Logs:** `sudo journalctl --machine elysiaclaw@ --user -u elysiaclaw.service -f`

The quadlet file lives at `~elysiaclaw/.config/containers/systemd/elysiaclaw.container`. To change ports or env, edit that file (or the `.env` it sources), then `sudo systemctl --machine elysiaclaw@ --user daemon-reload` and restart the service. On boot, the service starts automatically if lingering is enabled for elysiaclaw (setup does this when loginctl is available).

To add quadlet **after** an initial setup that did not use it, re-run: `./setup-podman.sh --quadlet`.

## The elysiaclaw user (non-login)

`setup-podman.sh` creates a dedicated system user `elysiaclaw`:

- **Shell:** `nologin` — no interactive login; reduces attack surface.
- **Home:** e.g. `/home/elysiaclaw` — holds `~/.elysiaclaw` (config, workspace) and the launch script `run-elysiaclaw-podman.sh`.
- **Rootless Podman:** The user must have a **subuid** and **subgid** range. Many distros assign these automatically when the user is created. If setup prints a warning, add lines to `/etc/subuid` and `/etc/subgid`:

  ```text
  elysiaclaw:100000:65536
  ```

  Then start the gateway as that user (e.g. from cron or systemd):

  ```bash
  sudo -u elysiaclaw /home/elysiaclaw/run-elysiaclaw-podman.sh
  sudo -u elysiaclaw /home/elysiaclaw/run-elysiaclaw-podman.sh setup
  ```

- **Config:** Only `elysiaclaw` and root can access `/home/elysiaclaw/.elysiaclaw`. To edit config: use the Control UI once the gateway is running, or `sudo -u elysiaclaw $EDITOR /home/elysiaclaw/.elysiaclaw/elysiaclaw.json`.

## Environment and config

- **Token:** Stored in `~elysiaclaw/.elysiaclaw/.env` as `OPENCLAW_GATEWAY_TOKEN`. `setup-podman.sh` and `run-elysiaclaw-podman.sh` generate it if missing (uses `openssl`, `python3`, or `od`).
- **Optional:** In that `.env` you can set provider keys (e.g. `GROQ_API_KEY`, `OLLAMA_API_KEY`) and other ElysiaClaw env vars.
- **Host ports:** By default the script maps `18789` (gateway) and `18790` (bridge). Override the **host** port mapping with `OPENCLAW_PODMAN_GATEWAY_HOST_PORT` and `OPENCLAW_PODMAN_BRIDGE_HOST_PORT` when launching.
- **Gateway bind:** By default, `run-elysiaclaw-podman.sh` starts the gateway with `--bind loopback` for safe local access. To expose on LAN, set `OPENCLAW_GATEWAY_BIND=lan` and configure `gateway.controlUi.allowedOrigins` (or explicitly enable host-header fallback) in `elysiaclaw.json`.
- **Paths:** Host config and workspace default to `~elysiaclaw/.elysiaclaw` and `~elysiaclaw/.elysiaclaw/workspace`. Override the host paths used by the launch script with `OPENCLAW_CONFIG_DIR` and `OPENCLAW_WORKSPACE_DIR`.

## Storage model

- **Persistent host data:** `OPENCLAW_CONFIG_DIR` and `OPENCLAW_WORKSPACE_DIR` are bind-mounted into the container and retain state on the host.
- **Ephemeral sandbox tmpfs:** if you enable `agents.defaults.sandbox`, the tool sandbox containers mount `tmpfs` at `/tmp`, `/var/tmp`, and `/run`. Those paths are memory-backed and disappear with the sandbox container; the top-level Podman container setup does not add its own tmpfs mounts.
- **Disk growth hotspots:** the main paths to watch are `media/`, `agents/<agentId>/sessions/sessions.json`, transcript JSONL files, `cron/runs/*.jsonl`, and rolling file logs under `/tmp/elysiaclaw/` (or your configured `logging.file`).

`setup-podman.sh` now stages the image tar in a private temp directory and prints the chosen base dir during setup. For non-root runs it accepts `TMPDIR` only when that base is safe to use; otherwise it falls back to `/var/tmp`, then `/tmp`. The saved tar stays owner-only and is streamed into the target user’s `podman load`, so private caller temp dirs do not block setup.

## Useful commands

- **Logs:** With quadlet: `sudo journalctl --machine elysiaclaw@ --user -u elysiaclaw.service -f`. With script: `sudo -u elysiaclaw podman logs -f elysiaclaw`
- **Stop:** With quadlet: `sudo systemctl --machine elysiaclaw@ --user stop elysiaclaw.service`. With script: `sudo -u elysiaclaw podman stop elysiaclaw`
- **Start again:** With quadlet: `sudo systemctl --machine elysiaclaw@ --user start elysiaclaw.service`. With script: re-run the launch script or `podman start elysiaclaw`
- **Remove container:** `sudo -u elysiaclaw podman rm -f elysiaclaw` — config and workspace on the host are kept

## Troubleshooting

- **Permission denied (EACCES) on config or auth-profiles:** The container defaults to `--userns=keep-id` and runs as the same uid/gid as the host user running the script. Ensure your host `OPENCLAW_CONFIG_DIR` and `OPENCLAW_WORKSPACE_DIR` are owned by that user.
- **Gateway start blocked (missing `gateway.mode=local`):** Ensure `~elysiaclaw/.elysiaclaw/elysiaclaw.json` exists and sets `gateway.mode="local"`. `setup-podman.sh` creates this file if missing.
- **Rootless Podman fails for user elysiaclaw:** Check `/etc/subuid` and `/etc/subgid` contain a line for `elysiaclaw` (e.g. `elysiaclaw:100000:65536`). Add it if missing and restart.
- **Container name in use:** The launch script uses `podman run --replace`, so the existing container is replaced when you start again. To clean up manually: `podman rm -f elysiaclaw`.
- **Script not found when running as elysiaclaw:** Ensure `setup-podman.sh` was run so that `run-elysiaclaw-podman.sh` is copied to elysiaclaw’s home (e.g. `/home/elysiaclaw/run-elysiaclaw-podman.sh`).
- **Quadlet service not found or fails to start:** Run `sudo systemctl --machine elysiaclaw@ --user daemon-reload` after editing the `.container` file. Quadlet requires cgroups v2: `podman info --format '{{.Host.CgroupsVersion}}'` should show `2`.

## Optional: run as your own user

To run the gateway as your normal user (no dedicated elysiaclaw user): build the image, create `~/.elysiaclaw/.env` with `OPENCLAW_GATEWAY_TOKEN`, and run the container with `--userns=keep-id` and mounts to your `~/.elysiaclaw`. The launch script is designed for the elysiaclaw-user flow; for a single-user setup you can instead run the `podman run` command from the script manually, pointing config and workspace to your home. Recommended for most users: use `setup-podman.sh` and run as the elysiaclaw user so config and process are isolated.
