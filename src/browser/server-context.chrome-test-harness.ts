import { vi } from "vitest";
import { installChromeUserDataDirHooks } from "./chrome-user-data-dir.test-harness.js";

const chromeUserDataDir = { dir: "/tmp/openclaw" };
installChromeUserDataDirHooks(chromeUserDataDir);

vi.mock("./chrome.js", () => ({
  isChromeCdpReady: vi.fn(async () => true),
  isChromeReachable: vi.fn(async () => true),
  launchElysiaClawChrome: vi.fn(async () => {
    throw new Error("unexpected launch");
  }),
  resolveElysiaClawUserDataDir: vi.fn(() => chromeUserDataDir.dir),
  stopElysiaClawChrome: vi.fn(async () => {}),
}));
