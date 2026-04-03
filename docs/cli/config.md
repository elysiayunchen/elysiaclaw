---
summary: "CLI reference for `elysiaclaw config` (get/set/unset/file/validate)"
read_when:
  - You want to read or edit config non-interactively
title: "config"
---

# `elysiaclaw config`

Config helpers: get/set/unset/validate values by path and print the active
config file. Run without a subcommand to open
the configure wizard (same as `elysiaclaw configure`).

## Examples

```bash
elysiaclaw config file
elysiaclaw config get browser.executablePath
elysiaclaw config set browser.executablePath "/usr/bin/google-chrome"
elysiaclaw config set agents.defaults.heartbeat.every "2h"
elysiaclaw config set agents.list[0].tools.exec.node "node-id-or-name"
elysiaclaw config unset tools.web.search.apiKey
elysiaclaw config validate
elysiaclaw config validate --json
```

## Paths

Paths use dot or bracket notation:

```bash
elysiaclaw config get agents.defaults.workspace
elysiaclaw config get agents.list[0].id
```

Use the agent list index to target a specific agent:

```bash
elysiaclaw config get agents.list
elysiaclaw config set agents.list[1].tools.exec.node "node-id-or-name"
```

## Values

Values are parsed as JSON5 when possible; otherwise they are treated as strings.
Use `--strict-json` to require JSON5 parsing. `--json` remains supported as a legacy alias.

```bash
elysiaclaw config set agents.defaults.heartbeat.every "0m"
elysiaclaw config set gateway.port 19001 --strict-json
elysiaclaw config set channels.whatsapp.groups '["*"]' --strict-json
```

## Subcommands

- `config file`: Print the active config file path (resolved from `OPENCLAW_CONFIG_PATH` or default location).

Restart the gateway after edits.

## Validate

Validate the current config against the active schema without starting the
gateway.

```bash
elysiaclaw config validate
elysiaclaw config validate --json
```
