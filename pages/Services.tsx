import React, { useEffect, useState } from 'react';
import { useServices, submitContactInquiry } from '../hooks/useSupabaseData';
import { SERVICE_DETAILS_MAP, SERVICE_GALLERY_PRESETS, getEmbedVideoUrl } from './ServicesDetailsData';
import { GROUND_INTELLIGENCE_SERVICES, SERVICES, LEGACY_SERVICE_MAP } from '../site_data';
import ServiceBg from '../assets/slider.jpeg';
import GroundIntelImg from '../assets/cpt.png';
import ScannerImg from '../assets/digital_intel_scanner.jpg';
import DigiTwinImg from '../assets/digitwin.png';
import PipelineImg from '../assets/newpipeline.png';
import AssetIntegrityImg from '../assets/asset_integrity_ndt.jpg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import NativeVideoPlayer from '../components/NativeVideoPlayer';
import DeliverableDetailModal from '../components/DeliverableDetailModal';
import { getDeliverableDetails } from '../data/serviceDeliverablesData';
import { ServiceDeliverableItem } from '../types';

// Representative capabilities for high-level service discovery (Section 12 & 13)
const PLATFORM_REPRESENTATIVE_SERVICES: Record<string, string[]> = {
  'geo-data-intelligence': [
    'Geotechnical Investigation',
    'Geophysical Investigation',
    'CPT / Site Investigation',
    'Geospatial Survey'
  ],
  'digital-mapping-intelligence': [
    'Topographic Survey',
    '3D Reality Capture',
    'Geomatics',
    'Digital Engineering'
  ],
  'marine-intelligence': [
    'Marine & Seabed Survey',
    'Hydrographic Survey',
    'MetOcean',
    'Continuous Marine Monitoring'
  ],
  'asset-integrity-intelligence': [
    'Inspection & NDT',
    'Integrity Monitoring',
    'Maintenance & Repairs',
    'ROV & Subsea Integrity'
  ],
  'engineering-industrial-environmental-solutions': [
    'Water Engineering',
    'Wastewater Treatment',
    'Produced Water Treatment',
    'Flow Control & Valve Solutions',
    'Pipeline & Civil Engineering'
  ]
};

const ServiceContactForm: React.FC<{ serviceTitle: string }> = ({ serviceTitle }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);
    try {
      await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        service_interest: serviceTitle,
        message: formData.message || `Inquiry regarding ${serviceTitle}`
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Service inquiry submission error:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 p-8 text-emerald-800 reveal active">
        <h4 className="text-xl font-bold mb-2">Technical Inquiry Received</h4>
        <p className="text-base font-normal leading-relaxed">
          Thank you. Your request for a technical consultation on <strong>{serviceTitle}</strong> has been logged. Our engineering desk in Port Harcourt will contact you at <strong>{formData.email}</strong> within 24 business hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Full Name</label>
          <input 
            type="text" 
            required 
            placeholder="Engr. Adeola Balogun"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Corporate Email</label>
          <input 
            type="email" 
            required 
            placeholder="a.balogun@company.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Company / Organization</label>
        <input 
          type="text" 
          required 
          placeholder="Energy / Infrastructure Operating Company"
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
          className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Project Brief & Technical Specifications</label>
        <textarea 
          rows={4} 
          required
          placeholder="Outline project coordinates, terrain type (swamp/onshore/offshore), target depths, specifications, or required delivery timeframe..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors resize-none"
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="inline-flex items-center px-8 py-4 bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors rounded-none"
      >
        Submit Technical Inquiry <span className="ml-2">→</span>
      </button>
    </form>
  );
};

const Services: React.FC = () => {
  const { services, loading } = useServices();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeLifecycleIndex, setActiveLifecycleIndex] = useState(0);
  const [activeDeliverableModal, setActiveDeliverableModal] = useState<ServiceDeliverableItem | null>(null);
  const [activeDeliverableService, setActiveDeliverableService] = useState<{ title: string; division?: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLifecycleIndex(prev => (prev + 1) % 5);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleLocationCheck = () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      setSelectedId(id);
    };

    handleLocationCheck();
    window.addEventListener('popstate', handleLocationCheck);
    window.addEventListener('pushstate-changed', handleLocationCheck);
    return () => {
      window.removeEventListener('popstate', handleLocationCheck);
      window.removeEventListener('pushstate-changed', handleLocationCheck);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedId]);

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

    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll('.reveal');
      revealElements.forEach(el => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [selectedId]);

  // View state switcher logic
  const resolvedId = selectedId ? (LEGACY_SERVICE_MAP[selectedId] || selectedId) : null;
  const selectedService = services.find(s => s.id === resolvedId || s.slug === resolvedId || s.id === selectedId || s.slug === selectedId) || SERVICES.find(s => s.id === resolvedId || s.id === selectedId);
  const selectedDetails = resolvedId ? SERVICE_DETAILS_MAP[resolvedId] : null;
  const selectedVideoUrl = selectedService?.video_url || selectedDetails?.video_url || ((selectedService?.slug === 'ground-intelligence' || resolvedId === 'geo-data-intelligence') ? '/assets/videos/ground_intelligence.mp4' : undefined);
  const selectedVideoEmbed = selectedVideoUrl ? getEmbedVideoUrl(selectedVideoUrl) : null;
  const selectedGallery = (selectedService?.gallery && selectedService.gallery.length > 0)
    ? selectedService.gallery
    : (selectedDetails?.gallery || (SERVICE_GALLERY_PRESETS && (SERVICE_GALLERY_PRESETS[selectedService?.slug || ''] || (resolvedId ? SERVICE_GALLERY_PRESETS[resolvedId] : []))) || []);

  // Canonical 5 Top-Level Service Platforms
  const canonicalOrder = [
    'geo-data-intelligence',
    'digital-mapping-intelligence',
    'marine-intelligence',
    'asset-integrity-intelligence',
    'engineering-industrial-environmental-solutions'
  ];

  const primaryPlatforms = canonicalOrder.map((slug, idx) => {
    const fromCMS = services.find(s => s.id === slug || s.slug === slug);
    const fromStatic = SERVICES.find(s => s.id === slug);
    if (fromCMS && fromStatic) {
      return {
        ...fromStatic,
        ...fromCMS,
        serviceNumber: fromStatic.serviceNumber || `0${idx + 1}`,
        partnerBadge: fromStatic.partnerBadge || (fromCMS as any).partner_badge
      };
    }
    return fromCMS || fromStatic;
  }).filter(Boolean) as any[];

  const selectedSubServices = (selectedService?.subServices && selectedService.subServices.length > 0)
    ? selectedService.subServices
    : (resolvedId ? (SERVICE_DETAILS_MAP[resolvedId]?.subServices || []) : []);

  if (selectedService) {
    return (
      <div className="flex flex-col bg-white font-sans">
        {/* Dynamic Premium Hero */}
        <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={selectedService.hero_image || selectedService.card_image} 
              alt={selectedService.title} 
              className="w-full h-full object-cover opacity-30 grayscale-[0.1]"
              loading="eager"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/70 to-transparent"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
                {selectedService.title}
              </h1>
              <p className="text-xl text-emerald-400 font-medium mb-6">
                {selectedService.tagline}
              </p>
              <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
                {selectedService.short_description}
              </p>
            </div>
          </div>
        </section>

        {/* Content Container */}
        <section className="py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back to All Services Button */}
            <div className="mb-12">
              <a 
                href="/services" 
                className="inline-flex items-center text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-colors group"
              >
                <span className="mr-2 transform group-hover:-translate-x-1.5 transition-transform">←</span> 
                Back to All Services
              </a>
            </div>

            {/* Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Left Column: Technical Overview, Methodology & Business Value */}
              <div className="lg:col-span-2 space-y-12">
                
                {/* Technical Overview */}
                <div className="border-b border-slate-100 pb-12 reveal">
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-6">
                    Technical Overview & Nigerian Field Context
                  </h2>
                  <div className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed font-normal space-y-6">
                    <p className="font-semibold text-slate-900 text-xl leading-relaxed">
                      Advanced indigenous engineering capability designed to address the most demanding technical requirements across Nigerian swamp, coastal, land, and offshore assets.
                    </p>
                    <p>
                      {selectedService.full_description || selectedDetails?.longDescription}
                    </p>
                  </div>
                </div>

                {/* Where We Operate */}
                {(selectedService.operating_environments?.length > 0 || selectedDetails?.whereWeOperate) && (
                  <div className="border-b border-slate-100 pb-12 reveal">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-6">
                      Operating Environments
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(selectedService.operating_environments?.length > 0 ? selectedService.operating_environments : selectedDetails?.whereWeOperate || []).map((env, i) => (
                        <div key={i} className="flex items-center space-x-3 bg-slate-50 border border-slate-200/80 p-4">
                          <span className="w-2 h-2 bg-emerald-600 flex-shrink-0"></span>
                          <span className="text-slate-800 font-bold text-sm">{env}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialized Services under Ground Intelligence */}
                {selectedSubServices.length > 0 && (
                  <div className="border-b border-slate-100 pb-12 reveal">
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                      Specialized Engineering Capabilities
                    </span>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
                      Services Under {selectedService.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedSubServices.map((sub, i) => (
                        <div key={i} className="bg-slate-50 border border-slate-200 p-6 flex flex-col justify-between hover:border-emerald-600/60 hover:shadow-md transition-all group">
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-mono font-bold text-emerald-700">0{i + 1}</span>
                              {sub.icon && <span className="text-base">{sub.icon}</span>}
                            </div>
                            <h4 className="font-bold text-slate-900 text-base mb-2 group-hover:text-emerald-700 transition-colors">
                              {sub.title}
                            </h4>
                            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                              {sub.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Operational Field Video Media */}
                {selectedVideoUrl && (
                  <div className="reveal">
                    <NativeVideoPlayer
                      src={selectedVideoUrl}
                      poster={selectedService.hero_image || selectedService.card_image}
                      title={`${selectedService.title} Operational Video`}
                    />
                  </div>
                )}

                {/* Client Value Proposition */}
                {(selectedService.business_value || selectedDetails?.businessValue) && (
                  <div className="bg-emerald-950 text-white p-8 md:p-12 relative overflow-hidden reveal">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800/10 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <span className="text-emerald-400 font-black text-xs uppercase tracking-widest block mb-3">
                        Client Value & Integrity Assurance
                      </span>
                      <h3 className="text-2xl font-bold tracking-tight mb-4">
                        Why Operators Partner with PIGL
                      </h3>
                      <p className="text-emerald-100 text-lg leading-relaxed font-normal">
                        {selectedService.business_value || selectedDetails?.businessValue}
                      </p>
                    </div>
                  </div>
                )}

                {/* Partner Integration Callout if applicable */}
                {selectedService.partner_badge && (
                  <div className="bg-slate-900 text-white p-8 md:p-10 border border-slate-800 reveal">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">
                      <span>Strategic Technology Alliance</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {selectedService.partner_badge.partnerName}
                    </h3>
                    <p className="text-slate-300 text-base leading-relaxed mb-6">
                      {selectedService.partner_badge.role}
                    </p>
                    {selectedService.partner_badge.website && (
                      <div className="flex flex-wrap items-center gap-4">
                        <a 
                          href={selectedService.partner_badge.website} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          Visit Partner Website <span className="ml-2">→</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Right Column: Sidebar */}
              <div className="space-y-8">
                <div className="lg:sticky lg:top-24 space-y-8">
                  
                  {/* Core Deliverables */}
                  <div className="bg-slate-50 border border-slate-200/80 p-8 reveal">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                        Core Deliverables & Capabilities
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
                        Click for scope
                      </span>
                    </div>
                    <ul className="space-y-2.5">
                      {selectedService.capabilities.map((item, i) => {
                        const deliverableObj = getDeliverableDetails(item, selectedService.slug || selectedService.id);
                        return (
                          <li key={i}>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveDeliverableModal(deliverableObj);
                                setActiveDeliverableService({ title: selectedService.title, division: selectedService.division });
                              }}
                              className="w-full text-left flex items-start justify-between space-x-3 p-3 bg-white border border-slate-200/70 hover:border-emerald-600 hover:bg-emerald-50/20 hover:shadow-sm transition-all group cursor-pointer"
                            >
                              <div className="flex items-start space-x-2.5 min-w-0">
                                <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-600 group-hover:scale-125 transition-transform rounded-none mt-1.5"></span>
                                <span className="text-slate-800 group-hover:text-emerald-900 font-bold text-xs leading-snug line-clamp-2">
                                  {deliverableObj.title}
                                </span>
                              </div>
                              <span className="text-slate-300 group-hover:text-emerald-600 transition-colors flex-shrink-0">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  {/* Specialized Equipment */}
                  {(selectedService.equipment?.length > 0 || selectedDetails?.equipment) && (
                    <div className="bg-slate-50 border border-slate-200/80 p-8 reveal">
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-6 pb-4 border-b border-slate-200">
                        Specialized Instrumentation
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedService.equipment?.length > 0 ? selectedService.equipment : selectedDetails?.equipment || []).map((equip, i) => (
                          <span 
                            key={i} 
                            className="bg-white border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-800 tracking-wide hover:border-emerald-700 hover:text-emerald-700 transition-colors cursor-default"
                          >
                            {equip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ISO & HSSE Compliance Standard Panel */}
                  <div className="bg-emerald-50 border border-emerald-200 p-8 reveal">
                    <h3 className="text-sm font-black text-emerald-900 tracking-wider uppercase mb-4">
                      Compliance & Assurance Standard
                    </h3>
                    <div className="space-y-4 text-xs text-slate-700 leading-relaxed font-normal">
                      <div className="flex items-center space-x-2 text-emerald-800 font-bold">
                        <span>🛡️</span>
                        <span>Dual Certified: ISO 9001 & ISO 45001</span>
                      </div>
                      <p>
                        All engineering deliverables conform to NUPRC guidelines, API codes, Eurocode, and ASTM international standards.
                      </p>
                      <p className="border-t border-emerald-200/60 pt-3">
                        <strong className="text-slate-950 font-bold block mb-1">Stop Work Authority (SWA):</strong>
                        Every PIGL field engineer holds uncompromised authority to halt operations whenever safety margins are threatened.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Operational Field Imagery & Instrumentation Gallery */}
            {selectedGallery.length > 0 && (
              <div className="mt-20 border-t border-slate-200 pt-16 reveal">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
                  <div>
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                      Operational Documentation & Field Assets
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                      Field Operations & Instrumentation Gallery
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-2 md:mt-0">
                    {selectedGallery.length} Verified Field Assets
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedGallery.map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="group border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all"
                    >
                      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                        <img
                          src={img.url}
                          alt={img.title || `${selectedService.title} asset`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 border border-slate-700">
                          Asset 0{idx + 1}
                        </div>
                      </div>
                      <div className="p-5">
                        <h4 className="font-bold text-slate-900 text-sm tracking-tight mb-2">
                          {img.title}
                        </h4>
                        {img.caption && (
                          <p className="text-xs text-slate-600 leading-relaxed font-normal">
                            {img.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localized Consultation Form Section */}
            <div className="mt-20 border border-slate-200 bg-slate-50 p-8 md:p-16 reveal">
              <div className="max-w-3xl">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-3">Service Consultation</span>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
                  Request a Technical Consultation
                </h3>
                <p className="text-slate-600 text-lg mb-10 leading-relaxed font-normal">
                  Inquire about specialized deployment of <strong>{selectedService.title}</strong> for your project. Our lead engineers will review your technical specifications and provide operational scoping.
                </p>

                <ServiceContactForm serviceTitle={selectedService.title} />
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  }

  // Full services list view
  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ServiceBg} 
            alt="PIGL Engineering Capabilities" 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Capabilities</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Intelligence, Solutions & Engineering
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Transforming complex physical environments into actionable intelligence and dependable infrastructure across Sub-Saharan Africa.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* Main Services Architecture Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="reveal max-w-3xl border-l-4 border-emerald-700 pl-6">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] block mb-2">PIGL Master Service Platforms</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">Five Operational Platforms</h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-normal">
              High-fidelity subsurface intelligence, digital reality capture, marine metocean observation, asset lifecycle integrity, and turnkey industrial infrastructure across Nigeria.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
            {primaryPlatforms.map((platform, idx) => {
              const platformSlug = platform.slug || platform.id;
              const repItems = PLATFORM_REPRESENTATIVE_SERVICES[platformSlug] || (platform.capabilities ? platform.capabilities.slice(0, 4) : []);
              const isFullWidth = idx === primaryPlatforms.length - 1 && primaryPlatforms.length % 2 !== 0;

              return (
                <div 
                  key={platform.id} 
                  id={platformSlug} 
                  className={`flex flex-col border border-slate-200 bg-slate-50 hover:shadow-xl transition-shadow p-8 md:p-12 hover-lift reveal ${
                    isFullWidth ? 'lg:col-span-2' : ''
                  }`}
                >
                  <a href={`/services/${platformSlug}`} className="relative h-64 md:h-[340px] bg-slate-200 mb-8 overflow-hidden group block">
                    <img
                      src={platform.card_image || platform.hero_image || platform.image}
                      alt={`${platform.title} - PIGL Indigenous Engineering`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-sm text-emerald-300 text-xs font-bold uppercase tracking-wider px-3 py-1.5 border border-emerald-700/50">
                      PIGL Platform 0{idx + 1}
                    </div>
                    {platform.partnerBadge && (
                      <div className="absolute bottom-4 right-4 bg-slate-900/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 border border-slate-700">
                        {platform.partnerBadge.partnerName || platform.partnerBadge}
                      </div>
                    )}
                  </a>

                  <div className="mb-4">
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest block mb-1">
                      0{idx + 1} • {platform.division || platform.category || 'Specialist Platform'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight hover:text-emerald-700 transition-colors">
                      <a href={`/services/${platformSlug}`}>{platform.title}</a>
                    </h3>
                    {platform.tagline && (
                      <p className="text-sm font-semibold text-slate-500 mt-1">
                        {platform.tagline}
                      </p>
                    )}
                  </div>

                  <p className="text-base text-slate-600 font-normal leading-relaxed mb-6 flex-grow">
                    {platform.short_description || platform.description}
                  </p>

                  {/* Representative Capabilities (Section 12 & 13) */}
                  <div className="bg-white p-5 border border-slate-200/80 mb-8">
                    <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                      <h4 className="text-emerald-800 font-bold text-xs uppercase tracking-wider">Representative Capabilities</h4>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Core Disciplines</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {repItems.map((item: string, rIdx: number) => (
                        <div key={rIdx} className="flex items-start space-x-2 text-xs font-semibold text-slate-800">
                          <span className="w-1.5 h-1.5 bg-emerald-600 flex-shrink-0 mt-1.5 rounded-none"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <a 
                      href={`/services/${platformSlug}`} 
                      className="inline-flex items-center px-6 py-3.5 bg-emerald-800 text-white font-bold text-xs uppercase tracking-widest hover:bg-emerald-900 transition-all group"
                    >
                      Explore Platform & Specifications <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Operational Lifecycle & Framework Section */}
      <section className="bg-slate-900 py-24 md:py-32 border-t border-slate-800 reveal text-white relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs mb-3 block">
                The PIGL Lifecycle
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                How We Deliver Engineering Certainty
              </h2>
            </div>

            {/* Active Stage Indicator */}
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-slate-950/80 px-4 py-2 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>ACTIVE STAGE: 0{activeLifecycleIndex + 1} // {['UNDERSTAND', 'MEASURE', 'ENGINEER', 'BUILD', 'PROTECT'][activeLifecycleIndex]}</span>
            </div>
          </div>

          {/* Connected Progression Stepper */}
          <div className="hidden lg:grid grid-cols-5 gap-4 mb-10 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-emerald-400 -translate-y-1/2 z-0 transition-all duration-700 ease-out"
              style={{ width: `${(activeLifecycleIndex / 4) * 100}%` }}
            />
            {['01 UNDERSTAND', '02 MEASURE', '03 ENGINEER', '04 BUILD', '05 PROTECT'].map((stepTitle, idx) => (
              <button
                key={idx}
                onClick={() => setActiveLifecycleIndex(idx)}
                className="relative z-10 flex flex-col items-center group focus:outline-none transition-all duration-300"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono font-bold text-xs transition-all duration-500 border ${
                  activeLifecycleIndex === idx
                    ? 'bg-emerald-500 text-slate-950 border-white shadow-lg shadow-emerald-500/50 scale-125'
                    : activeLifecycleIndex > idx
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/60'
                    : 'bg-slate-950 text-slate-500 border-slate-700 hover:border-slate-500'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider mt-2.5 transition-colors duration-300 ${
                  activeLifecycleIndex === idx ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {stepTitle.split(' ')[1]}
                </span>
              </button>
            ))}
          </div>

          {/* 5 Cards with Authentic Overlay Images & Progression Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: 'UNDERSTAND',
                desc: 'Pre-feasibility geoscientific analysis and environmental site appraisal.',
                image: GroundIntelImg
              },
              {
                step: '02',
                title: 'MEASURE',
                desc: 'Sub-millimeter 3D scanning, metocean telemetry, and deep soil sounding.',
                image: ScannerImg
              },
              {
                step: '03',
                title: 'ENGINEER',
                desc: 'Precision digital twin modeling, structural stress calculation, and design.',
                image: DigiTwinImg
              },
              {
                step: '04',
                title: 'BUILD',
                desc: 'API pipeline construction, heavy civil piling, and skid installation.',
                image: PipelineImg
              },
              {
                step: '05',
                title: 'PROTECT',
                desc: 'Long-term corrosion monitoring, PAUT NDT, and metocean telemetry.',
                image: AssetIntegrityImg
              }
            ].map((phase, idx) => {
              const isActive = activeLifecycleIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setActiveLifecycleIndex(idx)}
                  className={`relative overflow-hidden min-h-[340px] md:min-h-[380px] p-6 sm:p-7 flex flex-col justify-between border transition-all duration-500 cursor-pointer group card-shimmer ${
                    isActive
                      ? 'border-emerald-400 ring-2 ring-emerald-500/40 shadow-2xl scale-[1.02] z-10'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-600'
                  }`}
                >
                  {/* Background Image with Scale Animation */}
                  <img
                    src={phase.image}
                    alt={`${phase.title} - PIGL Engineering`}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                      isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                    }`}
                    loading="lazy"
                  />

                  {/* Dark Multi-Stop Gradient Scrim for Exceptional Contrast & Legibility */}
                  <div className={`absolute inset-0 transition-colors duration-500 ${
                    isActive
                      ? 'bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40'
                      : 'bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60 group-hover:via-slate-950/75'
                  }`} />

                  {/* Top: Step Number with Dynamic Glow */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className={`font-black text-3xl md:text-4xl transition-colors duration-300 font-mono tracking-tight ${
                      isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {phase.step}
                    </span>
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
                    )}
                  </div>

                  {/* Bottom: Title & Description */}
                  <div className="relative z-10 space-y-2.5">
                    <h3 className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}>
                      {phase.title}
                    </h3>
                    <p className="text-slate-300 text-xs sm:text-sm font-normal leading-relaxed">
                      {phase.desc}
                    </p>
                  </div>

                  {/* Active Card Bottom Progress Indicator Line */}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-400 animate-pulse z-20" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-950 p-12 text-white border border-emerald-800/40">
            <div>
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Technical Engagement</p>
              <p className="text-3xl font-bold tracking-tight">Need specialized engineering support for your Nigerian project?</p>
            </div>
            <a href="/contact" className="inline-flex items-center px-8 py-4 bg-white text-emerald-950 font-bold hover:bg-emerald-500 hover:text-white transition-colors">
              Consult with Our Engineers <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Deliverable Technical Scope Modal */}
      <DeliverableDetailModal
        deliverable={activeDeliverableModal}
        serviceTitle={activeDeliverableService?.title || 'Engineering Service'}
        division={activeDeliverableService?.division}
        onClose={() => {
          setActiveDeliverableModal(null);
          setActiveDeliverableService(null);
        }}
        onInquire={(deliverableTitle) => {
          const serviceTitle = activeDeliverableService?.title || '';
          setActiveDeliverableModal(null);
          window.location.href = `/contact?service=${encodeURIComponent(serviceTitle)}&scope=${encodeURIComponent(deliverableTitle)}`;
        }}
      />
    </div>
  );
};

export default Services;
