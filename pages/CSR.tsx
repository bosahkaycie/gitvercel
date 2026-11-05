import React, { useEffect } from 'react';
import { usePageHeaders } from '../hooks/useSupabaseData';
import { applySEO } from '../utils/seo';
import { MASTER_SEO_CONFIG } from '../utils/seoConfig';
import NextGenImg from '../assets/inspiring_next_gen.jpeg';
import LogBaseAerialImg from '../assets/operations/pigl_logistics_base_aerial.jpg';
import TeamImg from '../assets/team.jpeg';

const CSR: React.FC = () => {
  const { getPageHeader } = usePageHeaders();
  const pageHeader = getPageHeader('csr');
  const breadcrumbImage = pageHeader.has_custom_image ? pageHeader.breadcrumb_image : NextGenImg;

  useEffect(() => {
    const config = MASTER_SEO_CONFIG['/csr'];
    if (config) {
      applySEO({
        title: config.title,
        description: config.description,
        canonicalUrl: 'https://polarisigl.com/csr',
        keywords: config.keywords,
        breadcrumbs: config.breadcrumbs,
        ogImage: 'https://polarisigl.com/assets/inspiring_next_gen.jpeg'
      });
    }
  }, []);

  const csrPillars = [
    {
      number: '01',
      title: 'STEM Education & Youth Engineering Empowerment',
      description: 'PIGL actively invests in the next generation of Nigerian engineers through university partnerships, sponsored geospatial technology workshops, student internships, and practical fieldwork exposure in 3D laser scanning, hydrography, and geotechnical soil mechanics.',
      metrics: '350+ Students Mentored & Trained'
    },
    {
      number: '02',
      title: 'Local Content & Host Community Workforce Integration',
      description: 'We prioritize hiring, training, and retaining talent from our host communities across Rivers State and the Niger Delta. Our structured apprenticeship programs transition community youth into certified survey assistants, field mechanics, and laboratory technicians.',
      metrics: '85%+ Local Niger Delta Workforce'
    },
    {
      number: '03',
      title: 'Niger Delta Coastal & Marine Environmental Stewardship',
      description: 'Our environmental baseline surveys, non-invasive acoustic seafloor mapping, and zero-spill environmental protocols ensure sensitive mangrove swamps and marine ecosystems are protected during every geotechnical and construction campaign.',
      metrics: '100% Statutory Environmental Compliance'
    },
    {
      number: '04',
      title: 'Community Clean Potable Water Infrastructure',
      description: 'Leveraging our Industrial Solutions water treatment expertise, PIGL delivers reverse osmosis and deep borehole potable water stations to rural riverine communities, providing sustainable, safe drinking water to underserved populations.',
      metrics: 'Over 15,000 Community Beneficiaries'
    }
  ];

  return (
    <div className="flex flex-col bg-slate-50 font-sans">
      {/* 1. Header / Breadcrumb Section */}
      <section className="relative bg-slate-950 pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={breadcrumbImage}
            alt="PIGL Corporate Social Responsibility and STEM Community Engagement in Nigeria"
            className="w-full h-full object-cover"
            style={{ opacity: 1 - (pageHeader.overlay_opacity ?? 0.35) }}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = NextGenImg;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><span className="text-slate-500">/</span></li>
              <li className="text-slate-300" aria-current="page">CSR & Community</li>
            </ol>
          </nav>

          <div className="inline-block px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-mono text-xs uppercase tracking-wider mb-4">
            Corporate Social Responsibility & Community Stewardship
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            Empowering Communities. <br />
            <span className="text-emerald-400">Protecting Ecosystems.</span>
          </h1>

          <p className="mt-6 text-slate-300 max-w-2xl text-base md:text-lg leading-relaxed font-normal">
            At Polaris Integrated & GeoSolutions Limited (PIGL), sustainable engineering extends beyond commercial delivery. We build lasting partnerships with host communities across Port Harcourt, Rivers State, and the Niger Delta.
          </p>
        </div>
      </section>

      {/* 2. Core Values & Heritage Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 font-mono">Our Social Compact</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 mt-2 mb-6 tracking-tight">
                Engineering with Shared Value for Nigeria&apos;s Host Communities
              </h2>
              <p className="text-slate-600 leading-relaxed text-base mb-4 font-normal">
                Polaris Integrated & GeoSolutions Limited (PIGL) operates with deep respect for the social and ecological fabrics of the communities where we execute geotechnical, metocean, and pipeline infrastructure projects.
              </p>
              <p className="text-slate-600 leading-relaxed text-base mb-8 font-normal">
                Our Corporate Social Responsibility (CSR) policy is integrated into our ISO 9001:2015 and ISO 45001:2018 certified management framework. We ensure that every operational deployment leaves measurable benefits in education, healthcare, and economic self-reliance.
              </p>

              <div className="grid grid-cols-2 gap-6 border-t border-slate-100 pt-6">
                <div>
                  <div className="text-3xl font-black text-emerald-700 font-mono">500,000+</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Safe Man-Hours (Zero LTI)</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-700 font-mono">100%</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Indigenous Nigerian Ownership</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 aspect-video md:aspect-[4/3]">
                <img
                  src={NextGenImg}
                  alt="PIGL Engineers Inspiring Next-Generation STEM Students in Port Harcourt"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-6 rounded-xl shadow-xl max-w-xs hidden sm:block border border-slate-800">
                <p className="text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">Inspiring Future Engineers</p>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-normal">
                  Mentorship sessions introducing secondary and tertiary students to high-precision 3D reality capture and geotechnical engineering.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 4 CSR Pillars */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">Strategic Focus</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2 tracking-tight">
              PIGL Community Engagement Pillars
            </h2>
            <p className="text-slate-400 mt-4 text-base font-normal">
              Structured initiatives driving measurable educational, economic, and environmental impact across our operating theatres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {csrPillars.map((pillar) => (
              <div key={pillar.number} className="bg-slate-800/80 border border-slate-700/60 p-8 rounded-2xl hover:border-emerald-500/50 transition-all">
                <div className="flex items-baseline justify-between mb-4">
                  <span className="text-3xl font-black text-emerald-400 font-mono">{pillar.number}</span>
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/60">
                    {pillar.metrics}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{pillar.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed font-normal">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Commitment to Nigerian Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 font-mono">Nigerian Content Development</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 mb-3 tracking-tight">
                Strengthening Domestic Engineering Capabilities
              </h3>
              <p className="text-slate-700 text-sm md:text-base leading-relaxed font-normal">
                PIGL is 100% compliant with the Nigerian Oil and Gas Industry Content Development (NOGICD) Act. We retain engineering knowledge, invest in specialized laboratory equipment in Port Harcourt, and ensure our country retains critical subsurface data intelligence capabilities.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <a
                href="/about"
                className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center"
              >
                Learn More About PIGL
              </a>
              <a
                href="/contact"
                className="px-6 py-3.5 bg-white border border-slate-300 hover:border-emerald-600 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors text-center"
              >
                Contact CSR Desk
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CSR;
