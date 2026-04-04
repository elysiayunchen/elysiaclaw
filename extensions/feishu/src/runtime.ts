import { createPluginRuntimeStore } from "elysiaclaw/plugin-sdk/compat";
import type { PluginRuntime } from "elysiaclaw/plugin-sdk/feishu";

const { setRuntime: setFeishuRuntime, getRuntime: getFeishuRuntime } =
  createPluginRuntimeStore<PluginRuntime>("Feishu runtime not initialized");
export { getFeishuRuntime, setFeishuRuntime };
