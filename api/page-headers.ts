import { createClient } from '@supabase/supabase-js';

export interface PageHeaderConfig {
  id: string;
  page_slug: string;
  page_name: string;
  breadcrumb_title?: string;
  breadcrumb_image?: string;
  header_bg_image?: string;
  overlay_opacity?: number;
  fallback_image?: string;
  updated_at?: string;
  updated_by?: string;
}

export interface HeaderBackgroundSettings {
  top_header_bg_image?: string;
  top_header_overlay_opacity?: number;
  top_header_active?: boolean;
  updated_at?: string;
  updated_by?: string;
}

export interface SiteHeadersData {
  pages: Record<string, PageHeaderConfig>;
  top_header: HeaderBackgroundSettings;
  updated_at?: string;
}

export const DEFAULT_PAGE_HEADERS: Record<string, PageHeaderConfig> = {
  home: {
    id: 'home',
    page_slug: '/',
    page_name: 'Home',
    breadcrumb_title: 'Home',
    fallback_image: '/assets/newoffshore.png',
    overlay_opacity: 0.35
  },
  about: {
    id: 'about',
    page_slug: '/about',
    page_name: 'About Us',
    breadcrumb_title: 'About Us',
    fallback_image: '/assets/teaching.jpeg',
    overlay_opacity: 0.30
  },
  services: {
    id: 'services',
    page_slug: '/services',
    page_name: 'Our Services',
    breadcrumb_title: 'Services',
    fallback_image: '/assets/road.png',
    overlay_opacity: 0.35
  },
  projects: {
    id: 'projects',
    page_slug: '/projects',
    page_name: 'Executed Projects & Case Studies',
    breadcrumb_title: 'Case studies',
    fallback_image: '/assets/newoffshore.png',
    overlay_opacity: 0.35
  },
  teams: {
    id: 'teams',
    page_slug: '/teams',
    page_name: 'Leadership & Engineering Teams',
    breadcrumb_title: 'Management Team',
    fallback_image: '/assets/team.jpeg',
    overlay_opacity: 0.25
  },
  network: {
    id: 'network',
    page_slug: '/network',
    page_name: 'Our Professional Network',
    breadcrumb_title: 'Our Network',
    fallback_image: '/assets/pigl_international_partner.jpg',
    overlay_opacity: 0.25
  },
  careers: {
    id: 'careers',
    page_slug: '/careers',
    page_name: 'Careers & Vacancies',
    breadcrumb_title: 'Careers',
    fallback_image: '/assets/1770736125265.jpeg',
    overlay_opacity: 0.30
  },
  blog: {
    id: 'blog',
    page_slug: '/blog',
    page_name: 'Publications & Blog',
    breadcrumb_title: 'Publications & Insights',
    fallback_image: '/assets/pigl_field_team_swamp.jpg',
    overlay_opacity: 0.35
  },
  contact: {
    id: 'contact',
    page_slug: '/contact',
    page_name: 'Contact Us',
    breadcrumb_title: 'Contact Engineering Desk',
    fallback_image: '/assets/operations/pigl_logistics_base_aerial.jpg',
    overlay_opacity: 0.30
  },
  hsse: {
    id: 'hsse',
    page_slug: '/hsse',
    page_name: 'HSSE & Quality Policy',
    breadcrumb_title: 'QHSE Policy & Standards',
    fallback_image: '/assets/IMG_6170.jpg',
    overlay_opacity: 0.30
  },
  videos: {
    id: 'videos',
    page_slug: '/videos',
    page_name: 'Corporate Video Hub',
    breadcrumb_title: 'Corporate Video Hub',
    fallback_image: '/assets/operations/pigl_marine_crew_vessel.jpg',
    overlay_opacity: 0.30
  },
  vendors: {
    id: 'vendors',
    page_slug: '/vendors',
    page_name: 'Vendor Onboarding Desk',
    breadcrumb_title: 'Vendor Hub',
    fallback_image: '/assets/operations/pigl_geomatics_survey_quay.jpg',
    overlay_opacity: 0.30
  },
  'vendor-registration': {
    id: 'vendor-registration',
    page_slug: '/vendors/registration',
    page_name: 'Vendor Registration Dossier',
    breadcrumb_title: 'Vendor Registration',
    fallback_image: '/assets/operations/pigl_geomatics_survey_quay.jpg',
    overlay_opacity: 0.30
  },
  'services-ges': {
    id: 'services-ges',
    page_slug: '/services/geosolutions-engineering-services',
    page_name: 'GeoSolutions & Engineering Services',
    breadcrumb_title: 'GeoSolutions & Engineering',
    fallback_image: '/assets/cpt.png',
    overlay_opacity: 0.35
  },
  'services-mms': {
    id: 'services-mms',
    page_slug: '/services/metocean-marine-solutions',
    page_name: 'Metocean & Marine Solutions',
    breadcrumb_title: 'Metocean & Marine Solutions',
    fallback_image: '/assets/marine_intel_metocean.jpg',
    overlay_opacity: 0.35
  },
  'services-ics': {
    id: 'services-ics',
    page_slug: '/services/integrated-construction-services',
    page_name: 'Integrated Construction Services',
    breadcrumb_title: 'Integrated Construction',
    fallback_image: '/assets/newpipeline.png',
    overlay_opacity: 0.35
  },
  'services-iet': {
    id: 'services-iet',
    page_slug: '/services/industrial-solutions',
    page_name: 'Industrial & Environmental Technologies',
    breadcrumb_title: 'Industrial Technologies',
    fallback_image: '/assets/water_treatment_skid.png',
    overlay_opacity: 0.35
  }
};

export const DEFAULT_TOP_HEADER: HeaderBackgroundSettings = {
  top_header_bg_image: '',
  top_header_overlay_opacity: 0.30,
  top_header_active: false
};

const STORAGE_PATH = 'config/page_headers.json';
let memoryHeadersCache: SiteHeadersData | null = null;

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://jbldpfvceacfonkzzhig.supabase.co';
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpibGRwZnZjZWFjZm9ua3p6aGlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MzcwNDQzOSwiZXhwIjoyMTA5MjgwNDM5fQ.-QdwJyGzzER_sLPqPCNIm3nSMYeJ1hHRCkBcFIN_NPk';

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // GET: Retrieve all page headers and top header background configuration
  if (req.method === 'GET') {
    const forceReload = req.query?.nocache === '1';
    if (memoryHeadersCache && !forceReload) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, headers: memoryHeadersCache });
    }

    try {
      const { data, error } = await supabase.storage.from('media').download(STORAGE_PATH);
      if (error) {
        const initialData: SiteHeadersData = {
          pages: DEFAULT_PAGE_HEADERS,
          top_header: DEFAULT_TOP_HEADER,
          updated_at: new Date().toISOString()
        };
        await supabase.storage.from('media').upload(STORAGE_PATH, JSON.stringify(initialData, null, 2), {
          contentType: 'application/json',
          upsert: true
        });
        memoryHeadersCache = initialData;
        return res.status(200).json({ success: true, headers: initialData });
      }

      const text = await data.text();
      const parsed: SiteHeadersData = JSON.parse(text);

      // Merge with default page keys to guarantee any newly defined route exists
      const mergedPages: Record<string, PageHeaderConfig> = { ...DEFAULT_PAGE_HEADERS };
      if (parsed.pages && typeof parsed.pages === 'object') {
        for (const [key, val] of Object.entries(parsed.pages)) {
          mergedPages[key] = {
            ...(mergedPages[key] || {}),
            ...val
          };
        }
      }

      const mergedData: SiteHeadersData = {
        pages: mergedPages,
        top_header: parsed.top_header || DEFAULT_TOP_HEADER,
        updated_at: parsed.updated_at || new Date().toISOString()
      };

      memoryHeadersCache = mergedData;
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      return res.status(200).json({ success: true, headers: mergedData });
    } catch (err: any) {
      console.warn('page-headers download error, fallback to baseline:', err);
      const fallbackData = { pages: DEFAULT_PAGE_HEADERS, top_header: DEFAULT_TOP_HEADER };
      return res.status(200).json({
        success: true,
        headers: fallbackData,
        warning: err.message
      });
    }
  }

  // POST: Update, Replace, Remove or Reset page breadcrumb / top header background
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { action = 'save_page', pageId, pageConfig, topHeader, adminEmail = 'admin@polarisigl.com' } = body;

      // 1. Fetch current data (from memory cache or storage)
      let currentData: SiteHeadersData = memoryHeadersCache
        ? {
            pages: { ...DEFAULT_PAGE_HEADERS, ...memoryHeadersCache.pages },
            top_header: { ...DEFAULT_TOP_HEADER, ...memoryHeadersCache.top_header }
          }
        : {
            pages: { ...DEFAULT_PAGE_HEADERS },
            top_header: { ...DEFAULT_TOP_HEADER }
          };

      if (!memoryHeadersCache) {
        try {
          const { data } = await supabase.storage.from('media').download(STORAGE_PATH);
          if (data) {
            const text = await data.text();
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed.pages === 'object') {
              currentData = {
                pages: { ...DEFAULT_PAGE_HEADERS, ...parsed.pages },
                top_header: parsed.top_header || DEFAULT_TOP_HEADER
              };
            }
          }
        } catch (e) {
          // use default
        }
      }

      let auditDescription = '';

      // 2. Process Action
      if (action === 'save_page') {
        if (!pageId) {
          return res.status(400).json({ success: false, error: 'pageId is required.' });
        }
        const existing = currentData.pages[pageId] || DEFAULT_PAGE_HEADERS[pageId] || {
          id: pageId,
          page_slug: `/${pageId}`,
          page_name: pageId
        };

        const updatedPage: PageHeaderConfig = {
          ...existing,
          ...pageConfig,
          id: pageId,
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };

        currentData.pages[pageId] = updatedPage;
        auditDescription = `Updated breadcrumb background for page "${updatedPage.page_name}" (${updatedPage.page_slug})`;
      } else if (action === 'remove_page_image') {
        if (!pageId) {
          return res.status(400).json({ success: false, error: 'pageId is required.' });
        }
        const existing = currentData.pages[pageId];
        if (existing) {
          const previousImg = existing.breadcrumb_image;
          existing.breadcrumb_image = '';
          existing.header_bg_image = '';
          existing.updated_at = new Date().toISOString();
          existing.updated_by = adminEmail;
          currentData.pages[pageId] = existing;
          auditDescription = `Removed breadcrumb background for page "${existing.page_name}"`;

          // If previousImg is stored in Supabase storage and was custom, optionally clean up
          if (previousImg && previousImg.includes('/storage/v1/object/public/media/headers/')) {
            try {
              const storagePath = previousImg.split('/media/')[1];
              if (storagePath) {
                await supabase.storage.from('media').remove([storagePath]);
              }
            } catch {}
          }
        }
      } else if (action === 'save_top_header') {
        currentData.top_header = {
          ...currentData.top_header,
          ...topHeader,
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };
        auditDescription = `Updated main website top header background image`;
      } else if (action === 'remove_top_header') {
        const previousImg = currentData.top_header?.top_header_bg_image;
        currentData.top_header = {
          top_header_bg_image: '',
          top_header_overlay_opacity: 0.30,
          top_header_active: false,
          updated_at: new Date().toISOString(),
          updated_by: adminEmail
        };
        auditDescription = `Removed main website top header background image`;

        if (previousImg && previousImg.includes('/storage/v1/object/public/media/headers/')) {
          try {
            const storagePath = previousImg.split('/media/')[1];
            if (storagePath) {
              await supabase.storage.from('media').remove([storagePath]);
            }
          } catch {}
        }
      } else if (action === 'reset') {
        currentData = {
          pages: { ...DEFAULT_PAGE_HEADERS },
          top_header: { ...DEFAULT_TOP_HEADER },
          updated_at: new Date().toISOString()
        };
        auditDescription = 'Reset all page breadcrumbs and top header backgrounds to baseline defaults';
      }

      currentData.updated_at = new Date().toISOString();

      // 3. Persist to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('media').upload(
        STORAGE_PATH,
        JSON.stringify(currentData, null, 2),
        { contentType: 'application/json', upsert: true }
      );

      if (uploadError) {
        console.warn('Storage save warning:', uploadError.message);
      }

      // 4. Log Action in audit_logs table
      try {
        await supabase.from('audit_logs').insert([
          {
            action: auditDescription,
            entity_type: 'navigation',
            entity_id: pageId || 'top-header',
            details: { action, pageId, adminEmail },
            user_email: adminEmail,
            created_at: new Date().toISOString()
          }
        ]);
      } catch (auditErr) {
        console.warn('Audit log write notice:', auditErr);
      }

      memoryHeadersCache = currentData;

      return res.status(200).json({
        success: true,
        message: 'Page header & breadcrumb configuration updated successfully.',
        headers: currentData
      });
    } catch (err: any) {
      console.error('API /api/page-headers error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Internal server error' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}
