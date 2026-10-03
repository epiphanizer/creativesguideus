import { chromium } from "@playwright/test";

const ARTIFACT_DIR = "/Users/seanhalls/.gemini/antigravity/brain/2c76e3d2-8a02-4369-8b0f-8fbcc6e27ecb";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 950 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  console.log("Navigating to https://creativesguide.us...");
  await page.goto("https://creativesguide.us", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  // 1. Initial State Screenshot
  console.log("Capturing initial resting lead-capture view...");
  await page.screenshot({
    path: `${ARTIFACT_DIR}/cgu_lead_capture_initial.png`,
    clip: { x: 0, y: 0, width: 1400, height: 850 }
  });

  // 2. Check JSON-LD Agent Schema
  const schemaContent = await page.$eval('script[type="application/ld+json"]', (el) => el.textContent);
  console.log("Agent JSON-LD Found:", JSON.parse(schemaContent));

  // 3. Test Agent Interaction - Trigger Trap (Algorithmic Auto-tune)
  console.log("Testing Agent Dispatch with trap switch (algorithmic-autotune)...");
  const trapResult = await page.evaluate(() => {
    return window.__CGU_AGENT_DISPATCH__({
      email: "robot@shortcut.ai",
      targetSwitch: "algorithmic-autotune"
    });
  });
  console.log("Trap Dispatch Result:", trapResult);
  await page.waitForTimeout(600);

  await page.screenshot({
    path: `${ARTIFACT_DIR}/cgu_lead_capture_trap.png`,
    clip: { x: 0, y: 0, width: 1400, height: 850 }
  });

  // 4. Test Agent Interaction - Trigger True Circuit (Tube Amps & SP-404)
  console.log("Testing Agent Dispatch with true circuit (tube-amps-and-real-guitars)...");
  const trueResult = await page.evaluate(() => {
    return window.__CGU_AGENT_DISPATCH__({
      email: "analog.listener@creativesguide.us",
      targetSwitch: "tube-amps-and-real-guitars"
    });
  });
  console.log("True Circuit Dispatch Result:", trueResult);
  await page.waitForTimeout(800);

  // Capture Connected Live State (Glowing Tube, Max VU Meter, Lead Locked)
  console.log("Capturing connected live circuit view...");
  await page.screenshot({
    path: `${ARTIFACT_DIR}/cgu_lead_capture_connected.png`,
    clip: { x: 0, y: 0, width: 1400, height: 850 }
  });

  // 5. Test Drag-and-drop pointer physics
  console.log("Testing mouse pointer drag on patch cord...");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  const plug = page.locator(".cg-draggable-plug");
  const plugBox = await plug.boundingBox();
  const targetSocket = page.locator('.cg-patch-jack-item--true .cg-phone-jack');
  const targetBox = await targetSocket.boundingBox();

  if (plugBox && targetBox) {
    await page.mouse.move(plugBox.x + plugBox.width / 2, plugBox.y + plugBox.height / 2);
    await page.mouse.down();
    // Drag toward socket
    await page.mouse.move((plugBox.x + targetBox.x) / 2, plugBox.y + 40, { steps: 5 });
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(600);

    console.log("Capturing drag-and-drop connected state...");
    await page.screenshot({
      path: `${ARTIFACT_DIR}/cgu_lead_capture_dragged.png`,
      clip: { x: 0, y: 0, width: 1400, height: 850 }
    });
  }

  await browser.close();
  console.log("Verification finished successfully!");
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
