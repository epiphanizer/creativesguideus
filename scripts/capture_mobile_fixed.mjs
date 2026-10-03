import { chromium } from "@playwright/test";

const ARTIFACT_DIR = "/Users/seanhalls/.gemini/antigravity/brain/2c76e3d2-8a02-4369-8b0f-8fbcc6e27ecb";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  // 1. Bong Tour mobile hero
  console.log("Capturing /bong-tour mobile hero...");
  await page.goto("https://creativesguide.us/bong-tour", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_mobile_fixed_hero.png`,
    fullPage: false
  });

  // 2. Bong Tour full page
  console.log("Capturing /bong-tour full page...");
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_mobile_fixed_full.png`,
    fullPage: true
  });

  // 3. Treatment page
  console.log("Capturing /bong-tour/treatment mobile...");
  await page.goto("https://creativesguide.us/bong-tour/treatment", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/bong_tour_treatment_mobile_fixed.png`,
    fullPage: false
  });

  // 4. Home page mobile
  console.log("Capturing / mobile...");
  await page.goto("https://creativesguide.us/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/home_mobile_fixed.png`,
    fullPage: false
  });

  // 5. Walls Devine mobile
  console.log("Capturing /walls-devine mobile...");
  await page.goto("https://creativesguide.us/walls-devine", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: `${ARTIFACT_DIR}/walls_devine_mobile_fixed.png`,
    fullPage: false
  });

  await browser.close();
  console.log("Screenshots saved successfully.");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
