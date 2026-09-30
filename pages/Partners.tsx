import React, { useEffect } from 'react';
import { PARTNERS } from '../site_data';
import { usePartners } from '../hooks/useSupabaseData';
import MarineIntelImg from '../assets/marine_intel_metocean.jpg';
import WaterTreatmentImg from '../assets/drilling.png';
import ProcurementImg from '../assets/procure.jpg';
import PartnersHeroBg from '../assets/slider.jpeg';
import FrankstarLogo from '../assets/frankstar_logo.png';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Partners: React.FC = () => {
  const { partners: dynamicPartners, loading } = usePartners();
  const displayPartners = dynamicPartners && dynamicPartners.length > 0 ? dynamicPartners : PARTNERS;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
  }, [displayPartners]);

  const partnerImages: Record<string, string> = {
    frankstar: MarineIntelImg,
    coalexpert: WaterTreatmentImg,
    npk: ProcurementImg
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* 1. Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={PartnersHeroBg} 
            alt="Strategic Technology Partners" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.2]"
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
            <span className="text-white">Partners & Technology</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Partners & Technology
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed max-w-3xl">
              Combining 100% indigenous Nigerian engineering leadership and field execution with carefully selected specialist global technology partners.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Philosophy & Framework */}
      <section className="py-20 md:py-28 bg-slate-50 border-b border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">Integration Model</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                Indigenous Execution Enhanced by Global Technology
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                At PIGL, we believe that delivering engineering certainty in challenging physical environments requires the synthesis of deep local operating knowledge and high-fidelity technological tools.
              </p>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                Our technology partnerships do not replace our engineering autonomy—they reinforce our capability to solve high-stakes challenges across marine environmental observation, produced water separation, and critical industrial supply chains.
              </p>
            </div>

            <div className="lg:col-span-5 bg-white p-8 md:p-10 border border-slate-200 shadow-sm relative">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-700"></div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-4">Our Partnership Principles</h3>
              <ul className="space-y-4 text-sm text-slate-700 leading-relaxed font-medium">
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-emerald-600 mt-2 flex-shrink-0"></span>
                  <span><strong>Proven Field Track Record:</strong> Only technologies with verified industrial reliability are integrated.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-emerald-600 mt-2 flex-shrink-0"></span>
                  <span><strong>Local Content Alignment:</strong> Field deployment, operations, and management remain 100% indigenous.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="w-1.5 h-1.5 bg-emerald-600 mt-2 flex-shrink-0"></span>
                  <span><strong>High-Fidelity Assurance:</strong> Absolute data transparency and compliance with NUPRC, ISO, and API standards.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Partner Capability Showcases */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {displayPartners.map((partner: any, index: number) => {
            const isReversed = index % 2 === 1;
            const img = partner.image_url || partnerImages[partner.id] || MarineIntelImg;
            const logo = partner.logo_url || (partner.id === 'frankstar' ? FrankstarLogo : null);
            const serviceId = partner.service_id || partner.serviceId || 'offshore-intelligence';
            const serviceTitle = partner.service_title || partner.serviceTitle || 'Offshore Intelligence';

            return (
              <div 
                key={partner.id || partner.slug || index} 
                id={partner.id || partner.slug}
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center reveal"
              >
                {/* Image Column */}
                <div className={`lg:col-span-5 ${isReversed ? 'lg:order-2' : ''}`}>
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 border border-slate-200 shadow-md group">
                    <img 
                      src={img} 
                      alt={`${partner.name} - ${partner.role}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Content Column */}
                <div className={`lg:col-span-7 space-y-6 ${isReversed ? 'lg:order-1' : ''}`}>
                  <div className="space-y-3">
                    <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">
                      {partner.role}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                          {partner.name}
                        </h3>
                        {partner.specialty && (
                          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mt-1">
                            {partner.specialty}
                          </p>
                        )}
                      </div>
                      {logo && (
                        <div className="bg-slate-950 px-4 py-2.5 border border-slate-800 flex items-center justify-center shrink-0 w-fit">
                          <img 
                            src={logo} 
                            alt={`${partner.name} Logo`} 
                            className="h-8 md:h-10 w-auto object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 text-lg leading-relaxed font-normal">
                    {partner.description}
                  </p>

                  {partner.capabilities && partner.capabilities.length > 0 && (
                    <div className="bg-slate-50 border border-slate-200/80 p-6 md:p-8">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4">
                        Integrated Capabilities & Solutions:
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {partner.capabilities.map((cap: string, cIdx: number) => (
                          <li key={cIdx} className="flex items-start space-x-3 text-slate-700 font-bold text-sm">
                            <span className="w-1.5 h-1.5 bg-emerald-600 mt-2 flex-shrink-0"></span>
                            <span className="leading-snug">{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <a
                      href={`/services/${serviceId}`}
                      className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition-colors group"
                    >
                      Explore {serviceTitle} <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </a>

                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors"
                      >
                        Partner Reference <svg className="w-3.5 h-3.5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* 4. Consultation Banner */}
      <section className="bg-slate-900 text-white py-16 md:py-24 relative overflow-hidden reveal">
        <div className="absolute inset-0 bg-emerald-950/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-3xl text-left">
            <p className="text-emerald-400 font-black text-xs uppercase tracking-[0.2em] mb-3">Partner Engagement</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Interested in technology partnership or specialist deployment?
            </h2>
            <p className="text-slate-300 leading-relaxed font-normal text-base md:text-lg">
              We collaborate with premier international technology providers and energy operators to engineer high-fidelity solutions tailored for the Sub-Saharan African market.
            </p>
          </div>
          <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm tracking-wider uppercase transition-colors"
            >
              Contact Our Technical Desk <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Partners;
