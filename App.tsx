import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SERVICES, PROJECTS, LEGACY_SERVICE_MAP } from './site_data';

import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import { trackPageView, useSiteSettings } from './hooks/useSupabaseData';

// Route-based code splitting for GTmetrix Grade A performance and ultra-fast initial load
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const ServiceDetail = React.lazy(() => import('./pages/ServiceDetail'));
const Projects = React.lazy(() => import('./pages/Projects'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Careers = React.lazy(() => import('./pages/Careers'));
const News = React.lazy(() => import('./pages/News'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const HSSE = React.lazy(() => import('./pages/HSSE'));
const Partners = React.lazy(() => import('./pages/Partners'));
const VendorHub = React.lazy(() => import('./pages/VendorHub'));
const Videos = React.lazy(() => import('./pages/Videos'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'));
const SearchOverlay = React.lazy(() => import('./components/SearchOverlay'));
const MaintenanceUpdateScreen = React.lazy(() => import('./components/MaintenanceUpdateScreen'));

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
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleLocationChange = () => {
      let path = window.location.pathname || '/';
      // Check for legacy service URLs and redirect cleanly
      if (path.startsWith('/services/')) {
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
      '/': 'Polaris Integrated and GeoSolutions Limited (PIGL) is an ISO 9001:2015 & 45001:2018 certified geotechnical company, marine geophysical survey firm, and 3D reality capture specialist near you in Nigeria. Certified 20-ton CPT rigs, deep soil drilling, seismic surveys, and digital twins.',
      '/about': 'Discover PIGL\'s 20-year heritage of engineering excellence, ISO 9001:2015 & 45001:2018 certifications, and 100% indigenous Nigerian ownership.',
      '/services': 'Explore PIGL\'s specialist engineering divisions: GeoSolutions & Geotechnical Services, Metocean & Marine Solutions, 3D Reality Capture, Integrated Construction, and Industrial Solutions.',
      '/partners': 'PIGL Strategic Alliances & Global Technology Partnerships with Frankstar Technology, CoaleXpert, and NPK Flanges & Industrial Piping.',
      '/projects': 'Case studies of major engineering, reality capture, and geosolutions projects delivered for leading operators across swamp, coastal, land, and offshore terrains.',
      '/careers': 'Join the PIGL engineering team in Port Harcourt and across Nigeria. Grow your career with an indigenous leader in geosolutions and energy infrastructure.',
      '/news': 'Latest updates, technical milestones, and industry perspectives from Polaris Integrated and GeoSolutions Limited.',
      '/blog': 'Technical updates, project milestones, and engineering insights from Polaris Integrated and GeoSolutions Limited.',
      '/hsse': 'Health, Safety, Security, Environment & Quality (HSSEQ) at PIGL. Certified ISO 9001:2015 and ISO 45001:2018 with over 500,000+ safe man-hours and zero LTI.',
      '/contact': 'Connect with PIGL engineering desks in Port Harcourt, Lagos, and Abuja for project scoping, technical consultations, and field deployments.',
      '/vendors': 'Polaris Integrated & GeoSolutions Limited Vendor Onboarding & Tax Compliance Portal. Standardized registration Form PIGL/F/VOTC/AHR/037.',
      '/vendors/register': 'Digital Vendor Onboarding & Tax Compliance Form PIGL/F/VOTC/AHR/037 Rev 00 - PIGL Procurement & Finance Onboarding Wizard.',
      '/vendor-registration': 'Digital Vendor Onboarding & Tax Compliance Form PIGL/F/VOTC/AHR/037 Rev 00 - PIGL Procurement & Finance Onboarding Wizard.',
      '/vendors/portal': 'PIGL Vendor Status Tracker & Compliance Dossier Lookup. Check onboarding progress and print official verification receipts.',
      '/videos': 'Explore Polaris Integrated & GeoSolutions Limited (PIGL) official video hub, corporate documentary, 3D laser scanning field demos, 20-ton CPT geotechnical testing, and pipeline integrity operations.',
      '/media': 'PIGL Official Media Hub, Technical Videos & Corporate Documentary Showcase.',
      '/watch': 'Watch PIGL Corporate Documentary and Engineering Demonstrations.',
      '/admin': 'PIGL Content Management System - Administrative Control Center'
    };

    const pageTitles: { [key: string]: string } = {
      '/': 'PIGL | Geoscience, Marine, Engineering & Industrial Solutions in Nigeria',
      '/about': 'About PIGL | ISO Certified Indigenous Engineering Leader',
      '/services': 'Engineering Services & Specialist Divisions | PIGL Nigeria',
      '/partners': 'Strategic Alliances & Technology Partners | PIGL',
      '/projects': 'Engineering Case Studies & Executed Projects | PIGL',
      '/careers': 'Careers at PIGL | Indigenous Engineering Talent',
      '/news': 'News & Technical Insights | PIGL Nigeria',
      '/blog': 'Engineering News & Technical Insights | PIGL Nigeria',
      '/hsse': 'HSSEQ Standards & ISO Certifications | PIGL Safety',
      '/contact': 'Contact PIGL | Geotechnical & Engineering Consultations',
      '/vendors': 'Vendor Onboarding & Tax Compliance Portal | PIGL Nigeria',
      '/vendors/register': 'Vendor Registration Form PIGL/F/VOTC/AHR/037 | PIGL',
      '/vendor-registration': 'Vendor Registration Form PIGL/F/VOTC/AHR/037 | PIGL',
      '/vendors/portal': 'Vendor Status Tracker & Compliance Dossier | PIGL',
      '/videos': 'Official Video Hub & Corporate Documentary | PIGL Nigeria',
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
          activeTitle = 'GeoSolutions & Engineering Services in Nigeria | PIGL';
          activeDesc = 'Certified geotechnical investigations, 20-ton hydraulic CPT testing, deep borehole drilling, marine geophysical surveys, bathymetry, Leica RTC360 3D reality capture, and digital twins across Nigeria.';
        } else if (id === 'metocean-marine-solutions') {
          activeTitle = 'Metocean & Marine Solutions in Nigeria | PIGL';
          activeDesc = 'Autonomous oceanographic buoy telemetry, marine environmental monitoring, ADCP Doppler current profiling, MetOcean forecasting, and marine operational advisory across the Gulf of Guinea.';
        } else if (id === 'integrated-construction-services') {
          activeTitle = 'Pipeline, Civil & Integrated Construction Services | PIGL';
          activeDesc = 'Comprehensive energy infrastructure delivery: pipeline construction, horizontal directional drilling (HDD), mechanical spool fabrication, industrial civil infrastructure, and piling.';
        } else if (id === 'industrial-solutions') {
          activeTitle = 'Produced Water, Industrial Water & Wastewater Treatment | PIGL';
          activeDesc = 'Advanced produced water treatment skids, industrial wastewater recovery, water quality laboratory analysis, environmental engineering, and specialty industrial procurement.';
        } else {
          activeTitle = `${service.title} (${service.abbreviation}) | Geotechnical & Engineering | PIGL`;
          activeDesc = `${service.positioning ? `"${service.positioning}" — ` : ''}${service.description}`;
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
    } else if (currentPath === '/partners') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "PIGL Strategic Partners & Technology Alliances",
        "publisher": {
          "@type": "Organization",
          "name": "Polaris Integrated and GeoSolutions Limited (PIGL)",
          "url": "https://polarisigl.com/"
        }
      };
    } else if (currentPath === '/projects') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "PIGL Engineering Project Showcase",
        "itemListElement": PROJECTS.map((p, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `https://polarisigl.com/projects`,
          "name": p.title
        }))
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
      return <ServiceDetail currentPath={currentPath} />;
    }
    if (currentPath.startsWith('/blog/')) {
      return <BlogPost currentPath={currentPath} />;
    }
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/about':
        return <About />;
      case '/services':
        return <Services />;
      case '/partners':
        return <Partners />;
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
        return <VendorHub initialTab="register" />;
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
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={currentPath} onSearchClick={() => setIsSearchOpen(true)} />
      <main className="flex-grow">
        <Suspense fallback={<PageFallback />}>
          {renderPage()}
        </Suspense>
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
