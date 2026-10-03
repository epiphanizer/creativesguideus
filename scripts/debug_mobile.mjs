import { chromium } from "@playwright/test";

const ARTIFACT_DIR = "/Users/seanhalls/.gemini/antigravity/brain/2c76e3d2-8a02-4369-8b0f-8fbcc6e27ecb";

async function main() {
  const browser = await chromium.launch({ headless: true });
  // iPhone 14 / standard mobile viewport
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  console.log("Navigating to https://creativesguide.us/bong-tour on mobile...");
  await page.goto("https://creativesguide.us/bong-tour", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Mobile Hero
  console.log("Capturing Bong Tour mobile hero...");
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_mobile_hero.png`,
    fullPage: false
  });

  // 2. Full page capture to inspect overflow or layout breakage
  console.log("Capturing Bong Tour mobile full page...");
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_mobile_full.png`,
    fullPage: true
  });

  // 3. Check /bong-tour/treatment on mobile
  console.log("Navigating to https://creativesguide.us/bong-tour/treatment on mobile...");
  await page.goto("https://creativesguide.us/bong-tour/treatment", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_treatment_mobile.png`,
    fullPage: true
  });

  // 4. Also check home page / on mobile just in case
  console.log("Navigating to https://creativesguide.us on mobile...");
  await page.goto("https://creativesguide.us", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/home_mobile.png`,
    fullPage: false
  });

  await browser.close();
  console.log("Mobile captures complete.");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
