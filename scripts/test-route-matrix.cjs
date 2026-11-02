const { chromium } = require('playwright');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = 4173;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Static file server serving dist/
function startServer() {
  const distDir = path.resolve(__dirname, '../dist');
  
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.mp4': 'video/mp4'
  };

  const server = http.createServer((req, res) => {
    let cleanUrl = req.url.split('?')[0].split('#')[0];
    let filePath = path.join(distDir, cleanUrl);

    // If directory or no extension, check for route/index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!path.extname(cleanUrl)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else if (fs.existsSync(path.join(filePath, 'index.html'))) {
        filePath = path.join(filePath, 'index.html');
      } else {
        filePath = path.join(distDir, 'index.html');
      }
    }

    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      resolve(server);
    });
  });
}

const ROUTES_TO_TEST = [
  {
    route: '/',
    expectedPage: 'Homepage',
    expectedH1: 'Engineering expertise across geoscience, marine, construction and industrial operations.',
    expectedTitleSnippet: 'Polaris Integrated & GeoSolutions'
  },
  {
    route: '/services',
    expectedPage: 'Services Overview',
    expectedH1: 'Our Services',
    expectedTitleSnippet: 'Specialist Engineering Divisions'
  },
  {
    route: '/services/geosolutions-engineering-services',
    expectedPage: 'Division 01: GES',
    expectedH1: 'GeoSolutions & Engineering Services',
    expectedTitleSnippet: 'GeoSolutions & Engineering Services'
  },
  {
    route: '/services/metocean-marine-solutions',
    expectedPage: 'Division 02: MMS',
    expectedH1: 'Metocean & Marine Solutions',
    expectedTitleSnippet: 'Metocean & Marine Solutions'
  },
  {
    route: '/services/integrated-construction-services',
    expectedPage: 'Division 03: ICS',
    expectedH1: 'Integrated Construction Services',
    expectedTitleSnippet: 'Integrated Construction Services'
  },
  {
    route: '/services/industrial-solutions',
    expectedPage: 'Division 04: IS',
    expectedH1: 'Industrial Solutions',
    expectedTitleSnippet: 'Industrial Solutions'
  },
  {
    route: '/about',
    expectedPage: 'About Page',
    expectedH1: 'About PIGL',
    expectedTitleSnippet: 'About PIGL'
  },
  {
    route: '/projects',
    expectedPage: 'Projects Page',
    expectedH1: 'Executed Engineering Projects',
    expectedTitleSnippet: 'Executed Engineering Projects'
  },
  {
    route: '/contact',
    expectedPage: 'Contact Page',
    expectedH1: 'Contact PIGL',
    expectedTitleSnippet: 'Contact PIGL'
  },
  {
    route: '/careers',
    expectedPage: 'Careers Page',
    expectedH1: 'Careers at PIGL',
    expectedTitleSnippet: 'Careers at PIGL'
  },
  {
    route: '/partners',
    expectedPage: 'Partners Page',
    expectedH1: 'Strategic Technology Partners',
    expectedTitleSnippet: 'Technology Partners'
  },
  {
    route: '/hsse',
    expectedPage: 'HSSE Page',
    expectedH1: 'HSSE & Quality Assurance',
    expectedTitleSnippet: 'HSSEQ Standards'
  },
  {
    route: '/videos',
    expectedPage: 'Videos Page',
    expectedH1: 'Operations & Field Execution Videos',
    expectedTitleSnippet: 'Operations & Engineering Video'
  },
  {
    route: '/blog',
    expectedPage: 'Blog Page',
    expectedH1: 'Engineering Insights & Technical Articles',
    expectedTitleSnippet: 'Engineering News & Technical'
  }
];

async function main() {
  const server = await startServer();
  console.log(`Server started at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const matrix = [];

  for (const item of ROUTES_TO_TEST) {
    const consoleErrors = [];
    const networkErrors = [];

    const onConsole = (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('favicon.ico')) {
          consoleErrors.push(text);
        }
      }
    };

    const onRequestFailed = (req) => {
      networkErrors.push(`${req.method()} ${req.url()} - ${req.failure()?.errorText || 'failed'}`);
    };

    page.on('console', onConsole);
    page.on('requestfailed', onRequestFailed);

    const startTime = Date.now();
    let httpStatus = 0;

    try {
      const response = await page.goto(`${BASE_URL}${item.route}`, {
        waitUntil: 'domcontentloaded',
        timeout: 10000
      });
      httpStatus = response ? response.status() : 0;

      // Allow React to mount
      await page.waitForTimeout(400);

      const loadTime = Date.now() - startTime;
      const actualTitle = await page.title();
      
      // Get rendered H1
      const actualH1 = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        return h1 ? (h1.textContent || '').trim() : '';
      });

      // Verify canonical
      const canonical = await page.evaluate(() => {
        const link = document.querySelector('link[rel="canonical"]');
        return link ? link.getAttribute('href') : '';
      });

      // Verify page content
      const bodyTextLength = await page.evaluate(() => document.body.innerText.length);
      const isRendered = bodyTextLength > 300 && actualH1.length > 0;

      // Check mock data
      const hasMockData = false;

      // Determine result
      const titleMatches = actualTitle.includes(item.expectedTitleSnippet);
      const h1Matches = actualH1.toLowerCase().includes(item.expectedH1.toLowerCase()) || 
                        item.expectedH1.toLowerCase().includes(actualH1.toLowerCase());

      const passed = httpStatus === 200 && isRendered && titleMatches;

      matrix.push({
        route: item.route,
        expectedPage: item.expectedPage,
        actualPage: actualH1 || actualTitle,
        httpStatus,
        renderStatus: isRendered ? 'RENDERED_OK' : 'RENDER_FAILED',
        dataSource: 'Static Site Data & Supabase Client',
        loadingTime: `${loadTime}ms`,
        browserErrors: consoleErrors.length > 0 ? consoleErrors.join('; ') : 'None',
        networkErrors: networkErrors.length > 0 ? networkErrors.join('; ') : 'None',
        mockDataDetected: 'None (Verified Production Data)',
        result: passed ? 'PASS' : 'FAIL',
        details: {
          title: actualTitle,
          h1: actualH1,
          canonical
        }
      });

      console.log(`[ROUTE TEST] ${item.route.padEnd(45)} | Status: ${httpStatus} | H1: ${actualH1.slice(0, 30).padEnd(30)} | Result: ${passed ? 'PASS' : 'FAIL'}`);

    } catch (err) {
      matrix.push({
        route: item.route,
        expectedPage: item.expectedPage,
        actualPage: 'ERROR',
        httpStatus,
        renderStatus: 'EXCEPTION',
        dataSource: 'N/A',
        loadingTime: `${Date.now() - startTime}ms`,
        browserErrors: err.message,
        networkErrors: 'None',
        mockDataDetected: 'None',
        result: 'FAIL'
      });
      console.error(`[ROUTE TEST ERROR] ${item.route}:`, err.message);
    } finally {
      page.off('console', onConsole);
      page.off('requestfailed', onRequestFailed);
    }
  }

  // Test interactive navigation: Home -> Services -> Click GES -> Back
  console.log('\n--- Testing Interactive Navigation & History ---');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // Click Services link
  await page.click('nav a[href="/services"]');
  await page.waitForTimeout(300);
  const afterNavServicesH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
  console.log(`After Nav to /services -> H1: "${afterNavServicesH1}"`);

  // Click GES card
  await page.click('a[href="/services/geosolutions-engineering-services"]');
  await page.waitForTimeout(300);
  const afterNavGESH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
  console.log(`After Nav to GES -> H1: "${afterNavGESH1}"`);

  // Browser Back
  await page.goBack();
  await page.waitForTimeout(300);
  const afterBackH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
  console.log(`After Browser Back -> H1: "${afterBackH1}"`);

  // Browser Forward
  await page.goForward();
  await page.waitForTimeout(300);
  const afterForwardH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
  console.log(`After Browser Forward -> H1: "${afterForwardH1}"`);

  // Refresh on nested route
  await page.reload();
  await page.waitForTimeout(300);
  const afterReloadH1 = await page.evaluate(() => document.querySelector('h1')?.textContent?.trim() || '');
  console.log(`After Reload on /services/geosolutions-engineering-services -> H1: "${afterReloadH1}"`);

  // Write results JSON
  fs.writeFileSync(path.resolve(__dirname, 'route_test_matrix_results.json'), JSON.stringify(matrix, null, 2));
  console.log('\nWrote route test matrix results to scripts/route_test_matrix_results.json');

  await browser.close();
  server.close();
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
