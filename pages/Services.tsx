import React, { useEffect } from 'react';
import { SERVICES } from '../site_data';
import ServiceBg from '../assets/newpipeline.png';

const Services: React.FC = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = params.get('id');
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - 100,
            behavior: 'smooth'
          });
        }, 300);
      }
    }
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
  }, []);

  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ServiceBg} 
            alt="Advanced Geosolutions" 
            className="w-full h-full object-cover opacity-35 grayscale-[0.2]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/50 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10">
            <a href="#/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Services</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Advanced Geosolutions
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Integrated precision engineering services for the future of Energy & Infrastructure. We deliver high-fidelity data and technical assurance for complex operations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {SERVICES.map((service, idx) => (
              <div key={service.id} id={service.id} className="flex flex-col reveal border border-slate-200 bg-slate-50 hover:shadow-xl transition-shadow p-8 md:p-12 hover-lift">
                <div className="relative h-64 md:h-[400px] bg-slate-200 mb-8 overflow-hidden group">
                  <img
                    src={service.image}
                    alt={`${service.title} - Specialist Engineering by PIGL`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-700 text-white p-3 shadow-sm">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">{service.title}</h2>
                <p className="text-lg text-slate-600 font-normal leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                <div className="bg-white p-6 border border-slate-100 mb-8">
                  <h4 className="text-emerald-700 font-bold text-xs uppercase tracking-wider mb-4">Core Deliverables:</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-3 text-slate-700 font-bold text-sm">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-600 rounded-none mt-1.5"></span>
                        <span className="leading-tight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <a href="#/contact" className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition-colors group">
                    Consult with Experts <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generalized Technical Standard Section */}
      <section className="bg-slate-50 py-20 md:py-32 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">World Class Service Framework</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Operational Standard</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start reveal stagger-1 hover-lift">
              <div className="text-4xl mb-6">🛰️</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Precision Capture</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Advanced 3D Laser Scanning, Digital Twins, and high-fidelity Reality Capture workflows.</p>
            </div>
            
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start reveal stagger-2 hover-lift">
              <div className="text-4xl mb-6">🧪</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Geo-Analysis</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Comprehensive soil analysis, laboratory testing, and chemical characterization of site strata.</p>
            </div>
            
            <div className="bg-white p-10 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col items-start reveal stagger-3 hover-lift">
              <div className="text-4xl mb-6">⚓</div>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">Marine Operations</h3>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">Bathymetric surveying systems and precise offshore positioning for specialized nautical projects.</p>
            </div>
          </div>

          <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 bg-emerald-950 p-12 text-white">
            <div>
              <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider mb-2">Technical Engagement</p>
              <p className="text-3xl font-bold tracking-tight">Ready to optimize your site operations?</p>
            </div>
            <a href="#/contact" className="inline-flex items-center px-8 py-4 bg-white text-emerald-950 font-bold hover:bg-emerald-500 hover:text-white transition-colors">
              Consult with Us <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
