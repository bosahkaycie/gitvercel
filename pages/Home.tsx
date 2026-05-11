import React, { useState, useEffect } from 'react';
import { SERVICES, PROJECTS } from '../site_data';
import BootsImg from '../assets/boots_on_ground.jpeg';
import TeamLargeImg from '../assets/team_large.jpeg';
import CareersBg from '../assets/1770736125265.jpeg';
import TechEdgeImg from '../assets/IMG_6228.jpg';
import NiesImg from '../assets/nies.JPG';
import VideoShowcase from '../components/VideoShowcase';

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const slides = SERVICES.map(service => ({
    title: service.title,
    description: service.description,
    image: service.image,
    id: service.id
  }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

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

    // Inject SociableKIT script idempotently
    const scriptId = 'sociablekit-widget-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://widgets.sociablekit.com/linkedin-page-posts/widget.js";
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col font-sans">
      <h1 className="sr-only">Polaris Integrated & GeoSolutions Limited (PIGL)</h1>

      {/* Hero Slider Section */}
      <section className="relative h-[85vh] md:h-[calc(100vh-56px)] overflow-hidden bg-emerald-950">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={slide.image}
                alt={`${slide.title} - Advanced Geosolutions`}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 flex flex-col justify-end">
              <div className="w-full flex flex-col lg:flex-row justify-between lg:items-end gap-10 lg:gap-16">
                <div key={`${currentSlide}-left`} className={`max-w-3xl lg:max-w-4xl ${index === currentSlide ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
                  <h2 className="hero-title text-5xl sm:text-6xl lg:text-[4.8rem] text-white drop-shadow-sm">
                    {slide.title}
                  </h2>
                </div>

                <div key={`${currentSlide}-right`} className={`max-w-md ${index === currentSlide ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
                  <div className="w-full h-px bg-white mb-10" />
                  <div className="space-y-6 lg:space-y-8">
                    <p className="text-lg sm:text-xl lg:text-[22px] text-white font-normal drop-shadow-md leading-relaxed">
                      {slide.description}
                    </p>
                    <div 
                      className="flex items-center space-x-6 group cursor-pointer w-fit"
                      onClick={() => setIsVideoModalOpen(true)}
                    >
                      <div className="flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 border border-white group-hover:bg-white group-hover:text-emerald-900 transition-all duration-300 rounded-none text-white">
                        <svg className="w-5 h-5 lg:w-6 lg:h-6 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                      <span className="text-white font-normal text-sm lg:text-lg group-hover:text-emerald-400 transition-colors">Watch our story</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Sub-Navigation Bar */}
      <div className="w-full bg-white border-b border-slate-200 hidden md:block z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 overflow-x-auto no-scrollbar">
          <span className="sub-nav-font font-bold text-slate-800 mr-8 whitespace-nowrap">Jump to</span>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={() => document.getElementById('what-we-do')?.scrollIntoView({ behavior: 'smooth' })}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              What we do
            </button>
            <button 
              onClick={() => document.getElementById('our-industries')?.scrollIntoView({ behavior: 'smooth' })}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              Our industries
            </button>
            <button 
              onClick={() => document.getElementById('track-record')?.scrollIntoView({ behavior: 'smooth' })}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              Case studies
            </button>
            <button 
              onClick={() => document.getElementById('core-values')?.scrollIntoView({ behavior: 'smooth' })}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap"
            >
              Our organisation
            </button>
            <button 
              onClick={() => document.getElementById('community')?.scrollIntoView({ behavior: 'smooth' })}
              className="sub-nav-font text-emerald-700 hover:text-emerald-900 transition-colors font-bold whitespace-nowrap"
            >
              News highlights
            </button>
          </div>
        </div>
      </div>

      {/* 1. What we do / Our industries */}
      <section id="what-we-do" className="py-24 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 lg:mb-24">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 tracking-tight">What we do</h2>
            <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed mb-8">
              Whatever you're planning, building, or maintaining, we believe understanding the earth is key. At PIGL, we unlock its secrets in the form of high-fidelity Geo-data, which we apply to develop safer, more sustainable, and more efficient operations. It's how we help create a safe and liveable world – together.
            </p>
            <a href="#/about" className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition-colors group">
              Read more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 mb-8 tracking-tight" id="our-expertise">Our industries</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.slice(0, 3).map((service, idx) => (
              <a href={`#/services?id=${service.id}`} key={idx} className="group block reveal stagger-1 hover-lift">
                <div className="relative h-64 md:h-80 overflow-hidden bg-slate-100 mb-6 rounded-none">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{service.title}</h4>
                <p className="text-slate-600 font-normal leading-relaxed line-clamp-2">{service.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-slate-50 py-24 md:py-32 reveal border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="space-y-4 md:space-y-6">
              <span className="text-5xl md:text-6xl font-black text-emerald-600 block tracking-tighter">0 LTI</span>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">500k+ Safe Man-Hours</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">Unwavering commitment to safety across all swamp and offshore operations.</p>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <span className="text-5xl md:text-6xl font-black text-emerald-600 block tracking-tighter">100%</span>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">NCDMB Compliant</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">PIGL is a fully indigenous Nigerian company, committed to local capacity development.</p>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <span className="text-5xl md:text-6xl font-black text-emerald-600 block tracking-tighter">ISO</span>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Triple-Certified Systems</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">Operating under ISO 9001:2015, 14001:2015, and 45001:2018 standards.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Examples of our expertise */}
      <section id="track-record" className="py-24 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Examples of our expertise</h2>
            <a href="#/projects" className="hidden md:inline-flex items-center text-[#F97316] font-bold hover:text-orange-700 transition-colors group text-base">
              All case studies <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Featured Project */}
            {PROJECTS.length > 0 && (
              <a href={`#/projects?id=${PROJECTS[0].id}`} className="md:col-span-6 group block">
                <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-slate-100">
                  <img src={PROJECTS[0].image} alt={PROJECTS[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="space-y-3 pb-8 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-slate-300 flex-shrink-0" />
                    <span className="text-[14px] font-normal text-slate-500">Case study</span>
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-bold text-[#1A202C] leading-tight group-hover:text-[#F97316] transition-colors tracking-tight">
                    {PROJECTS[0].title}
                  </h3>
                  <p className="text-slate-500 font-medium text-[14px]">{PROJECTS[0].location}</p>
                </div>
              </a>
            )}

            {/* Other Projects */}
            <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {PROJECTS.slice(1, 3).map((project, idx) => (
                <a href={`#/projects?id=${project.id}`} key={idx} className="group block">
                  <div className="relative aspect-square overflow-hidden mb-6 bg-slate-100">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="space-y-3 pb-8 border-b border-slate-200">
                    <div className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-slate-300 flex-shrink-0" />
                      <span className="text-[14px] font-normal text-slate-500">Case study</span>
                    </div>
                    <h3 className="text-[18px] md:text-[20px] font-bold text-[#1A202C] leading-snug group-hover:text-[#F97316] transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 font-medium text-[14px]">{project.location}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-12 md:hidden">
            <a href="#/projects" className="inline-flex items-center text-[#F97316] font-bold hover:text-orange-700 transition-colors group">
              All case studies <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 4. Technical Edge Section */}
      <section className="py-24 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Image */}
            <div className="relative">
              <img 
                src={TechEdgeImg} 
                alt="Technical Edge - High-Fidelity Data" 
                className="w-full h-auto shadow-2xl"
              />
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] block">Technical Edge</span>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-[1.1]">
                  High-Fidelity Data for Complex Environments
                </h2>
              </div>
              
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                We leverage the industry's most advanced reality capture systems—including Leica 3D Laser Scanners and UAV-based bathymetry—to deliver millimeter-accurate Geo-data. Our digital twin solutions transform physical assets into intelligent, manageable data sets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">Millimeter Accuracy</h4>
                  <p className="text-slate-500 leading-relaxed text-[15px]">Precision scanning for offshore facility tie-ins.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-900 tracking-tight">Digital Integration</h4>
                  <p className="text-slate-500 leading-relaxed text-[15px]">BIM and CAD-ready data for intelligent asset management.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our organisation */}
      <section id="core-values" className="py-24 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 tracking-tight">Our organisation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Purpose */}
            <a href="#/about" className="group block bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow flex flex-col hover-lift">
              <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-slate-200 shrink-0">
                <img src={BootsImg} alt="Our Purpose" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 sm:p-10 flex-grow flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors tracking-tight">Creating a Safe and Liveable World</h3>
                <p className="text-slate-600 font-normal leading-relaxed mb-8 flex-grow">
                  The work we do every day, from infrastructure development consulting to advanced 3D reality capture, is accelerating our positive impact across the globe. Find out more about how we support renewable energy and coastal resilience projects.
                </p>
                <span className="text-emerald-700 font-bold inline-flex items-center group-hover:text-emerald-900 transition-colors">
                  Read more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </a>

            {/* Team */}
            <a href="#/about" className="group block bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow flex flex-col hover-lift">
              <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-slate-200 shrink-0">
                <img src={TeamLargeImg} alt="Leadership" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-8 sm:p-10 flex-grow flex flex-col">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors tracking-tight">Our Team</h3>
                <p className="text-slate-600 font-normal leading-relaxed mb-8 flex-grow">
                  Meet the dedicated professionals driving innovation, safety, and operational excellence at Polaris Integrated and GeoSolutions Limited.
                </p>
                <span className="text-emerald-700 font-bold inline-flex items-center group-hover:text-emerald-900 transition-colors">
                  Read more <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Industry Presence Spotlight */}
      <section className="py-24 md:py-32 bg-slate-50 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-6">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] block">Industry Presence</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Driving the Energy Conversation at NIES 2025
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                PIGL was proud to be featured at the Nigeria International Energy Summit (NIES) 2025. We participated in high-level workshops, sharing our expertise on how 3D reality capture and high-fidelity engineering are accelerating the digital transformation of Africa's energy sector.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center space-x-3 text-slate-900 font-bold">
                  <span className="w-8 h-[2px] bg-emerald-500"></span>
                  <span>Workshop Participant • Abuja, Nigeria</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-2 bg-emerald-500/10 rounded-sm blur-xl group-hover:blur-2xl transition-all duration-700 opacity-50"></div>
                <img 
                  src={NiesImg} 
                  alt="PIGL at NIES 2025" 
                  className="relative w-full h-auto rounded-sm shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. News highlights */}
      <section id="community" className="py-24 md:py-32 bg-white reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div className="space-y-4">
              <span className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] block">Live Updates</span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">News Highlights</h2>
            </div>
            <a href="https://www.linkedin.com/company/polarisigl/" target="_blank" rel="noreferrer" className="hidden md:inline-flex items-center px-6 py-3 border border-slate-300 font-bold text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition-colors bg-white">
              Follow on LinkedIn
            </a>
          </div>

          {/* SociableKIT Widget Container */}
          <div className="min-h-[600px] w-full bg-slate-50 border border-slate-100 p-4 md:p-8">
            <div className="sk-ww-linkedin-page-post" data-embed-id="25680745"></div>
          </div>
        </div>
      </section>

      {/* 8. Careers Banner */}
      <section className="bg-slate-950 py-24 md:py-32 reveal text-center px-4 relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={CareersBg} 
            alt="Careers Background" 
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-slate-950/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-emerald-400 font-bold mb-6 text-sm md:text-base uppercase tracking-widest">Come work with us</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 leading-tight tracking-tight">Help create an impact on a global scale</h2>
          <a href="#/careers" className="inline-flex items-center bg-white text-slate-900 font-bold px-10 py-4 hover:bg-emerald-500 hover:text-white transition-colors">
            Careers at PIGL <span className="ml-3 font-normal text-xl">→</span>
          </a>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video rounded-none overflow-hidden shadow-2xl bg-black animate-fade-in-scale">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white hover:bg-emerald-500 text-slate-900 hover:text-white rounded-none flex items-center justify-center transition-colors shadow-lg"
              aria-label="Close video"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/sExrHCIGkH0?autoplay=1"
              title="PIGL Video Story"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
