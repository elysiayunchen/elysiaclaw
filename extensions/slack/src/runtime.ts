import { createPluginRuntimeStore } from "elysiaclaw/plugin-sdk/compat";
import type { PluginRuntime } from "elysiaclaw/plugin-sdk/slack";

const { setRuntime: setSlackRuntime, getRuntime: getSlackRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Slack runtime not initialized");
export { getSlackRuntime, setSlackRuntime };
