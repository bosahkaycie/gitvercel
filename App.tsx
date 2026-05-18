
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import News from './pages/News';
import HSSE from './pages/HSSE';

import AIChatbot from './components/AIChatbot';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppButton from './components/WhatsAppButton';
import SearchOverlay from './components/SearchOverlay';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const path = window.location.hash.split('?')[0] || '#/';
      setCurrentPath(path);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Emergency Diagnostic: Signal that React logic is actually running
    console.log("React App Mounted Successfully");
    const statusText = document.querySelector('#diagnostic-loader p') as HTMLElement;
    if (statusText) {
      statusText.textContent = "React Initialized. Finalizing Layout...";
      statusText.style.color = "#059669";
    }

    // Auto-remove loader after a short delay to ensure Tailwind has processed
    setTimeout(() => {
      const loader = document.getElementById('diagnostic-loader');
      if (loader) loader.remove();
    }, 1000);
  }, []);

  useEffect(() => {
    // Emergency Diagnostic: Signal that React logic is actually running
    const statusText = document.querySelector('#diagnostic-loader p');
    if (statusText) statusText.textContent = "React Initialized. Finalizing Layout...";
  }, []);

  useEffect(() => {
    const metaDescriptions: { [key: string]: string } = {
      '#/': 'Polaris Integrated and GeoSolutions Limited (PIGL) - Leading provider of 3D Reality Capture & Laser Scanning, Digital Twins, and Geosolutions for the energy industry in Sub-Saharan Africa.',
      '#/about': 'Learn about PIGL\'s 20-year heritage of technical excellence, ISO certification, and commitment to HSE and local content in Nigeria.',
      '#/services': 'Explore our specialized engineering solutions including 3D Laser Scanning, Marine Survey, Pipeline Integrity, and Civil Infrastructure works.',
      '#/projects': 'Case studies of major engineering and geosolutions projects executed for global energy leaders like Chevron, TotalEnergies, and Aradel.',
      '#/careers': 'Join the PIGL team. We seek exceptional indigenous talent in engineering, reality capture, and geosolutions to power Africa\'s energy future.',
      '#/news': 'Latest developments, press releases, and insights from Polaris Integrated and GeoSolutions Limited. Stay updated on our 20-year journey of technical excellence.',
      '#/hsse': 'Our commitment to Health, Safety, Security, Environment, and Quality excellence in every operation.',
      '#/contact': 'Get in touch with PIGL experts for high-fidelity engineering consultations and project quotes in Port Harcourt and across Nigeria.'
    };

    const pageTitles: { [key: string]: string } = {
      '#/': 'PIGL | Leading Engineering & Geosolutions in Sub-Saharan Africa',
      '#/about': 'About PIGL | 20 Years of Technical Excellence & ISO Standards',
      '#/services': 'Engineering Services | 3D Reality Capture & Laser Scanning & Geosolutions',
      '#/projects': 'Project Showcase | Successful Engineering Case Studies',
      '#/careers': 'Careers at PIGL | Empowering Indigenous Technical Talent',
      '#/news': 'News & Insights | PIGL Latest Developments & Heritage',
      '#/hsse': 'HSSE & Quality | PIGL',
      '#/contact': 'Contact PIGL | Expert Engineering Consultations Nigeria'
    };

    document.title = pageTitles[currentPath] || 'Polaris Integrated and Geosolutions Ltd (PIGL)';

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaDescriptions[currentPath] || metaDescriptions['#/']);
    }

    // Update Social Tags too for a beautiful, unique sharing experience
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', document.title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', metaDescriptions[currentPath] || metaDescriptions['#/']);

    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', document.title);

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', metaDescriptions[currentPath] || metaDescriptions['#/']);
  }, [currentPath]);

  const renderPage = () => {
    switch (currentPath) {
      case '#/':
        return <Home />;
      case '#/about':
        return <About />;
      case '#/services':
        return <Services />;
      case '#/projects':
        return <Projects />;
      case '#/careers':
        return <Careers />;
      case '#/news':
        return <News />;
      case '#/hsse':
        return <HSSE />;
      case '#/contact':
        return <Contact />;
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
      <Footer />
      <WhatsAppButton />
      <ScrollToTop />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
};

export default App;
