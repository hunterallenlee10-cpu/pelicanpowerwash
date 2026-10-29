/**
 * QA screenshots for the scroll-story homepage.
 *
 *   pnpm build && pnpm start -p 3100   (in another terminal)
 *   node qa/shoot.mjs [baseUrl]
 *
 * Writes JPEGs to qa/screenshots/ and prints console errors per viewport.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

// The sandbox ships Playwright globally; plain require() finds it via NODE_PATH.
const { chromium } = createRequire(import.meta.url)("playwright");

const BASE = process.argv[2] || "http://localhost:3100";
const OUT = new URL("./screenshots/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const viewports = [
  { name: "390", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "768", width: 768, height: 1024, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  { name: "1440", width: 1440, height: 900, deviceScaleFactor: 1 },
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const errors = {};

async function scrollStory(page, p, id = "top") {
  await page.evaluate(([p, id]) => {
    const track = document.querySelector(`#${id} .story-track`);
    const stage = document.querySelector(`#${id} .story-stage`);
    const top = track.getBoundingClientRect().top + window.scrollY;
    const total = track.offsetHeight - stage.clientHeight;
    window.scrollTo({ top: top + total * p, behavior: "instant" });
  }, [p, id]);
  await wait(1100);
}

async function click(locator) {
  await locator.evaluate((el) => el.scrollIntoView({ block: "center", behavior: "instant" }));
  await wait(150);
  await locator.click();
}

async function toSection(page, id) {
  await page.evaluate((id) => {
    const el = document.getElementById(id);
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: "instant" });
  }, id);
  await wait(700);
}

async function run(vp, { reduced = false } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: vp.deviceScaleFactor,
    isMobile: vp.isMobile,
    hasTouch: vp.hasTouch,
    reducedMotion: reduced ? "reduce" : "no-preference",
  });
  const page = await ctx.newPage();
  const tag = `${vp.name}${reduced ? "-reduced" : ""}`;
  errors[tag] = [];
  page.on("console", (m) => m.type() === "error" && errors[tag].push(m.text()));
  page.on("pageerror", (e) => errors[tag].push(String(e)));
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  // The site's smooth scrolling makes Playwright's own scroll-into-view
  // animate, so targets are still moving when it clicks. Test-only override.
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });

  if (reduced) {
    await page.screenshot({ quality: 72, path: `${OUT}${tag}-hero-stacked.jpg`, fullPage: false });
    await toSection(page, "top");
    const story = page.locator("#top");
    await story.screenshot({ quality: 72, path: `${OUT}${tag}-story-cards.jpg` });
  } else {
    for (const p of [0, 0.3, 0.55, 0.8, 1]) {
      await scrollStory(page, p);
      await page.screenshot({ quality: 72, path: `${OUT}${tag}-hero-${Math.round(p * 100)}.jpg` });
    }
    for (const p of [0.1, 0.35, 0.55, 0.75, 0.97]) {
      await scrollStory(page, p, "house-and-roof");
      await page.screenshot({ quality: 72, path: `${OUT}${tag}-house-${Math.round(p * 100)}.jpg` });
    }
  }

  // Instant price with three picks.
  await toSection(page, "instant-price");
  const group = page.locator("#instant-price [role=group]");
  for (const name of ["Driveway", "Front walkway", "Roof soft wash"]) {
    await click(group.getByRole("button", { name, exact: true }));
  }
  await click(page.getByRole("button", { name: "Military" }));
  await toSection(page, "instant-price");
  await wait(900);
  await page.locator("#instant-price").screenshot({ quality: 72, path: `${OUT}${tag}-instant-price.jpg` });

  // Gauge: roof, then concrete.
  await toSection(page, "methods");
  for (const [name, file] of [
    ["Roof", "gauge-roof"],
    ["Driveway", "gauge-concrete"],
  ]) {
    await click(page.locator("#methods").getByRole("radio", { name, exact: true }));
    await wait(900);
    await page.locator("#methods").screenshot({ quality: 72, path: `${OUT}${tag}-${file}.jpg` });
  }

  // Game: arm (touch), drag, then auto-wash to finish.
  await toSection(page, "try-the-wand");
  await page.waitForSelector("#try-the-wand canvas", { timeout: 10000 });
  await wait(500);
  const start = page.getByRole("button", { name: "Tap to start washing" });
  if (await start.isVisible().catch(() => false)) await click(start);
  const canvas = page.locator("#try-the-wand canvas").first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + 20, box.y + box.height * 0.3);
    await page.mouse.down();
    for (let i = 0; i <= 24; i++) {
      await page.mouse.move(box.x + 20 + (box.width - 40) * (i / 24), box.y + box.height * (0.3 + 0.2 * Math.sin(i / 3)));
    }
    await page.mouse.up();
  }
  await wait(600);
  await page.locator("#try-the-wand").screenshot({ quality: 72, path: `${OUT}${tag}-game-midplay.jpg` });
  const demo = page.getByRole("button", { name: /Watch a pro/ });
  if (await demo.isVisible().catch(() => false)) {
    await click(demo);
    await page.waitForFunction(() => /9[5-9]|100/.test(document.querySelector("#try-the-wand")?.textContent || ""), null, { timeout: 30000 }).catch(() => {});
    await wait(2500);
    await page.locator("#try-the-wand").screenshot({ quality: 72, path: `${OUT}${tag}-game-finished.jpg` });
  }

  // Before/after gallery.
  await toSection(page, "work");
  await page.locator("#work").screenshot({ quality: 72, path: `${OUT}${tag}-before-after.jpg` });

  await toSection(page, "how-we-work");
  await page.locator("#how-we-work").screenshot({ quality: 72, path: `${OUT}${tag}-how-we-work.jpg` });

  // Quote bar near the pricing section.
  await toSection(page, "pricing");
  await page.screenshot({ quality: 72, path: `${OUT}${tag}-quote-bar.jpg` });

  await browser.close();
}

for (const vp of viewports) await run(vp);
await run(viewports[0], { reduced: true });
await run(viewports[2], { reduced: true });

for (const [tag, list] of Object.entries(errors)) {
  console.log(`${tag}: ${list.length} console errors`);
  for (const e of list) console.log("   ", e);
}
