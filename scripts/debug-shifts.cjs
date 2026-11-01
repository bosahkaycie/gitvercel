const { chromium } = require('playwright');

async function debugDesktopShift() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.addInitScript(() => {
    window.__shifts = [];
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          const sources = (entry.sources || []).map(s => ({
            node: s.node ? s.node.nodeName + '.' + (s.node.className || '') : 'unknown',
            previousRect: s.previousRect,
            currentRect: s.currentRect
          }));
          window.__shifts.push({ value: entry.value, sources });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  const shifts = await page.evaluate(() => window.__shifts);
  console.log('Desktop Layout Shifts for /:');
  console.dir(shifts, { depth: 5 });

  await browser.close();
}

debugDesktopShift();

