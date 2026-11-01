const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:5173';

const TEST_ROUTES = [
  { path: '/', name: 'Homepage' },
  { path: '/services', name: 'Services Directory' },
  { path: '/services/geosolutions-engineering-services', name: 'GeoSolutions (GES)' },
  { path: '/services/metocean-marine-solutions', name: 'Metocean (MMS)' },
  { path: '/services/integrated-construction-services', name: 'Construction (ICS)' },
  { path: '/services/industrial-solutions', name: 'Industrial (IS)' },
  { path: '/about', name: 'About PIGL' },
  { path: '/projects', name: 'Projects & Case Studies' },
  { path: '/contact', name: 'Contact & Consultations' }
];

async function measureRoute(browser, route, isMobile = false) {
  const context = await browser.newContext(
    isMobile
      ? {
          viewport: { width: 390, height: 844 },
          userAgent:
            'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
          isMobile: true,
          hasTouch: true
        }
      : {
          viewport: { width: 1440, height: 900 }
        }
  );

  const page = await context.newPage();

  // Inject performance observer before navigation
  await page.addInitScript(() => {
    window.__perfMetrics = {
      lcp: 0,
      cls: 0,
      fcp: 0,
      ttfb: 0,
      longTaskDuration: 0,
      longTaskCount: 0
    };

    // FCP
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.__perfMetrics.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        window.__perfMetrics.lcp = lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__perfMetrics.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Long Tasks (TBT proxy)
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const blockingDuration = entry.duration - 50;
          if (blockingDuration > 0) {
            window.__perfMetrics.longTaskDuration += blockingDuration;
            window.__perfMetrics.longTaskCount++;
          }
        }
      }).observe({ type: 'longtask', buffered: true });
    } catch (e) {}
  });

  let totalTransferBytes = 0;
  let requestCount = 0;

  page.on('response', (res) => {
    requestCount++;
    const headers = res.headers();
    const len = headers['content-length'];
    if (len) {
      totalTransferBytes += parseInt(len, 10);
    }
  });

  const t0 = Date.now();
  await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(1000); // Allow LCP and observers to settle

  const navTiming = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const metrics = window.__perfMetrics || {};
    if (nav) {
      metrics.ttfb = nav.responseStart - nav.requestStart;
      metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.startTime;
      metrics.load = nav.loadEventEnd - nav.startTime;
    }
    return metrics;
  });

  await context.close();

  return {
    route: route.name,
    path: route.path,
    isMobile,
    ttfb: Math.round(navTiming.ttfb || 0),
    fcp: Math.round(navTiming.fcp || 0),
    lcp: Math.round(navTiming.lcp || 0),
    cls: parseFloat((navTiming.cls || 0).toFixed(4)),
    tbt: Math.round(navTiming.longTaskDuration || 0),
    domContentLoaded: Math.round(navTiming.domContentLoaded || 0),
    load: Math.round(navTiming.load || 0),
    totalTransferKb: Math.round(totalTransferBytes / 1024),
    requestCount
  };
}

async function run() {
  console.log(`Starting Core Web Vitals & Laboratory Audit on ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  console.log('\n================ DESKTOP MEASUREMENTS ================');
  const desktopResults = [];
  for (const r of TEST_ROUTES) {
    const res = await measureRoute(browser, r, false);
    desktopResults.push(res);
    console.log(
      `✓ [Desktop] ${res.route.padEnd(25)} | LCP: ${String(res.lcp).padStart(4)}ms | FCP: ${String(res.fcp).padStart(4)}ms | CLS: ${res.cls.toFixed(3)} | TBT: ${String(res.tbt).padStart(3)}ms | Requests: ${res.requestCount}`
    );
  }

  console.log('\n================ MOBILE MEASUREMENTS =================');
  const mobileResults = [];
  for (const r of TEST_ROUTES) {
    const res = await measureRoute(browser, r, true);
    mobileResults.push(res);
    console.log(
      `✓ [Mobile]  ${res.route.padEnd(25)} | LCP: ${String(res.lcp).padStart(4)}ms | FCP: ${String(res.fcp).padStart(4)}ms | CLS: ${res.cls.toFixed(3)} | TBT: ${String(res.tbt).padStart(3)}ms | Requests: ${res.requestCount}`
    );
  }

  await browser.close();

  console.log('\n================ AUDIT SUMMARY =================');
  const avgDesktopLcp = Math.round(desktopResults.reduce((a, b) => a + b.lcp, 0) / desktopResults.length);
  const avgDesktopCls = (desktopResults.reduce((a, b) => a + b.cls, 0) / desktopResults.length).toFixed(3);
  const avgDesktopTbt = Math.round(desktopResults.reduce((a, b) => a + b.tbt, 0) / desktopResults.length);

  const avgMobileLcp = Math.round(mobileResults.reduce((a, b) => a + b.lcp, 0) / mobileResults.length);
  const avgMobileCls = (mobileResults.reduce((a, b) => a + b.cls, 0) / mobileResults.length).toFixed(3);
  const avgMobileTbt = Math.round(mobileResults.reduce((a, b) => a + b.tbt, 0) / mobileResults.length);

  console.log(`Desktop Averages -> LCP: ${avgDesktopLcp}ms | CLS: ${avgDesktopCls} | TBT: ${avgDesktopTbt}ms`);
  console.log(`Mobile Averages  -> LCP: ${avgMobileLcp}ms | CLS: ${avgMobileCls} | TBT: ${avgMobileTbt}ms`);
  console.log('================================================\n');
}

run().catch(console.error);

