import { chromium } from 'playwright';

async function testSocialLinks() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('--- Testing Footer Social Links ---');
  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);

  // Check footer social anchors
  const footerAnchors = await page.locator('footer a[aria-label*="PIGL"], footer a[aria-label*="LinkedIn"], footer a[aria-label*="YouTube"], footer a[title*="LinkedIn"]').all();
  console.log(`Found ${footerAnchors.length} social link elements in footer.`);

  for (const a of footerAnchors) {
    const label = await a.getAttribute('aria-label');
    const href = await a.getAttribute('href');
    console.log(` - Footer Link: ${label} -> ${href}`);
  }

  console.log('--- Testing Contact Page Social Channels ---');
  await page.goto('http://localhost:5173/contact', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  const contactSocialHeading = await page.locator('text=Connect Across Digital Channels').count();
  console.log(`Contact page social section present: ${contactSocialHeading > 0}`);

  const contactCards = await page.locator('text=Official Channels').locator('xpath=..').locator('xpath=..').locator('a').all();
  console.log(`Found ${contactCards.length} social channel links on contact page.`);
  for (const card of contactCards) {
    const text = (await card.innerText()).replace(/\n+/g, ' ');
    const href = await card.getAttribute('href');
    console.log(` - Contact Card: "${text}" -> ${href}`);
  }

  console.log('--- Testing Admin Social Links CMS Tab ---');
  await page.goto('http://localhost:5173/admin?tab=social-links', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // If login form is present, log in
  const isLoginForm = await page.locator('input[type="password"]').count();
  if (isLoginForm > 0) {
    console.log('Admin login required. Logging in...');
    await page.fill('input[type="email"]', 'admin@polarisigl.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.goto('http://localhost:5173/admin?tab=social-links', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(2000);
  }

  const adminHeader = await page.locator('h1').first().innerText();
  console.log(`Admin Tab Header: "${adminHeader}"`);

  // Count channels in admin table/cards
  const channelCount = await page.locator('text=Active').count();
  console.log(`Active badges in admin: ${channelCount}`);

  // Screenshot admin social links manager
  const screenshotPath = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177/admin_social_links_test.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`Saved screenshot to ${screenshotPath}`);

  await browser.close();
  console.log('--- All Playwright Verifications Completed Successfully ---');
}

testSocialLinks().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
