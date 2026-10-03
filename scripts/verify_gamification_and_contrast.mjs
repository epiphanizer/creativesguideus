import { chromium } from "@playwright/test";
import path from "path";

const ARTIFACT_DIR = "/Users/seanhalls/.gemini/antigravity/brain/2c76e3d2-8a02-4369-8b0f-8fbcc6e27ecb";

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Desktop Experience & Modals
  const desktopCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await desktopCtx.newPage();

  console.log("Navigating to https://creativesguide.us/bong-tour...");
  await page.goto("https://creativesguide.us/bong-tour", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // Take Desktop Hero & Grimoire Screenshot
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_gamified_hero_cards.png"),
    fullPage: false
  });
  console.log("Saved bong_tour_gamified_hero_cards.png");

  // Open Card Inspector for Vishal or Willie
  console.log("Clicking card inspector...");
  const firstCard = page.locator(".bt-mtg-card").first();
  await firstCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await firstCard.click();
  await page.waitForSelector(".bt-inspector-sheet", { state: "visible" });
  await page.waitForTimeout(500);

  // Screenshot Inspector with abilities
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_card_inspector_abilities.png")
  });
  console.log("Saved bong_tour_card_inspector_abilities.png");

  // Cast Signature Spell
  const castBtn = page.locator(".bt-cast-spell-btn").first();
  if (await castBtn.isVisible()) {
    console.log("Casting signature spell...");
    await castBtn.click();
    await page.waitForSelector(".bt-ability-cast-result", { state: "visible" });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, "bong_tour_spell_cast_result.png")
    });
    console.log("Saved bong_tour_spell_cast_result.png");
  }

  // Close inspector
  await page.click(".bt-modal-close-btn");
  await page.waitForTimeout(400);

  // Scroll to Skill Checks and Roll
  console.log("Rolling skill check...");
  const rollBtn = page.locator(".bt-roll-btn");
  await rollBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await rollBtn.click();
  await page.waitForTimeout(2000); // Wait for roll animation & sound
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_skillcheck_rolled.png")
  });
  console.log("Saved bong_tour_skillcheck_rolled.png");

  // Open Spellbook Modal via HUD
  console.log("Opening spellbook via HUD...");
  await page.click(".bt-pouch-hud__spellbook-btn");
  await page.waitForSelector(".bt-spellbook-sheet", { state: "visible" });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_spellbook_binder.png")
  });
  console.log("Saved bong_tour_spellbook_binder.png");

  // Click Deeds & Trophies Tab
  console.log("Switching to Deeds & Trophies tab...");
  const trophiesTab = page.locator(".bt-modal-tab-btn").nth(1);
  await trophiesTab.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_deeds_trophies.png")
  });
  console.log("Saved bong_tour_deeds_trophies.png");

  // Check Contrast Ratios programmatically
  const contrastAudit = await page.evaluate(() => {
    function getLuminance(rgbStr) {
      const match = rgbStr.match(/\d+/g);
      if (!match) return 0;
      const [r, g, b] = match.map(v => {
        let c = parseInt(v, 10) / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function getContrast(lum1, lum2) {
      const l1 = Math.max(lum1, lum2);
      const l2 = Math.min(lum1, lum2);
      return (l1 + 0.05) / (l2 + 0.05);
    }

    const testSelectors = [
      { name: "Parchment Body Text", sel: ".bt-reader-section p, .bt-synopsis-story p" },
      { name: "Card Ability Text", sel: ".bt-mtg-card__ability" },
      { name: "Card Flavor Text", sel: ".bt-mtg-card__flavor" },
      { name: "Card Footer Text", sel: ".bt-mtg-card__footer" },
      { name: "D&D Stat DT", sel: ".bt-dnd-stats dt" },
      { name: "Achievement Description", sel: ".bt-achievement-body p" }
    ];

    const results = [];
    for (const item of testSelectors) {
      const el = document.querySelector(item.sel);
      if (el) {
        const cs = window.getComputedStyle(el);
        const color = cs.color;
        const lum = getLuminance(color);
        // Compare to dark background #0e0d0c (lum ~ 0.007) and card bg #1a1816 (lum ~ 0.015)
        const darkContrast = getContrast(lum, 0.007);
        const cardContrast = getContrast(lum, 0.015);
        results.push({
          target: item.name,
          color,
          contrastAgainstDark: darkContrast.toFixed(2) + ":1",
          contrastAgainstCard: cardContrast.toFixed(2) + ":1",
          passesWCAG_AA: darkContrast >= 4.5 && cardContrast >= 4.5
        });
      }
    }
    return results;
  });

  console.log("\n=== CONTRAST AUDIT RESULTS ===");
  console.table(contrastAudit);

  // 2. Mobile Viewport Screenshot (iPhone 14 / 390x844)
  const mobileCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileCtx.newPage();
  await mobilePage.goto("https://creativesguide.us/bong-tour", { waitUntil: "networkidle" });
  await mobilePage.waitForTimeout(1000);

  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, "bong_tour_mobile_gamified.png"),
    fullPage: false
  });
  console.log("Saved bong_tour_mobile_gamified.png");

  await browser.close();
  console.log("Verification finished successfully!");
}

main().catch(err => {
  console.error("Verification failed:", err);
  process.exit(1);
});
