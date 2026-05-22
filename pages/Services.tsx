import React, { useState, useEffect } from 'react';
import { SERVICES } from '../site_data';
import ServiceBg from '../assets/newpipeline.png';

type TabType = 'all' | 'geosolutions' | 'integrated';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Handle on-mount parsing of query parameters/hash
  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    const params = new URLSearchParams(hashParts[1] || '');
    const id = params.get('id');
    const tabParam = params.get('tab');
    
    if (tabParam === 'geosolutions' || tabParam === 'integrated' || tabParam === 'all') {
      setActiveTab(tabParam as TabType);
    } else if (id) {
      // Find the service to auto-select the correct tab so it renders
      const service = SERVICES.find(s => s.id === id);
      if (service) {
        if (service.category === 'Geosolutions') {
          setActiveTab('geosolutions');
        } else if (service.category === 'Integrated') {
          setActiveTab('integrated');
        }
      }
    }
  }, []);

  // Handle smooth scroll when an ID is active on the current tab
  useEffect(() => {
    const hashParts = window.location.hash.split('?');
    const params = new URLSearchParams(hashParts[1] || '');
    const id = params.get('id');
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - 100,
            behavior: 'smooth'
          });
        }, 150);
      }
    }
  }, [activeTab]);

  // Set up intersection observer for entrance reveals
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    // Dynamic node observation on activeTab updates
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [activeTab]);

  // Filter service items
  const filteredServices = SERVICES.filter(s => {
    if (activeTab === 'geosolutions') return s.category === 'Geosolutions';
    if (activeTab === 'integrated') return s.category === 'Integrated';
    return true;
  });

  // Get count for each tab
  const allCount = SERVICES.length;
  const geoCount = SERVICES.filter(s => s.category === 'Geosolutions').length;
  const integratedCount = SERVICES.filter(s => s.category === 'Integrated').length;

  // Dynamic header information based on active tab
  const getHeaderContent = () => {
    switch (activeTab) {
      case 'geosolutions':
        return {
          division: 'Division One',
          title: 'Geosolution Services',
          description: 'High-fidelity sub-surface characterization, marine geophysics, and advanced geotechnical studies designed to unlock deep insights for complex operations.'
        };
      case 'integrated':
        return {
          division: 'Division Two',
          title: 'Integrated Services',
          description: 'Indigenous pipeline construction, facility support, advanced 3D reality capture, and high-stakes civil works driving operational excellence.'
        };
      case 'all':
      default:
        return {
          division: 'Comprehensive Portfolio',
          title: 'All Engineering Divisions',
          description: 'Polaris Integrated & Geosolutions Limited (PIGL) delivers comprehensive specialized engineering services across two major divisions: Geosolutions and Integrated Services. From high-fidelity sub-surface characterization to precision pipeline construction, our solutions ensure structural assurance and operational success.'
        };
    }
  };

  const headerContent = getHeaderContent();

  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ServiceBg} 
            alt="Advanced Geosolutions" 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Services</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8 animate-fade-in-up">
              Advanced Geosolutions
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed animate-fade-in-up delay-100">
              Integrated precision engineering services for the future of Energy & Infrastructure. We deliver high-fidelity data and technical assurance for complex operations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Tab Panel and Grid */}
      <section className="py-16 md:py-24 bg-white min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Smart Sorting Segmented Controller Bar */}
          <div className="flex justify-center mb-16">
            <div className="bg-slate-100/90 backdrop-blur-md p-1.5 rounded-full inline-flex border border-slate-200/50 shadow-inner">
              <button 
                onClick={() => setActiveTab('all')}
                className={`flex items-center space-x-2 rounded-full font-bold px-5 py-2.5 text-xs md:text-sm tracking-wider uppercase transition-all duration-300 transform active:scale-95 ${
                  activeTab === 'all' 
                    ? 'bg-emerald-950 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <span>All Divisions</span>
                <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] h-[18px] transition-colors duration-300 ${
                  activeTab === 'all' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {allCount}
                </span>
              </button>
              
              <button 
                onClick={() => setActiveTab('geosolutions')}
                className={`flex items-center space-x-2 rounded-full font-bold px-5 py-2.5 text-xs md:text-sm tracking-wider uppercase transition-all duration-300 transform active:scale-95 ${
                  activeTab === 'geosolutions' 
                    ? 'bg-emerald-950 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <span>Geo-Solutions</span>
                <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] h-[18px] transition-colors duration-300 ${
                  activeTab === 'geosolutions' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {geoCount}
                </span>
              </button>
              
              <button 
                onClick={() => setActiveTab('integrated')}
                className={`flex items-center space-x-2 rounded-full font-bold px-5 py-2.5 text-xs md:text-sm tracking-wider uppercase transition-all duration-300 transform active:scale-95 ${
                  activeTab === 'integrated' 
                    ? 'bg-emerald-950 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200/50'
                }`}
              >
                <span>Integrated</span>
                <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] h-[18px] transition-colors duration-300 ${
                  activeTab === 'integrated' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-600'
                }`}>
                  {integratedCount}
                </span>
              </button>
            </div>
          </div>

          {/* Dynamic Category Header Block */}
          <div className="max-w-3xl mb-16 border-l-4 border-emerald-700 pl-6 animate-fade-in" key={`header-${activeTab}`}>
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] block mb-2">
              {headerContent.division}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4 transition-all duration-300">
              {headerContent.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-normal transition-all duration-300">
              {headerContent.description}
            </p>
          </div>
          
          {/* 3-Column Services Responsive Grid */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 animate-fade-in" 
            key={`grid-${activeTab}`}
          >
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                id={service.id} 
                className="flex flex-col border border-slate-200 bg-slate-50 hover:shadow-xl transition-shadow p-6 md:p-8 hover-lift"
              >
                {/* Clickable Image Container */}
                <a 
                  href={`#/services/detail?id=${service.id}`} 
                  className="block relative h-48 md:h-[240px] bg-slate-200 mb-6 overflow-hidden group"
                >
                  <img
                    src={service.image}
                    alt={`${service.title} - Specialist Engineering by PIGL`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
                
                {/* Category Badge shown only when viewing all divisions */}
                {activeTab === 'all' && (
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 mb-4 rounded-none border border-emerald-250 self-start">
                    {service.category === 'Geosolutions' ? 'Geo-Solutions' : 'Integrated'}
                  </span>
                )}

                {/* Service Title */}
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  <a href={`#/services/detail?id=${service.id}`} className="hover:text-emerald-700 transition-colors">
                    {service.title}
                  </a>
                </h3>

                {/* Service Description (Line-clamped for grid consistency) */}
                <p className="text-sm md:text-base text-slate-600 font-normal leading-relaxed mb-6 flex-grow line-clamp-4">
                  {service.description}
                </p>

                {/* Clickable Action Link */}
                <div className="pt-2 border-t border-slate-200/50 mt-auto">
                  <a 
                    href={`#/services/detail?id=${service.id}`} 
                    className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-950 text-sm tracking-wider uppercase transition-colors group"
                  >
                    Explore Service Details <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Generalized Technical Standard Section */}
      <section className="bg-slate-50 py-20 md:py-32 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">World Class Service Framework</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Operational Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start hover-lift">
              <div className="text-4xl mb-6">🛰️</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Precision Capture</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Advanced 3D Laser Scanning, Digital Twins, and high-fidelity Reality Capture workflows.</p>
            </div>
            
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start hover-lift">
              <div className="text-4xl mb-6">🧪</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Geo-Analysis</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Comprehensive soil analysis, laboratory testing, and chemical characterization of site strata.</p>
            </div>
            
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start hover-lift">
              <div className="text-4xl mb-6">⚓</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Marine Operations</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Bathymetric surveying systems and precise offshore positioning for specialized nautical projects.</p>
            </div>
          </div>

          <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-950 p-12 text-white">
            <div>
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Technical Engagement</p>
              <p className="text-3xl font-bold tracking-tight">Ready to optimize your site operations?</p>
            </div>
            <a href="#/contact" className="inline-flex items-center px-8 py-4 bg-white text-emerald-950 font-bold hover:bg-emerald-500 hover:text-white transition-colors">
              Consult with Us <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
