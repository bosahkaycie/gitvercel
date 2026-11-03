const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177';

async function capture() {
  const browser = await chromium.launch({ headless: true });

  for (const theme of ['light', 'dark']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
    const page = await context.newPage();

    // Pre-seed localStorage with admin auth and theme
    await page.addInitScript(({ theme }) => {
      localStorage.setItem('pigl_admin_auth_user', JSON.stringify({
        id: 'admin-lead-1',
        email: 'admin@polarisigl.com',
        role: 'super_admin',
        full_name: 'Lead Administrator',
        status: 'active'
      }));
      localStorage.setItem('pigl_admin_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, { theme });

    await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('nav');
    await page.waitForTimeout(600);

    // 1. Dashboard
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, `matrix_dashboard_${theme}.png`),
      fullPage: false
    });
    console.log(`Captured matrix_dashboard_${theme}.png`);

    // 2. Navigation & Pages
    const navBtn = page.locator('button:has-text("Navigation & Pages")').first();
    if (await navBtn.isVisible()) {
      await navBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `matrix_navigation_${theme}.png`),
        fullPage: false
      });
      console.log(`Captured matrix_navigation_${theme}.png`);
    }

    // 3. Services & Capabilities
    const srvBtn = page.locator('button:has-text("Services & Capabilities")').first();
    if (await srvBtn.isVisible()) {
      await srvBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `matrix_services_${theme}.png`),
        fullPage: false
      });
      console.log(`Captured matrix_services_${theme}.png`);
    }

    // 4. Inquiries & RFPs Desk
    const inqBtn = page.locator('button:has-text("Inquiries & RFPs")').first();
    if (await inqBtn.isVisible()) {
      await inqBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `matrix_inquiries_${theme}.png`),
        fullPage: false
      });
      console.log(`Captured matrix_inquiries_${theme}.png`);
    }

    // 5. System Settings
    const setBtn = page.locator('button:has-text("System Settings")').first();
    if (await setBtn.isVisible()) {
      await setBtn.click();
      await page.waitForTimeout(600);
      await page.screenshot({
        path: path.join(ARTIFACT_DIR, `matrix_settings_${theme}.png`),
        fullPage: false
      });
      console.log(`Captured matrix_settings_${theme}.png`);
    }

    await context.close();
  }

  await browser.close();
  console.log('All screen captures complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
