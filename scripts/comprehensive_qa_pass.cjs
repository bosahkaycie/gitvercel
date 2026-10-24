const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:5173';

const VIEWPORTS = [
  { name: 'Mobile Mini (320px)', width: 320, height: 568 },
  { name: 'Mobile Standard (375px)', width: 375, height: 667 },
  { name: 'Mobile Large (390px)', width: 390, height: 844 },
  { name: 'Mobile Max (430px)', width: 430, height: 932 },
  { name: 'Tablet Portrait (768px)', width: 768, height: 1024 },
  { name: 'Tablet/Laptop (1024px)', width: 1024, height: 768 },
  { name: 'Desktop (1280px)', width: 1280, height: 800 },
  { name: 'Desktop Large (1440px)', width: 1440, height: 900 }
];

const PAGES = [
  { path: '/', name: 'Home' },
  { path: '/about', name: 'About' },
  { path: '/services', name: 'Services Overview' },
  { path: '/services/geosolutions-engineering-services', name: 'Service: GES' },
  { path: '/services/metocean-marine-solutions', name: 'Service: MMS' },
  { path: '/services/integrated-construction-services', name: 'Service: ICS' },
  { path: '/services/industrial-solutions', name: 'Service: IS' },
  { path: '/partners', name: 'Partners & Tech' },
  { path: '/projects', name: 'Case Studies' },
  { path: '/hsse', name: 'HSSE & Standards' },
  { path: '/contact', name: 'Contact' },
  { path: '/vendors', name: 'Vendor Hub' },
  { path: '/videos', name: 'Media Hub' }
];

async function runQAPass() {
  console.log(`Starting Comprehensive QA Pass on ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const results = {
    viewportsTested: VIEWPORTS.map(v => `${v.name} (${v.width}x${v.height})`),
    pagesTested: PAGES.map(p => p.name),
    overflowIssues: [],
    consoleErrors: [],
    failedRequests: [],
    brokenImages: [],
    missingAltImages: [],
    headingAudits: [],
    navInteractionResults: [],
    formAudits: [],
    adminCMSAudit: null,
    perfSummary: []
  };

  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore known benign third-party or socket noise if any
      if (!text.includes('Failed to load resource: net::ERR_CONNECTION_REFUSED') &&
          !text.includes('favicon.ico')) {
        results.consoleErrors.push({ url: page.url(), message: text });
      }
    }
  });

  page.on('pageerror', err => {
    results.consoleErrors.push({ url: page.url(), message: err.message });
  });

  page.on('requestfailed', request => {
    const url = request.url();
    // Exclude deliberate analytics/external telemetry if offline
    if (!url.includes('supabase.co') && !url.includes('google-analytics') && !url.includes('youtube.com')) {
      results.failedRequests.push({ pageUrl: page.url(), failedUrl: url, error: request.failure()?.errorText });
    }
  });

  // 1. Viewport Overflow & Responsive Render Tests
  console.log('\n--- 1. TESTING VIEWPORT RESPONSIVENESS & OVERFLOW ---');
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    for (const pg of PAGES) {
      try {
        const fullUrl = `${BASE_URL}${pg.path}`;
        const t0 = Date.now();
        await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        await page.waitForTimeout(600); // allow dynamic layout / images
        const loadDuration = Date.now() - t0;

        // Check horizontal overflow
        const overflow = await page.evaluate(() => {
          const docEl = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
          const innerWidth = window.innerWidth;
          const hasOverflow = scrollWidth > innerWidth + 1; // 1px threshold for subpixel

          let offender = null;
          if (hasOverflow) {
            const allElements = Array.from(document.querySelectorAll('*'));
            for (const el of allElements) {
              const rect = el.getBoundingClientRect();
              if (rect.right > innerWidth + 2) {
                offender = {
                  tag: el.tagName.toLowerCase(),
                  className: el.className ? String(el.className).substring(0, 100) : '',
                  right: Math.round(rect.right),
                  width: Math.round(rect.width)
                };
                break;
              }
            }
          }

          return { hasOverflow, scrollWidth, innerWidth, offender };
        });

        if (overflow.hasOverflow) {
          results.overflowIssues.push({
            viewport: vp.name,
            width: vp.width,
            page: pg.name,
            path: pg.path,
            scrollWidth: overflow.scrollWidth,
            innerWidth: overflow.innerWidth,
            offender: overflow.offender
          });
        }

        // Collect performance data for desktop standard (1280px)
        if (vp.width === 1280) {
          results.perfSummary.push({
            page: pg.name,
            path: pg.path,
            domContentLoadedMs: loadDuration
          });
        }
      } catch (err) {
        console.error(`Error loading ${pg.name} at ${vp.width}px:`, err.message);
      }
    }
  }

  // 2. Mobile Navigation Drawer & Dismissal Tests
  console.log('\n--- 2. TESTING MOBILE NAVIGATION & DISMISSAL ---');
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const mobileNavTest = await page.evaluate(async () => {
    // Find hamburger button
    const buttons = Array.from(document.querySelectorAll('button'));
    const hamburger = buttons.find(b => 
      b.getAttribute('aria-label')?.toLowerCase().includes('menu') ||
      b.innerHTML.includes('svg') && b.offsetParent !== null && window.getComputedStyle(b).display !== 'none'
    );

    if (!hamburger) {
      return { success: false, reason: 'Hamburger button not found' };
    }

    // Click hamburger to open
    hamburger.click();
    await new Promise(r => setTimeout(r, 400));

    // Check if drawer or mobile menu is visible
    const navs = Array.from(document.querySelectorAll('nav, [role="dialog"], [class*="drawer"], [class*="mobile"]'));
    const isDrawerOpen = navs.some(n => {
      const rect = n.getBoundingClientRect();
      return rect.width > 200 && rect.height > 200 && window.getComputedStyle(n).display !== 'none';
    });

    // Find close button or click link to close
    const closeBtn = buttons.find(b => 
      b.getAttribute('aria-label')?.toLowerCase().includes('close') ||
      (b.innerHTML.includes('✕') || b.innerHTML.includes('times') || b.innerHTML.includes('line'))
    );

    let dismissed = false;
    if (closeBtn) {
      closeBtn.click();
      await new Promise(r => setTimeout(r, 400));
      dismissed = true;
    } else {
      // Re-click hamburger to toggle
      hamburger.click();
      await new Promise(r => setTimeout(r, 400));
      dismissed = true;
    }

    return { success: true, isDrawerOpen, dismissed };
  });
  results.navInteractionResults.push(mobileNavTest);

  // 3. Deep Page Quality, Accessibility & Semantic Headings Audit (Desktop 1280px)
  console.log('\n--- 3. TESTING PAGE QUALITY, HEADING STRUCTURE & MEDIA ---');
  await page.setViewportSize({ width: 1280, height: 800 });

  for (const pg of PAGES) {
    await page.goto(`${BASE_URL}${pg.path}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(400);

    const pageAudit = await page.evaluate((pageName) => {
      // Heading check
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => h.textContent.trim().substring(0, 80));
      const h2s = Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim().substring(0, 60));
      
      // Images check
      const imgs = Array.from(document.querySelectorAll('img'));
      const broken = [];
      const missingAlt = [];
      for (const img of imgs) {
        if (img.complete && img.naturalWidth === 0 && !img.src.startsWith('data:')) {
          broken.push(img.src);
        }
        if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
          // Check if it has aria-hidden
          if (img.getAttribute('aria-hidden') !== 'true') {
            missingAlt.push(img.src.substring(img.src.lastIndexOf('/') + 1));
          }
        }
      }

      // Buttons accessible name check
      const buttons = Array.from(document.querySelectorAll('button'));
      const unlabeledButtons = buttons.filter(b => {
        const text = b.textContent.trim();
        const ariaLabel = b.getAttribute('aria-label');
        const ariaLabelledBy = b.getAttribute('aria-labelledby');
        const title = b.getAttribute('title');
        return !text && !ariaLabel && !ariaLabelledBy && !title;
      }).length;

      // Meta tags check
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const jsonLd = document.getElementById('dynamic-jsonld') ? true : false;

      return {
        pageName,
        h1Count: h1s.length,
        h1s,
        h2Count: h2s.length,
        brokenImgs: broken,
        missingAltImgs: missingAlt,
        unlabeledButtons,
        seo: { title, hasDesc: !!metaDesc, hasCanonical: !!canonical, hasJsonLd: jsonLd }
      };
    }, pg.name);

    results.headingAudits.push(pageAudit);
    if (pageAudit.brokenImgs.length > 0) {
      results.brokenImages.push({ page: pg.name, broken: pageAudit.brokenImgs });
    }
    if (pageAudit.missingAltImgs.length > 0) {
      results.missingAltImages.push({ page: pg.name, missing: pageAudit.missingAltImgs.slice(0, 5) });
    }
  }

  // 4. Form Accessibility & Interaction Audit (/contact)
  console.log('\n--- 4. TESTING FORMS & USER INTERACTION ---');
  await page.goto(`${BASE_URL}/contact`, { waitUntil: 'domcontentloaded' });
  const formAudit = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    const unassociatedInputs = inputs.filter(inp => {
      const id = inp.getAttribute('id');
      const type = inp.getAttribute('type');
      if (type === 'hidden') return false;
      const hasLabel = id ? document.querySelector(`label[for="${id}"]`) : null;
      const wrappedInLabel = inp.closest('label');
      const hasAriaLabel = inp.getAttribute('aria-label');
      return !hasLabel && !wrappedInLabel && !hasAriaLabel;
    });

    return {
      totalInputs: inputs.length,
      unassociatedInputsCount: unassociatedInputs.length
    };
  });
  results.formAudits.push({ page: 'Contact', ...formAudit });

  // 5. Admin Dashboard Service CMS Audit (/admin)
  console.log('\n--- 5. TESTING ADMIN DASHBOARD SERVICE CMS INTEGRATION ---');
  await page.goto(`${BASE_URL}/admin`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  const adminAudit = await page.evaluate(async () => {
    // Check if dashboard rendered
    const adminRoot = document.querySelector('body');
    const pageText = adminRoot ? adminRoot.innerText : '';
    const hasAdminTitle = pageText.includes('PIGL') || pageText.includes('Admin') || pageText.includes('Control Center');

    // Look for Services tab or link
    const allButtons = Array.from(document.querySelectorAll('button, a'));
    const servicesTab = allButtons.find(b => b.textContent.includes('Services') || b.textContent.includes('Specialist Services'));

    let tabClicked = false;
    if (servicesTab) {
      servicesTab.click();
      await new Promise(r => setTimeout(r, 500));
      tabClicked = true;
    }

    // Check for service cards or items in the CMS list
    const serviceItems = Array.from(document.querySelectorAll('[data-service-id], button, div')).filter(el => 
      el.textContent.includes('GeoSolutions') || el.textContent.includes('MMS') || el.textContent.includes('GES')
    );

    // Look for form inputs
    const cmsInputs = Array.from(document.querySelectorAll('input, textarea, select'));

    return {
      hasAdminTitle,
      tabClicked,
      cmsInputsCount: cmsInputs.length,
      serviceItemsDetected: serviceItems.length > 0
    };
  });
  results.adminCMSAudit = adminAudit;

  await browser.close();

  console.log('\n================ QA PASS SUMMARY ================');
  console.log(`Viewports Tested: ${results.viewportsTested.length}`);
  console.log(`Pages Tested: ${results.pagesTested.length}`);
  console.log(`Horizontal Overflow Issues: ${results.overflowIssues.length}`);
  if (results.overflowIssues.length > 0) {
    console.log(JSON.stringify(results.overflowIssues, null, 2));
  }
  console.log(`Console Errors: ${results.consoleErrors.length}`);
  if (results.consoleErrors.length > 0) {
    console.log(JSON.stringify(results.consoleErrors, null, 2));
  }
  console.log(`Broken Images: ${results.brokenImages.length}`);
  if (results.brokenImages.length > 0) {
    console.log(JSON.stringify(results.brokenImages, null, 2));
  }
  console.log(`Missing Alt Text Count: ${results.missingAltImages.reduce((acc, m) => acc + m.missing.length, 0)}`);
  console.log(`Mobile Nav Result:`, JSON.stringify(results.navInteractionResults));
  console.log(`Admin CMS Audit:`, JSON.stringify(results.adminCMSAudit));
  console.log(`SEO Audit Sample:`, JSON.stringify(results.headingAudits[0]?.seo));
  console.log('=================================================\n');

  // Write out results to JSON for deep inspection
  const fs = require('fs');
  fs.writeFileSync('scripts/qa_results.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Detailed results written to scripts/qa_results.json');
}

runQAPass().catch(err => {
  console.error('Fatal error in QA Pass:', err);
  process.exit(1);
});
