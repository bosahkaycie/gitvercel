import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import News from './pages/News';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import HSSE from './pages/HSSE';
import Partners from './pages/Partners';
import VendorHub from './pages/VendorHub';
import Videos from './pages/Videos';
import AdminLayout from './pages/admin/AdminLayout';
import { SERVICES, PROJECTS, LEGACY_SERVICE_MAP } from './site_data';

import AIChatbot from './components/AIChatbot';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import SearchOverlay from './components/SearchOverlay';
import MaintenanceUpdateScreen from './components/MaintenanceUpdateScreen';
import { trackPageView, useSiteSettings } from './hooks/useSupabaseData';

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
      window.scrollTo(0, 0);
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
      '/': 'Polaris Integrated and GeoSolutions Limited (PIGL) - Indigenous Nigerian engineering and geosolutions leader providing intelligence, asset integrity, and field execution for the energy sector across Sub-Saharan Africa.',
      '/about': 'Discover PIGL\'s 20-year heritage of engineering excellence, ISO 9001:2015 & 45001:2018 certifications, and 100% indigenous Nigerian ownership.',
      '/services': 'Explore PIGL\'s 9 core capabilities across Intelligence (Digital, Marine, Ground, Spatial) and Solutions & Engineering (Asset Integrity, Infrastructure, Field Operations, Water & Environment, Procurement).',
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
      '/': 'PIGL | Engineering, Geosolutions & Asset Integrity | Nigeria',
      '/about': 'About PIGL | ISO Certified Indigenous Engineering Leader',
      '/services': 'Intelligence, Solutions & Engineering Services | PIGL',
      '/partners': 'Partners & Technology | Strategic Alliances | PIGL',
      '/projects': 'Engineering Case Studies & Executed Projects | PIGL',
      '/careers': 'Careers at PIGL | Indigenous Engineering Talent',
      '/news': 'News & Technical Insights | PIGL Nigeria',
      '/blog': 'Engineering News & Technical Insights | PIGL Nigeria',
      '/hsse': 'HSSEQ Standards & ISO Certifications | PIGL Safety',
      '/contact': 'Contact PIGL | Technical Consultations & Project Scoping',
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
        activeTitle = `${service.title} | PIGL Specialist Engineering`;
        activeDesc = `${service.tagline} - ${service.description}`;
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
          "category": service.division === 'Intelligence' ? 'Intelligence & Geosolutions' : 'Solutions & Engineering',
          "offers": {
            "@type": "Offer",
            "description": "High-fidelity B2B engineering and geosolutions consultations"
          }
        };
      }
    } else if (currentPath === '/services') {
      schemaData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "PIGL Intelligence, Solutions & Engineering Services",
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
    return <AdminLayout />;
  }

  // Handle Administrative Maintenance / Update Mode Switch
  // Admins can bypass by appending ?bypass=true or ?preview=true
  const isBypassActive = typeof window !== 'undefined' && (
    window.location.search.includes('bypass=true') ||
    window.location.search.includes('preview=true')
  );

  if (settings?.maintenance_mode && !isBypassActive) {
    return <MaintenanceUpdateScreen settings={settings} />;
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
        {renderPage()}
      </main>
      {currentPath !== '/vendors/portal' && <Footer />}
      <WhatsAppButton />
      <ScrollToTop />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default App;
