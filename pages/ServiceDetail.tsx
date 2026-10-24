import React, { useEffect, useState } from 'react';
import { useServices, submitContactInquiry, FALLBACK_SERVICES } from '../hooks/useSupabaseData';
import { PROJECTS, LEGACY_SERVICE_MAP, GROUND_INTELLIGENCE_SERVICES, SERVICES } from '../site_data';
import { SERVICE_DETAILS_MAP, SERVICE_GALLERY_PRESETS, getEmbedVideoUrl } from './ServicesDetailsData';
import { ServiceGalleryImage, ServiceDeliverableItem, CMSService } from '../types';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import NativeVideoPlayer from '../components/NativeVideoPlayer';

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
            aria-label="Full Name"
            placeholder="Engr. Emeka Okonkwo"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 rounded-md focus:outline-none focus:border-emerald-700 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Corporate Email</label>
          <input 
            type="email" 
            required 
            aria-label="Corporate Email"
            placeholder="e.okonkwo@operator.com"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 rounded-md focus:outline-none focus:border-emerald-700 transition-colors"
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
          aria-label="Project Scope and Technical Parameters"
          placeholder="Specify operational asset, target coordinates, environmental conditions (swamp/nearshore/deepwater), or standards required..."
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-white border border-slate-300 px-4 py-3 text-slate-900 rounded-md focus:outline-none focus:border-emerald-700 transition-colors resize-none"
        ></textarea>
      </div>
      <button 
        type="submit" 
        className="inline-flex items-center px-8 py-4 bg-emerald-700 text-white font-bold hover:bg-emerald-800 transition-colors rounded-md shadow-md hover-lift cursor-pointer"
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

  // Find base service: prioritize exact canonical match first, only falling back to legacy alias if no exact match exists
  const staticDef = SERVICES.find((s) => s.id === id);
  const staticDefCMS: CMSService | undefined = staticDef ? {
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
  } as CMSService : undefined;

  const exactFromServices = services.find((s) => s.slug === id || s.id === id);
  const exactFromFallback = FALLBACK_SERVICES.find((s) => s.slug === id || s.id === id);
  const exactFromStatic = staticDefCMS;

  const legacyFromServices = services.find((s) => (s.slug && LEGACY_SERVICE_MAP[s.slug] === id) || (s.id && LEGACY_SERVICE_MAP[s.id] === id));
  const legacyFromFallback = FALLBACK_SERVICES.find((s) => (s.slug && LEGACY_SERVICE_MAP[s.slug] === id) || (s.id && LEGACY_SERVICE_MAP[s.id] === id));

  const service = exactFromServices || exactFromFallback || exactFromStatic || legacyFromServices || legacyFromFallback;
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

  // Scroll to hash target if present, or scroll to top on mount
  useEffect(() => {
    if (window.location.hash) {
      const targetHash = window.location.hash;
      const target = document.querySelector(targetHash);
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [id, pathname]);

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

  const otherDivisions = SERVICES.filter(s => s.id !== service.id && s.id !== id);
  const operatingEnvironments = service.operating_environments?.length > 0
    ? service.operating_environments
    : fallbackDetails?.whereWeOperate || [];
  const equipmentList = service.equipment?.length > 0
    ? service.equipment
    : fallbackDetails?.equipment || [];
  const methodologyList = service.methodology?.length > 0
    ? service.methodology
    : fallbackDetails?.methodology || [];

  const standardsList: string[] = (service.standards && service.standards.length > 0)
    ? service.standards
    : (fallbackDetails?.standards || []);

  const deliverablesList: string[] = (service.key_deliverables && service.key_deliverables.length > 0)
    ? service.key_deliverables
    : (fallbackDetails?.keyDeliverables || []);

  const hasSectionDContent = methodologyList.length > 0 || standardsList.length > 0 || equipmentList.length > 0 || deliverablesList.length > 0;

  const [selectedSubServiceScope, setSelectedSubServiceScope] = useState<string>('');

  const capabilitiesList: string[] = (service?.capabilities && service.capabilities.length > 0)
    ? service.capabilities
    : ((service as any)?.items || fallbackDetails?.methodology || []);

  const subServicesList = (service.subServices && service.subServices.length > 0)
    ? service.subServices
    : (fallbackDetails?.subServices || ((service.slug === 'ground-intelligence' || id === 'ground-intelligence') ? GROUND_INTELLIGENCE_SERVICES : []));

  // Dynamic SEO metadata management (title and description)
  useEffect(() => {
    if (service) {
      document.title = service.meta_title || `${service.title} | PIGL Specialist Engineering`;
      const metaDescription = service.meta_description || service.short_description || '';
      let metaTag = document.querySelector('meta[name="description"]');
      if (metaTag) {
        metaTag.setAttribute('content', metaDescription);
      } else if (metaDescription) {
        metaTag = document.createElement('meta');
        metaTag.setAttribute('name', 'description');
        metaTag.setAttribute('content', metaDescription);
        document.head.appendChild(metaTag);
      }
    }
  }, [service]);

  const handleInquireSubService = (subTitle: string) => {
    setSelectedSubServiceScope(subTitle);
    const el = document.getElementById('consultation-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col bg-white font-sans">
      {/* Section A: Hero */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.hero_image || service.card_image}
            alt={`${service.title} - PIGL Specialist Engineering`}
            className="w-full h-full object-cover opacity-35 grayscale-[0.1]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/assets/slider.jpeg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-8">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="/services" className="hover:text-white transition-colors">Services</a>
            <span className="text-slate-600">/</span>
            <span className="text-white truncate max-w-[240px] sm:max-w-none">{service.title}</span>
          </div>

          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {service.abbreviation && (
                <span className="text-xs font-mono font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-300 px-3 py-1 border border-emerald-400/30">
                  {service.abbreviation}
                </span>
              )}
              {service.descriptor && (
                <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                  {service.descriptor}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              {service.hero_heading || service.title}
            </h1>
            {service.positioning && (
              <p className="text-lg md:text-xl text-emerald-400 font-medium mb-4 italic">
                "{service.positioning}"
              </p>
            )}
            {service.tagline && !service.positioning && (
              <p className="text-xl text-emerald-400 font-medium mb-6">
                {service.tagline}
              </p>
            )}
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              {service.short_description}
            </p>

            {/* Primary CTA in Hero */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={service.cta_url || "#consultation-form"}
                onClick={(e) => {
                  const dest = service.cta_url || "#consultation-form";
                  if (dest.startsWith('#')) {
                    e.preventDefault();
                    const targetEl = document.getElementById(dest.replace('#', ''));
                    if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide transition-colors shadow-lg hover-lift rounded-md"
              >
                {service.cta_text || 'Discuss a Project'} <span className="ml-2">→</span>
              </a>
              {subServicesList.length > 0 && (
                <a
                  href="#capabilities-section"
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById('capabilities-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-bold text-sm tracking-wide transition-colors rounded-md"
                >
                  View Core Capabilities
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* Section B: Service Overview */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start reveal">
            {/* Left: Deep Overview */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Service Overview</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {service.overview_heading || 'Engineering Scope & Problem Resolution'}
                </h3>
              </div>
              <div className="text-slate-600 text-lg leading-relaxed font-normal space-y-4">
                <p>
                  {service.full_description || fallbackDetails?.longDescription}
                </p>
                {(service.engineering_problem_addressed || fallbackDetails?.engineeringProblemAddressed) && (
                  <div className="bg-emerald-900/5 border-l-4 border-emerald-600 p-5 rounded-r-lg mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                      Engineering Problem Addressed
                    </h4>
                    <p className="text-slate-700 text-sm md:text-base leading-relaxed font-medium">
                      {service.engineering_problem_addressed || fallbackDetails?.engineeringProblemAddressed}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Operational Video & Integrated Commercial Value */}
            <div className="lg:col-span-5 space-y-8">
              {/* Operational Video if configured */}
              {rawVideoUrl && (
                <NativeVideoPlayer
                  src={rawVideoUrl}
                  poster={service.hero_image || service.card_image}
                  title={`${service.title} Operational Video`}
                  className="hover-lift"
                />
              )}

              {/* Integrated Commercial Value & Operator Assurance */}
              <div className="bg-slate-50 p-8 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col hover-lift rounded-lg">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Commercial Value & Operator Assurance</h3>
                <p className="text-slate-600 leading-relaxed font-normal text-base mb-6">
                  {service.business_value || fallbackDetails?.businessValue || 'High-fidelity engineering execution designed to eliminate rework, reduce operational risk, and assure statutory compliance.'}
                </p>
                <div className="border-t border-slate-200 pt-6 mt-auto space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance & Standards</p>
                  <p className="text-sm font-bold text-slate-800">ISO 9001:2015 & ISO 45001:2018 Certified</p>
                  <p className="text-xs text-slate-500">NUPRC Regulated • 100% Nigerian Content Compliant</p>
                </div>
              </div>

              {/* Strategic Partner Callout if present */}
              {service.partner_badge && (
                <div className="bg-slate-900 text-white p-6 border border-slate-800 relative overflow-hidden flex flex-col rounded-lg">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2">
                    <span>Strategic Technology Alliance</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">{service.partner_badge.partnerName}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed mb-4">
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

      {/* Section C: Core Capabilities */}
      {subServicesList.length > 0 && (
        <section id="capabilities-section" className="py-20 md:py-28 bg-slate-50 border-b border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 reveal">
              <div className="max-w-3xl">
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                  Core Capabilities
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                  Capabilities Under {service.abbreviation ? `${service.abbreviation} — ` : ''}{service.title}
                </h3>
              </div>
              <p className="text-slate-600 text-sm md:text-base max-w-md mt-4 md:mt-0 font-normal leading-relaxed">
                Dedicated engineering capabilities executed to rigorous international and Nigerian regulatory standards.
              </p>
            </div>

            {/* 4 in a row layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subServicesList.map((sub, idx) => (
                <div
                  key={sub.id || idx}
                  id={sub.id}
                  className="group relative bg-white border border-slate-200 p-6 shadow-xs hover:border-emerald-600 hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover-lift scroll-mt-28 reveal rounded-lg"
                >
                  {/* Subtle top accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div>
                    {sub.image && (
                      <div className="mb-4 h-32 w-full rounded-md overflow-hidden bg-slate-100 border border-slate-200">
                        <img
                          src={sub.image}
                          alt={sub.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-emerald-700 tracking-wider">
                        0{idx + 1}
                      </span>
                      {sub.icon && (
                        <div className="w-9 h-9 bg-slate-50 border border-slate-100 flex items-center justify-center text-base group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-colors rounded-md">
                          <span>{sub.icon}</span>
                        </div>
                      )}
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-2.5 group-hover:text-emerald-700 transition-colors">
                      {sub.title}
                    </h4>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleInquireSubService(sub.title)}
                      className="text-xs font-bold text-emerald-700 group-hover:text-emerald-900 inline-flex items-center transition-colors cursor-pointer"
                    >
                      <span>Inquire About This Capability</span>
                      <span className="ml-1.5 transform group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      
      {/* Section D: Delivery, Methods, Technology & Deliverables */}
      {hasSectionDContent && (
        <section id="delivery-section" className="py-20 md:py-28 bg-white border-b border-slate-200 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-14 reveal">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                Delivery, Methods & Technology
              </span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Execution Methodology, Equipment Spreads & Deliverables
              </h3>
              <p className="text-slate-600 text-base mt-4 font-normal leading-relaxed">
                Every campaign is executed under certified quality and safety management systems (ISO 9001:2015, ISO 45001:2018), complying with statutory Nigerian upstream regulations (NUPRC) and relevant international engineering standards.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: Methodologies & Standards */}
              <div className="lg:col-span-7 space-y-8 reveal">
                {/* Methodologies */}
                {methodologyList.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200/80 p-8 rounded-lg">
                    <h4 className="text-xl font-bold text-slate-900 tracking-tight mb-4 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Operational Methodologies</span>
                    </h4>
                    <ul className="space-y-3">
                      {methodologyList.map((m, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 leading-relaxed">
                          <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2"></span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quality Standards & Regulatory Compliance */}
                {standardsList.length > 0 && (
                  <div className="bg-white border border-slate-200 p-8 rounded-lg shadow-xs">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Engineering Codes & Statutory Standards</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {standardsList.map((std, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600 leading-normal bg-slate-50 p-2.5 rounded border border-slate-100">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span className="font-medium">{std}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right: Field Equipment & Certified Deliverables */}
              <div className="lg:col-span-5 space-y-8 reveal">
                {/* Field Equipment */}
                {equipmentList.length > 0 && (
                  <div className="bg-slate-900 text-white p-8 rounded-lg shadow-md border border-slate-800">
                    <h4 className="text-xl font-bold text-white tracking-tight mb-4 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span>Mobilised Equipment & Spreads</span>
                    </h4>
                    <ul className="space-y-3">
                      {equipmentList.map((eq, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <span className="text-emerald-400 font-bold shrink-0">▸</span>
                          <span>{eq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Verified Key Deliverables */}
                {deliverablesList.length > 0 && (
                  <div className="bg-emerald-50/50 border border-emerald-200/80 p-8 rounded-lg">
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight mb-4 flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Certified Client Deliverables</span>
                    </h4>
                    <ul className="space-y-2.5">
                      {deliverablesList.map((deliv, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5 text-xs text-slate-800 leading-relaxed">
                          <span className="text-emerald-700 font-bold shrink-0">●</span>
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Section E: Relevant Project Imagery or Field Experience */}
      {galleryImages.length > 0 && (
        <section className="py-20 md:py-28 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
              <div>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">
                  Project Imagery & Field Experience
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  Operational Records & Field Experience
                </h3>
              </div>
              <p className="text-slate-500 text-sm max-w-md mt-4 md:mt-0 font-normal">
                Authentic field mobilization, sensor spreads, and certified engineering execution for {service.title}. Click any image to inspect in full detail.
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
                    alt={img.alt || img.title || `${service.title} operational record`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg';
                    }}
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

      {/* Section F: Primary Enquiry Call to Action */}
      <section id="consultation-form" className="py-20 md:py-28 bg-white border-b border-slate-200 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 border border-slate-200 p-8 md:p-14 reveal rounded-xl">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-2">Project Consultation</span>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">
              Discuss a Project with PIGL Engineers
            </h3>
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              Discuss specific operational parameters, mobilization schedules, or technical survey specifications for <strong>{service.title}</strong> with our engineering teams in Port Harcourt and Lagos.
            </p>
            <ServiceDetailContactForm 
              serviceTitle={service.title} 
              initialScope={selectedSubServiceScope} 
            />
          </div>
        </div>
      </section>

      {/* 5. Other Operating Divisions */}
      {otherDivisions.length > 0 && (
        <section className="py-20 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Other Operating Divisions
              </h3>
              <a href="/services" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 uppercase tracking-wider">
                All Divisions →
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherDivisions.map((rel) => (
                <a
                  key={rel.id}
                  href={`/services/${rel.id}`}
                  className="bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-emerald-700 transition-all flex flex-col justify-between group hover-lift rounded-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        {rel.abbreviation || 'Division'}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors mb-2">
                      {rel.title}
                    </h4>
                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>View Division Details</span>
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
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg';
                }}
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

    </div>
  );
};

export default ServiceDetail;
