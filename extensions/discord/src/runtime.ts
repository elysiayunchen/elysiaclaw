import { createPluginRuntimeStore } from "elysiaclaw/plugin-sdk/compat";
import type { PluginRuntime } from "elysiaclaw/plugin-sdk/discord";

const { setRuntime: setDiscordRuntime, getRuntime: getDiscordRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Discord runtime not initialized");
export { getDiscordRuntime, setDiscordRuntime };
