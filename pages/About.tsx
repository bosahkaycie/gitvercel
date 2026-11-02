import React, { useEffect } from 'react';
import { TEAM } from '../site_data';
import { useTeamMembers } from '../hooks/useSupabaseData';
import AboutBg from '../assets/teaching.jpeg';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';
import InfraSketchImg from '../assets/infrastructure_sketch.jpg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import YouTubeFacade from '../components/YouTubeFacade';

// Authentic Operations Photography
import OpLogisticsBaseImg from '../assets/operations/pigl_logistics_base_aerial.jpg';
import OpMarineCrewImg from '../assets/operations/pigl_marine_crew_vessel.jpg';

const About: React.FC = () => {
  const { teamMembers } = useTeamMembers();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px 50px 0px'
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

    // Fallback timer: guarantees all sections are visible even if observer is delayed or blocked
    const timer = setTimeout(() => {
      revealElements.forEach(el => el.classList.add('active'));
    }, 600);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const searchSection = searchParams.get('section');
      const hashSection = window.location.hash ? window.location.hash.replace(/^#/, '') : null;
      const targetId = searchSection || hashSection;

      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 300);
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }, []);

  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* 1. Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={AboutBg} 
            alt="About PIGL - Engineering and Technical Solutions" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.1]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-10">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-500">/</span>
            <span className="text-white">About Us</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              About PIGL
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Polaris Integrated & GeoSolutions Limited (PIGL) is a Nigerian engineering and technical solutions company serving the energy, infrastructure and industrial sectors.
            </p>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Corporate Introduction & Documentary */}
      <section id="introduction" className="py-20 md:py-28 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Engineering and Technical Solutions
              </h2>
              
              <div className="space-y-5 text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                <p>
                  Polaris Integrated & GeoSolutions Limited (PIGL) is a Nigerian engineering and technical solutions company serving the energy, infrastructure and industrial sectors.
                </p>
                <p>
                  We bring together geoscience, marine, digital mapping, construction and industrial solutions to address technical challenges across different operating environments. Our work combines engineering knowledge, specialist equipment, field experience and technology to help clients make informed decisions and deliver their operations effectively.
                </p>
                <p>
                  We understand that clients need more than a service provider. They need a team that can work safely, understand operational requirements, deploy the right technical resources and deliver solutions that make commercial and operational sense.
                </p>
                <p>
                  That understanding shapes how we approach every assignment. We continuously assess new technologies, develop our technical capabilities and work with specialist technology partners to respond to changing industry needs. Whether undertaking an investigation, supporting marine operations, delivering infrastructure or implementing industrial treatment systems, our focus remains on practical solutions, responsible execution and lasting value.
                </p>
              </div>

              {/* Verified Credentials Summary */}
              <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">ISO</p>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1.5">9001:2015 & 45001:2018</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">Certified Quality & Occupational Health and Safety Management Systems.</p>
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 leading-none">100%</p>
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1.5">Nigerian-Owned Company</p>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">Indigenous engineering firm registered and compliant under the NOGICD Act.</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href={ProfilePDF}
                  download="PIGL_Company_Profile.pdf"
                  className="inline-flex items-center px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm uppercase tracking-wider transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4 mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Company Profile
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-slate-300 hover:border-emerald-700 text-slate-800 hover:text-emerald-700 font-bold text-sm uppercase tracking-wider transition-colors"
                >
                  Contact Our Team
                </a>
              </div>
            </div>

            {/* Right Video / Corporate Documentary Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="border border-slate-200 bg-slate-950 shadow-md overflow-hidden">
                <YouTubeFacade
                  videoId="sExrHCIGkH0"
                  title="PIGL Corporate Documentary & Overview"
                  poster="/assets/operations/pigl_offshore_geotech_drilling_barge.jpg"
                  duration="6:20"
                  className="w-full aspect-video border-0"
                />
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">Corporate Documentary</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Overview of PIGL field operations, geotechnical drilling vessels, reality capture surveys, and pipeline execution across Nigerian energy corridors.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Why Clients Work With PIGL */}
      <section id="why-pigl" className="py-20 md:py-28 bg-slate-50 border-y border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Why Clients Work With PIGL
            </h2>
            <p className="text-slate-600 text-base md:text-lg mt-3 font-normal leading-relaxed">
              We combine technical competence, field resources and sound commercial practices to support critical operations and capital projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* 1. Safety in Execution */}
            <div className="bg-white p-8 md:p-10 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Safety in Execution
                </h3>
                <p className="text-slate-600 text-base leading-relaxed font-normal">
                  We recognise the demands and risks associated with engineering and field operations. Safety considerations inform our planning, personnel deployment and execution practices.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>Audited Under ISO 45001:2018</span>
              </div>
            </div>

            {/* 2. Technical and Commercial Value */}
            <div className="bg-white p-8 md:p-10 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Technical and Commercial Value
                </h3>
                <p className="text-slate-600 text-base leading-relaxed font-normal">
                  We focus on fit-for-purpose solutions, efficient use of resources and technical approaches that address the client's actual requirements.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>Fit-for-Purpose Engineering Design</span>
              </div>
            </div>

            {/* 3. Capacity and Technical Partnerships */}
            <div className="bg-white p-8 md:p-10 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Capacity and Technical Partnerships
                </h3>
                <p className="text-slate-600 text-base leading-relaxed font-normal">
                  Our engineering personnel, specialist equipment and relationships with technology providers strengthen our ability to undertake diverse technical assignments.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>Specialist Equipment & Global Technology Alliances</span>
              </div>
            </div>

            {/* 4. Adaptability and Problem-Solving */}
            <div className="bg-white p-8 md:p-10 border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Adaptability and Problem-Solving
                </h3>
                <p className="text-slate-600 text-base leading-relaxed font-normal">
                  We continue to develop our capabilities and evaluate emerging technologies, applying them where they offer practical benefits to our clients and their operations.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <span>Field-Tested Methods in Challenging Environments</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Business Divisions */}
      <section id="divisions" className="py-20 md:py-28 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Our Business Divisions
            </h2>
            <p className="text-slate-600 text-base md:text-lg mt-3 font-normal leading-relaxed">
              PIGL operates through four specialized engineering and technical divisions, bringing together dedicated teams, calibrated equipment and certified procedures to address operational requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Division 1: GES */}
            <div className="p-8 border border-slate-200 bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">GES</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  GeoSolutions & Engineering Services
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal mb-6">
                  Geotechnical site investigations, 20-tonne hydraulic CPT testing, deep borehole drilling, marine geophysical surveys, bathymetric mapping, geohazard evaluation, and Leica RTC360 3D reality capture.
                </p>
              </div>
              <div>
                <a
                  href="/services/geosolutions-engineering-services"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  Explore GES Capabilities <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Division 2: MMS */}
            <div className="p-8 border border-slate-200 bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">MMS</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Metocean & Marine Solutions
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal mb-6">
                  Autonomous oceanographic telemetry buoys, ADCP current profiling, metocean wave and weather forecasting, marine environmental baseline surveys, and offshore marine advisory services across West Africa.
                </p>
              </div>
              <div>
                <a
                  href="/services/metocean-marine-solutions"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  Explore MMS Capabilities <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Division 3: ICS */}
            <div className="p-8 border border-slate-200 bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">ICS</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Integrated Construction Services
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal mb-6">
                  Pipeline installation, horizontal directional drilling (HDD), mechanical spool fabrication, structural welding, industrial civil infrastructure, and right-of-way construction in swamp and land corridors.
                </p>
              </div>
              <div>
                <a
                  href="/services/integrated-construction-services"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  Explore ICS Capabilities <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* Division 4: IS */}
            <div className="p-8 border border-slate-200 bg-white hover:border-emerald-600 transition-colors flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex items-center justify-end mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">IS</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
                  Industrial Solutions
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal mb-6">
                  Produced water treatment skids, industrial wastewater recovery, accredited water quality laboratory testing, environmental remediation, and specialty industrial procurement.
                </p>
              </div>
              <div>
                <a
                  href="/services/industrial-solutions"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  Explore IS Capabilities <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our People and Resources */}
      <section id="people-resources" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Our People and Resources
            </h2>
            <p className="text-slate-600 text-base md:text-lg mt-3 font-normal leading-relaxed">
              Our operational capability rests on experienced engineering personnel, dedicated operations yards, and specialist equipment deployed across Nigerian operational corridors.
            </p>
          </div>

          {/* Operational Staging Base Feature */}
          <div className="bg-slate-950 text-white p-8 md:p-14 mb-16 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-7 space-y-5">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">Operational Base & Workshop</span>
                <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight leading-tight">
                  Logistics Yard & Mobilisation Base
                </h3>
                <p className="text-slate-300 text-base leading-relaxed font-normal">
                  To support fast-track swamp and offshore mobilisations, PIGL maintains a dedicated operations yard, container staging facility, and equipment maintenance workshop in Port Harcourt, Rivers State.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed font-normal">
                  Our facility houses operations office cabins, heavy equipment parking, soil laboratory sample preparation stations, and offshore survey equipment storage—guaranteeing rapid mobilisation readiness for urgent client field campaigns.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                  <div>
                    <span className="text-xl md:text-2xl font-black text-emerald-400 block">24/7</span>
                    <span className="text-xs text-slate-400">Mobilisation Ready</span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-black text-emerald-400 block">Hub</span>
                    <span className="text-xs text-slate-400">Port Harcourt Base</span>
                  </div>
                  <div>
                    <span className="text-xl md:text-2xl font-black text-emerald-400 block">100%</span>
                    <span className="text-xs text-slate-400">Secured Facility</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="relative aspect-[16/11] overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                  <img
                    src={OpLogisticsBaseImg}
                    alt="PIGL Logistics Staging Base & Container Yard - Aerial"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-medium text-slate-200">Port Harcourt Staging Yard & Maintenance Workshop</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Leadership */}
          <div className="mb-14">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-2">
              Technical Leadership & Management
            </h3>
            <p className="text-slate-600 text-sm md:text-base font-normal mb-8">
              Guided by experienced engineering executives and operational leaders with decades of field execution experience across West Africa.
            </p>

            {(() => {
              const activeTeam = (teamMembers && teamMembers.length > 0)
                ? teamMembers.filter(m => m.status === 'active')
                : TEAM;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {activeTeam.map((member, idx) => (
                    <div key={(member as any).id || idx} className="bg-white p-5 border border-slate-200 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="relative w-full aspect-[4/5] mb-4 bg-slate-200 overflow-hidden">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/management/steve.png';
                            }}
                          />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">{member.name}</h4>
                        <p className="text-xs font-bold text-emerald-700 mt-0.5">{member.role}</p>
                      </div>
                      {(member as any).department && (member as any).department !== 'Executive Management' && (
                        <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">{(member as any).department}</p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Local Content & Technical Workforce Development */}
          <div className="p-8 md:p-10 bg-white border border-slate-200 shadow-2xs">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight mb-3">
              Local Content & Technical Capacity Building
            </h3>
            <p className="text-slate-600 text-base leading-relaxed font-normal">
              PIGL is a 100% indigenous Nigerian engineering company committed to the Nigerian Oil and Gas Industry Content Development (NOGICD) Act. We invest continuously in training Nigerian surveyors, geotechnical engineers, laboratory analysts and technicians to operate advanced instrumentation and maintain rigorous engineering standards on Nigerian projects.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Quality, Health, Safety and Environment */}
      <section id="qhse" className="py-20 md:py-28 bg-white border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 relative aspect-[4/3] bg-slate-100 overflow-hidden border border-slate-200 shadow-md group">
              <img 
                src={OpMarineCrewImg} 
                alt="PIGL Offshore Marine Crew adhering to ISO 45001 safety protocols" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                loading="lazy" 
                decoding="async" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">Safety Governance</span>
                <p className="text-xs sm:text-sm font-semibold">PIGL marine crew conducting operational risk review aboard offshore vessel</p>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block mb-2">Standards & Governance</span>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                  Quality, Health, Safety and Environment
                </h2>
              </div>
              
              <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed font-normal">
                <p>
                  Safety and quality management are integral to our operational planning and execution. We maintain an uncompromising focus on risk reduction, personnel protection, and environmental stewardship across all field assignments.
                </p>
                <p className="text-sm md:text-base text-slate-600">
                  Our operating systems are certified to ISO 9001:2015 for quality management and ISO 45001:2018 for occupational health and safety. Every assignment operates under strict risk assessments, task-specific safety procedures, and documented performance standards.
                </p>
              </div>

              <div className="pt-2 space-y-3">
                {[
                  'ISO 9001:2015 Certified Quality Management Systems',
                  'ISO 45001:2018 Certified Occupational Health and Safety',
                  'Documented safety performance of over 500,000 safe man-hours',
                  'Comprehensive task risk assessments and daily toolbox meetings',
                  'Proactive environmental protection and waste management'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-emerald-700 font-bold text-base">✓</span>
                    <span className="text-sm md:text-base font-semibold text-slate-800">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href="/hsse"
                  className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
                >
                  View Full Quality & HSSEQ Policy <span className="ml-2">→</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Technology and Industry Partnerships */}
      <section id="partnerships" className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Technology and Industry Partnerships
            </h2>
            <p className="text-slate-600 text-base md:text-lg mt-3 font-normal leading-relaxed">
              We collaborate with specialist international technology providers and equipment manufacturers to integrate proven instrumentation, telemetry systems and treatment technologies into Nigerian operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {/* Partner 1: Frankstar */}
            <div className="p-8 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block mb-2">Metocean Technology</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                  Frankstar Technology
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal mb-4">
                  Collaboration for autonomous oceanographic weather buoys, real-time wave and current profiling, meteorological telemetry, and marine operational forecasting.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
                Oceanographic Telemetry Systems
              </div>
            </div>

            {/* Partner 2: CoaleXpert */}
            <div className="p-8 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block mb-2">Process & Water Treatment</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                  CoaleXpert
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal mb-4">
                  Technology partnership for high-efficiency produced water treatment, oil separation systems, and modular skids for regulatory compliance and reinjection.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
                Produced Water Recovery Skids
              </div>
            </div>

            {/* Partner 3: Geospatial & Survey Instrumentation */}
            <div className="p-8 bg-white border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-widest block mb-2">Geospatial & Subsea Sensors</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-3">
                  Specialist Instrumentation
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal mb-4">
                  Deployment of Leica RTC360 3D laser scanners, acoustic USBL subsea navigation, multibeam bathymetry, and high-thrust 20-tonne hydraulic CPT systems.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-bold text-slate-700">
                Calibrated Field Equipment
              </div>
            </div>
          </div>

          <div>
            <a
              href="/partners"
              className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              View Technology Partners & Capabilities <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 8. Call to Action */}
      <section className="bg-emerald-950 py-24 md:py-32 text-center px-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight max-w-4xl mx-auto">
          Discuss Your Engineering and Technical Requirements
        </h2>
        <p className="text-emerald-100/90 text-base md:text-lg max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Speak with our engineering team to review site characterisation, marine observation, infrastructure construction or industrial water solutions.
        </p>
        <a 
          href="/contact" 
          className="inline-flex items-center bg-white text-slate-950 hover:bg-emerald-500 hover:text-white font-bold px-10 py-4 text-xs md:text-sm uppercase tracking-wider transition-colors shadow-lg"
        >
          Contact Our Engineering Team <span className="ml-3 font-normal text-xl">→</span>
        </a>
      </section>
      
    </div>
  );
};

export default About;
