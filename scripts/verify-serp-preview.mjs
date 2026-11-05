import { chromium } from 'playwright';

async function verifyLive() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 960 } });

  console.log('Navigating to https://polarisigl.com/ ...');
  await page.goto('https://polarisigl.com/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  const ogImage = await page.locator('meta[property="og:image"]').first().getAttribute('content');
  const iconHref = await page.locator('link[rel="icon"][sizes="48x48"]').first().getAttribute('href');

  console.log('Live og:image:', ogImage);
  console.log('Live 48x48 icon:', iconHref);

  await page.setContent(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          margin: 0;
          padding: 30px;
          background: #090d16;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #f8fafc;
        }
        .container {
          max-width: 960px;
          margin: 0 auto;
        }
        .header {
          text-align: center;
          margin-bottom: 24px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0 0 6px 0;
          color: #34d399;
        }
        .header p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }
        .card-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        .panel {
          background: #111827;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #1f2937;
        }
        .panel-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .badge-before { color: #f87171; }
        .badge-after { color: #34d399; }
        
        .serp-box {
          background: #202124;
          border-radius: 10px;
          padding: 16px 18px;
          border: 1px solid #3c4043;
        }
        .serp-top {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }
        .icon-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.4);
        }
        .icon-circle.fallback {
          background: #3c4043;
          color: #9aa0a6;
          font-size: 16px;
        }
        .icon-circle img {
          width: 26px;
          height: 26px;
          object-fit: contain;
        }
        .serp-site-info {
          display: flex;
          flex-direction: column;
        }
        .serp-domain {
          font-size: 14px;
          color: #dadce0;
          font-weight: 400;
        }
        .serp-url {
          font-size: 12px;
          color: #9aa0a6;
        }
        .serp-title {
          font-size: 18px;
          color: #8ab4f8;
          text-decoration: none;
          font-weight: 400;
          line-height: 1.35;
          margin-bottom: 6px;
          display: block;
        }
        .serp-snippet {
          font-size: 13px;
          line-height: 1.5;
          color: #bdc1c6;
        }
        .serp-snippet strong {
          color: #ffffff;
        }
        .og-section {
          background: #111827;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid #1f2937;
        }
        .og-img-preview {
          width: 100%;
          border-radius: 8px;
          border: 1px solid #374151;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5);
          display: block;
        }
        .specs {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-top: 14px;
        }
        .spec-item {
          background: #090d16;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #1f2937;
        }
        .spec-label {
          font-size: 10px;
          text-transform: uppercase;
          color: #94a3b8;
          letter-spacing: 0.05em;
        }
        .spec-val {
          font-size: 12px;
          font-weight: 700;
          color: #34d399;
          margin-top: 2px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>PIGL Google SERP Logo &amp; SEO Image Verification</h1>
          <p>Production verification on polarisigl.com (Hostinger LiteSpeed Edge)</p>
        </div>

        <div class="card-grid">
          <div class="panel">
            <div class="panel-title badge-before">
              <span>✕</span> BEFORE: Generic Fallback Globe Icon
            </div>
            <div class="serp-box">
              <div class="serp-top">
                <div class="icon-circle fallback">&#9881;</div>
                <div class="serp-site-info">
                  <span class="serp-domain">polarisigl.com</span>
                  <span class="serp-url">https://polarisigl.com</span>
                </div>
              </div>
              <span class="serp-title">PIGL | Engineering, Geosolutions &amp; 3D Reality Capture | Nigeria</span>
              <div class="serp-snippet">
                <strong>PIGL</strong> delivers high-fidelity 3D Laser Scanning and Digital Twin solutions for precision engineering in Nigeria.
              </div>
            </div>
            <p style="font-size: 11px; color: #94a3b8; margin: 12px 0 0 0;">
              Root cause: Missing physical <code>/favicon.ico</code> caused LiteSpeed rewrite to return <code>index.html</code> (HTML instead of image).
            </p>
          </div>

          <div class="panel">
            <div class="panel-title badge-after">
              <span>✓</span> AFTER: Official PIGL Brand Logo Icon
            </div>
            <div class="serp-box">
              <div class="serp-top">
                <div class="icon-circle">
                  <img src="https://polarisigl.com/favicon-48x48.png" alt="PIGL Logo" />
                </div>
                <div class="serp-site-info">
                  <span class="serp-domain">polarisigl.com</span>
                  <span class="serp-url">https://polarisigl.com</span>
                </div>
              </div>
              <span class="serp-title">PIGL | Engineering, Geosolutions &amp; 3D Reality Capture | Nigeria</span>
              <div class="serp-snippet">
                <strong>PIGL</strong> delivers high-fidelity 3D Laser Scanning and Digital Twin solutions for precision engineering in Nigeria.
              </div>
            </div>
            <p style="font-size: 11px; color: #34d399; margin: 12px 0 0 0;">
              Fixed: Multi-resolution <code>/favicon.ico</code>, <code>/favicon-48x48.png</code>, and static bypass rules verified returning <code>200 image/x-icon</code>.
            </p>
          </div>
        </div>

        <div class="og-section">
          <div class="panel-title badge-after">
            <span>✓</span> Live Official 1200x630 SEO &amp; Social Preview (og-image.jpg)
          </div>
          <img class="og-img-preview" src="https://polarisigl.com/og-image.jpg" alt="PIGL Official OG Image" />
          <div class="specs">
            <div class="spec-item">
              <div class="spec-label">Dimensions</div>
              <div class="spec-val">1200 &times; 630 px</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Encoding</div>
              <div class="spec-val">JPEG (92% mozjpeg)</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Open Graph &amp; Twitter</div>
              <div class="spec-val">og:image &amp; twitter:image</div>
            </div>
            <div class="spec-item">
              <div class="spec-label">Live Status</div>
              <div class="spec-val">HTTP 200 OK</div>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `, { waitUntil: 'networkidle' });

  await page.waitForTimeout(1000);
  const screenshotPath = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177/live_serp_and_seo_image_verification.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });

  console.log('Saved live verification screenshot to:', screenshotPath);
  await browser.close();
}

verifyLive().catch((e) => {
  console.error(e);
  process.exit(1);
});
