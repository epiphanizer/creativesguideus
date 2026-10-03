import { defineConfig } from "@playwright/test";

const port = 3008;
const host = "127.0.0.1";
const baseURL = `http://${host}:${port}`;

export default defineConfig({
  testDir: "./tests/security",
  timeout: 60_000,
  fullyParallel: false,
  reporter: [["line"]],
  use: {
    baseURL,
    headless: true,
  },
  webServer: {
    command: `npx next dev --hostname ${host} --port ${port}`,
    url: baseURL,
    timeout: 60_000,
    reuseExistingServer: false,
  },
});
