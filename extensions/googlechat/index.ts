import type { ElysiaClawPluginApi } from "elysiaclaw/plugin-sdk/googlechat";
import { emptyPluginConfigSchema } from "elysiaclaw/plugin-sdk/googlechat";
import { googlechatDock, googlechatPlugin } from "./src/channel.js";
import { setGoogleChatRuntime } from "./src/runtime.js";

const plugin = {
  id: "googlechat",
  name: "Google Chat",
  description: "ElysiaClaw Google Chat channel plugin",
  configSchema: emptyPluginConfigSchema(),
  register(api: ElysiaClawPluginApi) {
    setGoogleChatRuntime(api.runtime);
    api.registerChannel({ plugin: googlechatPlugin, dock: googlechatDock });
  },
};

export default plugin;
