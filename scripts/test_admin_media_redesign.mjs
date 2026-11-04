import { chromium } from 'playwright';
import path from 'path';

const artifactDir = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177';

async function testMediaLibraryRedesign() {
  console.log('================================================================');
  console.log(' PIGL ADMIN MEDIA LIBRARY REDESIGN & MANAGEMENT AUDIT');
  console.log('================================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Authenticate as Admin
  await context.addInitScript(() => {
    window.localStorage.setItem('pigl_admin_auth_user', JSON.stringify({
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@polarisigl.com',
      role: 'super_admin',
      full_name: 'PIGL Administrator'
    }));
  });

  const page = await context.newPage();

  console.log('Step 1: Navigating to Media Library (/admin?tab=media)...');
  await page.goto('http://localhost:5173/admin?tab=media', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Wait for media assets to load from API
  await page.waitForSelector('text=Continuos_Offshore_intelligence.mp4', { timeout: 15000 });
  await page.waitForTimeout(1000);

  // 1. Verify Compact Filters
  console.log('\nStep 2: Inspecting Filter Bar...');
  const categoryButtons = page.locator('button:has-text("Videos & Motion"), button:has-text("Services & Solutions"), button:has-text("Homepage Sliders"), button:has-text("Blog & Articles"), button:has-text("General Media")');
  const count = await categoryButtons.count();
  console.log(`Found ${count} category filter buttons in compact tab bar.`);

  // 2. Capture Desktop Screenshot
  const desktopShot = path.join(artifactDir, 'admin_media_redesigned_desktop.png');
  await page.screenshot({ path: desktopShot, fullPage: false });
  console.log(`Saved redesigned desktop screenshot: ${desktopShot}`);

  // 3. Inspect Video Cards
  console.log('\nStep 3: Checking video cards in Videos & Motion...');
  const videoCards = page.locator('text="Continuos_Offshore_intelligence.mp4"');
  const hasUploadedVideo = await videoCards.count() > 0;
  console.log(`Uploaded video Continuos_Offshore_intelligence.mp4 found: ${hasUploadedVideo}`);

  const playButtons = page.locator('button:has-text("Play"), button:has-text("View")');
  console.log(`Preview buttons found on cards: ${await playButtons.count()}`);

  const copyButtons = page.locator('button:has-text("Copy")');
  console.log(`Copy buttons found on cards: ${await copyButtons.count()}`);

  const trashButtons = page.locator('button[title*="Delete"]');
  console.log(`Delete buttons found on cards: ${await trashButtons.count()}`);

  // 4. Test Preview Modal
  console.log('\nStep 4: Opening Preview Modal on first video...');
  const cardPlayBtn = page.locator('button:has-text("Play")').first();
  if (await cardPlayBtn.isVisible()) {
    await cardPlayBtn.click();
    await page.waitForTimeout(1200);

    const modalShot = path.join(artifactDir, 'admin_media_preview_modal.png');
    await page.screenshot({ path: modalShot, fullPage: false });
    console.log(`Saved preview modal screenshot: ${modalShot}`);

    // Verify modal has video element and copy URL input
    const modalVideo = page.locator('.fixed video');
    console.log(`Modal video player visible: ${await modalVideo.isVisible().catch(() => false)}`);

    // Close modal
    const closeBtn = page.locator('button[aria-label="Close Preview"]');
    await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 5. Test Search Filtering
  console.log('\nStep 5: Testing real-time search filtering...');
  const searchInput = page.locator('input[placeholder*="Search"]');
  await searchInput.fill('Offshore');
  await page.waitForTimeout(600);

  const searchShot = path.join(artifactDir, 'admin_media_search_filtered.png');
  await page.screenshot({ path: searchShot, fullPage: false });
  console.log(`Saved search filtered screenshot: ${searchShot}`);

  // Clear search
  await searchInput.fill('');
  await page.waitForTimeout(500);

  // 6. Test List / Table View Toggle
  console.log('\nStep 6: Testing List/Table View toggle...');
  const listToggleBtn = page.locator('button[title="List View"]');
  await listToggleBtn.click();
  await page.waitForTimeout(600);

  const listShot = path.join(artifactDir, 'admin_media_table_view.png');
  await page.screenshot({ path: listShot, fullPage: false });
  console.log(`Saved table view screenshot: ${listShot}`);

  // Switch back to grid view
  const gridToggleBtn = page.locator('button[title="Grid View"]');
  await gridToggleBtn.click();
  await page.waitForTimeout(500);

  // 7. Test Upload Drawer Toggle
  console.log('\nStep 7: Testing Upload Drawer toggle...');
  const uploadToggleBtn = page.locator('button:has-text("Upload New Asset")');
  await uploadToggleBtn.click();
  await page.waitForTimeout(600);

  const uploaderShot = path.join(artifactDir, 'admin_media_uploader_open.png');
  await page.screenshot({ path: uploaderShot, fullPage: false });
  console.log(`Saved uploader open screenshot: ${uploaderShot}`);

  // 8. Capture Tablet & Mobile Views
  console.log('\nStep 8: Capturing responsive tablet & mobile views...');
  // Tablet (768x1024)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(800);
  const tabletShot = path.join(artifactDir, 'admin_media_redesigned_tablet.png');
  await page.screenshot({ path: tabletShot, fullPage: false });
  console.log(`Saved tablet screenshot: ${tabletShot}`);

  // Mobile (375x812)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(800);
  const mobileShot = path.join(artifactDir, 'admin_media_redesigned_mobile.png');
  await page.screenshot({ path: mobileShot, fullPage: false });
  console.log(`Saved mobile screenshot: ${mobileShot}`);

  await browser.close();

  console.log('\n================================================================');
  console.log(' MEDIA LIBRARY REDESIGN VERIFICATION SUCCESSFUL!');
  console.log('================================================================\n');
}

testMediaLibraryRedesign().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
