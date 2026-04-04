import { createPluginRuntimeStore } from "elysiaclaw/plugin-sdk/compat";
import type { PluginRuntime } from "elysiaclaw/plugin-sdk/zalo";

const { setRuntime: setZaloRuntime, getRuntime: getZaloRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Zalo runtime not initialized");
export { getZaloRuntime, setZaloRuntime };
