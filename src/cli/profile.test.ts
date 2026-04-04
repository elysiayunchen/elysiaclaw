import path from "node:path";
import { describe, expect, it } from "vitest";
import { formatCliCommand } from "./command-format.js";
import { applyCliProfileEnv, parseCliProfileArgs } from "./profile.js";

describe("parseCliProfileArgs", () => {
  it("leaves gateway --dev for subcommands", () => {
    const res = parseCliProfileArgs([
      "node",
      "elysiaclaw",
      "gateway",
      "--dev",
      "--allow-unconfigured",
    ]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBeNull();
    expect(res.argv).toEqual(["node", "elysiaclaw", "gateway", "--dev", "--allow-unconfigured"]);
  });

  it("still accepts global --dev before subcommand", () => {
    const res = parseCliProfileArgs(["node", "elysiaclaw", "--dev", "gateway"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("dev");
    expect(res.argv).toEqual(["node", "elysiaclaw", "gateway"]);
  });

  it("parses --profile value and strips it", () => {
    const res = parseCliProfileArgs(["node", "elysiaclaw", "--profile", "work", "status"]);
    if (!res.ok) {
      throw new Error(res.error);
    }
    expect(res.profile).toBe("work");
    expect(res.argv).toEqual(["node", "elysiaclaw", "status"]);
  });

  it("rejects missing profile value", () => {
    const res = parseCliProfileArgs(["node", "elysiaclaw", "--profile"]);
    expect(res.ok).toBe(false);
  });

  it.each([
    ["--dev first", ["node", "elysiaclaw", "--dev", "--profile", "work", "status"]],
    ["--profile first", ["node", "elysiaclaw", "--profile", "work", "--dev", "status"]],
  ])("rejects combining --dev with --profile (%s)", (_name, argv) => {
    const res = parseCliProfileArgs(argv);
    expect(res.ok).toBe(false);
  });
});

describe("applyCliProfileEnv", () => {
  it("fills env defaults for dev profile", () => {
    const env: Record<string, string | undefined> = {};
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    const expectedStateDir = path.join(path.resolve("/home/peter"), ".elysiaclaw-dev");
    expect(env.ELYSIACLAW_PROFILE).toBe("dev");
    expect(env.ELYSIACLAW_STATE_DIR).toBe(expectedStateDir);
    expect(env.ELYSIACLAW_CONFIG_PATH).toBe(path.join(expectedStateDir, "elysiaclaw.json"));
    expect(env.ELYSIACLAW_GATEWAY_PORT).toBe("19001");
  });

  it("does not override explicit env values", () => {
    const env: Record<string, string | undefined> = {
      ELYSIACLAW_STATE_DIR: "/custom",
      ELYSIACLAW_GATEWAY_PORT: "19099",
    };
    applyCliProfileEnv({
      profile: "dev",
      env,
      homedir: () => "/home/peter",
    });
    expect(env.ELYSIACLAW_STATE_DIR).toBe("/custom");
    expect(env.ELYSIACLAW_GATEWAY_PORT).toBe("19099");
    expect(env.ELYSIACLAW_CONFIG_PATH).toBe(path.join("/custom", "elysiaclaw.json"));
  });

  it("uses ELYSIACLAW_HOME when deriving profile state dir", () => {
    const env: Record<string, string | undefined> = {
      ELYSIACLAW_HOME: "/srv/elysiaclaw-home",
      HOME: "/home/other",
    };
    applyCliProfileEnv({
      profile: "work",
      env,
      homedir: () => "/home/fallback",
    });

    const resolvedHome = path.resolve("/srv/elysiaclaw-home");
    expect(env.ELYSIACLAW_STATE_DIR).toBe(path.join(resolvedHome, ".elysiaclaw-work"));
    expect(env.ELYSIACLAW_CONFIG_PATH).toBe(
      path.join(resolvedHome, ".elysiaclaw-work", "elysiaclaw.json"),
    );
  });
});

describe("formatCliCommand", () => {
  it.each([
    {
      name: "no profile is set",
      cmd: "elysiaclaw doctor --fix",
      env: {},
      expected: "elysiaclaw doctor --fix",
    },
    {
      name: "profile is default",
      cmd: "elysiaclaw doctor --fix",
      env: { ELYSIACLAW_PROFILE: "default" },
      expected: "elysiaclaw doctor --fix",
    },
    {
      name: "profile is Default (case-insensitive)",
      cmd: "elysiaclaw doctor --fix",
      env: { ELYSIACLAW_PROFILE: "Default" },
      expected: "elysiaclaw doctor --fix",
    },
    {
      name: "profile is invalid",
      cmd: "elysiaclaw doctor --fix",
      env: { ELYSIACLAW_PROFILE: "bad profile" },
      expected: "elysiaclaw doctor --fix",
    },
    {
      name: "--profile is already present",
      cmd: "elysiaclaw --profile work doctor --fix",
      env: { ELYSIACLAW_PROFILE: "work" },
      expected: "elysiaclaw --profile work doctor --fix",
    },
    {
      name: "--dev is already present",
      cmd: "elysiaclaw --dev doctor",
      env: { ELYSIACLAW_PROFILE: "dev" },
      expected: "elysiaclaw --dev doctor",
    },
  ])("returns command unchanged when $name", ({ cmd, env, expected }) => {
    expect(formatCliCommand(cmd, env)).toBe(expected);
  });

  it("inserts --profile flag when profile is set", () => {
    expect(formatCliCommand("elysiaclaw doctor --fix", { ELYSIACLAW_PROFILE: "work" })).toBe(
      "elysiaclaw --profile work doctor --fix",
    );
  });

  it("trims whitespace from profile", () => {
    expect(
      formatCliCommand("elysiaclaw doctor --fix", { ELYSIACLAW_PROFILE: "  jbelysiaclaw  " }),
    ).toBe("elysiaclaw --profile jbelysiaclaw doctor --fix");
  });

  it("handles command with no args after elysiaclaw", () => {
    expect(formatCliCommand("elysiaclaw", { ELYSIACLAW_PROFILE: "test" })).toBe(
      "elysiaclaw --profile test",
    );
  });

  it("handles pnpm wrapper", () => {
    expect(formatCliCommand("pnpm elysiaclaw doctor", { ELYSIACLAW_PROFILE: "work" })).toBe(
      "pnpm elysiaclaw --profile work doctor",
    );
  });
});
