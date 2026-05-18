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

          <div className="space-y-4">
            {[
              { role: 'Senior Geotechnical Engineer', location: 'Port Harcourt', type: 'Full-Time' },
              { role: 'Reality Capture Specialist (Leica Systems)', location: 'Lagos / Field', type: 'Contract' },
              { role: 'Pipeline Integrity Lead', location: 'Swamp Operations', type: 'Full-Time' }
            ].map((job, idx) => (
              <div key={idx} className="bg-white p-8 flex flex-col md:flex-row justify-between items-start md:items-center border border-slate-200 hover:shadow-lg transition-shadow reveal stagger-1">
                <div className="mb-6 md:mb-0 space-y-2">
                  <h3 className="text-xl font-bold text-slate-900">{job.role}</h3>
                  <div className="flex items-center space-x-3 text-slate-500 font-bold text-xs uppercase tracking-wider">
                    <span>{job.location}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-none"></span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <a href={`#/contact?job=${encodeURIComponent(job.role)}`} className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition-colors group">
                  Apply Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-16 p-10 md:p-12 bg-white border border-slate-200 text-center shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">No match for your skills?</h3>
            <p className="text-slate-600 mb-8 font-normal text-lg">We are always looking for exceptional talent in engineering and geosolutions. Send us your CV for future consideration.</p>
            <a href="mailto:careers@polarisigl.com" className="inline-flex items-center px-8 py-4 bg-emerald-950 text-white font-bold hover:bg-emerald-800 transition-colors">
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
