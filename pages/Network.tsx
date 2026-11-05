import React, { useEffect } from 'react';
import { PARTNERS } from '../site_data';
import { usePartners, usePageHeaders } from '../hooks/useSupabaseData';
import MarineIntelImg from '../assets/marine_intel_metocean.jpg';
import WaterTreatmentSkidImg from '../assets/water_treatment_skid.jpg';
import ProcurementImg from '../assets/procure.jpg';
import NetworkHeroBg from '../assets/slider.jpeg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Network: React.FC = () => {
  const { partners: dynamicPartners, loading } = usePartners();
  const displayPartners = dynamicPartners && dynamicPartners.length > 0 ? dynamicPartners : PARTNERS;
  const { getPageHeader } = usePageHeaders();
  const pageHeader = getPageHeader('network');
  const breadcrumbImage = pageHeader.effective_image || NetworkHeroBg;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const partnerImages: Record<string, string> = {
    frankstar: MarineIntelImg,
    coalexpert: WaterTreatmentSkidImg,
    npk: ProcurementImg
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={breadcrumbImage}
            alt="Our Professional Network and Technology Alliances"
            className="w-full h-full object-cover grayscale-[0.2]"
            style={{ opacity: 1 - (pageHeader.overlay_opacity ?? 0.25) }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-emerald-400">Our Network</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Our Network
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Combining 100% indigenous Nigerian engineering leadership and field execution with carefully selected specialist technology relationships, equipment representations, and delivery collaborations.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Editorial Organisations Showcase (Alternating Layout) */}
      <section className="py-16 md:py-24 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-16 text-slate-500 font-mono text-sm">
              Loading network directory...
            </div>
          )}

          <div className="space-y-16 lg:space-y-24">
            {displayPartners.map((partner, idx) => {
              const contextImage = partnerImages[partner.id] || (partner as any).image_url || MarineIntelImg;
              const isReversed = idx % 2 === 1;

              return (
                <article
                  key={partner.id || idx}
                  id={partner.id}
                  className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-slate-200/80 hover:border-slate-300 transition-all duration-300 ease-out group motion-reduce:transition-none motion-reduce:hover:transform-none"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                    {/* Photographic Visual Column (Alternating on Desktop) */}
                    <div
                      className={`lg:col-span-6 relative bg-slate-950 min-h-[300px] sm:min-h-[380px] lg:min-h-[500px] overflow-hidden ${
                        isReversed ? 'lg:order-2' : 'lg:order-1'
                      }`}
                    >
                      <img
                        src={contextImage}
                        alt={`${partner.name} - Technical Collaboration`}
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = MarineIntelImg;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

                      {/* Operational Alignment Callout on Photo Base */}
                      {partner.specialty && (
                        <div className="absolute bottom-6 left-6 right-6 text-white pointer-events-none z-10">
                          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                            Operational Alignment
                          </span>
                          <p className="text-sm font-semibold text-slate-100 leading-snug">
                            {partner.specialty}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Content Column */}
                    <div
                      className={`lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between ${
                        isReversed ? 'lg:order-1' : 'lg:order-2'
                      }`}
                    >
                      <div>
                        {/* Organisation Name */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4 group-hover:text-emerald-900 transition-colors duration-200">
                          {partner.name}
                        </h2>

                        {/* Narrative Description */}
                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                          {partner.description}
                        </p>

                        {/* Capabilities & Scope */}
                        {partner.capabilities && partner.capabilities.length > 0 && (
                          <div className="mb-6 pt-5 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-3 font-mono">
                              Capabilities &amp; Scope
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600">
                              {partner.capabilities.map((cap: string, cIdx: number) => (
                                <li key={cIdx} className="flex items-center space-x-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                                  <span className="leading-snug">{cap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Links Row (Anchored to bottom) */}
                      <div className="pt-6 border-t border-slate-100 flex items-center gap-4 mt-6">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition-colors group/link"
                          >
                            <span>Visit Official Website</span>
                            <span className="ml-1.5 transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-200">
                              ↗
                            </span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium font-mono">
                            Verified Technical Relationship
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {displayPartners.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200 rounded-2xl">
              <p className="text-slate-600 font-medium">No organisations found in the network directory.</p>
            </div>
          )}

          {/* 3. Distinctive Collaboration CTA Banner */}
          <div className="mt-20 lg:mt-28 p-10 sm:p-14 lg:p-16 bg-slate-900 text-white rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />
            <div className="max-w-3xl relative z-10 space-y-4">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block font-mono">
                Alliances &amp; Technical Representations
              </span>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Explore Technical Collaboration With PIGL
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal max-w-2xl">
                We continuously evaluate specialist technical relationships, instrumentation distributorships, and engineering alliances to address evolving energy and infrastructure challenges in West Africa.
              </p>
              <div className="pt-3">
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors rounded-xl shadow-lg hover:shadow-emerald-900/30 group/btn cursor-pointer"
                >
                  <span>Contact Commercial Desk</span>
                  <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Network;
