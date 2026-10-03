import { spawn } from "node:child_process";
import { chromium } from "@playwright/test";

const ARTIFACT_DIR = "/Users/seanhalls/.gemini/antigravity/brain/2c76e3d2-8a02-4369-8b0f-8fbcc6e27ecb";
const PORT = 3009;

async function waitForServer(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // Wait a bit
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server at ${url} failed to start within ${timeoutMs}ms`);
}

async function main() {
  console.log("Starting Next.js production server on port 3009...");
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: "/Users/seanhalls/Desktop/sh/cgu_master",
    stdio: "inherit"
  });

  try {
    await waitForServer(`http://127.0.0.1:${PORT}/johnwalls-rocks`);
    console.log("Server ready!");

    const browser = await chromium.launch({ headless: true });

    // Desktop Context
    const desktopContext = await browser.newContext({
      viewport: { width: 1400, height: 950 },
      deviceScaleFactor: 2
    });

    // Mobile Context
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2
    });

    // 1. Capture Desktop johnwalls.rocks
    console.log("Capturing johnwalls.rocks desktop...");
    const rocksPageDesktop = await desktopContext.newPage();
    await rocksPageDesktop.goto(`http://127.0.0.1:${PORT}/johnwalls-rocks`, { waitUntil: "networkidle" });
    await rocksPageDesktop.waitForTimeout(600);
    await rocksPageDesktop.screenshot({
      path: `${ARTIFACT_DIR}/johnwalls_rocks_desktop.png`,
      fullPage: true
    });

    // 2. Capture Mobile johnwalls.rocks
    console.log("Capturing johnwalls.rocks mobile...");
    const rocksPageMobile = await mobileContext.newPage();
    await rocksPageMobile.goto(`http://127.0.0.1:${PORT}/johnwalls-rocks`, { waitUntil: "networkidle" });
    await rocksPageMobile.waitForTimeout(600);
    await rocksPageMobile.screenshot({
      path: `${ARTIFACT_DIR}/johnwalls_rocks_mobile.png`,
      fullPage: true
    });

    // 3. Capture Desktop johnwalls.studio
    console.log("Capturing johnwalls.studio desktop...");
    const studioPageDesktop = await desktopContext.newPage();
    await studioPageDesktop.goto(`http://127.0.0.1:${PORT}/johnwalls-studio`, { waitUntil: "networkidle" });
    await studioPageDesktop.waitForTimeout(600);
    await studioPageDesktop.screenshot({
      path: `${ARTIFACT_DIR}/johnwalls_studio_desktop.png`,
      fullPage: true
    });

    // 4. Capture Mobile johnwalls.studio
    console.log("Capturing johnwalls.studio mobile...");
    const studioPageMobile = await mobileContext.newPage();
    await studioPageMobile.goto(`http://127.0.0.1:${PORT}/johnwalls-studio`, { waitUntil: "networkidle" });
    await studioPageMobile.waitForTimeout(600);
    await studioPageMobile.screenshot({
      path: `${ARTIFACT_DIR}/johnwalls_studio_mobile.png`,
      fullPage: true
    });

    // 5. Test Host Header Rewrites
    console.log("Testing Host header rewrites in middleware...");
    const rocksHostRes = await fetch(`http://127.0.0.1:${PORT}/`, {
      headers: { "x-forwarded-host": "johnwalls.rocks" }
    });
    const rocksHtml = await rocksHostRes.text();
    console.log("Host johnwalls.rocks -> contains 'johnwalls.rocks' signature:", rocksHtml.includes("johnwalls.rocks"));

    const studioHostRes = await fetch(`http://127.0.0.1:${PORT}/`, {
      headers: { "x-forwarded-host": "johnwalls.studio" }
    });
    const studioHtml = await studioHostRes.text();
    console.log("Host johnwalls.studio -> contains 'johnwalls.studio' signature:", studioHtml.includes("johnwalls.studio"));

    await browser.close();
    console.log("Visual verification complete! Screenshots saved.");
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
