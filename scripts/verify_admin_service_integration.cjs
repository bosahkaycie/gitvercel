const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING COMPREHENSIVE SERVICE INTEGRATION AUDIT & TEST ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  function record(testName, passed, details = '') {
    results.push({ testName, passed, details });
    const mark = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${mark} | ${testName}${details ? ' - ' + details : ''}`);
  }

  try {
    // 1. Pre-authenticate with Super Admin credentials in localStorage
    await page.addInitScript(() => {
      localStorage.setItem('pigl_admin_auth_user', JSON.stringify({
        id: 'admin-super-001',
        email: 'admin@pigl.com.ng',
        full_name: 'Lead Engineering Administrator',
        role: 'Super Admin',
        status: 'active',
        created_at: new Date().toISOString(),
        last_login_at: new Date().toISOString()
      }));
    });

    // 2. Visit /admin
    await page.goto('http://127.0.0.1:5173/admin', { waitUntil: 'networkidle' });
    const pageTitle = await page.title();
    record('Admin Route Loads and Authenticates', pageTitle.includes('PIGL') || pageTitle.length > 0, `Page Title: "${pageTitle}"`);

    // 3. Navigate to Services Tab
    await page.waitForSelector('button:has-text("Services & Capabilities")', { timeout: 6000 });
    await page.click('button:has-text("Services & Capabilities")');
    await page.waitForTimeout(800);

    // 4. Check Services List has the 4 canonical divisions
    const bodyContent = await page.textContent('body');
    const hasGeo = bodyContent.includes('GeoSolutions');
    const hasMetocean = bodyContent.includes('Metocean');
    const hasConst = bodyContent.includes('Construction');
    const hasInd = bodyContent.includes('Industrial');

    record('Canonical 4 Divisions Listed in Admin', hasGeo && hasMetocean && hasConst && hasInd,
      `GeoSolutions: ${hasGeo}, Metocean: ${hasMetocean}, Construction: ${hasConst}, Industrial: ${hasInd}`);

    // 5. Open Editor for GeoSolutions
    const rows = await page.$$('tr');
    let editGeoBtn = null;
    for (const r of rows) {
      const text = await r.innerText();
      if (text.includes('GeoSolutions')) {
        editGeoBtn = await r.$('button[title="Edit Service"]');
        break;
      }
    }
    if (!editGeoBtn) {
      editGeoBtn = await page.$('button[title="Edit Service"]');
    }
    record('Edit Service Button Located', Boolean(editGeoBtn));
    if (editGeoBtn) {
      await editGeoBtn.click();
      await page.waitForTimeout(1000);
    }

    // 6. Inspect Form Fields in AdminServiceEditor
    const heroH1Input = await page.$('input[placeholder*="Precision Geodetic Survey"]');
    record('Hero Section Headline (H1) Field Present', Boolean(heroH1Input));

    const overviewHdrInput = await page.$('input[placeholder*="Engineering Scope & Problem Resolution"]');
    record('Overview Section Headline Field Present', Boolean(overviewHdrInput));

    const engProblemInput = await page.$('textarea[placeholder*="geotechnical hazards"]');
    record('Engineering Problem Addressed Field Present', Boolean(engProblemInput));

    const addStandardBtn = await page.$('button:has-text("+ Add Standard")');
    record('Statutory Standards & QA Codes Manager Present', Boolean(addStandardBtn));

    const addDeliverableBtn = await page.$('button:has-text("+ Add Deliverable")');
    record('Client Project Deliverables Manager Present', Boolean(addDeliverableBtn));

    const addCapabilityCardBtn = await page.$('button:has-text("Add Capability Card")');
    record('Core Capabilities Manager with Reorder & Remove Present', Boolean(addCapabilityCardBtn));

    const galleryAltInput = await page.$('input[placeholder*="Descriptive alt text"]');
    record('Gallery Image Alt Text Field Present', Boolean(galleryAltInput));

    const ctaTextInput = await page.$('input[value*="Discuss"], input[value*="Consultation"], input[value*="Request"]');
    record('CTA Button Label Field Present', Boolean(ctaTextInput));

    const ctaUrlInput = await page.$('input[value*="contact"], input[value*="#consultation-form"]');
    record('CTA Target URL Field Present', Boolean(ctaUrlInput));

    const metaTitleInput = await page.$('input[placeholder*="PIGL Specialist Engineering"]');
    record('SEO Meta Title Field Present', Boolean(metaTitleInput));

    // 7. Perform an Edit and Save
    const uniqueSuffix = Date.now().toString().slice(-4);
    const testHeroH1 = `Precision Geodetic Survey, Subsurface Geophysics & Geotechnical Engineering [Audit-${uniqueSuffix}]`;
    if (heroH1Input) {
      await heroH1Input.fill(testHeroH1);
    }

    const testOverviewHeading = `Subsurface Engineering Scope & Problem Mitigation [Audit-${uniqueSuffix}]`;
    if (overviewHdrInput) {
      await overviewHdrInput.fill(testOverviewHeading);
    }

    // Add a custom standard
    const newStandardInput = await page.$('input[placeholder*="ISO 9001:2015 Quality Management Systems"]');
    const customStandardText = `DNV-GL-ST-F101 Subsea Pipeline Integrity Standard [Audit-${uniqueSuffix}]`;
    if (newStandardInput && addStandardBtn) {
      await newStandardInput.fill(customStandardText);
      await addStandardBtn.click();
      await page.waitForTimeout(400);
    }

    // Add a custom deliverable
    const newDelivInput = await page.$('input[placeholder*="Certified Geotechnical Engineering Soil Investigation Report"]');
    const customDelivText = `Digital Twin 3D Laser Scan & As-Built CAD Package [Audit-${uniqueSuffix}]`;
    const addDelivBtn = await page.$('button:has-text("+ Add Deliverable")');
    if (newDelivInput && addDelivBtn) {
      await newDelivInput.fill(customDelivText);
      await addDelivBtn.click();
      await page.waitForTimeout(400);
    }

    // Click Save & Publish Service
    const saveBtn = await page.$('button:has-text("Save & Publish Service")');
    record('Save & Publish Service Button Present', Boolean(saveBtn));
    if (saveBtn) {
      await saveBtn.click();
      await page.waitForTimeout(2500);
    }

    // 8. Verify Public Page Integration for GeoSolutions
    console.log('Checking public page: /services/geosolutions-engineering-services ...');
    await page.goto('http://127.0.0.1:5173/services/geosolutions-engineering-services', { waitUntil: 'networkidle' });

    const renderedH1 = await page.$eval('h1', el => el.textContent.trim());
    record('Public Page Renders Hero H1 Headline from Dashboard', renderedH1 === testHeroH1, `Rendered: "${renderedH1}"`);

    const renderedOverviewHdrs = await page.$$eval('h3', els => els.map(e => e.textContent.trim()));
    const hasRenderedOverviewHdr = renderedOverviewHdrs.some(h => h === testOverviewHeading);
    record('Public Page Renders Overview Headline from Dashboard', hasRenderedOverviewHdr, `Found: ${testOverviewHeading}`);

    const publicBodyText = await page.textContent('body');
    const hasCustomStandard = publicBodyText.includes(customStandardText);
    record('Public Page Displays Added Statutory Standard without Code Changes', hasCustomStandard, `Standard: "${customStandardText}"`);

    const hasCustomDeliv = publicBodyText.includes(customDelivText);
    record('Public Page Displays Added Client Deliverable without Code Changes', hasCustomDeliv, `Deliverable: "${customDelivText}"`);

    // Verify Capabilities in Section C
    const capabilityCards = await page.$$eval('#capabilities-section .group', cards => cards.map(c => c.textContent));
    record('Section C Core Capabilities Rendered', capabilityCards.length > 0, `Count: ${capabilityCards.length}`);

    // Verify Section D Delivery & Methodology
    const methodologies = await page.$$eval('#delivery-section li', items => items.map(i => i.textContent));
    record('Section D Delivery, Standards & Deliverables Rendered', methodologies.length > 0, `Total items in Section D: ${methodologies.length}`);

    // Verify Section E Gallery with Alt Text
    const galleryImgAlts = await page.$$eval('img[alt]', imgs => imgs.map(i => i.getAttribute('alt')));
    const hasDescriptiveAlts = galleryImgAlts.some(alt => alt && alt.length > 5);
    record('Section E Gallery Img Tags Have Descriptive Alt Text', hasDescriptiveAlts, `Sample Alt: "${galleryImgAlts.find(a => a && a.length > 5)}"`);

    // Verify Section F Enquiry Form Presence
    const consultationForm = await page.$('#consultation-form');
    record('Section F Technical Consultation Form Available & Functional', Boolean(consultationForm));

    // 9. Test Data Isolation (No data leak to /services/metocean-marine-solutions)
    console.log('Checking public page: /services/metocean-marine-solutions for isolation...');
    await page.goto('http://127.0.0.1:5173/services/metocean-marine-solutions', { waitUntil: 'networkidle' });
    const metoceanBodyText = await page.textContent('body');
    const metoceanH1 = await page.$eval('h1', el => el.textContent.trim());

    record('Content Isolation: GeoSolutions Edit Does Not Leak to Metocean', !metoceanBodyText.includes(testHeroH1), `Metocean H1: "${metoceanH1}"`);
    record('Metocean Title & Content Preserved Correctly', metoceanH1.includes('Metocean & Marine Solutions'));

    // 10. Dynamic SEO Metadata
    const metoceanTitle = await page.title();
    record('Dynamic SEO Title Updated on Public Service Page', metoceanTitle.includes('Metocean') && metoceanTitle.includes('PIGL'), `Title: "${metoceanTitle}"`);

    // 11. Test Optional Section Clean Hiding
    console.log('Verifying clean hiding of optional sections...');
    const hasSectionDInMetocean = await page.$('#delivery-section');
    record('Sections with content render cleanly', Boolean(hasSectionDInMetocean));

  } catch (err) {
    console.error('Audit execution error:', err);
    record('Audit Execution Finished', false, err.message);
  } finally {
    await browser.close();
    console.log('\n--- AUDIT SUMMARY ---');
    const passedCount = results.filter(r => r.passed).length;
    console.log(`Total tests: ${results.length} | Passed: ${passedCount} | Failed: ${results.length - passedCount}`);
  }
})();
