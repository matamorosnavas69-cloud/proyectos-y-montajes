const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUT_DIR = path.resolve(__dirname, '../qa-previews');
const BRAIN_DIR = '/home/sebastiangarcia/.gemini/antigravity-ide/brain/b72628d8-7784-4d06-8f3e-4a129e5bad8e';

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
if (!fs.existsSync(BRAIN_DIR)) fs.mkdirSync(BRAIN_DIR, { recursive: true });

function convertToWebp(pngPath, webpPath, brainWebpPath) {
  execSync(`python3 -c "from PIL import Image; Image.open('${pngPath}').save('${webpPath}', 'WEBP', quality=90)"`);
  fs.copyFileSync(webpPath, brainWebpPath);
}

async function run() {
  const browser = await chromium.launch();

  // 1. Mobile Drawer OPEN (at 390px)
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });

    // Click hamburger button to open drawer
    const hamburger = page.locator('button[aria-label="Abrir menú de navegación"]');
    await hamburger.click();
    await page.waitForTimeout(400); // Wait for transition

    const png = path.join(OUT_DIR, 'qa-drawer-open-390px.png');
    const webp = path.join(OUT_DIR, 'qa-drawer-open-390px.webp');
    const brainWebp = path.join(BRAIN_DIR, 'qa-drawer-open-390px.webp');

    await page.screenshot({ path: png });
    convertToWebp(png, webp, brainWebp);
    console.log(`Captured: ${webp}`);
    await context.close();
  }

  // 2. Breakpoint Header Verification (320px, 360px, 390px, 430px, 640px, 768px, 1024px, 1440px)
  const bpList = [
    { name: '320px', width: 320, height: 600 },
    { name: '360px', width: 360, height: 640 },
    { name: '390px', width: 390, height: 844 },
    { name: '430px', width: 430, height: 932 },
    { name: '640px', width: 640, height: 800 },
    { name: '768px', width: 768, height: 1024 },
    { name: '1024px', width: 1024, height: 768 },
    { name: '1440px', width: 1440, height: 900 },
  ];

  for (const bp of bpList) {
    const context = await browser.newContext({
      viewport: { width: bp.width, height: bp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });

    const header = page.locator('header');
    const png = path.join(OUT_DIR, `qa-header-${bp.name}.png`);
    const webp = path.join(OUT_DIR, `qa-header-${bp.name}.webp`);
    const brainWebp = path.join(BRAIN_DIR, `qa-header-${bp.name}.webp`);

    await header.screenshot({ path: png });
    convertToWebp(png, webp, brainWebp);
    console.log(`Captured header ${bp.name}: ${webp}`);
    await context.close();
  }

  // 3. Homepage Hero Transformation (1440px desktop & 390px mobile)
  for (const mode of [{ name: 'desktop', w: 1440, h: 900 }, { name: 'mobile', w: 390, h: 844 }]) {
    const context = await browser.newContext({
      viewport: { width: mode.w, height: mode.h },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });

    const hero = page.locator('section').first();
    const png = path.join(OUT_DIR, `qa-hero-${mode.name}.png`);
    const webp = path.join(OUT_DIR, `qa-hero-${mode.name}.webp`);
    const brainWebp = path.join(BRAIN_DIR, `qa-hero-${mode.name}.webp`);

    await hero.screenshot({ path: png });
    convertToWebp(png, webp, brainWebp);
    console.log(`Captured hero ${mode.name}: ${webp}`);
    await context.close();
  }

  // 4. Footer Verification (1440px desktop & 390px mobile)
  for (const mode of [{ name: 'desktop', w: 1440, h: 900 }, { name: 'mobile', w: 390, h: 844 }]) {
    const context = await browser.newContext({
      viewport: { width: mode.w, height: mode.h },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:3005/', { waitUntil: 'networkidle' });

    // Hide header during footer capture
    await page.evaluate(() => {
      const h = document.querySelector('header');
      if (h) h.style.display = 'none';
    });

    const footer = page.locator('footer');
    const png = path.join(OUT_DIR, `qa-footer-${mode.name}.png`);
    const webp = path.join(OUT_DIR, `qa-footer-${mode.name}.webp`);
    const brainWebp = path.join(BRAIN_DIR, `qa-footer-${mode.name}.webp`);

    await footer.screenshot({ path: png });
    convertToWebp(png, webp, brainWebp);
    console.log(`Captured footer ${mode.name}: ${webp}`);
    await context.close();
  }

  await browser.close();
  console.log('All Phase 2A QA visuals captured successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
