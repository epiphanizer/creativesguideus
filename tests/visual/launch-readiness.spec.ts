import fs from "node:fs/promises";
import path from "node:path";

import { test } from "@playwright/test";

type RouteCapture = {
  id: string;
  path: string;
};

type ViewportPreset = {
  label: string;
  width: number;
  height: number;
  isMobile?: boolean;
  hasTouch?: boolean;
};

const phase = process.env.CGU_SCREENSHOT_PHASE || "before";
const artifactRoot = path.join(process.cwd(), ".artifacts", "launch-readiness-screenshots", phase);

const routes: RouteCapture[] = [
  { id: "home", path: "/" },
  { id: "bong-tour", path: "/bong-tour" },
  { id: "bong-tour-treatment", path: "/bong-tour/treatment" },
  { id: "walls-devine", path: "/walls-devine" },
  {
    id: "contact-walls-devine-mailing-list",
    path: "/contact?context=walls-devine-mailing-list&inquiryType=mailing-list&project=Walls%2FDevine",
  },
  { id: "links", path: "/links" },
];

const viewports: ViewportPreset[] = [
  { label: "390x844", width: 390, height: 844, isMobile: true, hasTouch: true },
  { label: "430x932", width: 430, height: 932, isMobile: true, hasTouch: true },
  { label: "768x1024", width: 768, height: 1024, hasTouch: true },
  { label: "1024x768", width: 1024, height: 768 },
  { label: "1440x900", width: 1440, height: 900 },
  { label: "1728x1117", width: 1728, height: 1117 },
];

async function ensureDirectory(directoryPath: string) {
  await fs.mkdir(directoryPath, { recursive: true });
}

test.describe("launch readiness screenshot capture", () => {
  test("captures the configured route and viewport matrix", async ({ browser, baseURL }) => {
    if (!baseURL) {
      throw new Error("Missing Playwright baseURL for screenshot capture.");
    }

    for (const viewport of viewports) {
      const viewportDir = path.join(artifactRoot, viewport.label);
      await ensureDirectory(viewportDir);

      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: viewport.isMobile ?? false,
        hasTouch: viewport.hasTouch ?? false,
        deviceScaleFactor: 1,
      });

      for (const route of routes) {
        const page = await context.newPage();
        const targetUrl = new URL(route.path, baseURL).toString();

        console.log(`[capture] ${viewport.label} :: ${route.id}`);

        await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
        await page.locator("main").first().waitFor({ state: "visible" });
        await page.waitForTimeout(1200);

        const baseFileName = `${route.id}`;
        await page.screenshot({
          path: path.join(viewportDir, `${baseFileName}-above-the-fold.png`),
          fullPage: false,
        });
        await page.screenshot({
          path: path.join(viewportDir, `${baseFileName}-full-page.png`),
          fullPage: true,
        });

        await page.close();
      }

      await context.close();
    }
  });
});