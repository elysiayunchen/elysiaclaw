import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { withTempDir } from "../test-helpers/temp-dir.js";
import {
  resolveDefaultConfigCandidates,
  resolveConfigPathCandidate,
  resolveConfigPath,
  resolveOAuthDir,
  resolveOAuthPath,
  resolveStateDir,
} from "./paths.js";

describe("oauth paths", () => {
  it("prefers ELYSIACLAW_OAUTH_DIR over ELYSIACLAW_STATE_DIR", () => {
    const env = {
      ELYSIACLAW_OAUTH_DIR: "/custom/oauth",
      ELYSIACLAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.resolve("/custom/oauth"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join(path.resolve("/custom/oauth"), "oauth.json"),
    );
  });

  it("derives oauth path from ELYSIACLAW_STATE_DIR when unset", () => {
    const env = {
      ELYSIACLAW_STATE_DIR: "/custom/state",
    } as NodeJS.ProcessEnv;

    expect(resolveOAuthDir(env, "/custom/state")).toBe(path.join("/custom/state", "credentials"));
    expect(resolveOAuthPath(env, "/custom/state")).toBe(
      path.join("/custom/state", "credentials", "oauth.json"),
    );
  });
});

describe("state + config path candidates", () => {
  function expectElysiaClawHomeDefaults(env: NodeJS.ProcessEnv): void {
    const configuredHome = env.ELYSIACLAW_HOME;
    if (!configuredHome) {
      throw new Error("ELYSIACLAW_HOME must be set for this assertion helper");
    }
    const resolvedHome = path.resolve(configuredHome);
    expect(resolveStateDir(env)).toBe(path.join(resolvedHome, ".elysiaclaw"));

    const candidates = resolveDefaultConfigCandidates(env);
    expect(candidates[0]).toBe(path.join(resolvedHome, ".elysiaclaw", "elysiaclaw.json"));
  }

  it("uses ELYSIACLAW_STATE_DIR when set", () => {
    const env = {
      ELYSIACLAW_STATE_DIR: "/new/state",
    } as NodeJS.ProcessEnv;

    expect(resolveStateDir(env, () => "/home/test")).toBe(path.resolve("/new/state"));
  });

  it("uses ELYSIACLAW_HOME for default state/config locations", () => {
    const env = {
      ELYSIACLAW_HOME: "/srv/elysiaclaw-home",
    } as NodeJS.ProcessEnv;
    expectElysiaClawHomeDefaults(env);
  });

  it("prefers ELYSIACLAW_HOME over HOME for default state/config locations", () => {
    const env = {
      ELYSIACLAW_HOME: "/srv/elysiaclaw-home",
      HOME: "/home/other",
    } as NodeJS.ProcessEnv;
    expectElysiaClawHomeDefaults(env);
  });

  it("orders default config candidates in a stable order", () => {
    const home = "/home/test";
    const resolvedHome = path.resolve(home);
    const candidates = resolveDefaultConfigCandidates({} as NodeJS.ProcessEnv, () => home);
    const expected = [
      path.join(resolvedHome, ".elysiaclaw", "elysiaclaw.json"),
      path.join(resolvedHome, ".elysiaclaw", "clawdbot.json"),
      path.join(resolvedHome, ".elysiaclaw", "moldbot.json"),
      path.join(resolvedHome, ".elysiaclaw", "moltbot.json"),
      path.join(resolvedHome, ".clawdbot", "elysiaclaw.json"),
      path.join(resolvedHome, ".clawdbot", "clawdbot.json"),
      path.join(resolvedHome, ".clawdbot", "moldbot.json"),
      path.join(resolvedHome, ".clawdbot", "moltbot.json"),
      path.join(resolvedHome, ".moldbot", "elysiaclaw.json"),
      path.join(resolvedHome, ".moldbot", "clawdbot.json"),
      path.join(resolvedHome, ".moldbot", "moldbot.json"),
      path.join(resolvedHome, ".moldbot", "moltbot.json"),
      path.join(resolvedHome, ".moltbot", "elysiaclaw.json"),
      path.join(resolvedHome, ".moltbot", "clawdbot.json"),
      path.join(resolvedHome, ".moltbot", "moldbot.json"),
      path.join(resolvedHome, ".moltbot", "moltbot.json"),
    ];
    expect(candidates).toEqual(expected);
  });

  it("prefers ~/.elysiaclaw when it exists and legacy dir is missing", async () => {
    await withTempDir({ prefix: "elysiaclaw-state-" }, async (root) => {
      const newDir = path.join(root, ".elysiaclaw");
      await fs.mkdir(newDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(newDir);
    });
  });

  it("falls back to existing legacy state dir when ~/.elysiaclaw is missing", async () => {
    await withTempDir({ prefix: "elysiaclaw-state-legacy-" }, async (root) => {
      const legacyDir = path.join(root, ".clawdbot");
      await fs.mkdir(legacyDir, { recursive: true });
      const resolved = resolveStateDir({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyDir);
    });
  });

  it("CONFIG_PATH prefers existing config when present", async () => {
    await withTempDir({ prefix: "elysiaclaw-config-" }, async (root) => {
      const legacyDir = path.join(root, ".elysiaclaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyPath = path.join(legacyDir, "elysiaclaw.json");
      await fs.writeFile(legacyPath, "{}", "utf-8");

      const resolved = resolveConfigPathCandidate({} as NodeJS.ProcessEnv, () => root);
      expect(resolved).toBe(legacyPath);
    });
  });

  it("respects state dir overrides when config is missing", async () => {
    await withTempDir({ prefix: "elysiaclaw-config-override-" }, async (root) => {
      const legacyDir = path.join(root, ".elysiaclaw");
      await fs.mkdir(legacyDir, { recursive: true });
      const legacyConfig = path.join(legacyDir, "elysiaclaw.json");
      await fs.writeFile(legacyConfig, "{}", "utf-8");

      const overrideDir = path.join(root, "override");
      const env = { ELYSIACLAW_STATE_DIR: overrideDir } as NodeJS.ProcessEnv;
      const resolved = resolveConfigPath(env, overrideDir, () => root);
      expect(resolved).toBe(path.join(overrideDir, "elysiaclaw.json"));
    });
  });
});
