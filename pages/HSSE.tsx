import React, { useEffect } from 'react';
import { HSSE_STATS, HSSE_POLICIES, CERTIFICATIONS } from '../site_data';
import HeroImg from '../assets/slider.jpeg'; // Reusing a safe asset
import QualityImg from '../assets/IMG_6558.jpg'; // Technical/Field image

const HSSE: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Navbar height + sub-nav height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-slate-50 font-sans">
      {/* Hero Section */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HeroImg} 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]" 
            alt="HSSE Excellence"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">HSSE</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Safety First. <span className="font-light">Quality Always.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              We maintain the highest standards of Health, Safety, Security, Environment, and Quality (HSSEQ) across all operations, ensuring the protection of our people, assets, and the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Navigation */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-12 overflow-x-auto no-scrollbar py-4">
            <a 
              href="#performance" 
              onClick={(e) => scrollToSection(e, 'performance')}
              className="sub-nav-font text-slate-600 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold"
            >
              Performance
            </a>
            <a 
              href="#policies" 
              onClick={(e) => scrollToSection(e, 'policies')}
              className="sub-nav-font text-slate-600 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold"
            >
              Policies
            </a>
            <a 
              href="#certifications" 
              onClick={(e) => scrollToSection(e, 'certifications')}
              className="sub-nav-font text-slate-600 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold"
            >
              Certifications
            </a>
            <a 
              href="#quality" 
              onClick={(e) => scrollToSection(e, 'quality')}
              className="sub-nav-font text-slate-600 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold"
            >
              Quality Excellence
            </a>
          </div>
        </div>
      </div>

      {/* Performance Stats */}
      <section id="performance" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {HSSE_STATS.map((stat, index) => (
              <div key={index} className="border-l-4 border-emerald-500 pl-6 py-2">
                <div className="text-5xl font-black text-slate-900 mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight leading-tight">{stat.label}</div>
                <p className="text-slate-600 text-sm font-normal leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Grid */}
      <section id="policies" className="py-24 bg-slate-50 border-t border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <span className="h-[1px] w-12 bg-emerald-600"></span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Operational Standards</span>
          </div>
          <h2 className="text-4xl font-light mb-16 text-slate-900">HSSE <span className="font-bold">Governance & Framework</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HSSE_POLICIES.map((policy, index) => (
              <div key={index} className="bg-white border border-slate-200 p-8 md:p-12 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-colors duration-300">
                  <span className="text-emerald-600 group-hover:text-white font-bold transition-colors duration-300">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-6 text-slate-900">{policy.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base font-normal">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Excellence Section */}
      <section id="quality" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-[1px] w-12 bg-emerald-600"></span>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Precision Engineering</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight text-slate-900">
                Our Pursuit of <br />
                <span className="font-bold text-slate-900">Technical Perfection</span>
              </h2>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-normal">
                <p>
                  At Polaris Integrated and GeoSolutions, quality is not just a department—it's a fundamental pillar of our technical DNA. We employ a rigorous Quality Management System (QMS) that governs every phase of project delivery, from initial data acquisition to final engineering report.
                </p>
                <p>
                  Our use of state-of-the-art 3D Reality Capture and hydrographic survey equipment ensures that the data we provide is of the highest fidelity, enabling our clients to make critical offshore and subsea decisions with absolute confidence.
                </p>
              </div>
              
              <div className="mt-12 flex gap-8 border-t border-slate-100 pt-12">
                <div>
                  <div className="text-3xl font-black text-emerald-600">100%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Data Fidelity</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-emerald-600">ISO</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Aligned Workflows</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 border-[20px] border-white shadow-2xl overflow-hidden">
                <img src={QualityImg} alt="Quality Control" className="w-full h-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="absolute top-12 -right-12 w-full h-full bg-emerald-50 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-12 bg-emerald-600"></span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Validated Excellence</span>
            <span className="h-[1px] w-12 bg-emerald-600"></span>
          </div>
          <h2 className="text-4xl font-light mb-16 text-slate-900">Compliance & <span className="font-bold">Certifications</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CERTIFICATIONS.map((cert, index) => (
              <div key={index} className="bg-white p-10 border border-slate-200 hover:border-emerald-600 transition-all duration-300 group hover:-translate-y-2 hover:shadow-lg">
                <div className="mb-6 text-emerald-600 opacity-60 group-hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{cert.title}</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed font-normal">{cert.organization}</p>
                <span className="inline-block px-4 py-1 bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-widest">{cert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-slate-950 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-12 tracking-tight">Driven by Safety, Defined by Quality.</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a href="#/contact" className="px-12 py-5 bg-emerald-600 text-white font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20">
              Request HSE Profile
            </a>
            <a href="#/contact" className="px-12 py-5 border-2 border-slate-700 text-slate-300 font-bold uppercase tracking-widest hover:bg-white hover:text-slate-950 transition-all">
              Work with Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HSSE;
