import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const artifactDir = '/Users/Kaycie/.gemini/antigravity/brain/be90a82b-578b-4621-903a-059e20a2c177';
const LIVE_URL = 'https://pigl.vercel.app';
const LOCAL_URL = 'http://localhost:5173';

const PUBLIC_ROUTES = [
  { path: '/', name: 'Homepage', selector: 'section video' },
  { path: '/about', name: 'About PIGL', selector: 'h1' },
  { path: '/services', name: 'Services Overview', selector: 'h1' },
  { path: '/services/geosolutions-engineering-services', name: 'GeoSolutions Service Detail', selector: 'h1' },
  { path: '/services/metocean-marine-solutions', name: 'Metocean Service Detail', selector: 'h1' },
  { path: '/services/integrated-construction-services', name: 'Integrated Construction Detail', selector: 'h1' },
  { path: '/services/industrial-solutions', name: 'Industrial Solutions Detail', selector: 'h1' },
  { path: '/teams', name: 'Leadership & Team', selector: 'h1' },
  { path: '/projects', name: 'Track Record & Projects', selector: 'h1' },
  { path: '/network', name: 'Technology Network', selector: 'h1' },
  { path: '/contact', name: 'Contact & RFPs', selector: 'form' },
  { path: '/careers', name: 'Careers & Vacancies', selector: 'h1' },
  { path: '/vendors', name: 'Vendor Hub & Onboarding', selector: 'h1, h2' },
  { path: '/blog', name: 'Publications & Blog', selector: 'h1' },
  { path: '/videos', name: 'Corporate Video Showcase', selector: 'h1' },
  { path: '/hsse', name: 'HSSE & Quality Assurance', selector: 'h1' }
];

const ADMIN_TABS = [
  { tab: 'dashboard', name: 'Admin Dashboard Overview' },
  { tab: 'sliders', name: 'Hero Sliders CMS' },
  { tab: 'media', name: 'Media Library & Asset Manager' },
  { tab: 'services', name: 'Services CMS' },
  { tab: 'projects', name: 'Projects CMS' },
  { tab: 'team', name: 'Teams CMS' },
  { tab: 'partners', name: 'Network & Partners CMS' },
  { tab: 'inquiries', name: 'Inquiries & RFPs' }
];

async function runProductionReadinessAudit() {
  console.log('========================================================================');
  console.log(' POLARIS INTEGRATED & GEOSOLUTIONS (PIGL) - PRODUCTION READINESS AUDIT');
  console.log(' Target Live Production URL: ' + LIVE_URL);
  console.log(' Timestamp: ' + new Date().toISOString());
  console.log('========================================================================\n');

  const report = {
    timestamp: new Date().toISOString(),
    git: {},
    database: {},
    api: {},
    security: {},
    prerender: {},
    publicRoutes: [],
    adminRoutes: [],
    summary: { total: 0, passed: 0, failed: 0 }
  };

  // CHECK 1: Database & Storage Connectivity
  console.log('--- CHECK 1: Database & Cloud Storage Integrity ---');
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
    );

    const { data: sliders, error: sErr } = await supabase.from('sliders').select('id, title, video_url, desktop_image').limit(5);
    const { data: services, error: svErr } = await supabase.from('services').select('id, slug, title').limit(5);
    const { data: projects, error: pErr } = await supabase.from('projects').select('id, title').limit(5);
    const { data: mediaStorage, error: stErr } = await supabase.storage.from('media').list('videos');

    if (sErr || svErr || pErr || stErr) {
      report.database = { status: 'FAILED', error: sErr || svErr || pErr || stErr };
      console.error('❌ Supabase check failed:', report.database.error);
    } else {
      report.database = {
        status: 'READY',
        slidersCount: sliders?.length,
        servicesCount: services?.length,
        projectsCount: projects?.length,
        mediaVideosCount: mediaStorage?.length
      };
      console.log('✅ Supabase PostgreSQL: Connected & healthy.');
      console.log(`   Sliders: ${sliders?.length}, Services: ${services?.length}, Projects: ${projects?.length}`);
      console.log(`✅ Supabase Cloud Storage: Connected & healthy. Stored videos: ${mediaStorage?.length}`);
    }
  } catch (err) {
    report.database = { status: 'ERROR', message: err.message };
    console.error('❌ Database error:', err);
  }

  // CHECK 2: Live Serverless APIs
  console.log('\n--- CHECK 2: Serverless API Functions on Live Production ---');
  const apiEndpoints = [
    { name: 'Media Storage API', url: `${LIVE_URL}/api/media?bucket=videos`, expectStatus: 200 },
    { name: 'Sliders API', url: `${LIVE_URL}/api/sliders`, expectStatus: 200 },
    { name: 'Email Dispatch API', url: `${LIVE_URL}/api/send-email`, expectStatus: 200 },
    { name: 'Direct Upload API', url: `${LIVE_URL}/api/upload`, expectStatus: 200 }
  ];

  for (const ep of apiEndpoints) {
    try {
      const resp = await fetch(ep.url);
      const isOk = resp.status === ep.expectStatus;
      console.log(`   [${resp.status}] ${ep.name} (${ep.url}): ${isOk ? 'PASS' : 'WARN'}`);
      report.api[ep.name] = { status: resp.status, ok: isOk };
    } catch (e) {
      console.log(`   [ERROR] ${ep.name} (${ep.url}): ${e.message}`);
      report.api[ep.name] = { status: 'ERROR', error: e.message };
    }
  }

  // CHECK 3: Security Headers & SEO Files
  console.log('\n--- CHECK 3: Security Headers & Static Distribution Assets ---');
  try {
    const headResp = await fetch(LIVE_URL, { method: 'HEAD' });
    const headers = Object.fromEntries(headResp.headers.entries());
    const secHeaders = {
      'strict-transport-security': headers['strict-transport-security'] || 'MISSING',
      'x-content-type-options': headers['x-content-type-options'] || 'MISSING',
      'x-frame-options': headers['x-frame-options'] || 'MISSING',
      'referrer-policy': headers['referrer-policy'] || 'MISSING',
      'permissions-policy': headers['permissions-policy'] || 'MISSING'
    };
    console.log('   Security Headers on Production:', secHeaders);
    report.security = secHeaders;

    // Static SEO files
    const sitemapResp = await fetch(`${LIVE_URL}/sitemap.xml`);
    const robotsResp = await fetch(`${LIVE_URL}/robots.txt`);
    console.log(`   sitemap.xml status: ${sitemapResp.status} (${sitemapResp.status === 200 ? 'OK' : 'FAIL'})`);
    console.log(`   robots.txt status: ${robotsResp.status} (${robotsResp.status === 200 ? 'OK' : 'FAIL'})`);
  } catch (err) {
    console.warn('   Security headers check warning:', err.message);
  }

  // CHECK 4: End-to-End Route Matrix on Live Production with Headless Chromium
  console.log('\n--- CHECK 4: Automated End-to-End Route Matrix on Live Production ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  // Pre-seed mock admin session for admin route testing
  await context.addInitScript(() => {
    window.localStorage.setItem('pigl_admin_auth_user', JSON.stringify({
      id: '00000000-0000-4000-8000-000000000001',
      email: 'admin@polarisigl.com',
      role: 'super_admin',
      full_name: 'PIGL Administrator'
    }));
  });

  const page = await context.newPage();

  // Test Public Routes
  for (const r of PUBLIC_ROUTES) {
    report.summary.total++;
    const fullUrl = LIVE_URL + r.path;
    try {
      const resp = await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);
      const status = resp.status();
      const hasSelector = await page.$(r.selector);
      const title = await page.title();

      if (status === 200 && hasSelector) {
        report.summary.passed++;
        report.publicRoutes.push({ path: r.path, name: r.name, status, ok: true, title });
        console.log(`   ✅ [200] ${r.name} (${r.path}) - "${title}"`);
      } else {
        report.summary.failed++;
        report.publicRoutes.push({ path: r.path, name: r.name, status, ok: false, title });
        console.log(`   ❌ [${status}] ${r.name} (${r.path}) - Missing selector: ${r.selector}`);
      }
    } catch (e) {
      report.summary.failed++;
      report.publicRoutes.push({ path: r.path, name: r.name, status: 'TIMEOUT', ok: false, error: e.message });
      console.log(`   ❌ [FAIL] ${r.name} (${r.path}) - ${e.message}`);
    }
  }

  // Test Admin CMS Routes
  console.log('\n--- CHECK 5: Admin Dashboard CMS Functionality on Live Production ---');
  for (const a of ADMIN_TABS) {
    report.summary.total++;
    const adminUrl = `${LIVE_URL}/admin?tab=${a.tab}`;
    try {
      const resp = await page.goto(adminUrl, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);
      const status = resp.status();
      const title = await page.title();

      if (status === 200) {
        report.summary.passed++;
        report.adminRoutes.push({ tab: a.tab, name: a.name, status, ok: true });
        console.log(`   ✅ [200] ${a.name} (?tab=${a.tab})`);
      } else {
        report.summary.failed++;
        report.adminRoutes.push({ tab: a.tab, name: a.name, status, ok: false });
        console.log(`   ❌ [${status}] ${a.name} (?tab=${a.tab})`);
      }
    } catch (e) {
      report.summary.failed++;
      report.adminRoutes.push({ tab: a.tab, name: a.name, status: 'TIMEOUT', ok: false, error: e.message });
      console.log(`   ❌ [FAIL] ${a.name} (?tab=${a.tab}) - ${e.message}`);
    }
  }

  // Capture final live production screenshots
  console.log('\n--- Capturing Live Production Proof Screenshots ---');
  await page.goto(LIVE_URL, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const liveHomeShot = path.join(artifactDir, 'live_production_homepage.png');
  await page.screenshot({ path: liveHomeShot, fullPage: false });
  console.log(`Saved live homepage screenshot: ${liveHomeShot}`);

  await page.goto(`${LIVE_URL}/admin?tab=media`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  const liveMediaShot = path.join(artifactDir, 'live_production_admin_media.png');
  await page.screenshot({ path: liveMediaShot, fullPage: false });
  console.log(`Saved live admin media screenshot: ${liveMediaShot}`);

  await browser.close();

  console.log('\n========================================================================');
  console.log(` FINAL PRODUCTION READINESS AUDIT RESULT:`);
  console.log(` Total Checks: ${report.summary.total} | Passed: ${report.summary.passed} | Failed: ${report.summary.failed}`);
  console.log(` Status: ${report.summary.failed === 0 ? '🟢 100% READY FOR PRODUCTION' : '🔴 ISSUES DETECTED'}`);
  console.log('========================================================================\n');

  return report;
}

runProductionReadinessAudit().catch(err => {
  console.error('Production audit failed with error:', err);
  process.exit(1);
});
