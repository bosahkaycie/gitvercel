import React, { useState, useEffect, useRef } from 'react';
import { SERVICES, PROJECTS } from '../site_data';
import BootsImg from '../assets/IMG_6170.jpg';
import TeamLargeImg from '../assets/team_large.jpeg';
import CareersBg from '../assets/1770736125265.jpeg';
import TechEdgeImg from '../assets/IMG_6228.jpg';
import TechDrillImg from '../assets/new drill.png';
import TechRealityImg from '../assets/newreality.jpg';
import TechSubImg from '../assets/sub.png';
import NiesImg from '../assets/nies new.png';
import VideoShowcase from '../components/VideoShowcase';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';

const CountUp: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentCount = Math.floor(easeOutQuad(percentage) * end);
      
      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationFrameId = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [end, duration]);

  return <span ref={elementRef}>{count}{suffix}</span>;
};

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const techEdgeImages = [
    { src: TechEdgeImg, alt: "Leica 3D Laser Scanning & Reality Capture" },
    { src: TechDrillImg, alt: "Millimeter-Accurate Facility Tie-Ins & Geotechnical Exploration" },
    { src: TechRealityImg, alt: "High-Fidelity 3D Reality Modeling & Surveys" },
    { src: TechSubImg, alt: "Subsea Seabed Surveying & Marine Geophysics" }
  ];

  const [currentTechSlide, setCurrentTechSlide] = useState(0);

  // States & Effects for 'Our industries' Auto-Sliding Carousel
  const [visibleCards, setVisibleCards] = useState(3);
  const [currentIndustrySlide, setCurrentIndustrySlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const maxIndex = SERVICES.length - visibleCards;
    if (currentIndustrySlide > maxIndex) {
      setCurrentIndustrySlide(Math.max(0, maxIndex));
    }
  }, [visibleCards, currentIndustrySlide]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndustrySlide((prev) => {
        const maxIndex = SERVICES.length - visibleCards;
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4500); // Smooth leftward slide transitions every 4.5 seconds

    return () => clearInterval(timer);
  }, [visibleCards]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTechSlide(prev => (prev === techEdgeImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [techEdgeImages.length]);

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
      <section className="relative h-[85vh] md:h-[calc(100vh-56px)] overflow-hidden bg-slate-950">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="absolute inset-0 overflow-hidden bg-slate-950">
              <img
                src={slide.image}
                alt={`${slide.title} - Advanced Geosolutions`}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
              />
              {/* Solid even overlay for pristine text readability and image contrast */}
              <div className="absolute inset-0 bg-slate-950/35 z-10" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 md:pb-12 flex flex-col justify-end z-20">
              <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center gap-10 lg:gap-16">
                <div key={`${currentSlide}-left`} className={`max-w-xl lg:max-w-2xl ${index === currentSlide ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
                  <h2 className="hero-title text-4xl sm:text-5xl lg:text-[4.0rem] text-white drop-shadow-sm font-medium">
                    {slide.title}
                  </h2>
                </div>

                <div key={`${currentSlide}-right`} className={`max-w-md ${index === currentSlide ? 'animate-slide-up delay-300' : 'opacity-0'}`}>
                  <div className="w-full h-px bg-white mb-10" />
                  <div className="space-y-6 lg:space-y-8">
                    <p className="text-lg sm:text-xl lg:text-[22px] text-white font-normal drop-shadow-md leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 pt-2">
                      <div 
                        className="flex items-center space-x-4 group cursor-pointer w-fit"
                        onClick={() => setIsVideoModalOpen(true)}
                      >
                        <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 border border-white/60 group-hover:bg-white group-hover:text-emerald-950 transition-all duration-300 rounded-none text-white">
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                        <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Watch our story</span>
                      </div>

                      <a 
                        href={ProfilePDF}
                        download="PIGL_Company_Profile.pdf"
                        className="flex items-center space-x-4 group cursor-pointer w-fit"
                      >
                        <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 border border-white/60 group-hover:bg-white group-hover:text-emerald-950 transition-all duration-300 rounded-none text-white">
                          <svg className="w-4 h-4 lg:w-5 lg:h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        </div>
                        <span className="text-white font-bold text-xs lg:text-sm uppercase tracking-widest group-hover:text-emerald-400 transition-colors">Company Profile</span>
                      </a>
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
              Our Organisation
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

          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight" id="our-expertise">Our industries</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentIndustrySlide(prev => Math.max(0, prev - 1))}
                disabled={currentIndustrySlide === 0}
                className={`p-2.5 border border-slate-300 rounded-none text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition-colors bg-white ${
                  currentIndustrySlide === 0 ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Previous Industry"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentIndustrySlide(prev => Math.min(SERVICES.length - visibleCards, prev + 1))}
                disabled={currentIndustrySlide >= SERVICES.length - visibleCards}
                className={`p-2.5 border border-slate-300 rounded-none text-slate-800 hover:border-emerald-700 hover:text-emerald-700 transition-colors bg-white ${
                  currentIndustrySlide >= SERVICES.length - visibleCards ? 'opacity-40 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Next Industry"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="overflow-hidden -mx-3">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndustrySlide * (100 / visibleCards)}%)` }}
            >
              {SERVICES.map((service, idx) => (
                <div 
                  key={idx} 
                  className="px-3 flex-shrink-0 flex"
                  style={{ width: `${100 / visibleCards}%` }}
                >
                  <a href={`#/services?id=${service.id}`} className="group block bg-slate-50 border border-slate-200/60 p-6 md:p-8 hover:shadow-xl transition-shadow flex flex-col w-full hover-lift">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 mb-6 rounded-none shrink-0">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                        loading="lazy" 
                        decoding="async" 
                      />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">{service.title}</h4>
                    <p className="text-slate-600 font-normal leading-relaxed line-clamp-3 text-sm md:text-base flex-grow">{service.description}</p>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Indicators */}
          {SERVICES.length > visibleCards && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {Array.from({ length: SERVICES.length - visibleCards + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndustrySlide(idx)}
                  className={`h-1.5 transition-all duration-500 rounded-none ${
                    currentIndustrySlide === idx ? 'w-8 bg-emerald-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="bg-slate-50 py-24 md:py-32 reveal border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="space-y-4 md:space-y-6">
              <span className="text-5xl md:text-6xl font-black text-emerald-600 block tracking-tighter">
                0<span className="text-3xl md:text-4xl ml-2 font-black uppercase tracking-normal">LTI</span>
              </span>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">500k+ Safe Man-Hours</h3>
                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-normal">Unwavering commitment to safety across all swamp and offshore operations.</p>
              </div>
            </div>
            <div className="space-y-4 md:space-y-6">
              <span className="text-5xl md:text-6xl font-black text-emerald-600 block tracking-tighter">
                <CountUp end={100} suffix="%" />
              </span>
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
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Our Expertise</h2>
            <a href="#/projects" className="hidden md:inline-flex items-center text-[#F97316] font-bold hover:text-orange-700 transition-colors group text-base">
              All case studies <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            {/* Featured Project */}
            {PROJECTS.length > 0 && (
              <a href={`#/projects?id=${PROJECTS[0].id}`} className="md:col-span-6 group block">
                <div className="relative aspect-[16/10] overflow-hidden mb-6 bg-slate-100">
                  <img src={PROJECTS[0].image} alt={PROJECTS[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
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
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" decoding="async" />
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
            {/* Left: Image Carousel */}
            <div className="relative overflow-hidden group shadow-2xl aspect-[4/3] w-full bg-slate-100">
              {techEdgeImages.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentTechSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img 
                    src={slide.src} 
                    alt={slide.alt} 
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-[4000ms]"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
              ))}
              
              {/* Navigation Arrows */}
              <button
                onClick={() => setCurrentTechSlide(prev => (prev === 0 ? techEdgeImages.length - 1 : prev - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/30 hover:bg-emerald-700 hover:scale-105 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => setCurrentTechSlide(prev => (prev === techEdgeImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 bg-black/30 hover:bg-emerald-700 hover:scale-105 text-white transition-all duration-300 opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
              
              {/* Square Pagination Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                {techEdgeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTechSlide(idx)}
                    className={`w-2.5 h-2.5 transition-all duration-500 ${
                      currentTechSlide === idx ? 'bg-emerald-500 w-6' : 'bg-white/60 hover:bg-white'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
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
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-16 tracking-tight">Our Organisation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Purpose */}
            <a href="#/about" className="group block bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow flex flex-col hover-lift">
              <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-slate-200 shrink-0">
                <img src={BootsImg} alt="Our Purpose" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
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
                <img src={TeamLargeImg} alt="Leadership" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" decoding="async" />
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

          {/* Core Values Section */}
          <div className="mt-24 pt-20 border-t border-slate-200">
            <div className="max-w-3xl">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-[0.2em] block mb-3">Our Foundation</span>
              <h3 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">Our Core Values</h3>
              <p className="text-slate-600 text-lg leading-relaxed mb-12">
                At Polaris Integrated & GeoSolutions Limited, our operations are built on four unbreakable pillars of excellence. These values guide our engineers in the field and direct our long-term strategic growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Value 1: Technical Integrity */}
              <div className="group bg-slate-50 border border-slate-100 hover:border-slate-300 p-8 transition-all hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-950 group-hover:text-white transition-all rounded-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">Technical Integrity</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Uncompromising engineering precision and transparent methodologies, delivering accurate data that serves as a single source of truth.
                </p>
              </div>

              {/* Value 2: Safety First */}
              <div className="group bg-slate-50 border border-slate-100 hover:border-slate-300 p-8 transition-all hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-950 group-hover:text-white transition-all rounded-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">Safety & HSSE</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Safety is engineered into our daily operations. We maintain strict HSSE compliance to protect our personnel, assets, and environments.
                </p>
              </div>

              {/* Value 3: Technical Innovation */}
              <div className="group bg-slate-50 border border-slate-100 hover:border-slate-300 p-8 transition-all hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-950 group-hover:text-white transition-all rounded-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">Innovation</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Deploying cutting-edge 3D laser scanners, bathymetry, and subsea digital twin models to solve complex engineering challenges.
                </p>
              </div>

              {/* Value 4: Client Centricity */}
              <div className="group bg-slate-50 border border-slate-100 hover:border-slate-300 p-8 transition-all hover:shadow-lg relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-emerald-950 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                <div className="w-12 h-12 bg-emerald-50 text-emerald-800 flex items-center justify-center mb-6 group-hover:bg-emerald-950 group-hover:text-white transition-all rounded-none">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">Collaboration</h4>
                <p className="text-slate-600 text-sm leading-relaxed font-normal">
                  Building deep, transparent relationships with national and international oil operators, acting as trusted technical advisors.
                </p>
              </div>
            </div>
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
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. News highlights */}
      <section id="community" className="hidden md:block py-24 md:py-32 bg-white reveal">
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
            loading="lazy"
            decoding="async"
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
