---
summary: "CLI reference for `elysiaclaw voicecall` (voice-call plugin command surface)"
read_when:
  - You use the voice-call plugin and want the CLI entry points
  - You want quick examples for `voicecall call|continue|status|tail|expose`
title: "voicecall"
---

# `elysiaclaw voicecall`

`voicecall` is a plugin-provided command. It only appears if the voice-call plugin is installed and enabled.

Primary doc:

- Voice-call plugin: [Voice Call](/plugins/voice-call)

## Common commands

```bash
elysiaclaw voicecall status --call-id <id>
elysiaclaw voicecall call --to "+15555550123" --message "Hello" --mode notify
elysiaclaw voicecall continue --call-id <id> --message "Any questions?"
elysiaclaw voicecall end --call-id <id>
```

## Exposing webhooks (Tailscale)

```bash
elysiaclaw voicecall expose --mode serve
elysiaclaw voicecall expose --mode funnel
elysiaclaw voicecall expose --mode off
```

Security note: only expose the webhook endpoint to networks you trust. Prefer Tailscale Serve over Funnel when possible.
