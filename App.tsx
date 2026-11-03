import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SERVICES, PROJECTS, LEGACY_SERVICE_MAP } from './site_data';

import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import { trackPageView, useSiteSettings } from './hooks/useSupabaseData';

// Resilient dynamic import wrapper that handles stale chunk 404s after new deployments
function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(async () => {
    try {
      return await factory();
    } catch (error: any) {
      console.warn('Chunk loading failed, attempting automatic reload:', error);
      const reloadKey = 'pigl_chunk_retry_' + (typeof window !== 'undefined' ? window.location.pathname : '');
      const alreadyRetried = typeof window !== 'undefined' && window.sessionStorage.getItem(reloadKey);
      if (!alreadyRetried && typeof window !== 'undefined') {
        window.sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
      throw error;
    }
  });
}

// Route-based code splitting for GTmetrix Grade A performance and ultra-fast initial load
const Home = lazyWithRetry(() => import('./pages/Home'));
const About = lazyWithRetry(() => import('./pages/About'));
const Services = lazyWithRetry(() => import('./pages/Services'));
const ServiceDetail = lazyWithRetry(() => import('./pages/ServiceDetail'));
const Projects = lazyWithRetry(() => import('./pages/Projects'));
const Teams = lazyWithRetry(() => import('./pages/Teams'));
const Network = lazyWithRetry(() => import('./pages/Network'));
const Contact = lazyWithRetry(() => import('./pages/Contact'));
const Careers = lazyWithRetry(() => import('./pages/Careers'));
const News = lazyWithRetry(() => import('./pages/News'));
const Blog = lazyWithRetry(() => import('./pages/Blog'));
const BlogPost = lazyWithRetry(() => import('./pages/BlogPost'));
const HSSE = lazyWithRetry(() => import('./pages/HSSE'));
const Partners = lazyWithRetry(() => import('./pages/Partners'));
const VendorHub = lazyWithRetry(() => import('./pages/VendorHub'));
const Videos = lazyWithRetry(() => import('./pages/Videos'));
const AdminLayout = lazyWithRetry(() => import('./pages/admin/AdminLayout'));
const SearchOverlay = lazyWithRetry(() => import('./components/SearchOverlay'));
const MaintenanceUpdateScreen = lazyWithRetry(() => import('./components/MaintenanceUpdateScreen'));

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('loading chunk');

    if (isChunkError && typeof window !== 'undefined') {
      const reloadKey = 'pigl_eb_retry_' + window.location.pathname;
      if (!window.sessionStorage.getItem(reloadKey)) {
        window.sessionStorage.setItem(reloadKey, 'true');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-slate-900 border border-slate-800 p-8 rounded-lg shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4 text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Updating Engineering Portal</h2>
            <p className="text-sm text-slate-400 mb-6">
              A new version of the website has been deployed. Please reload to display the updated content.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.sessionStorage.clear();
                    window.location.reload();
                  }
                }}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
              >
                Reload Page
              </button>
              <a
                href="/"
                className="px-6 py-2.5 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                Return Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const normalizePath = (rawPath?: string): string => {
  if (!rawPath) return '/';
  let path = rawPath.split('?')[0].split('#')[0];
  if (path.length > 1 && path.endsWith('/')) {
    path = path.replace(/\/+$/, '');
  }
  return path || '/';
};

const PageFallback: React.FC = () => (
  <div className="min-h-screen w-full flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Loading Polaris Portal...</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const { settings } = useSiteSettings();
  const [currentPath, setCurrentPath] = useState(() => normalizePath(typeof window !== 'undefined' ? window.location.pathname : '/'));
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      let path = normalizePath(window.location.pathname);
      if (path === '/our-network') {
        window.history.replaceState({}, '', '/network');
        path = '/network';
      } else if (path.startsWith('/services/')) {
        const legacyId = path.split('/services/')[1];
        if (LEGACY_SERVICE_MAP[legacyId]) {
          const newPath = `/services/${LEGACY_SERVICE_MAP[legacyId]}`;
          window.history.replaceState({}, '', newPath);
          path = newPath;
        }
      } else if (path.startsWith('/solutions/')) {
        const solutionId = path.split('/solutions/')[1];
        if (LEGACY_SERVICE_MAP[solutionId]) {
          const newPath = `/services/${LEGACY_SERVICE_MAP[solutionId]}`;
          window.history.replaceState({}, '', newPath);
          path = newPath;
        }
      } else if (path.startsWith('/technology-partners/')) {
        const partnerId = path.split('/technology-partners/')[1];
        const newPath = `/partners#${partnerId}`;
        window.history.replaceState({}, '', newPath);
        path = '/partners';
      }
      setCurrentPath(path);
      if (!window.location.hash) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate-changed', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate-changed', handleLocationChange);
    };
  }, []);

  useEffect(() => {
    // Intercept standard local links to prevent full reloads
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Intercept local paths
      if (
        href.startsWith('/') &&
        !href.startsWith('//') &&
        target.getAttribute('target') !== '_blank' &&
        !target.hasAttribute('download')
      ) {
        e.preventDefault();
        window.history.pushState({}, '', href);
        window.dispatchEvent(new Event('pushstate-changed'));
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  useEffect(() => {
    // Redirect legacy hash routing to clean path routes
    const checkHashRedirect = () => {
      if (window.location.hash) {
        let hashPath = window.location.hash.slice(1); // remove '#'

        if (hashPath === '/our-network') {
          window.history.replaceState({}, '', '/network');
          window.dispatchEvent(new Event('pushstate-changed'));
          return;
        }

        if (hashPath.startsWith('/services/detail?id=')) {
          let id = new URLSearchParams(hashPath.split('?')[1]).get('id');
          if (id) {
            if (LEGACY_SERVICE_MAP[id]) id = LEGACY_SERVICE_MAP[id];
            window.history.replaceState({}, '', `/services/${id}`);
            window.dispatchEvent(new Event('pushstate-changed'));
            return;
          }
        }
        
        if (hashPath === '') hashPath = '/';
        window.history.replaceState({}, '', hashPath);
        window.dispatchEvent(new Event('pushstate-changed'));
      }
    };

    checkHashRedirect();
    window.addEventListener('hashchange', checkHashRedirect);
    return () => window.removeEventListener('hashchange', checkHashRedirect);
  }, []);

  useEffect(() => {
    console.log("PIGL Web App Mounted Successfully with Structured Architecture");
    const statusText = document.querySelector('#diagnostic-loader p') as HTMLElement;
    if (statusText) {
      statusText.textContent = "PIGL Engineering Portal Initialized.";
      statusText.style.color = "#059669";
    }

    setTimeout(() => {
      const loader = document.getElementById('diagnostic-loader');
      if (loader) loader.remove();
    }, 800);
  }, []);

  useEffect(() => {
    const metaDescriptions: { [key: string]: string } = {
      '/': 'Polaris Integrated & GeoSolutions Limited provides geoscience and survey services, marine observation, infrastructure construction and industrial water treatment for energy, infrastructure and industrial clients in Nigeria.',
      '/about': 'Polaris Integrated & GeoSolutions Limited (PIGL) is a Nigerian engineering and technical solutions company serving the energy, infrastructure and industrial sectors.',
      '/services': 'Explore PIGL\'s four operating divisions: GeoSolutions & Engineering Services (GES), Metocean & Marine Solutions (MMS), Integrated Construction Services (ICS), and Industrial Solutions (IS).',
      '/projects': 'Review completed engineering, reality capture, geotechnical survey, and pipeline construction projects delivered for energy and infrastructure clients across Nigeria.',
      '/teams': 'Meet the executive leadership and multidisciplinary engineering teams guiding PIGL operations across West Africa.',
      '/network': 'PIGL Strategic Alliances, Authorised Representations & Global Technology Partnerships with Frankstar Technology, CoaleXpert, and NPK Automation.',
      '/our-network': 'PIGL Strategic Alliances, Authorised Representations & Global Technology Partnerships with Frankstar Technology, CoaleXpert, and NPK Automation.',
      '/partners': 'PIGL Strategic Alliances & Global Technology Partnerships with Frankstar Technology, CoaleXpert, and NPK Automation.',
      '/careers': 'Join the PIGL engineering team in Port Harcourt and across Nigeria. Grow your career with an indigenous leader in geosolutions and energy infrastructure.',
      '/news': 'Latest updates, technical milestones, and industry perspectives from Polaris Integrated and GeoSolutions Limited.',
      '/blog': 'Technical updates, project milestones, and engineering insights from Polaris Integrated and GeoSolutions Limited.',
      '/hsse': 'Health, Safety, Security, Environment & Quality (HSSEQ) at PIGL. Certified ISO 9001:2015 and ISO 45001:2018 with over 500,000+ safe man-hours and zero LTI.',
      '/contact': 'Contact Polaris Integrated & GeoSolutions Limited for project consultations, technical scoping, and field mobilisation across Nigeria.',
      '/vendors': 'Polaris Integrated & GeoSolutions Limited Vendor Onboarding & Tax Compliance Portal. Standardized registration Form PIGL/F/VOTC/AHR/037.',
      '/vendors/register': 'Digital Vendor Onboarding & Tax Compliance Form PIGL/F/VOTC/AHR/037 Rev 00 - PIGL Procurement & Finance Onboarding Wizard.',
      '/vendor-registration': 'Digital Vendor Onboarding & Tax Compliance Form PIGL/F/VOTC/AHR/037 Rev 00 - PIGL Procurement & Finance Onboarding Wizard.',
      '/vendors/portal': 'PIGL Vendor Status Tracker & Compliance Dossier Lookup. Check onboarding progress and print official verification receipts.',
      '/videos': 'Explore Polaris Integrated & GeoSolutions Limited (PIGL) official video hub, corporate documentary, 3D laser scanning field demos, 20-tonne CPT geotechnical testing, and pipeline integrity operations.',
      '/media': 'PIGL Official Media Hub, Technical Videos & Corporate Documentary Showcase.',
      '/watch': 'Watch PIGL Corporate Documentary and Engineering Demonstrations.',
      '/admin': 'PIGL Content Management System - Administrative Control Center'
    };

    const pageTitles: { [key: string]: string } = {
      '/': 'Polaris Integrated & GeoSolutions (PIGL) | Geoscience, Marine, Construction & Industrial Solutions',
      '/about': 'About PIGL | ISO Certified Engineering Contractor',
      '/services': 'Specialist Engineering Divisions | PIGL Nigeria',
      '/projects': 'Executed Engineering Projects & Case Studies | PIGL',
      '/teams': 'Leadership & Engineering Teams | PIGL Nigeria',
      '/network': 'Our Professional Network & Technology Alliances | PIGL',
      '/our-network': 'Our Professional Network & Technology Alliances | PIGL',
      '/partners': 'Technology Partners & Engineering Alliances | PIGL',
      '/careers': 'Careers at PIGL | Engineering Opportunities in Nigeria',
      '/news': 'News & Technical Insights | PIGL Nigeria',
      '/blog': 'Engineering News & Technical Insights | PIGL Nigeria',
      '/hsse': 'HSSEQ Standards & ISO Certifications | PIGL Safety',
      '/contact': 'Contact PIGL | Engineering Offices in Port Harcourt & Lagos',
      '/vendors': 'Vendor Onboarding & Compliance Portal | PIGL Nigeria',
      '/vendors/register': 'Vendor Registration Form PIGL/F/VOTC/AHR/037 | PIGL',
      '/vendor-registration': 'Vendor Registration Form PIGL/F/VOTC/AHR/037 | PIGL',
      '/vendors/portal': 'Vendor Status Tracker & Compliance Dossier | PIGL',
      '/videos': 'Operations & Engineering Video Library | PIGL Nigeria',
      '/media': 'Media Center & Technical Video Showcase | PIGL Nigeria',
      '/watch': 'Watch Corporate Documentary & Field Demos | PIGL Nigeria',
      '/admin': 'PIGL CMS Portal | Engineering Administration'
    };

    let activeTitle = pageTitles[currentPath] || 'Polaris Integrated and GeoSolutions Limited (PIGL)';
    let activeDesc = metaDescriptions[currentPath] || metaDescriptions['/'];

    if (currentPath.startsWith('/services/')) {
      let id = currentPath.split('/services/')[1];
      if (LEGACY_SERVICE_MAP[id]) id = LEGACY_SERVICE_MAP[id];
      const service = SERVICES.find(s => s.id === id);
      if (service) {
        if (id === 'geosolutions-engineering-services') {
          activeTitle = 'GeoSolutions & Engineering Services | PIGL';
          activeDesc = 'PIGL undertakes geophysical and hydrographic surveys, geotechnical investigations, positioning, geospatial data acquisition and reality capture to support engineering design and infrastructure development.';
        } else if (id === 'metocean-marine-solutions') {
          activeTitle = 'Metocean & Marine Solutions | PIGL';
          activeDesc = 'We provide marine observation, oceanographic monitoring, forecasting and environmental survey services to support offshore planning, marine operations and environmental assessment.';
        } else if (id === 'integrated-construction-services') {
          activeTitle = 'Integrated Construction Services | PIGL';
          activeDesc = 'We undertake pipeline installation, civil infrastructure, mechanical fabrication and installation, and construction support for industrial and energy projects.';
        } else if (id === 'industrial-solutions') {
          activeTitle = 'Industrial Solutions | PIGL';
          activeDesc = 'We provide produced-water treatment, industrial and domestic water systems, laboratory analysis and wastewater treatment services for industrial and environmental applications.';
        } else {
          activeTitle = `${service.title} | PIGL Specialist Engineering`;
          activeDesc = service.description;
        }
      }
    } else if (currentPath.startsWith('/blog/')) {
      activeTitle = 'Engineering Technical Publication | PIGL Insights';
    }

    document.title = activeTitle;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', activeDesc);
    }

    // Dynamic Canonical Link Update
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', `https://polarisigl.com${currentPath}`);
    }

    // Update Social Tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', activeTitle);

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', activeDesc);

    // Track Page View Telemetry
    trackPageView(currentPath);

    // Dynamic JSON-LD structured data injection
    const existingJsonLd = document.getElementById('dynamic-jsonld');
    if (existingJsonLd) existingJsonLd.remove();

    let schemaData: any = null;

    if (currentPath.startsWith('/services/')) {
      let id = currentPath.split('/services/')[1];
      if (LEGACY_SERVICE_MAP[id]) id = LEGACY_SERVICE_MAP[id];
      const service = SERVICES.find(s => s.id === id);
      if (service) {
        schemaData = {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": service.title,
          "alternateName": service.abbreviation,
          "provider": {
            "@type": "Organization",
            "name": "Polaris Integrated and GeoSolutions Limited (PIGL)",
            "url": "https://polarisigl.com/"
          },
          "description": service.description,
          "areaServed": {
            "@type": "Country",
            "name": "Nigeria"
          },
          "category": service.descriptor || "Engineering & Industrial Solutions",
          "offers": {
            "@type": "Offer",
            "description": "High-fidelity engineering, geoscience, metocean and industrial solutions"
          }
        };
      }
    } else if (currentPath === '/services') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "PIGL Four Operating Divisions",
        "itemListElement": SERVICES.map((s, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://polarisigl.com/services/${s.id}`,
          "name": s.title
        }))
      };
    } else if (currentPath === '/projects') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "PIGL Engineering Project Showcase",
        "itemListElement": PROJECTS.map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://polarisigl.com/projects?id=${p.id}`,
          "name": p.title
        }))
      };
    } else if (currentPath === '/network' || currentPath === '/our-network' || currentPath === '/partners') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "PIGL Professional Network & Technology Alliances",
        "publisher": {
          "@type": "Organization",
          "name": "Polaris Integrated and GeoSolutions Limited (PIGL)",
          "url": "https://polarisigl.com/"
        }
      };
    } else if (currentPath === '/teams') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "PIGL Leadership & Engineering Teams",
        "publisher": {
          "@type": "Organization",
          "name": "Polaris Integrated and GeoSolutions Limited (PIGL)",
          "url": "https://polarisigl.com/"
        }
      };
    } else if (currentPath === '/videos' || currentPath === '/media' || currentPath === '/watch') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": "Polaris Integrated & GeoSolutions Limited — Corporate Documentary",
        "description": "A comprehensive visual exploration of PIGL indigenous engineering heritage, ground characterisation, sub-centimeter reality capture, and high-assurance field execution across Nigerian energy corridors.",
        "thumbnailUrl": "https://img.youtube.com/vi/sExrHCIGkH0/maxresdefault.jpg",
        "uploadDate": "2026-01-01T08:00:00+01:00",
        "contentUrl": "https://www.youtube.com/watch?v=sExrHCIGkH0",
        "embedUrl": "https://www.youtube.com/embed/sExrHCIGkH0",
        "publisher": {
          "@type": "Organization",
          "name": "Polaris Integrated and GeoSolutions Limited (PIGL)",
          "url": "https://polarisigl.com/"
        }
      };
    }

    if (schemaData) {
      const script = document.createElement('script');
      script.id = 'dynamic-jsonld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schemaData);
      document.head.appendChild(script);
    }
  }, [currentPath]);

  // Handle Admin Portal View as Standalone Full App
  if (currentPath.startsWith('/admin')) {
    return (
      <Suspense fallback={<PageFallback />}>
        <AdminLayout />
      </Suspense>
    );
  }

  // Handle Administrative Maintenance / Update Mode Switch
  // Admins can bypass by appending ?bypass=true or ?preview=true
  const isBypassActive = typeof window !== 'undefined' && (
    window.location.search.includes('bypass=true') ||
    window.location.search.includes('preview=true')
  );

  if (settings?.maintenance_mode && !isBypassActive) {
    return (
      <Suspense fallback={<PageFallback />}>
        <MaintenanceUpdateScreen settings={settings} />
      </Suspense>
    );
  }

  const renderPage = () => {
    if (currentPath.startsWith('/services/')) {
      const serviceId = currentPath.split('/services/')[1];
      if (serviceId) {
        return <ServiceDetail currentPath={currentPath} />;
      }
      return <Services />;
    }
    if (currentPath.startsWith('/blog/')) {
      return <BlogPost currentPath={currentPath} />;
    }
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/teams':
        return <Teams />;
      case '/services':
        return <Services />;
      case '/network':
      case '/our-network':
      case '/partners':
        return <Network />;
      case '/projects':
        return <Projects />;
      case '/careers':
        return <Careers />;
      case '/news':
        return <News />;
      case '/blog':
        return <Blog />;
      case '/hsse':
        return <HSSE />;
      case '/contact':
        return <Contact />;
      case '/vendors':
      case '/vendors/register':
      case '/vendor-registration':
        return <VendorHub initialTab="register" />;
      case '/vendors/portal':
      case '/vendors/track':
        return <VendorHub initialTab="track" />;
      case '/videos':
      case '/media':
      case '/watch':
        return <Videos />;
      default:
        return (
          <div className="min-h-[70vh] bg-slate-950 text-white flex flex-col items-center justify-center px-4 py-24 text-center">
            <span className="text-emerald-500 font-mono text-sm uppercase tracking-widest mb-3">404 — Page Not Found</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">The requested engineering page does not exist.</h1>
            <p className="text-slate-400 max-w-lg mb-8 text-base">
              The link you followed may be outdated or the page has moved within our four operating divisions.
            </p>
            <div className="flex gap-4">
              <a href="/services" className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded transition-colors">
                Explore Services
              </a>
              <a href="/" className="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-200 font-bold text-xs uppercase tracking-wider rounded transition-colors">
                Return Home
              </a>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={currentPath} onSearchClick={() => setIsSearchOpen(true)} />
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<PageFallback />}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>
      {currentPath !== '/vendors/portal' && <Footer />}
      <WhatsAppButton />
      <ScrollToTop />
      {isSearchOpen && (
        <Suspense fallback={null}>
          <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </Suspense>
      )}
    </div>
  );
};

export default App;
