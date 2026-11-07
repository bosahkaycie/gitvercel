import { chromium } from 'playwright';

async function testPerformance() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let totalBytes = 0;
  let requestCount = 0;
  const requests = [];

  page.on('response', async (response) => {
    requestCount++;
    try {
      const buffer = await response.body();
      totalBytes += buffer.length;
      requests.push({
        url: response.url(),
        status: response.status(),
        sizeKB: (buffer.length / 1024).toFixed(1),
        type: response.request().resourceType()
      });
    } catch (e) {
      // Streamed or canceled
      requests.push({
        url: response.url(),
        status: response.status(),
        sizeKB: '0',
        type: response.request().resourceType()
      });
    }
  });

  const startTime = Date.now();
  console.log('Navigating to https://polarisigl.com/ ...');
  await page.goto('https://polarisigl.com/', { waitUntil: 'networkidle', timeout: 30000 });
  const duration = Date.now() - startTime;

  console.log(`\n=== Live Page Load Summary ===`);
  console.log(`Total Requests: ${requestCount}`);
  console.log(`Total Transferred: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Network Idle Time: ${duration} ms (${(duration / 1000).toFixed(2)} s)`);

  // Check top 10 heaviest requests
  requests.sort((a, b) => parseFloat(b.sizeKB) - parseFloat(a.sizeKB));
  console.log('\nTop 10 Heaviest Requests:');
  requests.slice(0, 10).forEach(r => {
    console.log(` - [${r.status}] ${r.sizeKB} KB (${r.type}) : ${r.url.substring(0, 80)}`);
  });

  await browser.close();
}

testPerformance().catch(console.error);
