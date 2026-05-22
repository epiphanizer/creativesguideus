import { defineConfig } from "@playwright/test";

const port = Number(process.env.CGU_SCREENSHOT_PORT || "3005");
const host = process.env.CGU_SCREENSHOT_HOST || "127.0.0.1";
const baseURL = process.env.CGU_BASE_URL || `http://${host}:${port}`;
const useManualServer = process.env.CGU_MANUAL_SERVER === "true";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 180_000,
  fullyParallel: false,
  reporter: [["line"]],
  use: {
    baseURL,
    trace: "off",
    screenshot: "off",
    video: "off",
    headless: true,
  },
  webServer: useManualServer
    ? undefined
    : {
        command: `npm run dev -- --hostname ${host} --port ${port}`,
        url: baseURL,
        timeout: 180_000,
        reuseExistingServer: true,
      },
});