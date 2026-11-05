import React, { Component, useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SERVICES, PROJECTS, LEGACY_SERVICE_MAP } from './site_data';

import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import { trackPageView, useSiteSettings } from './hooks/useSupabaseData';
import { applySEO } from './utils/seo';
import { getSEOForPath } from './utils/seoConfig';

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
const CSR = lazyWithRetry(() => import('./pages/CSR'));
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

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
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
    // 1. Resolve SEO configuration for active route
    const seoRecord = getSEOForPath(currentPath);
    let serviceSchema: any = undefined;

    if (currentPath.startsWith('/services/')) {
      let id = currentPath.split('/services/')[1];
      if (LEGACY_SERVICE_MAP[id]) id = LEGACY_SERVICE_MAP[id];
      const service = SERVICES.find(s => s.id === id);
      if (service) {
        serviceSchema = {
          name: service.title,
          description: service.description,
          serviceType: service.descriptor || service.title,
          divisionName: service.title,
          divisionSlug: service.slug,
          capabilities: seoRecord.capabilities || []
        };
      }
    }

    // 2. Apply complete SEO metadata, OpenGraph, Twitter, and Schema.org Graph
    applySEO({
      title: seoRecord.title,
      description: seoRecord.description,
      canonicalUrl: `https://polarisigl.com${currentPath === '/' ? '/' : currentPath}`,
      keywords: seoRecord.keywords,
      breadcrumbs: seoRecord.breadcrumbs,
      serviceSchema,
      noIndex: currentPath.startsWith('/admin')
    });

    // 3. Track Page View Telemetry
    trackPageView(currentPath);
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
  // Dedicated preview trigger for administrators (from Admin Settings "Preview Screen" button or /maintenance route)
  const isMaintenancePreview = typeof window !== 'undefined' && (
    window.location.search.includes('preview_maintenance=true') ||
    window.location.search.includes('maintenance_preview=true') ||
    window.location.search.includes('preview=maintenance') ||
    currentPath === '/maintenance'
  );

  // Admin bypass to view live public site while maintenance mode is ON
  const isBypassActive = typeof window !== 'undefined' && (
    window.location.search.includes('bypass=true') ||
    window.location.search.includes('admin_bypass=true')
  );

  if ((settings?.maintenance_mode && !isBypassActive) || isMaintenancePreview) {
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
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', '/services');
        }
        return <Services />;
      case '/careers':
        return <Careers />;
      case '/news':
        return <News />;
      case '/blog':
        return <Blog />;
      case '/hsse':
        return <HSSE />;
      case '/csr':
        return <CSR />;
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
