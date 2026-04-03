import { describe, expect, it } from "vitest";
import { buildPlatformRuntimeLogHints, buildPlatformServiceStartHints } from "./runtime-hints.js";

describe("buildPlatformRuntimeLogHints", () => {
  it("renders launchd log hints on darwin", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "darwin",
        env: {
          ELYSIACLAW_STATE_DIR: "/tmp/openclaw-state",
          ELYSIACLAW_LOG_PREFIX: "gateway",
        },
        systemdServiceName: "elysiaclaw-gateway",
        windowsTaskName: "ElysiaClaw Gateway",
      }),
    ).toEqual([
      "Launchd stdout (if installed): /tmp/openclaw-state/logs/gateway.log",
      "Launchd stderr (if installed): /tmp/openclaw-state/logs/gateway.err.log",
    ]);
  });

  it("renders systemd and windows hints by platform", () => {
    expect(
      buildPlatformRuntimeLogHints({
        platform: "linux",
        systemdServiceName: "elysiaclaw-gateway",
        windowsTaskName: "ElysiaClaw Gateway",
      }),
    ).toEqual(["Logs: journalctl --user -u elysiaclaw-gateway.service -n 200 --no-pager"]);
    expect(
      buildPlatformRuntimeLogHints({
        platform: "win32",
        systemdServiceName: "elysiaclaw-gateway",
        windowsTaskName: "ElysiaClaw Gateway",
      }),
    ).toEqual(['Logs: schtasks /Query /TN "ElysiaClaw Gateway" /V /FO LIST']);
  });
});

describe("buildPlatformServiceStartHints", () => {
  it("builds platform-specific service start hints", () => {
    expect(
      buildPlatformServiceStartHints({
        platform: "darwin",
        installCommand: "elysiaclaw gateway install",
        startCommand: "elysiaclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.elysiaclaw.gateway.plist",
        systemdServiceName: "elysiaclaw-gateway",
        windowsTaskName: "ElysiaClaw Gateway",
      }),
    ).toEqual([
      "elysiaclaw gateway install",
      "elysiaclaw gateway",
      "launchctl bootstrap gui/$UID ~/Library/LaunchAgents/com.elysiaclaw.gateway.plist",
    ]);
    expect(
      buildPlatformServiceStartHints({
        platform: "linux",
        installCommand: "elysiaclaw gateway install",
        startCommand: "elysiaclaw gateway",
        launchAgentPlistPath: "~/Library/LaunchAgents/com.elysiaclaw.gateway.plist",
        systemdServiceName: "elysiaclaw-gateway",
        windowsTaskName: "ElysiaClaw Gateway",
      }),
    ).toEqual([
      "elysiaclaw gateway install",
      "elysiaclaw gateway",
      "systemctl --user start elysiaclaw-gateway.service",
    ]);
  });
});
