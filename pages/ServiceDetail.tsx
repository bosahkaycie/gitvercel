import React, { useEffect, useState } from 'react';
import { useServices, submitContactInquiry, FALLBACK_SERVICES } from '../hooks/useSupabaseData';
import { PROJECTS, LEGACY_SERVICE_MAP, GROUND_INTELLIGENCE_SERVICES, SERVICES } from '../site_data';
import { SERVICE_DETAILS_MAP, SERVICE_GALLERY_PRESETS, getEmbedVideoUrl } from './ServicesDetailsData';
import { ServiceGalleryImage, ServiceDeliverableItem, CMSService } from '../types';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import NativeVideoPlayer from '../components/NativeVideoPlayer';
import DeliverableDetailModal from '../components/DeliverableDetailModal';
import { getDeliverableDetails } from '../data/serviceDeliverablesData';

const ServiceDetailContactForm: React.FC<{ serviceTitle: string; initialScope?: string }> = ({ serviceTitle, initialScope = '' }) => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialScope) {
      setFormData(prev => ({
        ...prev,
        message: `Scoping inquiry regarding ${initialScope} under ${serviceTitle}. Please provide engineering specifications, mobilization feasibility, and operational parameters.`
      }));
    }
  }, [initialScope, serviceTitle]);

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
        message: formData.message || `Technical project scoping inquiry regarding ${serviceTitle}`
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Service detail inquiry submission error:', err);
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
          Thank you. Your project inquiry for <strong>{serviceTitle}</strong> has been assigned to our lead engineering desk in Port Harcourt. We will contact you at <strong>{formData.email}</strong> within 24 business hours.
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
            placeholder="Engr. Emeka Okonkwo"
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
            placeholder="e.okonkwo@operator.com"
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
          placeholder="Upstream Operator / EPC Company"
          value={formData.company}
          onChange={e => setFormData({ ...formData, company: e.target.value })}
          className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-700 transition-colors"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Project Scope & Coordinates</label>
        <textarea 
          rows={4} 
          required
          placeholder="Specify operational asset, target coordinates, environmental challenges (swamp/coastal/deepwater), or standards required..."
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

interface ServiceDetailProps {
  currentPath?: string;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ currentPath }) => {
  const { services, loading } = useServices();

  // Get active service ID from URL path (e.g. /services/digital-intelligence)
  const pathname = currentPath || window.location.pathname;
  let id = pathname.replace(/^\/services\/?/, '').split('/')[0] || '';
  if (LEGACY_SERVICE_MAP[id]) {
    id = LEGACY_SERVICE_MAP[id];
  }

  // Find base service with robust multi-tiered fallback
  const fallbackCMS = FALLBACK_SERVICES.find((s) => s.slug === id || s.id === id || LEGACY_SERVICE_MAP[s.slug] === id || LEGACY_SERVICE_MAP[s.id] === id);
  const staticDef = SERVICES.find((s) => s.id === id || LEGACY_SERVICE_MAP[s.id] === id);
  const service = services.find((s) => s.slug === id || s.id === id || LEGACY_SERVICE_MAP[s.slug] === id || LEGACY_SERVICE_MAP[s.id] === id) || fallbackCMS || (staticDef ? {
    id: staticDef.id,
    slug: staticDef.id,
    title: staticDef.title,
    division: staticDef.division,
    category: staticDef.title,
    tagline: staticDef.tagline,
    short_description: staticDef.description,
    full_description: staticDef.description,
    hero_image: staticDef.image,
    card_image: staticDef.image,
    capabilities: staticDef.items || [],
    subServices: staticDef.subServices || [],
    operating_environments: ['Onshore', 'Swamp', 'Offshore'],
    benefits: [
      'Sub-millimeter accuracy and single source of truth',
      'Minimizes operational risk and field rework',
      'Certified to international and statutory standards (NUPRC, ISO)'
    ],
    technology: [],
    methodology: [],
    equipment: [],
    gallery: [],
    status: 'published' as const,
    display_order: 1,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  } as CMSService : undefined);
  const fallbackDetails = id ? SERVICE_DETAILS_MAP[id] : null;

  // Active Lightbox image index state
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  // Derive authentic operational images for this service
  const galleryImages: ServiceGalleryImage[] = (service?.gallery && service.gallery.length > 0)
    ? service.gallery
    : (fallbackDetails?.gallery || (SERVICE_GALLERY_PRESETS && (SERVICE_GALLERY_PRESETS[service?.slug || ''] || SERVICE_GALLERY_PRESETS[id])) || []);

  // Derive operational video URL
  const rawVideoUrl = service?.video_url || fallbackDetails?.video_url || ((service?.slug === 'ground-intelligence' || id === 'ground-intelligence') ? '/assets/videos/ground_intelligence.mp4' : undefined);
  const activeEmbedVideoUrl = getEmbedVideoUrl(rawVideoUrl);

  // Lightbox keyboard navigation & body scroll lock
  useEffect(() => {
    if (activeImageIndex === null) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveImageIndex(null);
      if (e.key === 'ArrowRight' && galleryImages.length > 0) {
        setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0));
      }
      if (e.key === 'ArrowLeft' && galleryImages.length > 0) {
        setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImageIndex, galleryImages.length]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

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

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));

    // Safety fallback: ensure all reveal elements become active even if observer is delayed
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal:not(.active)').forEach(el => el.classList.add('active'));
    }, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [id, service]);

  if (loading && !service) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center font-sans">
        <svg className="animate-spin h-8 w-8 text-emerald-600 mb-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Loading Engineering Specifications...</p>
      </div>
    );
  }

  // Fallback for invalid or missing service IDs
  if (!service) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white p-10 border border-slate-200 text-center shadow-lg hover-lift">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Service Not Found</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The capability you are looking for has been reorganized in our service architecture.
          </p>
          <a
            href="/services"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-950 text-white font-bold tracking-wide hover:bg-emerald-800 transition-colors"
          >
            ← View All Capabilities
          </a>
        </div>
      </div>
    );
  }

  const relatedServices = services.filter(s => s.id !== service.id && s.division === service.division).slice(0, 3);
  const operatingEnvironments = service.operating_environments?.length > 0
    ? service.operating_environments
    : fallbackDetails?.whereWeOperate || [];
  const equipmentList = service.equipment?.length > 0
    ? service.equipment
    : fallbackDetails?.equipment || [];
  const methodologyList = service.methodology?.length > 0
    ? service.methodology
    : fallbackDetails?.methodology || [];

  const [selectedSubServiceScope, setSelectedSubServiceScope] = useState<string>('');
  const [activeDeliverableModal, setActiveDeliverableModal] = useState<ServiceDeliverableItem | null>(null);

  const capabilitiesList: string[] = (service?.capabilities && service.capabilities.length > 0)
    ? service.capabilities
    : ((service as any)?.items || fallbackDetails?.methodology || []);

  const subServicesList = (service.subServices && service.subServices.length > 0)
    ? service.subServices
    : (fallbackDetails?.subServices || ((service.slug === 'ground-intelligence' || id === 'ground-intelligence') ? GROUND_INTELLIGENCE_SERVICES : []));

  const handleInquireSubService = (subTitle: string) => {
    setSelectedSubServiceScope(subTitle);
    const el = document.getElementById('consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-white font-sans">
      {/* 1. Sleek Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.hero_image || service.card_image}
            alt={`${service.title} - PIGL Specialist Engineering`}
            className="w-full h-full object-cover opacity-35 grayscale-[0.1]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="/services" className="hover:text-white transition-colors">Capabilities</a>
            <span className="text-slate-600">/</span>
            <span className="text-white truncate max-w-[240px] sm:max-w-none">{service.title}</span>
          </div>

          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              {service.title}
            </h1>
            <p className="text-xl text-emerald-400 font-medium mb-6">
              {service.tagline}
            </p>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              {service.short_description}
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Overview & Operating Environments */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start reveal">
            {/* Left: Deep Overview */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Technical Overview</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  High-Fidelity Engineering & Nigerian Field Assurance
                </h3>
              </div>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                {service.full_description || fallbackDetails?.longDescription}
              </p>
              
              {/* Operating Environments */}
              {operatingEnvironments.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Where We Operate:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {operatingEnvironments.map((env: string, i: number) => (
                      <div key={i} className="flex items-center space-x-3 bg-slate-50 p-3.5 border border-slate-100">
                        <span className="w-2 h-2 bg-emerald-600 flex-shrink-0"></span>
                        <span className="text-slate-800 font-bold text-xs uppercase tracking-wide">{env}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Core Deliverables & Focal Points:</h4>
                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Click item for scope
                  </span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {capabilitiesList.map((item, i) => {
                    const deliverableObj = getDeliverableDetails(item, service.slug || service.id);
                    return (
                      <li key={i}>
                        <button
                          type="button"
                          onClick={() => setActiveDeliverableModal(deliverableObj)}
                          className="w-full h-full text-left flex items-center justify-between space-x-3 bg-slate-50 hover:bg-white p-4 border border-slate-200/80 hover:border-emerald-600 hover:shadow-sm transition-all group cursor-pointer"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <span className="flex-shrink-0 w-2 h-2 bg-emerald-600 group-hover:scale-125 transition-transform rounded-none"></span>
                            <span className="text-slate-900 group-hover:text-emerald-900 font-bold text-sm leading-snug transition-colors">
                              {deliverableObj.title}
                            </span>
                          </div>
                          <span className="flex-shrink-0 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all ml-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Right: Operational Video & Commercial Value & Integrity Standards */}
            <div className="lg:col-span-5 space-y-8">
              {/* Dynamic 16:9 Operational Video (Positioned directly above Commercial Value card) */}
              {rawVideoUrl && (
                <NativeVideoPlayer
                  src={rawVideoUrl}
                  poster={service.hero_image || service.card_image}
                  title={`${service.title} Operational Video`}
                  className="hover-lift"
                />
              )}

              <div className="bg-slate-50 p-8 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col hover-lift">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Commercial Value & Operator Assurance</h3>
                <p className="text-slate-600 leading-relaxed font-normal text-base mb-6">
                  {service.business_value || fallbackDetails?.businessValue}
                </p>
                <div className="border-t border-slate-200 pt-6 mt-auto space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance Standards</p>
                  <p className="text-sm font-bold text-slate-800">ISO 9001:2015 & ISO 45001:2018 Certified</p>
                  <p className="text-xs text-slate-500">NUPRC Regulated • 100% Nigerian Content Compliant</p>
                </div>
              </div>

              {/* Partner Callout if present */}
              {service.partner_badge && (
                <div className="bg-slate-900 text-white p-8 md:p-10 border border-slate-800 relative overflow-hidden flex flex-col reveal">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-black uppercase tracking-widest mb-3">
                    <span>Strategic Technology Alliance</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{service.partner_badge.partnerName}</h4>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {service.partner_badge.role}
                  </p>
                  {service.partner_badge.website ? (
                    <a
                      href={service.partner_badge.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                    >
                      Visit Partner Website <span className="ml-1">→</span>
                    </a>
                  ) : (
                    <a
                      href="/partners"
                      className="inline-flex items-center text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
                    >
                      View Strategic Partnerships <span className="ml-1">→</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Specialized Services Grid (Services Under Ground Intelligence) */}
      {subServicesList.length > 0 && (
        <section id="services-list" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 reveal">
              <div className="max-w-3xl">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                  Specialized Service Capabilities
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  Services Under {service.title}
                </h3>
              </div>
              <p className="text-slate-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-normal leading-relaxed">
                Dedicated subsurface, geophysical, and geotechnical solutions executed to rigorous international and Nigerian regulatory standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {subServicesList.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  id={sub.id}
                  className="group relative bg-white border border-slate-200 p-8 shadow-xs hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover-lift scroll-mt-28 reveal"
                >
                  {/* Subtle top accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider">
                        0{idx + 1}
                      </span>
                      {sub.icon && (
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 flex items-center justify-center text-lg group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors">
                          <span>{sub.icon}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-3 group-hover:text-emerald-700 transition-colors">
                      {sub.title}
                    </h4>

                    <p className="text-slate-600 text-sm leading-relaxed font-normal">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleInquireSubService(sub.title)}
                      className="text-xs font-bold text-emerald-700 group-hover:text-emerald-900 inline-flex items-center transition-colors"
                    >
                      <span>Inquire About This Service</span>
                      <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Methodology & Instrumentation */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 reveal">
            {/* Methodology Execution Workflow */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">Technical Workflow</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-6">
                Execution Methodology & Quality Control
              </h3>
              <div className="space-y-4">
                {methodologyList.map((step: string, i: number) => (
                  <div key={i} className="flex items-start space-x-4 bg-white p-5 border border-slate-200 shadow-sm hover-lift">
                    <span className="flex-shrink-0 w-7 h-7 bg-emerald-700 text-white text-xs font-black flex items-center justify-center">
                      0{i + 1}
                    </span>
                    <p className="text-slate-700 text-sm font-medium leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Specialized Equipment */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">Instrumentation Spreads</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-6">
                Equipment & Technology Fleet
              </h3>
              <div className="bg-white p-6 border border-slate-200 shadow-sm space-y-3">
                {equipmentList.map((equip: string, i: number) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-slate-50 border border-slate-100">
                    <span className="text-emerald-700 font-bold text-sm">⚙️</span>
                    <span className="text-slate-800 text-xs font-bold uppercase tracking-wider">{equip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Field Imagery & Instrumentation Gallery */}
      {galleryImages.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
              <div>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                  Operational Deployment & Field Imagery
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  Field Operations & Instrumentation Gallery
                </h3>
              </div>
              <p className="text-slate-500 text-sm max-w-md mt-4 md:mt-0 font-normal">
                Authentic field mobilization, sensor spreads, and certified engineering execution for {service.title}. Click any image to view in high resolution.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {galleryImages.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className="group relative bg-slate-950 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 cursor-pointer flex flex-col justify-end aspect-[4/3] reveal hover-lift"
                >
                  <img
                    src={img.url}
                    alt={img.title || `${service.title} operational record`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />
                  
                  {/* Zoom indicator button */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-900/80 backdrop-blur-md text-white flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100 shadow-md">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>

                  {/* Caption & Title */}
                  <div className="relative z-10 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 block mb-1">
                      0{idx + 1} / 0{galleryImages.length}
                    </span>
                    <h4 className="text-white font-bold text-base leading-snug tracking-tight">
                      {img.title}
                    </h4>
                    {img.caption && (
                      <p className="text-slate-300 text-xs mt-1.5 line-clamp-2 leading-relaxed font-normal opacity-90 group-hover:opacity-100">
                        {img.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Technical Project Inquiry Consultation Form */}
      <section id="consultation-form" className="py-20 md:py-28 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 p-8 md:p-14 reveal">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">Engineering Engagement</span>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Scope Your Project with PIGL Engineers
            </h3>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Discuss specific operational parameters, mobilization schedules, or survey specifications for <strong>{service.title}</strong> with our engineering teams.
            </p>
            <ServiceDetailContactForm 
              serviceTitle={service.title} 
              initialScope={selectedSubServiceScope} 
            />
          </div>
        </div>
      </section>

      {/* 5. Related Capabilities */}
      {relatedServices.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Related {service.division} Capabilities
              </h3>
              <a href="/services" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wider">
                All Capabilities →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <a
                  key={rel.id}
                  href={`/services/${rel.slug}`}
                  className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-700 transition-all flex flex-col justify-between group hover-lift"
                >
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 block mb-2">
                      {rel.division}
                    </span>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {rel.short_description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>View Specifications</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interactive Lightbox Modal */}
      {activeImageIndex !== null && galleryImages[activeImageIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Lightbox Header Bar */}
          <div className="flex items-center justify-between text-white border-b border-white/10 pb-4 max-w-7xl mx-auto w-full z-20">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
                {service.title}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-300">
                {activeImageIndex + 1} of {galleryImages.length}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(null);
              }}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider"
              aria-label="Close Lightbox"
            >
              <span>Close</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lightbox Main Stage */}
          <div
            className="relative flex-1 flex items-center justify-center py-4 my-auto max-w-6xl mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev button */}
            <button
              type="button"
              onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : 0))}
              className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-sm transition-all transform hover:scale-110"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Current Image */}
            <div className="max-h-[72vh] flex items-center justify-center overflow-hidden rounded-xl shadow-2xl border border-white/10 bg-slate-950">
              <img
                src={galleryImages[activeImageIndex].url}
                alt={galleryImages[activeImageIndex].title}
                className="max-h-[72vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={() => setActiveImageIndex((prev) => (prev !== null ? (prev + 1) % galleryImages.length : 0))}
              className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white border border-white/20 backdrop-blur-sm transition-all transform hover:scale-110"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Lightbox Footer Info */}
          <div
            className="border-t border-white/10 pt-4 max-w-4xl mx-auto w-full text-center z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-bold text-white tracking-tight">
              {galleryImages[activeImageIndex].title}
            </h4>
            {galleryImages[activeImageIndex].caption && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl mx-auto leading-relaxed font-normal">
                {galleryImages[activeImageIndex].caption}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Deliverable Technical Scope Modal */}
      <DeliverableDetailModal
        deliverable={activeDeliverableModal}
        serviceTitle={service.title}
        division={service.division}
        onClose={() => setActiveDeliverableModal(null)}
        onInquire={handleInquireSubService}
      />

    </div>
  );
};

export default ServiceDetail;
