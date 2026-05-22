import React, { useState, useEffect } from 'react';
import LogoDarkImg from '../assets/LOGO.png';
import LogoLightImg from '../assets/logo_light.png';
import BootsImg from '../assets/IMG_6170.jpg';
import { SERVICES, PROJECTS, CONTACT_CONFIG } from '../site_data';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';
import ProfileCoverImg from '../assets/PIGL COMPANY PROFILE.jpg';
import { Service, Project } from '../types';

interface NavbarProps {
  currentPath?: string;
  onSearchClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath = '', onSearchClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [hoveredService, setHoveredService] = useState<Service>(SERVICES[0]);
  const [hoveredProject, setHoveredProject] = useState<Project>(PROJECTS[0]);

  const menuDescriptions: Record<string, string> = {
    // About us - Company
    'Company Overview': 'Our history, expertise and operational footprint',
    'Our Philosophy': 'Our vision, mission and strategic objectives',
    'Core Values': 'Professionalism, innovation, integrity and safety',
    'Management Team': 'Experienced leaders driving project excellence',
    
    // About us - Commitment
    'HSSE & Quality Policy': 'Commitment to zero injuries & high-quality assurance',
    'Certifications': 'ISO 9001:2015, ISO 45001:2018 and regulatory permits',
    'Safety Performance': 'Track record of 500k+ safe man-hours & zero LTI',

    // Projects - Capabilities
    '3D Reality Capture & Laser Scanning': 'High-precision digitization & dimension control',
    'Geotechnical & Marine': 'Sub-surface soil boring, CPT & marine surveys',
    'Pipeline Integrity': 'API-standard fabrication, welding & hydrostatic tests',
    'Civil Works': 'Access road rehab, piling & foundational concrete',
    'Integrated Project Management': 'Bespoke engineering procurement & water drilling',
    'Digital Twins': 'Intelligent as-built digitalization & brownfield mods'
  };

  // Pages that have a light background (white/gray) at the top, requiring dark navbar text
  const lightBgRoutes: string[] = [];
  const isLightPage = lightBgRoutes.includes(currentPath);

  // Text should be dark if scrolled (white navbar), if on a light page, or if a mega menu is open
  const useDarkText = scrolled || isLightPage || activeDropdown !== null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      if (window.scrollY > 50 && activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown]);

  const navLinks = [
    { name: 'Home', href: '#/', type: 'standard' },
    {
      name: 'About us',
      href: '#/about',
      type: 'mega',
      layout: 'links',
      featured: {
        title: 'Precision & Integrity',
        description: 'Expert Partner in Sub-Surface Characterization and 3D Reality Capture across Sub-Saharan Africa.',
        image: BootsImg,
        link: '#/about'
      },
      sections: [
        {
          title: 'Company',
          links: [
            { label: 'Company Overview', href: '#/about?section=heritage' },
            { label: 'Our Philosophy', href: '#/about?section=vision' },
            { label: 'Core Values', href: '#/about?section=values' },
            { label: 'Management Team', href: '#/about?section=management' },
          ]
        },
        {
          title: 'Commitment',
          links: [
            { label: 'HSSE & Quality Policy', href: '#/hsse' },
            { label: 'Certifications', href: '#/hsse?section=certifications' },
            { label: 'Safety Performance', href: '#/hsse?section=stats' },
          ]
        }
      ]
    },
    {
      name: 'Services',
      href: '#/services',
      type: 'mega',
      layout: 'services',
      featured: {
        title: SERVICES[0].title,
        description: SERVICES[0].description,
        image: SERVICES[0].image,
        link: `#/services/detail?id=${SERVICES[0].id}`
      }
    },
    {
      name: 'Projects',
      href: '#/projects',
      type: 'mega',
      layout: 'projects',
      featured: {
        title: PROJECTS[0].title,
        category: PROJECTS[0].category,
        description: PROJECTS[0].description,
        image: PROJECTS[0].image,
        link: '#/projects'
      },
      sections: [
        {
          title: 'Capabilities',
          links: [
            { label: '3D Reality Capture & Laser Scanning', href: '#/projects?filter=Integrated' },
            { label: 'Geotechnical & Marine', href: '#/projects?filter=Geosolutions' },
            { label: 'Pipeline Integrity', href: '#/projects?filter=Pipeline' },
            { label: 'Civil Works', href: '#/projects?filter=Civil' },
            { label: 'Integrated Project Management', href: '#/projects?filter=Integrated' },
            { label: 'Digital Twins', href: '#/projects?filter=Integrated' }
          ]
        }
      ]
    },
    { name: 'News', href: '#/news', type: 'standard' },
    { name: 'HSSE', href: '#/hsse', type: 'standard' },
    { name: 'Careers', href: '#/careers', type: 'standard' },
  ];

  const handleMobileNavClick = (linkName: string, isMega: boolean, e: React.MouseEvent) => {
    if (isMega) {
      e.preventDefault();
      setMobileExpanded(mobileExpanded === linkName ? null : linkName);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || activeDropdown ? 'bg-white shadow-xl' : 'bg-transparent'} ${scrolled ? 'py-3 md:py-4' : 'py-5 md:py-7'}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        {/* Dark Hue Gradient Overlay for Text Legibility (only when transparent) */}
        {!scrolled && !isLightPage && !activeDropdown && (
          <div className="absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent pointer-events-none -z-10" />
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="#/" className="flex items-center group outline-none" onClick={() => setIsOpen(false)}>
                <img
                  src={useDarkText ? LogoDarkImg : LogoLightImg}
                  alt="Polaris Integrated & Geosolutions Logo"
                  className="h-10 md:h-12 w-auto object-contain transition-all duration-500"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-full">
              <div className="flex items-center space-x-1 xl:space-x-2 mr-4 xl:mr-6">
                {navLinks.map((link) => (
                  <div 
                    key={link.name} 
                    className="relative h-full py-2 px-2 xl:px-3 flex items-center cursor-pointer"
                    onMouseEnter={() => link.type === 'mega' ? setActiveDropdown(link.name) : setActiveDropdown(null)}
                  >
                    <a
                      href={link.href}
                      className={`nav-link-font link-underline transition-all duration-300 flex items-center ${
                        activeDropdown === link.name 
                          ? 'text-emerald-600' 
                          : useDarkText 
                            ? 'text-slate-800 hover:text-emerald-700' 
                            : 'text-white hover:text-white/80'
                      }`}
                      onClick={() => setActiveDropdown(null)}
                    >
                      {link.name}
                      {link.type === 'mega' && (
                        <svg className={`w-4 h-4 ml-1.5 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      )}
                    </a>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-300/30">
                {/* Search Icon */}
                <button 
                  aria-label="Search" 
                  className={`p-1 transition-colors ${useDarkText ? 'text-slate-800 hover:text-emerald-700' : 'text-white hover:text-white/80'}`}
                  onClick={onSearchClick}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
                {/* Download Profile Icon */}
                <button 
                  onClick={() => setIsDownloadModalOpen(true)}
                  title="Download Profile"
                  aria-label="Download Profile"
                  className={`p-1 transition-colors flex items-center justify-center ${useDarkText ? 'text-slate-800 hover:text-emerald-700' : 'text-white hover:text-white/80'}`}
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>

              <a
                href="#/contact"
                className={`ml-4 px-6 py-2.5 rounded-none font-medium text-sm tracking-wider transition-all border-2 ${
                  useDarkText 
                    ? 'border-emerald-950 text-emerald-950 hover:bg-emerald-950 hover:text-white' 
                    : 'border-white text-white hover:bg-white hover:text-emerald-950'
                }`}
              >
                Get in touch
              </a>
            </div>

            {/* Mobile Toggle Button */}
            <div className="lg:hidden flex items-center space-x-3">
              {/* Mobile Search Icon */}
              <button 
                onClick={onSearchClick}
                aria-label="Search" 
                className={`p-2 transition-colors duration-300 focus:outline-none ${useDarkText ? 'text-emerald-950 hover:text-emerald-700' : 'text-white hover:text-white/80'}`}
              >
                <svg className="w-[20px] h-[20px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </button>
              
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 transition-colors duration-300 focus:outline-none ${useDarkText ? 'text-emerald-950' : 'text-white'}`}
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6 md:h-8 md:w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 8h16M4 16h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mega Menu Dropdown Panels */}
        <div 
          className={`absolute top-full left-0 w-full bg-white border-t border-b border-slate-200 overflow-hidden transition-all duration-500 ease-in-out ${
            activeDropdown ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {navLinks.map((link) => {
              if (link.type !== 'mega' || activeDropdown !== link.name) return null;

              return (
                <div key={`${link.name}-dropdown`} className="flex flex-col lg:flex-row gap-12 animate-fade-in">
                  {/* Menu Links Column */}
                  <div className={`flex-1 ${link.layout === 'services' ? 'lg:col-span-2' : ''}`}>
                    <div className="mb-6 border-b border-slate-100 pb-4">
                      <h3 className="text-2xl font-black text-slate-900">{link.name}</h3>
                    </div>
                    
                    {/* Layout for standard sections (About, Projects) */}
                    {(link.layout === 'links' || link.layout === 'projects') && link.sections && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {link.sections.map((section, idx) => (
                          <div key={idx}>
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">{section.title}</h4>
                            <ul className="space-y-1">
                              {section.links.map((sublink, subIdx) => {
                                const desc = menuDescriptions[sublink.label];
                                return (
                                  <li key={subIdx} className="group">
                                    <a 
                                      href={sublink.href} 
                                      className="flex items-start px-3 py-2 hover:bg-slate-50/80 transition-all rounded-md"
                                      onClick={() => setActiveDropdown(null)}
                                      onMouseEnter={() => {
                                        if (link.layout === 'projects') {
                                          if (subIdx === 0) setHoveredProject(PROJECTS[2]); // p3
                                          else if (subIdx === 1) setHoveredProject(PROJECTS[1]); // p2
                                          else if (subIdx === 2) setHoveredProject(PROJECTS[0]); // p1
                                          else if (subIdx === 3) setHoveredProject(PROJECTS[5]); // p6
                                          else if (subIdx === 4) setHoveredProject(PROJECTS[3]); // p4
                                          else if (subIdx === 5) setHoveredProject(PROJECTS[7]); // p8
                                        }
                                      }}
                                    >
                                      <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-300 text-emerald-500 mr-0 group-hover:mr-1.5 flex-shrink-0 font-black mt-0.5">→</span>
                                      <div className="flex flex-col">
                                        <span className="text-[14px] text-slate-800 font-semibold group-hover:text-emerald-700 transition-colors leading-tight">{sublink.label}</span>
                                      </div>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Layout for Services mapping */}
                    {link.layout === 'services' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Geosolution Services</h4>
                          <div className="space-y-1">
                            {SERVICES.filter(s => s.category === 'Geosolutions').map((service, idx) => (
                              <div key={idx} className="group">
                                <a 
                                  href={`#/services/detail?id=${service.id}`} 
                                  className="flex items-start px-3 py-2 hover:bg-slate-50/80 transition-all rounded-md"
                                  onClick={() => setActiveDropdown(null)}
                                  onMouseEnter={() => setHoveredService(service)}
                                >
                                  <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-300 text-emerald-500 mr-0 group-hover:mr-1.5 flex-shrink-0 font-black mt-0.5">→</span>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-slate-800 font-semibold group-hover:text-emerald-700 transition-colors leading-tight">{service.title}</span>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 pb-2">Integrated Services</h4>
                          <div className="space-y-1">
                            {SERVICES.filter(s => s.category === 'Integrated').map((service, idx) => (
                              <div key={idx} className="group">
                                <a 
                                  href={`#/services/detail?id=${service.id}`} 
                                  className="flex items-start px-3 py-2 hover:bg-slate-50/80 transition-all rounded-md"
                                  onClick={() => setActiveDropdown(null)}
                                  onMouseEnter={() => setHoveredService(service)}
                                >
                                  <span className="w-0 overflow-hidden group-hover:w-3.5 transition-all duration-300 text-emerald-500 mr-0 group-hover:mr-1.5 flex-shrink-0 font-black mt-0.5">→</span>
                                  <div className="flex flex-col">
                                    <span className="text-[14px] text-slate-800 font-semibold group-hover:text-emerald-700 transition-colors leading-tight">{service.title}</span>
                                  </div>
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Featured Content Column */}
                  {link.featured && (
                    <div className="hidden lg:block w-[350px] shrink-0">
                      {link.layout === 'services' ? (
                        <a 
                          href={`#/services/detail?id=${hoveredService.id}`} 
                          className="block group relative overflow-hidden h-full rounded-none" 
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/10 transition-colors z-10" />
                          <img 
                            key={hoveredService.id}
                            src={hoveredService.image} 
                            alt={hoveredService.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 animate-fade-in"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">
                              {hoveredService.category} Service
                            </span>
                            <h4 className="text-white font-black text-xl mb-2 min-h-[28px]">{hoveredService.title}</h4>
                            <p className="text-slate-200 text-sm font-medium line-clamp-3 leading-relaxed min-h-[60px]">{hoveredService.description}</p>
                            <div className="mt-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-emerald-400 group-hover:text-white transition-colors">
                              Explore Service Details <span className="ml-2">→</span>
                            </div>
                          </div>
                        </a>
                      ) : link.layout === 'projects' ? (
                        <a 
                          href={`#/projects`} 
                          className="block group relative overflow-hidden h-full rounded-none" 
                          onClick={() => setActiveDropdown(null)}
                        >
                          <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/10 transition-colors z-10" />
                          <img 
                            key={hoveredProject.id}
                            src={hoveredProject.image} 
                            alt={hoveredProject.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 animate-fade-in"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-20">
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2 block">
                              Featured {hoveredProject.category} Project
                            </span>
                            <h4 className="text-white font-black text-xl mb-2 min-h-[28px]">{hoveredProject.title}</h4>
                            <p className="text-slate-200 text-sm font-medium line-clamp-3 leading-relaxed min-h-[60px]">{hoveredProject.description}</p>
                            <div className="mt-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-emerald-400 group-hover:text-white transition-colors">
                              Explore Case Studies <span className="ml-2">→</span>
                            </div>
                          </div>
                        </a>
                      ) : (
                        <a href={link.featured.link} className="block group relative overflow-hidden h-full rounded-none" onClick={() => setActiveDropdown(null)}>
                          <div className="absolute inset-0 bg-emerald-950/20 group-hover:bg-emerald-950/10 transition-colors z-10" />
                          <img 
                            src={link.featured.image} 
                            alt={link.featured.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent z-20">
                            {link.featured.category && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2 block">
                                {link.featured.category}
                              </span>
                            )}
                            <h4 className="text-white font-black text-xl mb-2">{link.featured.title}</h4>
                            <p className="text-slate-200 text-sm font-medium line-clamp-2">{link.featured.description}</p>
                            <div className="mt-4 flex items-center text-[11px] font-bold uppercase tracking-widest text-emerald-400 group-hover:text-white transition-colors">
                              Explore <span className="ml-2">→</span>
                            </div>
                          </div>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsOpen(false)}></div>

      {/* Mobile Drawer Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[85vw] sm:w-[350px] bg-white z-[50] overflow-y-auto transition-transform duration-500 lg:hidden ease-expo shadow-[-20px_0_60px_rgba(0,0,0,0.1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col min-h-full p-6 pt-20 border-l border-slate-100">
          <div className="mb-8">
            <h3 className="text-emerald-950 font-black text-2xl tracking-tighter">Menu</h3>
          </div>

          <div className="flex flex-col space-y-2 flex-grow">
            {navLinks.map((link, idx) => (
              <div key={link.name} className={`transform transition-all duration-300 ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`} style={{ transitionDelay: `${idx * 50}ms` }}>
                {/* Main Link / Accordion Toggle */}
                <a
                  href={link.href}
                  className="flex items-center justify-between py-3 text-xl font-medium text-slate-800 hover:text-emerald-600 transition-colors"
                  onClick={(e) => handleMobileNavClick(link.name, link.type === 'mega', e)}
                >
                  {link.name}
                  {link.type === 'mega' && (
                    <svg className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${mobileExpanded === link.name ? 'rotate-180 text-emerald-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  )}
                </a>
                
                {/* Accordion Content */}
                {link.type === 'mega' && (
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${mobileExpanded === link.name ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                    <div className="pl-4 border-l-2 border-emerald-100 space-y-4 pt-2">
                      {link.layout === 'services' && (
                        <div className="space-y-4 w-full">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Geosolution Services</p>
                            <div className="space-y-2.5 pl-2 border-l border-slate-100">
                              {SERVICES.filter(s => s.category === 'Geosolutions').map((service, sIdx) => (
                                <a 
                                  key={sIdx} 
                                  href={`#/services/detail?id=${service.id}`} 
                                  className="block text-[14px] font-medium text-slate-600 hover:text-emerald-600 flex items-center group"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-emerald-500 mr-0 group-hover:mr-2 flex-shrink-0">→</span>
                                  {service.title}
                                </a>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Integrated Services</p>
                            <div className="space-y-2.5 pl-2 border-l border-slate-100">
                              {SERVICES.filter(s => s.category === 'Integrated').map((service, sIdx) => (
                                <a 
                                  key={sIdx} 
                                  href={`#/services/detail?id=${service.id}`} 
                                  className="block text-[14px] font-medium text-slate-600 hover:text-emerald-600 flex items-center group"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="w-0 overflow-hidden group-hover:w-3 transition-all duration-300 text-emerald-500 mr-0 group-hover:mr-2 flex-shrink-0">→</span>
                                  {service.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {(link.layout === 'links' || link.layout === 'projects') && link.sections && link.sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-2">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 pt-2">{section.title}</p>
                          {section.links.map((sublink, subIdx) => (
                            <a 
                              key={subIdx} 
                              href={sublink.href} 
                              className="block text-[15px] font-medium text-slate-600 hover:text-emerald-600"
                              onClick={() => setIsOpen(false)}
                            >
                              {sublink.label}
                            </a>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Bottom Actions */}
          <div className="mt-8 pt-8 border-t border-slate-100 space-y-6">
            <div className="flex items-center justify-between px-4">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onSearchClick?.();
                }}
                className="flex flex-col items-center space-y-2 text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <span className="font-bold text-[10px] uppercase tracking-widest">Search</span>
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setIsDownloadModalOpen(true);
                }}
                className="flex flex-col items-center space-y-2 text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="font-bold text-[10px] uppercase tracking-widest">Profile</span>
              </button>
            </div>
             <button
              onClick={() => {
                setIsOpen(false);
                setIsDownloadModalOpen(true);
              }}
              className="w-full text-center py-3.5 bg-emerald-700 text-white font-black text-sm uppercase tracking-widest hover:bg-emerald-800 transition-all block mb-3"
            >
              Company Profile
            </button>

            <a
              href="#/contact"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-3.5 border-2 border-emerald-950 text-emerald-950 font-black text-sm uppercase tracking-widest hover:bg-emerald-950 hover:text-white transition-all block"
            >
              Get in touch
            </a>
          </div>
        </div>
      </div>

      {/* Download Profile Confirmation Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col sm:flex-row">
            {/* Close Button */}
            <button 
              onClick={() => setIsDownloadModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-10 p-1"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            {/* Image Preview Block */}
            <div className="w-full sm:w-5/12 bg-slate-50 flex items-center justify-center p-6 border-b sm:border-b-0 sm:border-r border-slate-100">
              <img 
                src={ProfileCoverImg} 
                alt="PIGL Company Profile Cover" 
                className="w-full max-w-[140px] sm:max-w-none h-auto object-contain shadow-lg border border-slate-200 transform hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            {/* Content & Action Buttons */}
            <div className="w-full sm:w-7/12 p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-xl font-black text-slate-950 tracking-tight leading-snug">Company Profile</h3>
                <p className="text-sm font-normal text-slate-500 leading-relaxed">
                  Would you like to download our comprehensive corporate profile presentation?
                </p>
              </div>
              
              <div className="mt-8 space-y-3">
                <a
                  href={ProfilePDF}
                  download="PIGL_Company_Profile.pdf"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="w-full inline-flex items-center justify-center py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs uppercase tracking-widest transition-colors duration-300"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Confirm Download
                </a>
                <button
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="w-full py-3.5 border-2 border-slate-200 text-slate-600 hover:text-slate-950 hover:border-slate-950 font-black text-xs uppercase tracking-widest transition-colors duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
