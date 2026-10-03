import { chromium } from "@playwright/test";

const routes = [
  "/bong-tour",
  "/bong-tour/treatment",
  "/walls-devine",
  "/"
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  for (const route of routes) {
    const url = `https://creativesguide.us${route}`;
    console.log(`\nNavigating to ${url}...`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2000);

    const overflowElements = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const overflowing = [];

      const allElements = document.querySelectorAll('*');
      for (const el of allElements) {
        const rect = el.getBoundingClientRect();
        if (rect.right > docWidth + 1) {
          overflowing.push({
            tag: el.tagName,
            id: el.id,
            className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 50) : '') : '',
            rectRight: rect.right,
            rectWidth: rect.width,
            docWidth: docWidth,
            overflow: Math.round(rect.right - docWidth)
          });
        }
      }
      return overflowing;
    });

    const docInfo = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      docScrollWidth: document.documentElement.scrollWidth,
      docClientWidth: document.documentElement.clientWidth
    }));

    console.log(`Route ${route}: Found ${overflowElements.length} overflowing elements.`);
    if (overflowElements.length > 0) {
      overflowElements.sort((a, b) => b.overflow - a.overflow);
      console.log("Top overflowing elements:", overflowElements.slice(0, 5));
    }
    console.log("Doc dimensions:", docInfo);
  }

  await browser.close();
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
