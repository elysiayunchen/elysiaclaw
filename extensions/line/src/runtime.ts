import { createPluginRuntimeStore } from "elysiaclaw/plugin-sdk/compat";
import type { PluginRuntime } from "elysiaclaw/plugin-sdk/line";

const { setRuntime: setLineRuntime, getRuntime: getLineRuntime } =
  createPluginRuntimeStore<PluginRuntime>("LINE runtime not initialized - plugin not registered");
export { getLineRuntime, setLineRuntime };
