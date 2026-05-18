import React, { useEffect } from 'react';
import EngineerImg from '../assets/image.png';
import CareersBg from '../assets/inspiring_next_gen.jpeg';

const Careers: React.FC = () => {
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
    <div className="flex flex-col min-h-screen bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={CareersBg} 
            alt="Careers at PIGL" 
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
            <span className="text-white">Careers</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              Careers at PIGL
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Building the future of Sub-Saharan energy requires the sharpest minds. Come innovate with us and help create a safe and liveable world.
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Empowering Indigenous Talent</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                At PIGL, we believe our people are our most valuable asset. We provide a platform for engineers, surveyors, and project managers to work with world-class technology in challenging environments.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                {[
                  { title: 'Advanced Tech', desc: 'Work with Leica Geosystems Reality Capture gear.' },
                  { title: 'Safety Culture', desc: 'Our zero-harm policy ensures you go home safe.' },
                  { title: 'Growth Paths', desc: 'Continuous learning and ISO-certified training.' },
                  { title: 'Impact', desc: 'Be part of Nigeria\'s most critical energy infrastructure.' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-6 border border-slate-200">
                    <h4 className="text-emerald-700 font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative h-[400px] md:h-[600px] bg-slate-100">
              <img src={EngineerImg} alt="Engineer at work" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Openings Section */}
      <section className="py-20 md:py-32 bg-slate-50 border-y border-slate-200 reveal">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Current Openings</h2>
            <p className="text-slate-600 mt-4 text-lg">Explore our active vacancies across Nigeria.</p>
          </div>

          <div className="bg-white border border-slate-200 p-12 text-center space-y-6 shadow-sm reveal">
            <div className="mx-auto w-16 h-16 bg-slate-50 border border-slate-200 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">No Active Vacancies</h3>
              <p className="text-slate-600 max-w-lg mx-auto text-base">
                We currently do not have any open positions. However, we are always eager to discover exceptional minds. You can submit your CV below for future consideration.
              </p>
            </div>
          </div>

          <div className="mt-8 p-10 md:p-12 bg-white border border-slate-200 text-center shadow-sm reveal">
            <h3 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">Submit Your CV</h3>
            <p className="text-slate-600 mb-8 font-normal text-base">
              Send your CV and a brief cover letter to our recruitment team for future openings in engineering, surveying, reality capture, and swamp/offshore operations.
            </p>
            <a href="mailto:careers@polarisigl.com" className="inline-flex items-center px-8 py-3.5 bg-emerald-750 text-white font-bold hover:bg-emerald-850 transition-colors">
              Submit CV <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Graduate Internship Program */}
      <section className="py-20 md:py-32 bg-white text-center reveal">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Student Opportunities</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">Graduate Internship Program</h2>
          <p className="text-xl text-slate-600 leading-relaxed font-light italic">
            "Fostering the next generation of Nigerian surveyors and engineers through hands-on field experience and technical mentorship."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Careers;
