import React from 'react';
import { TEAM, CORE_VALUES } from '../site_data';
import BootsImg from '../assets/IMG_6170.jpg';
import AboutBg from '../assets/teaching.jpeg';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';

const About: React.FC = () => {
  React.useEffect(() => {
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

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const section = params.get('section');
    if (section) {
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, []);

  return (
    <div className="flex flex-col bg-white font-sans">
      
      {/* Clean Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={AboutBg} 
            alt="About PIGL" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.1]"
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
            <span className="text-white">About Us</span>
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-8">
              About PIGL
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-normal leading-relaxed">
              Polaris Integrated and GeoSolutions Limited is an indigenous leader delivering high-fidelity engineering and advanced geosolutions for Swamp, Land, and Offshore operations.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Narrative & Heritage */}
      <section id="heritage" className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Over 20 Years of Technical Excellence</h2>
              <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-normal">
                <p>
                  Polaris Integrated and GeoSolutions Limited (PIGL) has built a 20-year reputation as an indigenous powerhouse in the Nigerian Energy Sector. We specialize in complex engineering operations across all terrains, providing high-fidelity integrated solutions.
                </p>
                <p>
                  Our journey is marked by a commitment to technical precision and a culture of safety. As an ISO 9001:2015 certified organization, we adhere to the highest global standards of quality management in our services across Sub-Saharan Africa.
                </p>
              </div>
              <div className="flex items-center space-x-8 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-3xl font-bold text-slate-900 leading-none">ISO</p>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-2">Certified Organization</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900 leading-none">NCDMB</p>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest mt-2">Compliant Partner</p>
                </div>
              </div>
              <div className="pt-6">
                <a
                  href={ProfilePDF}
                  download="PIGL_Company_Profile.pdf"
                  className="inline-flex items-center px-8 py-3.5 border-2 border-emerald-950 text-emerald-950 font-bold hover:bg-emerald-950 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Download Company Profile
                </a>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[600px] bg-slate-100">
              <img
                src={BootsImg}
                className="w-full h-full object-cover"
                alt="Technical survey"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-20 md:py-32 bg-slate-50 border-y border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="bg-white p-10 md:p-16 border border-slate-200 shadow-sm flex flex-col justify-center space-y-6">
              <h3 className="text-slate-900 font-bold text-2xl tracking-tight">Our Vision</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                "To become the Leading Integrated & Geosolutions provider for the future of the Energy Industry in Sub-Saharan Africa."
              </p>
            </div>
            <div className="bg-emerald-950 text-white p-10 md:p-16 border border-emerald-900 shadow-sm flex flex-col justify-center space-y-6">
              <h3 className="text-white font-bold text-2xl tracking-tight">Our Mission</h3>
              <p className="text-lg text-emerald-100/90 leading-relaxed font-normal">
                "Employing the most advanced technology, highly specialized staff, and safe systems to create unparalleled value for our customers, stakeholders, and host communities."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className="py-20 md:py-32 bg-white border-b border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Our Philosophy</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Core Values Driving PIGL</h2>
            <p className="text-slate-600 text-lg mt-4 font-normal">
              At the heart of all our operations across Sub-Saharan Africa are four primary values that guarantee technical precision and delivery.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {CORE_VALUES.map((value, idx) => (
              <div key={idx} className="bg-slate-50 p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col space-y-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100 text-2xl">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed font-normal flex-grow">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HSE Policy Section */}
      <section id="hse" className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="order-2 lg:order-1 relative h-[400px] md:h-[600px] bg-slate-100">
              <img src={BootsImg} alt="HSE Commitment" className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm">Commitment to Safety</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Health, Safety & Environment (HSE)</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                Safety is not just a policy at PIGL; it is our culture. We operate under a "Goal Zero" philosophy—zero injuries and zero incidents. Our management systems are rigorously audited and ISO 9001:2015 certified to ensure the highest protection for our people and the environment.
              </p>
              <div className="pt-4 space-y-3">
                {[
                  'Zero Lost Time Injuries (LTI)',
                  'ISO 9001:2015 Compliant',
                  'Rigorous Risk Assessments',
                  'Environmental Stewardship'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-emerald-600 text-lg">✓</span>
                    <span className="text-base font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Local Content & Community */}
      <section id="local-content" className="py-20 md:py-32 bg-slate-50 border-y border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm mb-4 block">Sustainability</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Empowering Local Capacity</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <div className="space-y-6 p-10 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-shadow hover-lift">
              <h3 className="text-slate-900 font-bold text-xl tracking-tight">Local Content Development</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                PIGL is a 100% indigenous Nigerian company. We are dedicated to the Nigerian Oil and Gas Industry Content Development (NOGICD) Act. We invest heavily in training local surveyors, engineers, and technicians to handle world-class technology on local soil.
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-emerald-700">Supporting NCDMB Initiatives</p>
              </div>
            </div>
            
            <div className="space-y-6 p-10 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-shadow hover-lift">
              <h3 className="text-slate-900 font-bold text-xl tracking-tight">Community Relations</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-normal">
                We believe in shared prosperity. Our operations prioritize peaceful co-existence with host communities, providing employment opportunities, supporting local business, and engaging in transparent dialogue to ensure mutually beneficial project execution.
              </p>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-emerald-700">Niger Delta Community Partnership</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Resources - Company Profile */}
      <section className="py-20 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <span className="text-emerald-700 font-bold uppercase tracking-wider text-sm">Corporate Resources</span>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight tracking-tight">Company Profile</h2>
              <p className="text-slate-600 text-lg font-normal leading-relaxed">
                Download our detailed company profile to explore our full range of capabilities, technical specifications, and past project portfolios.
              </p>
              <div className="pt-4">
                <a
                  href="/assets/PIGL_COMPANY_PROFILE.pdf"
                  download="PIGL_Company_Profile.pdf"
                  className="inline-flex items-center space-x-3 px-8 py-4 bg-emerald-950 text-white font-bold tracking-wide hover:bg-emerald-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span>Download PDF</span>
                </a>
              </div>
            </div>

            <div className="relative bg-slate-100 p-8 border border-slate-200">
              <img
                src="/assets/PIGL_COMPANY_PROFILE.jpg"
                alt="PIGL Company Profile Preview"
                className="w-full max-w-sm mx-auto object-cover border border-slate-200 shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Management Team */}
      <section id="management" className="py-20 md:py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Management Team</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {TEAM.map((member, idx) => (
              <div key={idx} className="group">
                <div className="relative w-full aspect-[4/5] mb-6 bg-slate-200 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                  />
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white flex items-center justify-center text-slate-900 hover:text-emerald-700 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm font-bold text-emerald-700">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-emerald-950 py-24 md:py-32 text-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight max-w-4xl mx-auto">Ready to Partner with a Leader?</h2>
        <a href="#/contact" className="inline-flex items-center bg-emerald-500 text-white font-bold px-10 py-4 hover:bg-white hover:text-emerald-950 transition-colors shadow-lg">
          Connect with Us <span className="ml-3 font-normal text-xl">→</span>
        </a>
      </section>
    </div>
  );
};

export default About;
