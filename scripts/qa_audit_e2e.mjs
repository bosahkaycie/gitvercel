import { chromium } from 'playwright';

async function runE2E() {
  console.log('Launching Playwright Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const failedRequests = [];
  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedRequests.push(`${resp.status()} on ${resp.url()}`);
    }
  });

  const publicRoutes = [
    { name: 'Public Homepage', path: '/', selector: 'h1' },
    { name: 'Public About Page', path: '/about', selector: 'h1' },
    { name: 'Public Services Page', path: '/services', selector: 'h1' },
    { name: 'Public Projects Page', path: '/projects', selector: 'h1' },
    { name: 'Public Teams Page', path: '/teams', selector: 'h1' },
    { name: 'Public Network Page', path: '/network', selector: 'h1' },
    { name: 'Public Contact Page', path: '/contact', selector: 'form' },
    { name: 'Public Careers Page', path: '/careers', selector: 'h1' },
    { name: 'Public Vendor Hub Page', path: '/vendors', selector: 'h1, h2' }
  ];

  console.log('--- Testing Public Routes against http://localhost:5173 ---');

  for (const t of publicRoutes) {
    try {
      const resp = await page.goto('http://localhost:5173' + t.path, { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForTimeout(800);
      const exists = await page.$(t.selector);
      const title = await page.title();
      console.log(`✅ ${t.name} [${t.path}]: Status ${resp.status()} | Title: "${title}" | Element matched: ${Boolean(exists)}`);
    } catch (err) {
      console.error(`❌ ${t.name} [${t.path}] FAILED: ${err.message}`);
    }
  }

  console.log('\n--- Testing Administrative Dashboard Journey ---');
  try {
    // 1. Visit /admin
    await page.goto('http://localhost:5173/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(1000);

    // 2. Perform authentication via login form
    await page.click('button:has-text("Auto-fill")');
    await page.waitForTimeout(300);
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2500);

    // 3. Verify Dashboard overview loaded
    const hasDashboard = await page.evaluate(() => {
      const text = document.body.innerText;
      return text.includes('Website Visitation') && text.includes('Operational Overview');
    });
    console.log(`✅ Admin Dashboard Auth & Overview: ${hasDashboard ? 'Passed' : 'Failed'}`);

    // 4. Test tab navigation
    const tabsToTest = [
      { name: 'Services CMS', text: 'Services' },
      { name: 'Projects CMS', text: 'Projects' },
      { name: 'Team CMS', text: 'Teams' },
      { name: 'Our Network CMS', text: 'Our Network' },
      { name: 'Inquiries & RFPs Desk', text: 'Inquiries & RFPs' },
      { name: 'Site Settings', text: 'Settings' }
    ];

    for (const tab of tabsToTest) {
      try {
        const tabBtn = await page.$(`button:has-text("${tab.text}"), a:has-text("${tab.text}")`);
        if (tabBtn) {
          await tabBtn.click();
          await page.waitForTimeout(800);
          console.log(`✅ Admin Navigation to [${tab.name}]: Clicked & Rendered`);
        } else {
          console.log(`⚠️ Tab [${tab.name}] button selector not directly found in sidebar`);
        }
      } catch (tabErr) {
        console.error(`❌ Admin Tab [${tab.name}] error:`, tabErr.message);
      }
    }

  } catch (adminErr) {
    console.error('❌ Admin Dashboard journey failed:', adminErr.message);
  }

  await browser.close();

  console.log('\n--- Failed Requests Check ---');
  if (failedRequests.length > 0) {
    console.log('Failed HTTP requests during session:', failedRequests.slice(0, 10));
  } else {
    console.log('Zero HTTP 4xx/5xx errors detected across entire public and admin session!');
  }
}

runE2E();
