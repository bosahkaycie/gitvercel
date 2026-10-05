import React, { useState, useEffect, useRef } from 'react';
import { SERVICES, PROJECTS, PARTNERS, OPERATIONS_GALLERY } from '../site_data';
import BootsImg from '../assets/IMG_6170.jpg';
import TeamLargeImg from '../assets/team_large.jpeg';
import CareersBg from '../assets/1770736125265.jpeg';
import NiesImg from '../assets/nies new.png';
import ProfilePDF from '../assets/PIGL COMPANY PROFILE.pdf';
import FrankstarLogo from '../assets/frankstar_logo.png';
import FrankstarLoopVideo from '../assets/FRANKSTAR LOOP.mp4';
import OffshoreIntelVideo from '../assets/OFFSHORE INTELLIGENCE.mp4';
import DigitalIntelVideo from '../assets/DIGITAL INTELLINGENCE.mp4';
import GroundIntelImg from '../assets/cpt.png';
import PipelineImg from '../assets/newpipeline.png';
import FieldTeamSwampImg from '../assets/pigl_field_team_swamp.jpg';
import ConferenceKeynoteImg from '../assets/pigl_conference_keynote.jpg';
import InternationalPartnerImg from '../assets/pigl_international_partner.jpg';
import ExhibitionConsultingImg from '../assets/pigl_exhibition_consulting.jpg';
import PipelineClearingAerialImg from '../assets/pigl_pipeline_clearing_aerial.jpg';
import InfraSketchImg from '../assets/infrastructure_sketch.jpg';
import DigitalScannerImg from '../assets/digital_intel_scanner.jpg';
import MarineOperationsImg from '../assets/field_operations_marine.jpg';
import AssetIntegrityNdtImg from '../assets/asset_integrity_ndt.jpg';

// Authentic Field Operations & Maritime Photography
import OpLogisticsBaseImg from '../assets/operations/pigl_logistics_base_aerial.jpg';
import OpMarineCrewImg from '../assets/operations/pigl_marine_crew_vessel.jpg';
import OpWeldingImg from '../assets/operations/pigl_pipeline_marine_welding.jpg';
import OpGeomaticsImg from '../assets/operations/pigl_geomatics_survey_quay.jpg';
import OpWinchPiglImg from '../assets/operations/pigl_offshore_winch_pigl_container.jpg';
import OpOffshoreBargeImg from '../assets/operations/pigl_offshore_geotech_drilling_barge.jpg';
import OpSubbottomSb216Img from '../assets/operations/pigl_subbottom_profiler_sb216s.jpg';
import OpDrillCrewCasingImg from '../assets/operations/pigl_offshore_drill_crew_casing.jpg';
import OpLaserCoolerImg from '../assets/operations/pigl_3d_laser_scan_facility_cooler.jpg';
import OpLaserManifoldImg from '../assets/operations/pigl_3d_laser_scan_manifold_station.jpg';
import OpRealityJettyImg from '../assets/operations/pigl_3d_reality_capture_jetty_plant.jpg';
import OpPipelineSwampCatImg from '../assets/operations/pigl_pipeline_construction_swamp_cat.jpg';

import { useSliders, useServices, useBlogPosts, useProjects, usePartners, useSiteSettings } from '../hooks/useSupabaseData';
import { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../utils/video';

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

// Robust HTML5 Video Component ensuring compliant autoplay, explicit DOM muting, and lifecycle management
const HeroSlideVideo: React.FC<{
  src: string;
  isActive: boolean;
  poster?: string;
  title?: string;
}> = ({ src, isActive, poster, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Critical: Programmatically enforce DOM property muting to satisfy strict modern browser autoplay security policies
    video.muted = true;
    video.defaultMuted = true;

    if (isActive) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Normal browser interrupt or policy catch
          console.warn('Hero video autoplay notice:', err?.message);
        });
      }
    } else {
      video.pause();
    }
  }, [isActive, src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload={isActive ? 'auto' : 'metadata'}
      poster={poster}
      aria-label={title || 'Slide background video'}
      className="w-full h-full object-cover pointer-events-none"
    />
  );
};

const Home: React.FC = () => {
  const { sliders } = useSliders();
  const { services: dynamicServices } = useServices();
  const { projects: dynamicProjects } = useProjects();
  const { partners: dynamicPartners } = usePartners();
  const { posts: blogPosts, loading: blogLoading } = useBlogPosts();
  const { settings } = useSiteSettings();

  const effectiveServices = dynamicServices && dynamicServices.length > 0 ? dynamicServices : SERVICES;
  const effectiveProjects = dynamicProjects && dynamicProjects.length > 0 ? dynamicProjects : PROJECTS;
  const effectivePartners = dynamicPartners && dynamicPartners.length > 0 ? dynamicPartners : PARTNERS;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'Intelligence' | 'Solutions & Engineering'>('Intelligence');
  const [galleryFilter, setGalleryFilter] = useState<string>('All');

  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const heroSlides = sliders.length > 0 ? sliders.map((s, idx) => {
    let resolvedVideoUrl = s.video_url;
    // Map known legacy Frankstar YouTube shortlink to local high-definition video loop if needed
    if (resolvedVideoUrl && (resolvedVideoUrl.includes('X0d8DmasSiQ') || resolvedVideoUrl.includes('FRANKSTAR LOOP'))) {
      resolvedVideoUrl = FrankstarLoopVideo;
    }

    let targetCtaUrl = s.cta_url || '/services';
    if (targetCtaUrl.startsWith('/services/')) {
      const slug = targetCtaUrl.replace('/services/', '');
      if (LEGACY_SERVICE_MAP[slug]) {
        targetCtaUrl = `/services/${LEGACY_SERVICE_MAP[slug]}`;
      }
    }

    return {
      id: s.id,
      phase: s.subtitle ? s.subtitle.toUpperCase() : `LIFECYCLE PHASE 0${idx + 1}`,
      title: s.title,
      description: s.description || s.subtitle || '',
      cta_text: s.cta_text || 'Explore Capabilities',
      cta_url: targetCtaUrl,
      video_url: resolvedVideoUrl,
      desktop_image: s.desktop_image,
      mobile_image: s.mobile_image || s.desktop_image
    };
  }) : [
    {
      id: '3bd59604-1015-41e0-bcb1-c087fa769342',
      phase: 'LIFECYCLE PHASE 01 // CONTINUOUS MARINE INTELLIGENCE',
      title: 'Continuous Marine Intelligence',
      description: 'Continuous Marine Intelligence is a real-time, round-the-clock framework of data collection, analysis, and surveillance used to maintain total situational awareness across maritime domains.',
      cta_text: 'Explore Our Capabilities',
      cta_url: '/services/marine-intelligence',
      video_url: FrankstarLoopVideo,
      desktop_image: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/sliders/1790716750733_HERO_2.png',
      mobile_image: '/assets/DJI_0003.jpg'
    },
    {
      id: 'c72b6c96-00ff-48d7-9589-1f2ef3a24aee',
      phase: 'LIFECYCLE PHASE 02 // DEEP OFFSHORE INTELLIGENCE',
      title: 'Deep Offshore Intelligence',
      description: 'By merging real-time edge computing, AI-driven digital twins, and autonomous monitoring systems, we empower operators to maximize asset production, minimize operational downtime, and navigate complex marine environments safely.',
      cta_text: 'Explore Our Capabilities',
      cta_url: '/services/marine-intelligence',
      video_url: '/assets/OFFSHORE INTELLIGENCE.mp4',
      desktop_image: '/assets/DJI_0003.jpg',
      mobile_image: '/assets/DJI_0003.jpg'
    },
    {
      id: '52f9111a-7fc9-4668-9f04-3fdbb37ef77d',
      phase: 'LIFECYCLE PHASE 03 // PIPELINE & CIVIL ENGINEERING',
      title: 'Pipeline & Civil Engineering',
      description: 'We deliver integrated pipeline and civil engineering solutions for energy, industrial, and infrastructure projects. Our expertise covers pipeline design and installation, right of way development, earthworks, drainage, foundations, access roads, and associated civil works.',
      cta_text: 'Explore Capabilities',
      cta_url: '/services/engineering-industrial-environmental-solutions',
      video_url: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/media/1791214307405_Pipeline_construction.mp4',
      desktop_image: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/sliders/1791214469409_Screenshot_2026-10-05_at_4.34.19_PM.png',
      mobile_image: '/assets/DJI_0003.jpg'
    },
    {
      id: '9f5faf33-0d6b-4373-b86b-c989b330ba60',
      phase: 'LIFECYCLE PHASE 04 // 3D REALITY CAPTURE & AS-BUILT INTEGRITY',
      title: 'Digital Intelligence Reality Capture',
      description: 'Digital Intelligence Reality Capture is the process of using smart sensors, laser scanners, and artificial intelligence to turn physical spaces into exact digital 3D models.',
      cta_text: 'View Digital Intelligence',
      cta_url: '/services/digital-mapping-intelligence',
      video_url: DigitalIntelVideo,
      desktop_image: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/sliders/1790716979886_leica_rtc360.jpg',
      mobile_image: '/assets/DJI_0003.jpg'
    },
    {
      id: 'dee1a0f3-5f08-4bfd-948e-c5f597b32227',
      phase: 'LIFECYCLE PHASE 05 // OFFSHORE INFRASTRUCTURE & NERVOUS SYSTEM',
      title: 'Deep Offshore Intelligence',
      description: 'Because deepwater environments operate under intense atmospheric pressure, freezing temperatures, and minimal physical accessibility, operators rely on this "intelligence infrastructure" as the primary nervous system for offshore production.',
      cta_text: 'Explore Offshore Intelligence',
      cta_url: '/services/marine-intelligence',
      video_url: undefined,
      desktop_image: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/sliders/1790718985902_Screenshot_2026-09-29_at_10.56.16_PM.png',
      mobile_image: 'https://supabasekong-7deaxlm0rmorqbbbstpmvjgj.191.215.41.50.sslip.io/storage/v1/object/public/sliders/1790718985902_Screenshot_2026-09-29_at_10.56.16_PM.png'
    }
  ];

  useEffect(() => {
    if (isHeroHovered || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isHeroHovered]);

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

    return () => {
      observer.disconnect();
    };
  }, []);

  const intelligenceServices = effectiveServices.filter(s => 
    ['Ground Intelligence', 'Digital Intelligence', 'Offshore Intelligence', 'Intelligence'].includes(s.division)
  );

  // Continuous left-scrolling marquee for Services Carousel
  useEffect(() => {
    const track = document.getElementById('services-carousel-track');
    if (!track) return;
    
    let isHovered = false;
    let animId: number;
    const handleMouseEnter = () => { isHovered = true; };
    const handleMouseLeave = () => { isHovered = false; };
    
    track.addEventListener('mouseenter', handleMouseEnter);
    track.addEventListener('mouseleave', handleMouseLeave);
    
    const step = () => {
      if (!isHovered && track) {
        track.scrollLeft += 0.8;
        const halfWidth = track.scrollWidth / 2;
        if (track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      animId = requestAnimationFrame(step);
    };
    
    animId = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animId);
      track.removeEventListener('mouseenter', handleMouseEnter);
      track.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVideoModalOpen(false);
    };
    if (isVideoModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isVideoModalOpen]);

  return (
    <div className="flex flex-col font-sans bg-white">
      <h1 className="sr-only">Polaris Integrated & GeoSolutions Limited (PIGL) - Engineering Intelligence & Geosolutions</h1>

      {/* 1. Hero Section with Looping Background Video & Content Slider */}
      <section 
        className="relative h-[80vh] sm:h-[86vh] md:h-[calc(100vh-48px)] min-h-[540px] max-h-[960px] overflow-hidden bg-slate-950 group"
        onMouseEnter={() => setIsHeroHovered(true)}
        onMouseLeave={() => setIsHeroHovered(false)}
      >
        
        {/* Dynamic Video & Image Backgrounds with Seamless Looping and Smooth Cross-Fades */}
        <div className="absolute inset-0 overflow-hidden bg-slate-950 pointer-events-none z-0 select-none">
          {heroSlides.map((slide, idx) => {
            const isActive = currentSlide === idx;
            const youtubeId = getYouTubeId(slide.video_url);
            const isDirectVideo = Boolean(slide.video_url && !youtubeId);
            const fallbackPoster = youtubeId 
              ? (getYouTubeThumbnail(slide.video_url) || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`)
              : (slide.desktop_image || '/assets/DJI_0003.jpg');

            return (
              <div
                key={`bg-${slide.id || idx}`}
                className={`absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {youtubeId ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {/* Persistent poster image prevents black flash during YouTube stream initialization */}
                    <img
                      src={fallbackPoster}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {isActive && (
                      <iframe
                        src={getYouTubeEmbedUrl(slide.video_url, { autoplay: true, mute: true, loop: true, controls: false }) || ''}
                        title={slide.title}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none border-0 aspect-video z-1"
                        style={{
                          width: 'max(100%, 177.78vh)',
                          height: 'max(100%, 56.25vw)',
                          minWidth: '100%',
                          minHeight: '100%'
                        }}
                        allow="autoplay; encrypted-media"
                        frameBorder="0"
                      />
                    )}
                  </div>
                ) : isDirectVideo && slide.video_url ? (
                  <HeroSlideVideo
                    src={slide.video_url}
                    isActive={isActive}
                    poster={slide.desktop_image || fallbackPoster}
                    title={slide.title}
                  />
                ) : (
                  <img
                    src={slide.desktop_image || fallbackPoster}
                    alt={slide.title}
                    className={`w-full h-full object-cover pointer-events-none transition-transform duration-[10000ms] ease-out ${
                      isActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Global Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-900/40 z-10 pointer-events-none" />

        {/* Hero Slider Content */}
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 z-20 flex items-end pb-12 sm:pb-18 md:pb-24 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-12 items-end">
                
                {/* Left Side: Refined Headline */}
                <div className="lg:col-span-7">
                  <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight sm:leading-[1.12] drop-shadow-lg">
                    {slide.title}
                  </h2>
                </div>

                {/* Right Side: Divider + Description + Watch our story Play Button */}
                <div className="lg:col-span-5 flex flex-col justify-end">
                  <div className="border-t border-white/25 pt-3 sm:pt-4 mb-3 sm:mb-4">
                    <p className="text-sm sm:text-base md:text-lg text-slate-100 font-normal leading-relaxed drop-shadow line-clamp-3 sm:line-clamp-none">
                      {slide.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                    <button
                      onClick={() => setIsVideoModalOpen(true)}
                      className="inline-flex items-center space-x-2.5 sm:space-x-3 text-white group/btn cursor-pointer focus:outline-none"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 border border-white/80 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover/btn:bg-white group-hover/btn:text-slate-950 transition-all rounded-sm">
                        <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="text-xs sm:text-base font-medium text-white/95 group-hover/btn:text-emerald-400 transition-colors">
                        Watch our story (2 mins)
                      </span>
                    </button>

                    <a
                      href={slide.cta_url}
                      className="text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 tracking-wide transition-colors"
                    >
                      {slide.cta_text} →
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}

        {/* Previous / Next Arrow Controls */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/40 hover:bg-slate-900/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100 cursor-pointer shadow-lg hover:scale-105"
              aria-label="Previous Slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-950/40 hover:bg-slate-900/80 backdrop-blur-md text-white/80 hover:text-white border border-white/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100 cursor-pointer shadow-lg hover:scale-105"
              aria-label="Next Slide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Hero Slider Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-slate-950/60 backdrop-blur-md px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/10">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${
                currentSlide === idx ? 'w-6 sm:w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Sub-Navigation Bar */}
      <div className={`w-full bg-white border-b border-slate-200 hidden md:block z-40 sticky transition-all duration-500 shadow-sm ${
        navScrolled ? 'top-[64px] lg:top-[80px]' : 'top-[80px] lg:top-[104px]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-14 overflow-x-auto no-scrollbar">
          <span className="sub-nav-font font-bold text-slate-800 mr-8 whitespace-nowrap">Jump to</span>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <button 
              onClick={() => {
                const element = document.getElementById('about-us');
                if (element) {
                  const offset = window.innerWidth >= 1024 ? 136 : 120;
                  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap font-medium"
            >
              About Us
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('pigl-difference');
                if (element) {
                  const offset = window.innerWidth >= 1024 ? 136 : 120;
                  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap font-medium"
            >
              The PIGL Difference
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('our-services');
                if (element) {
                  const offset = window.innerWidth >= 1024 ? 136 : 120;
                  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap font-medium"
            >
              Services & Capabilities
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('case-studies');
                if (element) {
                  const offset = window.innerWidth >= 1024 ? 136 : 120;
                  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap font-medium"
            >
              Case Studies
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('leadership');
                if (element) {
                  const offset = window.innerWidth >= 1024 ? 136 : 120;
                  const y = element.getBoundingClientRect().top + window.pageYOffset - offset;
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
              className="sub-nav-font text-slate-600 hover:text-emerald-700 transition-colors whitespace-nowrap font-medium"
            >
              Leadership
            </button>
          </div>
        </div>
      </div>

      {/* 3. Brief About Us Section (Light Theme with Subtle Engineering Topographic Watermark) */}
      <section id="about-us" className="relative py-20 md:py-28 bg-white border-b border-slate-200 reveal overflow-hidden">
        {/* Subtle Background Decorations */}
        <div className="absolute inset-0 bg-topo-pattern pointer-events-none" />
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            {/* Left Narrative Content */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest block">
                    About Polaris Integrated & GeoSolutions
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                  Two Decades of Indigenous Engineering Excellence
                </h2>
                <div className="space-y-4 text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                  <p>
                    Polaris Integrated and GeoSolutions Limited (PIGL) is a 100% indigenous Nigerian engineering and geosolutions firm. We help energy and infrastructure companies understand their ground conditions, map subsea environments, capture accurate 3D facility models, and build dependable assets across Sub-Saharan Africa.
                  </p>
                  <p className="text-sm sm:text-base">
                    Certified to ISO 9001:2015 and ISO 45001:2018 with over 500,000 safe man-hours, our experienced engineers, survey vessels, and specialized ground rigs deliver trusted results from initial site survey to long-term asset operations.
                  </p>
                </div>

                {/* Engineering Lifecycle Continuum Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5">
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Phase 1: Discover</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">Site Characterization</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">CPT soil testing, seismic profiling & ocean buoys</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Phase 2: Build</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">Swamp Field Delivery</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">Pipeline construction, certified welding & rig positioning</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200/90">
                    <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Phase 3: Verify</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">3D Reality Capture</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">Millimeter Leica LiDAR & operating digital twins</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="/about"
                  className="px-7 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center group rounded-none"
                >
                  <span>Know more about us</span>
                  <span className="ml-2.5 group-hover:translate-x-1 transition-transform">→</span>
                </a>
                <a
                  href="/contact"
                  className="px-7 py-4 border-2 border-slate-300 hover:border-emerald-700 text-slate-800 hover:text-emerald-700 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all rounded-none"
                >
                  Request Consultation
                </a>
              </div>
            </div>

            {/* Right Video Embed & Verified Credentials Panel */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-4 h-full">
              <div className="relative aspect-video w-full overflow-hidden shadow-xl border border-slate-200 bg-slate-950 group">
                <iframe
                  src="https://www.youtube.com/embed/sExrHCIGkH0"
                  title="PIGL Corporate Documentary & Overview"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>

              {/* Verified Credentials Card filling the remaining height */}
              <div className="p-6 bg-slate-50 border border-slate-200 shadow-xs flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Verified Corporate Credentials</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-700">ISO Certified & NCDMB Compliant</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{settings?.stat_years_experience || '20+'}</div>
                    <div className="text-xs font-bold text-slate-800">Years Industry Leadership</div>
                    <p className="text-[11px] text-slate-500 leading-snug">Indigenous engineering delivering energy infrastructure across Sub-Saharan Africa.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{settings?.stat_safe_hours || '500k+'}</div>
                    <div className="text-xs font-bold text-slate-800">Safe Man-Hours</div>
                    <p className="text-[11px] text-slate-500 leading-snug">Uncompromising Goal Zero LTI culture across swamp and offshore operational sites.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">ISO</div>
                    <div className="text-xs font-bold text-slate-800">9001:2015 & 45001:2018</div>
                    <p className="text-[11px] text-slate-500 leading-snug">Audited international quality management and occupational safety systems.</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">100%</div>
                    <div className="text-xs font-bold text-slate-800">Indigenous Firm</div>
                    <p className="text-[11px] text-slate-500 leading-snug">Committed to local workforce empowerment, training, and host community partnership.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Section: The PIGL Difference */}
      <section id="pigl-difference" className="relative py-24 md:py-32 bg-slate-50/80 border-b border-slate-200 reveal overflow-hidden">
        {/* Subtle Background Grid & Light Aura */}
        <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-50" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest block">
                    The Asset Lifecycle Continuum
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-4">
                  One Seamless Journey: From Ground Truth to 3D Reality Capture
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed font-normal mb-3">
                  When site exploration, engineering design, and post-build inspection are handled by disconnected vendors, critical data is lost in translation—leading to foundation settlement, design clashes, and costly offshore delays.
                </p>
                <p className="text-slate-600 text-base leading-relaxed font-normal mb-5">
                  PIGL eliminates hand-off risk by serving as the <strong>single continuous thread of engineering truth</strong> throughout the life of your asset:
                </p>

                <div className="space-y-3.5">
                  <div className="flex items-start space-x-3.5 p-3.5 bg-white border border-slate-200 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Before Breaking Ground: Site Characterization & Geotechnics</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">20-ton hydraulic CPT soundings, deep soil sampling, and MetOcean buoys define soil strength and marine hazard thresholds before design freeze.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3.5 p-3.5 bg-white border border-slate-200 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">During Execution: Precision Positioning & Swamp Pipeline Delivery</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Certified swamp welding, right-of-way clearing, and sub-meter acoustic rig positioning in Niger Delta mangrove environments.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3.5 p-3.5 bg-white border border-slate-200 shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">After Construction: 3D Reality Capture & Digital Twin Verification</h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Millimeter Leica RTC360 LiDAR scans create an immutable digital twin of the built asset—validating as-built tolerances and preventing brownfield clashes.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a 
                  href="/about" 
                  className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 transition-colors group text-sm"
                >
                  Discover Our Heritage & Leadership <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            {/* Right Graphic Collage with Real High-Res Photos Stretching Full Height */}
            <div className="lg:col-span-6 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                {/* Column 1 */}
                <div className="flex flex-col gap-4 h-full">
                  {/* 1. Ground Truth / Geotech */}
                  <div className="flex-1 relative overflow-hidden shadow-md border border-slate-200 group bg-slate-900 min-h-[220px] sm:min-h-[260px]">
                    <img
                      src={OpDrillCrewCasingImg}
                      alt="PIGL Geotechnical Drilling specialists conducting borehole operations"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Phase 1 • Ground Truth</span>
                      <p className="text-xs font-bold leading-tight truncate">Deep Borehole Casing & Soil Sampling</p>
                    </div>
                  </div>

                  {/* 2. 3D Reality Capture Scanner */}
                  <div className="flex-1 relative overflow-hidden shadow-md border border-slate-200 group bg-slate-900 min-h-[220px] sm:min-h-[260px]">
                    <img
                      src={OpLaserManifoldImg}
                      alt="PIGL Engineers conducting high-density 3D Laser Scanning on process manifold"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Phase 3 • Verify</span>
                      <p className="text-xs font-bold leading-tight truncate">Facility Manifold 3D Laser Scanning</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="flex flex-col gap-4 h-full">
                  {/* 3. Marine Operations */}
                  <div className="flex-1 relative overflow-hidden shadow-md border border-slate-200 group bg-slate-900 min-h-[220px] sm:min-h-[260px]">
                    <img
                      src={OpOffshoreBargeImg}
                      alt="PIGL Offshore Geotechnical Drilling Barge and Vessel in open sea"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Phase 1 • Marine</span>
                      <p className="text-xs font-bold leading-tight truncate">Offshore Geotech Drilling Vessel</p>
                    </div>
                  </div>

                  {/* 4. Infrastructure & Pipeline Execution */}
                  <div className="flex-1 relative overflow-hidden shadow-md border border-slate-200 group bg-slate-900 min-h-[220px] sm:min-h-[260px]">
                    <img
                      src={OpPipelineSwampCatImg}
                      alt="PIGL Heavy Pipeline ROW Construction with CAT pipelayers in swamp terrain"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">Phase 2 • Build</span>
                      <p className="text-xs font-bold leading-tight truncate">Swamp Pipeline ROW Execution</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Section: What We Do - Continuous Carousel */}
      <section id="our-services" className="relative py-24 md:py-32 bg-white reveal overflow-hidden">
        {/* Subtle Background Contour Lines & Depth */}
        <div className="absolute inset-0 bg-contour-lines pointer-events-none opacity-80" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header with Carousel Navigation Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest">
                  Core Engineering Platforms
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
                What We Do
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-normal leading-relaxed">
                Converting physical environments, complex subsurfaces, and maritime conditions into high-fidelity data and execution.
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center space-x-3 self-start md:self-end">
              <button
                onClick={() => {
                  const container = document.getElementById('services-carousel-track');
                  if (container) {
                    container.scrollBy({ left: -380, behavior: 'smooth' });
                  }
                }}
                className="w-11 h-11 border border-slate-300 hover:border-emerald-700 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 flex items-center justify-center transition-all shadow-xs"
                aria-label="Previous service"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => {
                  const container = document.getElementById('services-carousel-track');
                  if (container) {
                    container.scrollBy({ left: 380, behavior: 'smooth' });
                  }
                }}
                className="w-11 h-11 border border-slate-300 hover:border-emerald-700 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-700 flex items-center justify-center transition-all shadow-xs"
                aria-label="Next service"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Continuous Left Marquee Carousel Track with Subtle Shimmer */}
          <div
            id="services-carousel-track"
            className="flex space-x-6 overflow-x-auto pb-6 scrollbar-none no-scrollbar cursor-grab active:cursor-grabbing select-none"
          >
            {[...effectiveServices, ...effectiveServices].map((service, sIdx) => (
              <div 
                key={`${service.id}-${sIdx}`} 
                className="flex-shrink-0 w-[300px] sm:w-[360px] md:w-[390px] group flex flex-col bg-white border border-slate-200 hover:border-emerald-700/60 hover:shadow-2xl transition-all duration-500 overflow-hidden card-shimmer relative"
              >
                {/* Engineering Corner Bracket Accent */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-600/30 group-hover:border-emerald-600 transition-colors z-20 pointer-events-none" />

                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={service.image}
                    alt={`${service.title} - Polaris Integrated & GeoSolutions`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <div className="p-6 sm:p-7 flex-grow flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                      <a href={`/services/${service.id}`}>{service.title}</a>
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed font-normal mb-2 line-clamp-4">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={`/services/${service.id}`}
                      className="inline-flex items-center text-emerald-700 font-bold hover:text-emerald-900 text-xs sm:text-sm uppercase tracking-wider transition-colors group-hover:translate-x-1 duration-300"
                    >
                      Explore Service Specs <span className="ml-2">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Section: Executed Projects & Case Studies */}
      <section id="case-studies" className="relative py-24 md:py-32 bg-slate-50/70 border-t border-b border-slate-200 reveal overflow-hidden">
        {/* Subtle Engineering Grid Background */}
        <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-40" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">
                  Proven Field Track Record
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Executed Projects
              </h2>
              <p className="text-slate-600 text-lg font-normal leading-relaxed mt-4">
                Demonstrating engineering precision, safety, and dependable delivery across major energy assets.
              </p>
            </div>
            <a
              href="/projects"
              className="inline-flex items-center text-emerald-800 hover:text-emerald-950 font-bold text-sm tracking-wide transition-colors group"
            >
              Explore All Case Studies <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Clean 3-Project Grid with 3-Beat Narrative Arc & Corner Accents */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {effectiveProjects.slice(0, 3).map((project, idx) => (
              <a
                key={idx}
                href={`/projects?id=${project.id}`}
                className="group border border-slate-200 bg-white flex flex-col hover:border-emerald-700/60 hover:shadow-xl transition-all duration-300 overflow-hidden card-shimmer relative"
              >
                {/* Engineering Corner Bracket */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-600/30 group-hover:border-emerald-600 transition-colors z-20 pointer-events-none" />

                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    loading="lazy" 
                    decoding="async" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>

                <div className="p-7 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <div className="mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Client: {project.client || 'Energy Sector'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 leading-snug mb-3 tracking-tight group-hover:text-emerald-800 transition-colors">
                      {project.title}
                    </h3>

                    {/* 3-Beat Narrative Arc */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-500 uppercase text-[10px] block">THE CHALLENGE:</span>
                        <p className="text-slate-600 font-normal leading-relaxed line-clamp-2 mt-0.5">
                          {project.challenge || project.description}
                        </p>
                      </div>
                      <div className="pt-1.5">
                        <span className="font-mono font-bold text-emerald-700 uppercase text-[10px] block">OUTCOME ACHIEVED:</span>
                        <p className="text-slate-800 font-medium leading-relaxed line-clamp-1 mt-0.5">
                          {project.results || 'Delivered with 100% HSSE compliance and zero asset clashes.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-emerald-800 group-hover:text-emerald-950 group-hover:translate-x-1 transition-all">
                      Read Project Narrative <span className="ml-1.5">→</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a
              href="/projects"
              className="inline-flex items-center px-8 py-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              View Full Projects & Case Studies Library <span className="ml-2">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6.5 Live Operational Field Showcase */}
      <section id="operations-gallery" className="relative py-24 md:py-32 bg-slate-950 text-white reveal overflow-hidden">
        {/* Subtle dark tech background grid */}
        <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-20" />
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest block">
                  Field Operations in Action
                </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Authentic Engineering & Maritime Delivery
              </h2>
              <p className="text-slate-400 text-base md:text-lg font-normal leading-relaxed mt-4">
                Real operational photographs from active PIGL energy projects across Nigeria—from deepwater geotechnical drilling vessels and high-density 3D laser scan surveys to heavy swamp pipeline construction and certified field fabrication.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 self-start md:self-end">
              {(['All', 'Offshore & Marine', '3D Reality Capture', 'Pipelines & Infrastructure', 'Logistics & Safety'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setGalleryFilter(cat)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all border ${
                    galleryFilter === cat
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Responsive Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(galleryFilter === 'All' 
              ? OPERATIONS_GALLERY 
              : OPERATIONS_GALLERY.filter(item => item.category === galleryFilter)
            ).map((photo) => (
              <div
                key={photo.id}
                className="group relative bg-slate-900 border border-slate-800 overflow-hidden flex flex-col hover:border-emerald-500/50 hover:shadow-2xl transition-all duration-300"
              >
                {/* Engineering Corner Bracket */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-500/40 group-hover:border-emerald-400 transition-colors z-20 pointer-events-none" />

                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />
                  
                  {photo.location && (
                    <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] font-mono text-emerald-400">
                      📍 {photo.location}
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                      {photo.category}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                      {photo.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-normal leading-relaxed mt-2 line-clamp-3">
                      {photo.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Section: Operational Stats & Dual ISO Certification */}
      <section className="relative bg-white py-24 md:py-32 border-b border-slate-200 reveal overflow-hidden">
        {/* Subtle Architectural Infrastructure Line-Art Watermark */}
        <div 
          className="absolute inset-0 pointer-events-none select-none z-0 bg-no-repeat bg-cover bg-center opacity-[0.035] mix-blend-multiply filter grayscale contrast-125"
          style={{ backgroundImage: `url(${InfraSketchImg})` }}
          aria-hidden="true"
        />
        {/* Subtle Topographic Contour Background */}
        <div className="absolute inset-0 bg-contour-lines pointer-events-none opacity-40 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Stat 1 */}
            <div className="space-y-4 p-6 sm:p-8 bg-slate-50/80 border border-slate-200/80 shadow-xs relative">
              <div className="flex items-center space-x-3">
                <span className="text-5xl md:text-6xl font-black text-emerald-700 block tracking-tighter">
                  0<span className="text-3xl md:text-4xl ml-2 font-bold uppercase tracking-normal">LTI</span>
                </span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{settings?.stat_safe_hours || '500k+'} Safe Field Hours</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                  Zero Lost Time Injuries across swamp, coastal, and offshore terrains—proving that complex engineering can return every surveyor and engineer home safely.
                </p>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="space-y-4 p-6 sm:p-8 bg-slate-50/80 border border-slate-200/80 shadow-xs">
              <span className="text-5xl md:text-6xl font-black text-emerald-700 block tracking-tighter">
                <CountUp end={100} suffix="%" />
              </span>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Indigenous & NCDMB Certified</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                  100% Nigerian ownership and technical stewardship, advancing domestic engineering capacity in geosolutions and infrastructure delivery.
                </p>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="space-y-4 p-6 sm:p-8 bg-slate-50/80 border border-slate-200/80 shadow-xs">
              <span className="text-5xl md:text-6xl font-black text-emerald-700 block tracking-tighter">ISO</span>
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Dual-Certified Systems</h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed font-normal">
                  Certified to ISO 9001:2015 (Quality Management) and ISO 45001:2018 (Occupational Health & Safety) across all project disciplines.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Section: Strategic Technology Partnerships */}
      <section id="partnerships" className="relative py-24 md:py-32 bg-slate-50/50 reveal overflow-hidden">
        {/* Subtle Tech Grid */}
        <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mb-16">
            <div className="flex items-center space-x-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">
                Global Technology Alliances
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              World-Class Technology, Indigenous Mastery
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-normal leading-relaxed">
              We connect global innovation directly to African energy corridors. Through strategic technology alliances with Frankstar, CoaleXpert, and NPK Automation, we deploy international-grade oceanographic telemetry, modular produced-water treatment, and engineered flow control—backed by 100% indigenous field execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {effectivePartners.map((partner) => (
              <div 
                key={partner.id} 
                className="bg-white border border-slate-200 p-8 flex flex-col justify-between hover:shadow-xl hover:border-emerald-700/40 transition-all duration-300 card-shimmer relative"
              >
                {/* Engineering Corner Bracket */}
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-600/30 group-hover:border-emerald-600 transition-colors pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1">
                      Technology Partner
                    </span>
                    {partner.id === 'frankstar' && (
                      <div className="bg-slate-950 px-2.5 py-1.5 border border-slate-800">
                        <img 
                          src={FrankstarLogo} 
                          alt="Frankstar Technology Logo" 
                          className="h-5 w-auto object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                    {partner.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {partner.specialty}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed font-normal">
                    {partner.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100">
                  <a
                    href={`/partners#${partner.id}`}
                    className="inline-flex items-center text-emerald-700 font-bold text-xs uppercase tracking-wider hover:text-emerald-900 transition-colors"
                  >
                    Partner Details <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/partners"
              className="inline-flex items-center text-sm font-bold text-slate-800 hover:text-emerald-700 transition-colors group"
            >
              Explore Our Full Technology Alliance Framework <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* 9. Section: Industry Presence (NIES 2025) */}
      <section className="py-24 md:py-32 bg-slate-50 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="lg:w-1/2 space-y-6">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block">
                Industry Presence
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                Driving the Energy Conversation at NIES 2025
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-normal">
                PIGL was proud to participate in high-level sessions at the Nigeria International Energy Summit (NIES) 2025. We shared our perspective on how 3D reality capture, digital twins, and high-fidelity geosolutions accelerate the sustainable modernization of Africa's energy assets.
              </p>
              <div className="pt-4">
                <div className="inline-flex items-center space-x-3 text-slate-900 font-bold text-sm">
                  <span className="w-8 h-[2px] bg-emerald-600"></span>
                  <span>Technical Participant • Abuja, Nigeria</span>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative group overflow-hidden border border-slate-200 shadow-xl">
                <img 
                  src={NiesImg} 
                  alt="PIGL at NIES 2025" 
                  className="w-full h-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Blogs & Publications */}
      <section className="py-20 md:py-28 bg-slate-50 border-t border-slate-200 reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-widest block">
                News & Publications
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
                Blogs & Publications
              </h2>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                Technical articles, project milestones, and engineering perspectives from Polaris Integrated & GeoSolutions.
              </p>
            </div>
            
            <a 
              href="/blog" 
              className="inline-flex items-center space-x-2 px-6 py-3 bg-white border border-slate-300 font-bold text-slate-900 hover:border-emerald-600 hover:text-emerald-700 transition-all text-xs uppercase tracking-wider shadow-sm hover:shadow self-start md:self-end"
            >
              <span>View All Blogs & Publications</span>
              <span className="text-emerald-600 font-normal text-base">→</span>
            </a>
          </div>

          {/* Blog Posts Display */}
          {blogLoading ? (
            <div className="py-16 text-center text-slate-400">
              <svg className="animate-spin h-8 w-8 text-emerald-600 mx-auto mb-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <p className="text-xs font-bold uppercase tracking-wider">Loading publications...</p>
            </div>
          ) : blogPosts.length > 0 ? (
            <div className="space-y-8">
              
              {/* Featured / Lead Article */}
              {(() => {
                const leadPost = blogPosts.find(p => p.featured) || blogPosts[0];
                const regularPosts = blogPosts.filter(p => p.id !== leadPost.id).slice(0, 3);

                return (
                  <>
                    <div className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                        <div className="lg:col-span-7 relative min-h-[280px] lg:min-h-[380px] overflow-hidden bg-slate-900">
                          <img 
                            src={leadPost.featured_image || '/assets/IMG_6170.jpg'} 
                            alt={leadPost.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>

                        <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3 text-xs text-slate-500 font-semibold">
                              <span>{new Date(leadPost.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              <span>•</span>
                              <span>{leadPost.read_time || '5 min read'}</span>
                            </div>

                            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                              <a href={`/blog/${leadPost.slug}`}>
                                {leadPost.title}
                              </a>
                            </h3>

                            <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-4">
                              {leadPost.excerpt}
                            </p>
                          </div>

                          <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                            <div className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-800">By {leadPost.author}</span>
                            </div>
                            <a 
                              href={`/blog/${leadPost.slug}`}
                              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-800"
                            >
                              <span>Read Article</span>
                              <span>→</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Secondary 3-Column Grid */}
                    {regularPosts.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        {regularPosts.map((post) => (
                          <article 
                            key={post.id}
                            className="bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
                          >
                            <div>
                              <div className="h-48 overflow-hidden bg-slate-900 relative">
                                <img 
                                  src={post.featured_image || '/assets/IMG_6170.jpg'} 
                                  alt={post.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  decoding="async"
                                />
                              </div>

                              <div className="p-6 space-y-3">
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  <span>{new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                  <span>•</span>
                                  <span>{post.read_time || '4 min read'}</span>
                                </div>

                                <h4 className="font-bold text-slate-900 text-lg leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
                                  <a href={`/blog/${post.slug}`}>
                                    {post.title}
                                  </a>
                                </h4>

                                <p className="text-slate-600 text-xs md:text-sm leading-relaxed line-clamp-3">
                                  {post.excerpt}
                                </p>
                              </div>
                            </div>

                            <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-4">
                              <span className="text-slate-500 font-medium truncate max-w-[130px]">{post.author}</span>
                              <a 
                                href={`/blog/${post.slug}`}
                                className="font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider inline-flex items-center space-x-1"
                              >
                                <span>Read</span>
                                <span>→</span>
                              </a>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-12 text-center">
              <p className="text-slate-500 text-sm">No technical publications are currently live. Check back shortly or visit our blog portal.</p>
              <a href="/blog" className="mt-4 inline-block px-6 py-2.5 bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider">
                Visit Insights Hub
              </a>
            </div>
          )}

        </div>
      </section>

      {/* 11. Careers Banner */}
      <section className="bg-slate-950 py-24 md:py-32 reveal text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={CareersBg} 
            alt="Careers Background" 
            className="w-full h-full object-cover opacity-35 grayscale"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-emerald-400 font-bold mb-6 text-sm uppercase tracking-widest">Join Our Engineering Team</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10 leading-tight tracking-tight">
            Help build and protect critical infrastructure
          </h2>
          <a 
            href="/careers" 
            className="inline-flex items-center bg-white text-slate-900 font-bold px-10 py-4 hover:bg-emerald-500 hover:text-white transition-colors text-sm uppercase tracking-widest"
          >
            Careers at PIGL <span className="ml-3 font-normal text-xl">→</span>
          </a>
        </div>
      </section>

      {/* Video Story Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/95 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl aspect-video rounded-none overflow-hidden shadow-2xl bg-black animate-fade-in-scale">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-12 h-12 bg-white hover:bg-emerald-500 text-slate-900 hover:text-white flex items-center justify-center transition-colors shadow-lg"
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

