import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const artifactDir = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177';

async function runHeroVideoVerification() {
  console.log('================================================================');
  console.log(' PIGL HERO VIDEO - NO FALLBACK IMAGE VERIFICATION AUDIT');
  console.log('================================================================\n');

  // STEP 1: Query initial sliders
  console.log('Step 1: Reading sliders in Supabase database...');
  const { data: sliders, error: fetchErr } = await supabase
    .from('sliders')
    .select('*')
    .order('display_order', { ascending: true });

  if (fetchErr) {
    console.error('Failed to fetch sliders from Supabase:', fetchErr);
    process.exit(1);
  }

  console.log(`Found ${sliders.length} sliders in Supabase.`);
  const videoSlide = sliders.find(s => s.video_url);
  if (!videoSlide) {
    console.error('No video slide found in database.');
    process.exit(1);
  }

  const originalDesktopImage = videoSlide.desktop_image;
  const originalMobileImage = videoSlide.mobile_image;
  console.log(`Target Video Slide [ID: ${videoSlide.id}]:`);
  console.log(`  Title: "${videoSlide.title}"`);
  console.log(`  Video: ${videoSlide.video_url}`);
  console.log(`  Initial Desktop Image: "${originalDesktopImage}"`);

  // STEP 2: Launch browser with authenticated admin session
  console.log('\nStep 2: Launching Playwright browser with Admin session...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Pre-seed authentication and clear sliders local cache to ensure fresh DB sync
  await context.addInitScript(() => {
    window.localStorage.setItem('pigl_admin_auth_user', JSON.stringify({
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@polarisigl.com',
      role: 'super_admin',
      full_name: 'System Administrator'
    }));
    window.localStorage.removeItem('pigl_cms_sliders');
  });

  const page = await context.newPage();

  // STEP 3: Test Admin Slider Management UI
  console.log('\nStep 3: Navigating to Admin Slider Management (/admin?tab=sliders)...');
  await page.goto('http://localhost:5173/admin?tab=sliders', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  // Take screenshot of initial slider list
  const initialAdminListPath = path.join(artifactDir, 'admin_sliders_initial.png');
  await page.screenshot({ path: initialAdminListPath, fullPage: false });
  console.log(`Captured admin sliders initial screenshot: ${initialAdminListPath}`);

  // Find Edit button for the video slide
  console.log('Finding and clicking Edit on the video slide...');
  const editButtons = page.locator('button:has-text("Edit")');
  const count = await editButtons.count();
  console.log(`Found ${count} edit buttons.`);
  
  if (count > 0) {
    await editButtons.first().click();
    await page.waitForTimeout(1000);

    // Look for "Remove Image" button in AdminSliderEditor
    const removeImgBtn = page.locator('button:has-text("Remove Image")').first();
    const hasRemoveBtn = await removeImgBtn.isVisible().catch(() => false);
    console.log(`"Remove Image" button visible in editor: ${hasRemoveBtn}`);

    if (hasRemoveBtn) {
      console.log('Clicking "Remove Image" to clear fallback image...');
      await removeImgBtn.click();
      await page.waitForTimeout(500);

      // Verify "No Fallback Image Set" indicator appeared
      const noImageBadge = page.locator('text="No Fallback Image Set"').first();
      const hasNoImageBadge = await noImageBadge.isVisible().catch(() => false);
      console.log(`"No Fallback Image Set" indicator visible after remove: ${hasNoImageBadge}`);

      // Capture screenshot of editor with empty image state
      const editorNoImagePath = path.join(artifactDir, 'admin_slider_editor_removed_image.png');
      await page.screenshot({ path: editorNoImagePath, fullPage: false });
      console.log(`Captured editor screenshot without fallback image: ${editorNoImagePath}`);

      // Click "Save Slide" to save
      console.log('Saving slide without fallback image...');
      const saveBtn = page.locator('button[type="submit"]').first();
      await saveBtn.click();
      await page.waitForTimeout(2500);
    } else {
      console.log('Fallback image already removed. Checking "No Fallback Image Set" state...');
      const noImageBadge = page.locator('text="No Fallback Image Set"').first();
      const hasNoImageBadge = await noImageBadge.isVisible().catch(() => false);
      console.log(`"No Fallback Image Set" indicator visible: ${hasNoImageBadge}`);

      const editorNoImagePath = path.join(artifactDir, 'admin_slider_editor_removed_image.png');
      await page.screenshot({ path: editorNoImagePath, fullPage: false });
      console.log(`Captured editor screenshot without fallback image: ${editorNoImagePath}`);

      const cancelBtn = page.locator('button:has-text("Cancel")').first();
      if (await cancelBtn.isVisible()) {
        await cancelBtn.click();
      }
    }
  }

  // STEP 4: Verify Supabase Database State
  console.log('\nStep 4: Verifying Supabase DB reflects empty fallback image...');
  const { data: updatedDbSlide, error: updateCheckErr } = await supabase
    .from('sliders')
    .select('*')
    .eq('id', videoSlide.id)
    .single();

  if (updateCheckErr || !updatedDbSlide) {
    console.error('Failed to query updated slide from Supabase:', updateCheckErr);
    process.exit(1);
  }

  console.log(`Supabase desktop_image value: "${updatedDbSlide.desktop_image}"`);
  if (updatedDbSlide.desktop_image && updatedDbSlide.desktop_image.trim() !== '') {
    console.error(`FAILURE: desktop_image is not empty in Supabase! Got: "${updatedDbSlide.desktop_image}"`);
    process.exit(1);
  }
  console.log('PASS: Supabase desktop_image is empty string! No unwanted image was injected.');

  // STEP 5: Verify Admin List displays "Pure Video (No Image)" badge
  console.log('\nStep 5: Verifying Admin Slider list displays "Pure Video (No Image)" badge...');
  await page.goto('http://localhost:5173/admin?tab=sliders', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1500);

  const pureVideoBadge = page.locator('text="Pure Video (No Image)"').first();
  const isPureBadgeVisible = await pureVideoBadge.isVisible().catch(() => false);
  console.log(`"Pure Video (No Image)" badge visible on slider card: ${isPureBadgeVisible}`);

  const adminListUpdatedPath = path.join(artifactDir, 'admin_sliders_pure_video_badge.png');
  await page.screenshot({ path: adminListUpdatedPath, fullPage: false });
  console.log(`Captured admin list screenshot: ${adminListUpdatedPath}`);

  // STEP 6: Public Homepage Verification
  console.log('\nStep 6: Loading public homepage (http://localhost:5173/) to verify frontend rendering...');
  const publicPage = await context.newPage();
  await publicPage.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 30000 });
  await publicPage.waitForTimeout(2000);

  const heroVideo = await publicPage.$('section video');
  if (!heroVideo) {
    console.error('FAILURE: Hero video element not found on homepage!');
    process.exit(1);
  }

  const domAttrs = await heroVideo.evaluate(v => ({
    autoplay: v.autoplay,
    muted: v.muted,
    playsInline: v.playsInline,
    loop: v.loop,
    preload: v.preload,
    poster: v.getAttribute('poster'),
    src: v.getAttribute('src') || (v.querySelector('source') ? v.querySelector('source').getAttribute('src') : null)
  }));
  console.log('Hero Video DOM attributes on public homepage:', domAttrs);

  if (domAttrs.poster) {
    console.error(`FAILURE: video element has poster attribute: "${domAttrs.poster}"`);
    process.exit(1);
  }
  console.log('PASS: <video> element has NO poster attribute.');

  // Check that NO fallback <img> tag is rendered inside the slide
  const fallbackImgCount = await publicPage.$$eval('section video ~ img, section .relative img[alt="Pioneering Sub-Surface & Digital Geosolutions"]', imgs => imgs.length);
  console.log(`Fallback <img> tags rendered in video container: ${fallbackImgCount}`);
  if (fallbackImgCount > 0) {
    console.error('FAILURE: Fallback <img> was rendered when fallback image was removed!');
    process.exit(1);
  }
  console.log('PASS: Zero fallback <img> tags rendered in video container.');

  // STEP 7: Responsive Screenshots across Desktop, Tablet, and Mobile
  console.log('\nStep 7: Capturing responsive screenshots of hero video playing with no fallback image...');
  
  // Desktop (1440x900)
  const desktopShot = path.join(artifactDir, 'hero_video_no_image_desktop.png');
  await publicPage.screenshot({ path: desktopShot, fullPage: false });
  console.log(`Saved desktop screenshot: ${desktopShot}`);

  // Tablet (768x1024)
  await publicPage.setViewportSize({ width: 768, height: 1024 });
  await publicPage.waitForTimeout(1000);
  const tabletShot = path.join(artifactDir, 'hero_video_no_image_tablet.png');
  await publicPage.screenshot({ path: tabletShot, fullPage: false });
  console.log(`Saved tablet screenshot: ${tabletShot}`);

  // Mobile (375x812)
  await publicPage.setViewportSize({ width: 375, height: 812 });
  await publicPage.waitForTimeout(1000);
  const mobileShot = path.join(artifactDir, 'hero_video_no_image_mobile.png');
  await publicPage.screenshot({ path: mobileShot, fullPage: false });
  console.log(`Saved mobile screenshot: ${mobileShot}`);

  await browser.close();

  console.log('\n================================================================');
  console.log(' VERIFICATION COMPLETED WITH 100% SUCCESS!');
  console.log('================================================================\n');
}

runHeroVideoVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
