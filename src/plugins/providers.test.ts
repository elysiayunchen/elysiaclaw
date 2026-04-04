import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolvePluginProviders } from "./providers.js";

const loadElysiaClawPluginsMock = vi.fn();

vi.mock("./loader.js", () => ({
  loadElysiaClawPlugins: (...args: unknown[]) => loadElysiaClawPluginsMock(...args),
}));

describe("resolvePluginProviders", () => {
  beforeEach(() => {
    loadElysiaClawPluginsMock.mockReset();
    loadElysiaClawPluginsMock.mockReturnValue({
      providers: [{ provider: { id: "demo-provider" } }],
    });
  });

  it("forwards an explicit env to plugin loading", () => {
    const env = { ELYSIACLAW_HOME: "/srv/elysiaclaw-home" } as NodeJS.ProcessEnv;

    const providers = resolvePluginProviders({
      workspaceDir: "/workspace/explicit",
      env,
    });

    expect(providers).toEqual([{ id: "demo-provider" }]);
    expect(loadElysiaClawPluginsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        workspaceDir: "/workspace/explicit",
        env,
      }),
    );
  });
});
