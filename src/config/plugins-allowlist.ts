import type { ElysiaClawConfig } from "./config.js";

export function ensurePluginAllowlisted(cfg: ElysiaClawConfig, pluginId: string): ElysiaClawConfig {
  const allow = cfg.plugins?.allow;
  if (!Array.isArray(allow) || allow.includes(pluginId)) {
    return cfg;
  }
  return {
    ...cfg,
    plugins: {
      ...cfg.plugins,
      allow: [...allow, pluginId],
    },
  };
}
