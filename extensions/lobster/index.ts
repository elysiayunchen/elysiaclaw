import type {
  AnyAgentTool,
  ElysiaClawPluginApi,
  ElysiaClawPluginToolFactory,
} from "elysiaclaw/plugin-sdk/lobster";
import { createLobsterTool } from "./src/lobster-tool.js";

export default function register(api: ElysiaClawPluginApi) {
  api.registerTool(
    ((ctx) => {
      if (ctx.sandboxed) {
        return null;
      }
      return createLobsterTool(api) as AnyAgentTool;
    }) as ElysiaClawPluginToolFactory,
    { optional: true },
  );
}
