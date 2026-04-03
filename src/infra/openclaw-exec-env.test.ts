import { describe, expect, it } from "vitest";
import {
  ensureElysiaClawExecMarkerOnProcess,
  markElysiaClawExecEnv,
  ELYSIACLAW_CLI_ENV_VALUE,
  ELYSIACLAW_CLI_ENV_VAR,
} from "./openclaw-exec-env.js";

describe("markElysiaClawExecEnv", () => {
  it("returns a cloned env object with the exec marker set", () => {
    const env = { PATH: "/usr/bin", ELYSIACLAW_CLI: "0" };
    const marked = markElysiaClawExecEnv(env);

    expect(marked).toEqual({
      PATH: "/usr/bin",
      ELYSIACLAW_CLI: ELYSIACLAW_CLI_ENV_VALUE,
    });
    expect(marked).not.toBe(env);
    expect(env.ELYSIACLAW_CLI).toBe("0");
  });
});

describe("ensureElysiaClawExecMarkerOnProcess", () => {
  it("mutates and returns the provided process env", () => {
    const env: NodeJS.ProcessEnv = { PATH: "/usr/bin" };

    expect(ensureElysiaClawExecMarkerOnProcess(env)).toBe(env);
    expect(env[ELYSIACLAW_CLI_ENV_VAR]).toBe(ELYSIACLAW_CLI_ENV_VALUE);
  });

  it("defaults to mutating process.env when no env object is provided", () => {
    const previous = process.env[ELYSIACLAW_CLI_ENV_VAR];
    delete process.env[ELYSIACLAW_CLI_ENV_VAR];

    try {
      expect(ensureElysiaClawExecMarkerOnProcess()).toBe(process.env);
      expect(process.env[ELYSIACLAW_CLI_ENV_VAR]).toBe(ELYSIACLAW_CLI_ENV_VALUE);
    } finally {
      if (previous === undefined) {
        delete process.env[ELYSIACLAW_CLI_ENV_VAR];
      } else {
        process.env[ELYSIACLAW_CLI_ENV_VAR] = previous;
      }
    }
  });
});
