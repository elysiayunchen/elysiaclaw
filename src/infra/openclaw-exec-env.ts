export const ELYSIACLAW_CLI_ENV_VAR = "ELYSIACLAW_CLI";
export const ELYSIACLAW_CLI_ENV_VALUE = "1";

export function markElysiaClawExecEnv<T extends Record<string, string | undefined>>(env: T): T {
  return {
    ...env,
    [ELYSIACLAW_CLI_ENV_VAR]: ELYSIACLAW_CLI_ENV_VALUE,
  };
}

export function ensureElysiaClawExecMarkerOnProcess(
  env: NodeJS.ProcessEnv = process.env,
): NodeJS.ProcessEnv {
  env[ELYSIACLAW_CLI_ENV_VAR] = ELYSIACLAW_CLI_ENV_VALUE;
  return env;
}
