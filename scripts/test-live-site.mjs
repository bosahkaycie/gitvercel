import { chromium } from 'playwright';

async function testLiveSite() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('Testing live footer at https://polarisigl.com/ ...');
  await page.goto('https://polarisigl.com/', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  // Check footer
  const footerLinks = await page.locator('footer a[aria-label*="PIGL"], footer a[title*="LinkedIn"]').all();
  console.log(`Live Footer Social Links Count: ${footerLinks.length}`);
  for (const a of footerLinks) {
    const label = await a.getAttribute('aria-label');
    const href = await a.getAttribute('href');
    console.log(` - ${label} -> ${href}`);
  }

  console.log('Testing live contact page at https://polarisigl.com/contact ...');
  await page.goto('https://polarisigl.com/contact', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await page.waitForTimeout(3000);

  const contactSection = await page.locator('text=Connect Across Digital Channels').count();
  console.log(`Live Contact Social Section present: ${contactSection > 0}`);

  await browser.close();
  console.log('Live verification complete!');
}

testLiveSite().catch(console.error);
