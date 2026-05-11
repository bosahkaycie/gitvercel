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
    <div className="bg-[#f5f5f5]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HeroImg} 
            className="w-full h-full object-cover grayscale-[0.3]" 
            alt="HSSE Excellence"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#003c2f]/90 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-[1px] w-12 bg-[#00e676]"></span>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#00e676]">Our Commitment</span>
            </div>
            <h1 className="hero-title text-white mb-8">
              Safety First. <br />
              <span className="font-bold">Quality Always.</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
              We maintain the highest standards of Health, Safety, Security, Environment, and Quality (HSSEQ) across all operations, ensuring the protection of our people, assets, and the environment.
            </p>
          </div>
        </div>
      </section>

      {/* Sub-Navigation */}
      <div className="sticky top-[80px] z-30 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex gap-12 overflow-x-auto no-scrollbar py-4">
            <a 
              href="#performance" 
              onClick={(e) => scrollToSection(e, 'performance')}
              className="sub-nav-font text-[#003c2f] hover:text-[#00e676] transition-colors whitespace-nowrap"
            >
              Performance
            </a>
            <a 
              href="#policies" 
              onClick={(e) => scrollToSection(e, 'policies')}
              className="sub-nav-font text-[#003c2f] hover:text-[#00e676] transition-colors whitespace-nowrap"
            >
              Policies
            </a>
            <a 
              href="#certifications" 
              onClick={(e) => scrollToSection(e, 'certifications')}
              className="sub-nav-font text-[#003c2f] hover:text-[#00e676] transition-colors whitespace-nowrap"
            >
              Certifications
            </a>
            <a 
              href="#quality" 
              onClick={(e) => scrollToSection(e, 'quality')}
              className="sub-nav-font text-[#003c2f] hover:text-[#00e676] transition-colors whitespace-nowrap"
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
              <div key={index} className="border-l-4 border-[#00e676] pl-6 py-2">
                <div className="text-5xl font-bold text-[#003c2f] mb-2">{stat.value}</div>
                <div className="text-lg font-bold text-gray-800 mb-2 uppercase tracking-tight leading-tight">{stat.label}</div>
                <p className="text-gray-600 text-sm">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Grid */}
      <section id="policies" className="py-24 bg-[#003c2f] text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-12">
            <span className="h-[1px] w-12 bg-[#00e676]"></span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#00e676]">Operational Standards</span>
          </div>
          <h2 className="text-4xl font-light mb-16">HSSE <span className="font-bold">Governance & Framework</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
            {HSSE_POLICIES.map((policy, index) => (
              <div key={index} className="p-12 hover:bg-white/5 transition-colors group">
                <div className="w-12 h-12 bg-[#00e676]/20 flex items-center justify-center mb-8 group-hover:bg-[#00e676] transition-colors">
                  <span className="text-[#00e676] group-hover:text-[#003c2f] font-bold">{index + 1}</span>
                </div>
                <h3 className="text-2xl font-bold mb-6">{policy.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
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
                <span className="h-[1px] w-12 bg-[#00e676]"></span>
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#003c2f]">Precision Engineering</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-light mb-8 leading-tight">
                Our Pursuit of <br />
                <span className="font-bold text-[#003c2f]">Technical Perfection</span>
              </h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  At Polaris Integrated and GeoSolutions, quality is not just a department—it's a fundamental pillar of our technical DNA. We employ a rigorous Quality Management System (QMS) that governs every phase of project delivery, from initial data acquisition to final engineering report.
                </p>
                <p>
                  Our use of state-of-the-art 3D Reality Capture and hydrographic survey equipment ensures that the data we provide is of the highest fidelity, enabling our clients to make critical offshore and subsea decisions with absolute confidence.
                </p>
              </div>
              
              <div className="mt-12 flex gap-8 border-t border-gray-100 pt-12">
                <div>
                  <div className="text-3xl font-bold text-[#003c2f]">100%</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Data Fidelity</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#003c2f]">ISO</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-1">Aligned Workflows</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 border-[20px] border-white shadow-2xl overflow-hidden">
                <img src={QualityImg} alt="Quality Control" className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-12 -right-12 w-full h-full bg-[#00e676]/10 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-24 bg-[#f9f9f9]">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-[1px] w-12 bg-[#00e676]"></span>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#003c2f]">Validated Excellence</span>
            <span className="h-[1px] w-12 bg-[#00e676]"></span>
          </div>
          <h2 className="text-4xl font-light mb-16 text-[#003c2f]">Compliance & <span className="font-bold">Certifications</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {CERTIFICATIONS.map((cert, index) => (
              <div key={index} className="bg-white p-10 border border-gray-200 hover:border-[#00e676] transition-all group hover:-translate-y-2">
                <div className="mb-6 text-[#00e676] opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#003c2f] mb-3">{cert.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{cert.organization}</p>
                <span className="inline-block px-4 py-1 bg-gray-100 text-[#003c2f] text-[10px] font-black uppercase tracking-widest">{cert.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#00e676]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#003c2f] mb-12">Driven by Safety, Defined by Quality.</h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <a href="#/contact" className="px-12 py-5 bg-[#003c2f] text-white font-bold uppercase tracking-widest hover:bg-black transition-all">
              Request HSE Profile
            </a>
            <a href="#/contact" className="px-12 py-5 border-2 border-[#003c2f] text-[#003c2f] font-bold uppercase tracking-widest hover:bg-[#003c2f] hover:text-white transition-all">
              Work with Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HSSE;
