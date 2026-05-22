import React, { useEffect } from 'react';
import { SERVICES } from '../site_data';
import { SERVICE_DETAILS_MAP } from './ServicesDetailsData';

const ServiceDetail: React.FC = () => {
  // Get active service ID from URL hash query params
  const hashParts = window.location.hash.split('?');
  const params = new URLSearchParams(hashParts[1] || '');
  const id = params.get('id');

  // Find base service and long-form details
  const service = SERVICES.find((s) => s.id === id);
  const details = id ? SERVICE_DETAILS_MAP[id] : null;

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

    return () => observer.disconnect();
  }, [id]);

  // Fallback for invalid or missing service IDs
  if (!service || !details) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-20 font-sans">
        <div className="max-w-md w-full bg-white p-10 border border-slate-200 text-center shadow-lg hover-lift">
          <div className="text-6xl mb-6">⚠️</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Service Not Found</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            The service you are looking for could not be located. It may have been renamed or relocated.
          </p>
          <a
            href="#/services"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-emerald-950 text-white font-bold tracking-wide hover:bg-emerald-800 transition-colors"
          >
            ← Back to Services
          </a>
        </div>
      </div>
    );
  }

  const categoryLabel = service.category === 'Geosolutions' ? 'Geosolutions Division' : 'Integrated Division';
  const contactJobParam = service.category === 'Geosolutions' ? 'Geosolutions Services' : 'Integrated Services';

  return (
    <div className="flex flex-col bg-white font-sans">
      {/* 1. Sleek Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-35 grayscale-[0.1]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <a href="#/services" className="hover:text-white transition-colors">Services</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">{service.title}</span>
          </div>

          <div className="max-w-4xl">
            <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] block mb-3">
              {categoryLabel}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-8">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              {service.description}
            </p>
          </div>
        </div>
      </section>

      {/* 2. Overview and Commercial Impact Section */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start reveal">
            {/* Left: Deep Overview */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-emerald-700">Service Overview</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Technical Precision & Professional Execution
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal pt-2">
                {details.longDescription}
              </p>
              
              <div className="pt-6">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Core Deliverables & Focal Points:</h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 bg-slate-50 p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                      <span className="flex-shrink-0 w-2 h-2 bg-emerald-600 rounded-none mt-2"></span>
                      <span className="text-slate-800 font-bold text-sm leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Commercial Impact Callout */}
            <div className="lg:col-span-5">
              <div className="bg-slate-50 p-8 md:p-10 border border-slate-200/80 shadow-sm relative overflow-hidden flex flex-col hover-lift">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Commercial Value & Industry Impact</h3>
                <p className="text-slate-600 leading-relaxed font-normal text-base mb-6">
                  {details.businessValue}
                </p>
                <div className="border-t border-slate-200 pt-6 mt-auto">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Standards Alignment</p>
                  <p className="text-sm font-bold text-slate-700">ISO 9001:2015 & HSE Excellence Compliant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Methodology / Operational Workflow Timeline */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 md:mb-20 reveal">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] block mb-3">Our Methodology</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">How We Execute</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-normal mt-4">
              We employ a standardized, safety-driven workflow configured for extreme terrains (onshore, nearshore, swamp, or offshore) to ensure maximum data fidelity and structural assurance.
            </p>
          </div>

          <div className="relative border-l border-slate-300 ml-4 md:ml-6 space-y-12 pb-2 reveal">
            {details.methodology.map((step, index) => (
              <div key={index} className="relative pl-8 md:pl-12 group">
                {/* Timeline node */}
                <div className="absolute -left-[17px] top-1.5 flex items-center justify-center w-8 h-8 rounded-none border border-slate-300 bg-white text-slate-700 text-xs font-black uppercase tracking-wider group-hover:bg-emerald-950 group-hover:text-white group-hover:border-emerald-950 transition-all duration-300">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight group-hover:text-emerald-800 transition-colors mb-2">
                    Phase 0{index + 1}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-normal text-base md:text-lg max-w-4xl">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Equipment Grid Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 reveal">
            <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] block mb-3">Deployed Technology</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">High-End Instrumentation</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-normal mt-4">
              We own and operate state-of-the-art surveying systems and engineering equipment to guarantee sub-millimeter precision in the most volatile environments.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 reveal">
            {details.equipment.map((item, index) => (
              <div key={index} className="p-8 border border-slate-200 bg-slate-50 flex items-start space-x-5 hover:shadow-lg hover:border-slate-300 hover-lift transition-all duration-300">
                <div className="text-xl mt-1 text-emerald-700">⚙️</div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight tracking-tight mb-2">
                    {item}
                  </h3>
                  <p className="text-xs text-slate-500 font-black tracking-widest uppercase">
                    Commercial Spec
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Sleek Call to Action Container */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden reveal">
        <div className="absolute inset-0 bg-emerald-950/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-3xl text-left">
            <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Project Consultation</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Ready to secure engineering assurance for your asset?
            </h2>
            <p className="text-slate-300 leading-relaxed font-normal text-base md:text-lg">
              Collaborate with Polaris Integrated & GeoSolutions Limited. We deliver high-fidelity spatial data and sub-surface integrity surveys customized for your exact operations.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={`#/contact?job=${encodeURIComponent(contactJobParam)}`}
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase transition-colors"
            >
              Request a Consult <span className="ml-2 font-normal text-lg">→</span>
            </a>
            <a
              href="#/services"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white/60 hover:border-white text-white font-bold text-sm tracking-wider uppercase transition-colors"
            >
              All Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
