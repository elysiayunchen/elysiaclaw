import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { captureEnv } from "../test-utils/env.js";
import {
  cleanupGlobalRenameDirs,
  detectGlobalInstallManagerByPresence,
  detectGlobalInstallManagerForRoot,
  globalInstallArgs,
  globalInstallFallbackArgs,
  resolveGlobalPackageRoot,
  resolveGlobalInstallSpec,
  resolveGlobalRoot,
  type CommandRunner,
} from "./update-global.js";

describe("update global helpers", () => {
  let envSnapshot: ReturnType<typeof captureEnv> | undefined;

  afterEach(() => {
    envSnapshot?.restore();
    envSnapshot = undefined;
  });

  it("prefers explicit package spec overrides", () => {
    envSnapshot = captureEnv(["ELYSIACLAW_UPDATE_PACKAGE_SPEC"]);
    process.env.ELYSIACLAW_UPDATE_PACKAGE_SPEC = "file:/tmp/elysiaclaw.tgz";

    expect(resolveGlobalInstallSpec({ packageName: "elysiaclaw", tag: "latest" })).toBe(
      "file:/tmp/elysiaclaw.tgz",
    );
    expect(
      resolveGlobalInstallSpec({
        packageName: "elysiaclaw",
        tag: "beta",
        env: { ELYSIACLAW_UPDATE_PACKAGE_SPEC: "elysiaclaw@next" },
      }),
    ).toBe("elysiaclaw@next");
  });

  it("resolves global roots and package roots from runner output", async () => {
    const runCommand: CommandRunner = async (argv) => {
      if (argv[0] === "npm") {
        return { stdout: "/tmp/npm-root\n", stderr: "", code: 0 };
      }
      if (argv[0] === "pnpm") {
        return { stdout: "", stderr: "", code: 1 };
      }
      throw new Error(`unexpected command: ${argv.join(" ")}`);
    };

    await expect(resolveGlobalRoot("npm", runCommand, 1000)).resolves.toBe("/tmp/npm-root");
    await expect(resolveGlobalRoot("pnpm", runCommand, 1000)).resolves.toBeNull();
    await expect(resolveGlobalRoot("bun", runCommand, 1000)).resolves.toContain(
      path.join(".bun", "install", "global", "node_modules"),
    );
    await expect(resolveGlobalPackageRoot("npm", runCommand, 1000)).resolves.toBe(
      path.join("/tmp/npm-root", "elysiaclaw"),
    );
  });

  it("detects install managers from resolved roots and on-disk presence", async () => {
    const base = await fs.mkdtemp(path.join(os.tmpdir(), "elysiaclaw-update-global-"));
    const npmRoot = path.join(base, "npm-root");
    const pnpmRoot = path.join(base, "pnpm-root");
    const bunRoot = path.join(base, ".bun", "install", "global", "node_modules");
    const pkgRoot = path.join(pnpmRoot, "elysiaclaw");
    await fs.mkdir(pkgRoot, { recursive: true });
    await fs.mkdir(path.join(npmRoot, "elysiaclaw"), { recursive: true });
    await fs.mkdir(path.join(bunRoot, "elysiaclaw"), { recursive: true });

    envSnapshot = captureEnv(["BUN_INSTALL"]);
    process.env.BUN_INSTALL = path.join(base, ".bun");

    const runCommand: CommandRunner = async (argv) => {
      if (argv[0] === "npm") {
        return { stdout: `${npmRoot}\n`, stderr: "", code: 0 };
      }
      if (argv[0] === "pnpm") {
        return { stdout: `${pnpmRoot}\n`, stderr: "", code: 0 };
      }
      throw new Error(`unexpected command: ${argv.join(" ")}`);
    };

    await expect(detectGlobalInstallManagerForRoot(runCommand, pkgRoot, 1000)).resolves.toBe(
      "pnpm",
    );
    await expect(detectGlobalInstallManagerByPresence(runCommand, 1000)).resolves.toBe("npm");

    await fs.rm(path.join(npmRoot, "elysiaclaw"), { recursive: true, force: true });
    await fs.rm(path.join(pnpmRoot, "elysiaclaw"), { recursive: true, force: true });
    await expect(detectGlobalInstallManagerByPresence(runCommand, 1000)).resolves.toBe("bun");
  });

  it("builds install argv and npm fallback argv", () => {
    expect(globalInstallArgs("npm", "elysiaclaw@latest")).toEqual([
      "npm",
      "i",
      "-g",
      "elysiaclaw@latest",
      "--no-fund",
      "--no-audit",
      "--loglevel=error",
    ]);
    expect(globalInstallArgs("pnpm", "elysiaclaw@latest")).toEqual([
      "pnpm",
      "add",
      "-g",
      "elysiaclaw@latest",
    ]);
    expect(globalInstallArgs("bun", "elysiaclaw@latest")).toEqual([
      "bun",
      "add",
      "-g",
      "elysiaclaw@latest",
    ]);

    expect(globalInstallFallbackArgs("npm", "elysiaclaw@latest")).toEqual([
      "npm",
      "i",
      "-g",
      "elysiaclaw@latest",
      "--omit=optional",
      "--no-fund",
      "--no-audit",
      "--loglevel=error",
    ]);
    expect(globalInstallFallbackArgs("pnpm", "elysiaclaw@latest")).toBeNull();
  });

  it("cleans only renamed package directories", async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), "elysiaclaw-update-cleanup-"));
    await fs.mkdir(path.join(root, ".elysiaclaw-123"), { recursive: true });
    await fs.mkdir(path.join(root, ".elysiaclaw-456"), { recursive: true });
    await fs.writeFile(path.join(root, ".elysiaclaw-file"), "nope", "utf8");
    await fs.mkdir(path.join(root, "elysiaclaw"), { recursive: true });

    await expect(
      cleanupGlobalRenameDirs({
        globalRoot: root,
        packageName: "elysiaclaw",
      }),
    ).resolves.toEqual({
      removed: [".elysiaclaw-123", ".elysiaclaw-456"],
    });
    await expect(fs.stat(path.join(root, "elysiaclaw"))).resolves.toBeDefined();
    await expect(fs.stat(path.join(root, ".elysiaclaw-file"))).resolves.toBeDefined();
  });
});
