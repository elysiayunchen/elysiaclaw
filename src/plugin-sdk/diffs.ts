// Narrow plugin-sdk surface for the bundled diffs plugin.
// Keep this list additive and scoped to symbols used under extensions/diffs.

export type { ElysiaClawConfig } from "../config/config.js";
export { resolvePreferredElysiaClawTmpDir } from "../infra/tmp-elysiaclaw-dir.js";
export type {
  AnyAgentTool,
  ElysiaClawPluginApi,
  ElysiaClawPluginConfigSchema,
  PluginLogger,
} from "../plugins/types.js";
