import type { ElysiaClawConfig } from "../config/config.js";
import { loadElysiaClawPlugins } from "../plugins/loader.js";
import { resolveUserPath } from "../utils.js";

export function ensureRuntimePluginsLoaded(params: {
  config?: ElysiaClawConfig;
  workspaceDir?: string | null;
}): void {
  const workspaceDir =
    typeof params.workspaceDir === "string" && params.workspaceDir.trim()
      ? resolveUserPath(params.workspaceDir)
      : undefined;

  loadElysiaClawPlugins({
    config: params.config,
    workspaceDir,
  });
}
