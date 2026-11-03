import React, { useState, useEffect } from 'react';
import { PARTNERS } from '../site_data';
import { usePartners } from '../hooks/useSupabaseData';
import MarineIntelImg from '../assets/marine_intel_metocean.jpg';
import WaterTreatmentImg from '../assets/drilling.png';
import ProcurementImg from '../assets/procure.jpg';
import NetworkHeroBg from '../assets/slider.jpeg';
import FrankstarLogo from '../assets/frankstar_logo.png';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';

const Network: React.FC = () => {
  const { partners: dynamicPartners, loading } = usePartners();
  const displayPartners = dynamicPartners && dynamicPartners.length > 0 ? dynamicPartners : PARTNERS;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = [
    'All',
    'Strategic and Technical Relationships',
    'Authorised Distributorships and Representations',
    'Technology and Delivery Collaborations'
  ];

  const getPartnerCategory = (partner: any): string => {
    if (partner.relationship_type) return partner.relationship_type;
    if (partner.id === 'frankstar') return 'Technology and Delivery Collaborations';
    if (partner.id === 'coalexpert') return 'Strategic and Technical Relationships';
    if (partner.id === 'npk') return 'Authorised Distributorships and Representations';
    return 'Strategic and Technical Relationships';
  };

  const filteredPartners = selectedCategory === 'All'
    ? displayPartners
    : displayPartners.filter(p => getPartnerCategory(p) === selectedCategory);

  const partnerImages: Record<string, string> = {
    frankstar: MarineIntelImg,
    coalexpert: WaterTreatmentImg,
    npk: ProcurementImg
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 1. Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={NetworkHeroBg}
            alt="Our Professional Network and Technology Alliances"
            className="w-full h-full object-cover opacity-25 grayscale-[0.2]"
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
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-3">
              Commercial, Technical & Operational Relationships
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
              Our Network
            </h1>
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed">
              Combining 100% indigenous Nigerian engineering leadership and field execution with carefully selected specialist technology relationships, equipment representations, and delivery collaborations.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine />
        </div>
      </section>

      {/* 2. Relationship Category Filters */}
      <section className="bg-slate-50 border-b border-slate-200 sticky top-16 md:top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto py-4 space-x-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Organisations List */}
      <section className="py-16 md:py-24 bg-white flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="text-center py-16 text-slate-500 font-mono text-sm">
              Loading network directory...
            </div>
          )}

          <div className="space-y-16">
            {filteredPartners.map((partner, idx) => {
              const categoryBadge = getPartnerCategory(partner);
              const contextImage = partnerImages[partner.id] || partner.logo_url || MarineIntelImg;

              return (
                <div
                  key={partner.id || idx}
                  id={partner.id}
                  className="bg-white border border-slate-200 hover:border-emerald-600/70 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Visual & Context Column */}
                    <div className="lg:col-span-5 relative bg-slate-950 min-h-[260px] lg:min-h-full overflow-hidden">
                      <img
                        src={contextImage}
                        alt={`${partner.name} - Technical Collaboration`}
                        className="w-full h-full object-cover opacity-80"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/assets/operations/pigl_subbottom_profiler_sb216s.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
                      
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                          Operational Alignment
                        </span>
                        <p className="text-sm font-semibold text-slate-200">
                          {partner.specialty}
                        </p>
                      </div>
                    </div>

                    {/* Details Column */}
                    <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            {categoryBadge}
                          </span>
                          <span className="text-xs font-mono text-slate-400">
                            {partner.serviceTitle}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">
                          {partner.name}
                        </h2>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4">
                          {partner.role}
                        </p>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                          {partner.description}
                        </p>

                        {partner.capabilities && partner.capabilities.length > 0 && (
                          <div className="mb-6 pt-4 border-t border-slate-100">
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">
                              Capabilities & Scope:
                            </span>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                              {partner.capabilities.map((cap, cIdx) => (
                                <li key={cIdx} className="flex items-start">
                                  <span className="text-emerald-600 font-bold mr-2">✓</span>
                                  <span>{cap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        {partner.website ? (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 transition-colors"
                          >
                            <span>Visit Official Website</span>
                            <span className="ml-1.5">↗</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Verified Relationship</span>
                        )}

                        <a
                          href={`/services/${partner.serviceId || 'geosolutions-engineering-services'}`}
                          className="inline-flex items-center px-5 py-2.5 bg-slate-100 hover:bg-emerald-800 hover:text-white text-slate-800 text-xs font-bold uppercase tracking-wider transition-colors rounded"
                        >
                          View Associated Division →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-16 bg-slate-50 border border-slate-200">
              <p className="text-slate-600 font-medium">No organisations found in this category.</p>
            </div>
          )}

          {/* 4. Strategic Network Engagement Banner */}
          <div className="mt-20 p-8 sm:p-12 bg-slate-900 text-white rounded-none border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="max-w-2xl">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-2">
                Alliances & Technical Representations
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                Explore Technical Collaboration With PIGL
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We continuously evaluate specialist technical relationships, instrumentation distributorships, and engineering alliances to address evolving energy and infrastructure challenges in West Africa.
              </p>
            </div>
            <a
              href="/contact"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md shrink-0"
            >
              Contact Commercial Desk
            </a>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Network;
