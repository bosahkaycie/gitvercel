import React, { useState } from 'react';
import VideoHeroBg from '../assets/IMG_6558.jpg';
import DocThumbImg from '../assets/team_large.jpeg';
import CptThumbImg from '../assets/cpt.png';
import DigitalThumbImg from '../assets/digital_intel_scanner.jpg';
import PipelineThumbImg from '../assets/newpipeline.png';
import MarineThumbImg from '../assets/marine_intel_metocean.jpg';
import HsseThumbImg from '../assets/IMG_6170.jpg';
import ReflectiveEnergyLine from '../components/ReflectiveEnergyLine';
import { CMSVideoItem } from '../types';
import { useVideos } from '../hooks/useSupabaseData';

const OFFICIAL_VIDEOS: CMSVideoItem[] = [
  {
    id: 'doc-main',
    youtubeId: 'sExrHCIGkH0',
    title: 'Polaris Integrated & GeoSolutions Limited — Corporate Documentary',
    category: 'documentary',
    categoryLabel: 'Corporate Documentary',
    duration: '07:14',
    publishDate: '2026',
    description: 'A comprehensive visual exploration of PIGL indigenous engineering heritage, ground characterisation, sub-centimeter reality capture, and high-assurance field execution across Nigerian energy corridors.',
    highlights: [
      'Indigenous Tier-1 Engineering Heritage & Vision',
      'Ground Intelligence: In-situ 20-Ton CPT & Soil Mechanics',
      'Digital Intelligence: 3D Reality Capture & Digital Twin As-Builts',
      'Pipeline Integrity, Mechanical Fabrication & Welding',
      'HSSEQ Excellence: Zero LTI & ISO 9001 / ISO 45001 Governance'
    ],
    thumbnail: 'https://img.youtube.com/vi/sExrHCIGkH0/maxresdefault.jpg'
  },
  {
    id: 'cpt-operations',
    youtubeId: 'sExrHCIGkH0',
    title: 'Ground Intelligence: 20-Ton Hydraulic CPT & Swamp Soil Characterisation',
    category: 'ground',
    categoryLabel: 'Ground Intelligence',
    duration: '04:45',
    publishDate: '2026',
    description: 'Field footage of PIGL hydraulic cone penetration testing (CPT) units and amphibious pontoon rigs operating in complex Niger Delta swamp and coastal formations to eliminate foundation failure risks.',
    highlights: [
      '20-Ton Heavy-Duty Hydraulic Thrust Rigs',
      'Continuous Tip Resistance & Sleeve Friction Telemetry',
      'Amphibious Pontoon Shallow Water Operations',
      'Deep Foundation & Piling Engineering Data'
    ],
    thumbnail: CptThumbImg
  },
  {
    id: 'laser-scanning',
    youtubeId: 'sExrHCIGkH0',
    title: 'Digital Intelligence: Leica RTC360 3D Reality Capture & Asset Digitalization',
    category: 'digital',
    categoryLabel: 'Digital Intelligence',
    duration: '03:52',
    publishDate: '2026',
    description: 'High-definition 3D laser scanning demonstration delivering millimeter-accurate point cloud modeling, clash detection, and intelligent As-Built BIM twins for offshore platforms and brownfield industrial plants.',
    highlights: [
      '2 Million Points/Second High-Density LiDAR',
      'Dimensional Control & Brownfield Tie-in Verification',
      'Intelligent 3D CAD/BIM Digital Twin Generation',
      'Virtual Asset Walkthroughs & Maintenance Planning'
    ],
    thumbnail: DigitalThumbImg
  },
  {
    id: 'pipeline-integrity',
    youtubeId: 'sExrHCIGkH0',
    title: 'Integrated Engineering: API-Standard Pipeline Fabrication & Integrity Testing',
    category: 'pipeline',
    categoryLabel: 'Pipeline Engineering',
    duration: '05:18',
    publishDate: '2026',
    description: 'Showcase of PIGL mechanical fabrication yard, sectional pipeline replacements, precision orbital welding, and high-pressure hydrostatic integrity certifications across land and swamp right-of-ways.',
    highlights: [
      'API 1104 & ASME B31.3 Standard Welding',
      'Non-Destructive Testing (NDT) & Ultrasonic Inspection',
      'Hydrostatic Pressure Testing & De-watering',
      'Heavy Right-of-Way Pipelay & Swamp Access Execution'
    ],
    thumbnail: PipelineThumbImg
  },
  {
    id: 'offshore-marine',
    youtubeId: 'sExrHCIGkH0',
    title: 'Offshore Intelligence: Multi-Beam Bathymetry & MetOcean Telemetry Buoys',
    category: 'marine',
    categoryLabel: 'Offshore & Marine',
    duration: '04:10',
    publishDate: '2026',
    description: 'Marine survey deployments featuring multi-beam echo sounders, sub-bottom profiling, and real-time oceanographic meteorological observation buoys safeguarding deepwater subsea corridors.',
    highlights: [
      'High-Resolution Seabed Topography Bathymetry',
      'Real-time Wave, Current & Wind Meteorological Telemetry',
      'Sub-bottom Acoustic Stratigraphy Profiling',
      'Subsea Pipeline & Cable Route Scoping'
    ],
    thumbnail: MarineThumbImg
  },
  {
    id: 'hsse-standards',
    youtubeId: 'sExrHCIGkH0',
    title: 'PIGL HSSEQ & Community Commitment: 500,000+ Safe Man-Hours & Zero LTI',
    category: 'hsse',
    categoryLabel: 'HSSE & Quality Policy',
    duration: '03:30',
    publishDate: '2026',
    description: 'Overview of Polaris Integrated & GeoSolutions Limited health, safety, environmental stewardship, and community relations across all field operations, certified under ISO 9001:2015 and ISO 45001:2018.',
    highlights: [
      'Over 500k+ Safe Operational Hours without Loss Time Injury',
      'Certified ISO 9001:2015 & ISO 45001:2018 Frameworks',
      'Community Content Development & Host Community Harmony',
      'Environmental Impact Mitigation & Waste Minimization'
    ],
    thumbnail: HsseThumbImg
  }
];

const Videos: React.FC = () => {
  const { videos } = useVideos();
  const effectiveVideos = videos && videos.length > 0
    ? videos.filter(v => v.status !== 'draft')
    : OFFICIAL_VIDEOS;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<CMSVideoItem | null>(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState<boolean>(false);

  const filteredVideos = activeCategory === 'all'
    ? effectiveVideos
    : effectiveVideos.filter(v => v.category === activeCategory);

  const heroVideo = effectiveVideos.find(v => v.featured) || effectiveVideos[0] || OFFICIAL_VIDEOS[0];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-slate-900">
      
      {/* 1. Immersive Video Hub Hero Header */}
      <section className="relative bg-slate-950 pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 z-0">
          <img 
            src={VideoHeroBg} 
            alt="PIGL Video Hub" 
            className="w-full h-full object-cover opacity-20 grayscale-[0.3]"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/75"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="text-slate-600">/</span>
            <span className="text-white">Media & Video Hub</span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
              PIGL Video Hub & Operations in Action
            </h1>
            <p className="text-base md:text-lg text-slate-300 font-normal leading-relaxed">
              Explore our official corporate documentary, hydraulic CPT field operations, 3D laser scanning reality capture, and high-assurance energy infrastructure case studies.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="https://www.youtube.com/@polarisigl"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg hover:shadow-rose-600/30"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Subscribe on YouTube (@polarisigl)</span>
              </a>
              <span className="text-xs text-slate-400 font-mono">
                Official Channel • Port Harcourt, Nigeria
              </span>
            </div>
          </div>
        </div>

        {/* Continuous Reflective Energy Line at the base of the Hero & Breadcrumb section */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <ReflectiveEnergyLine dark={true} />
        </div>
      </section>

      {/* 2. Featured Corporate Documentary Showcase */}
      <section className="py-16 md:py-24 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-10 pb-6 border-b border-slate-800">
            <div>
              <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-bold block mb-1">
                Featured Presentation
              </span>
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white">
                Company Corporate Documentary
              </h2>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
              <span>Runtime: <strong className="text-white">07:14</strong></span>
              <span>•</span>
              <span>Quality: <strong className="text-emerald-400">1080p Full HD</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Video Player Card (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 shadow-2xl group">
                {!isHeroPlaying ? (
                  <div className="relative w-full h-full cursor-pointer" onClick={() => setIsHeroPlaying(true)}>
                    <img
                      src="https://img.youtube.com/vi/sExrHCIGkH0/maxresdefault.jpg"
                      alt="PIGL Corporate Documentary"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => {
                        // Fallback if maxres is unavailable
                        (e.target as HTMLImageElement).src = DocThumbImg;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                    
                    {/* Glowing Big Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300 ring-8 ring-emerald-500/30">
                        <svg className="w-8 h-8 md:w-10 md:h-10 fill-current translate-x-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <iframe
                    src="https://www.youtube-nocookie.com/embed/sExrHCIGkH0?autoplay=1&rel=0"
                    title="Polaris Integrated & GeoSolutions Limited Corporate Documentary"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  ></iframe>
                )}
              </div>
            </div>

            {/* Right: Documentary Narrative & Chapter Outline (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                  High-Fidelity Engineering Intelligence Across Nigerian Terrains
                </h3>
                <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-2.5">
                  This documentary provides an insider look into PIGL field operations in Port Harcourt and across Nigeria's energy corridors — showcasing how we eliminate foundation uncertainties, digitize critical brownfield facilities, and uphold rigorous zero-LTI safety protocols.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Documentary Chapters & Highlights:
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {heroVideo.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://www.youtube.com/watch?v=sExrHCIGkH0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 border border-slate-700"
                >
                  <span>Open on YouTube</span>
                  <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <a
                  href="/contact"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  Consult Engineering Team
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Category Filter & Curated Video Gallery */}
      <section className="py-16 md:py-24 bg-slate-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-emerald-700 font-bold text-xs uppercase tracking-wider block mb-1">
                Official YouTube Archive
              </span>
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Operations & Engineering Video Showcase
              </h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1 max-w-2xl">
                Browse our collection of field execution clips, technical presentations, and project case studies.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-200/80 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Videos' },
                { id: 'documentary', label: 'Documentaries' },
                { id: 'ground', label: 'Ground & CPT' },
                { id: 'digital', label: '3D Reality Capture' },
                { id: 'pipeline', label: 'Pipelines' },
                { id: 'marine', label: 'Offshore' },
                { id: 'hsse', label: 'HSSE & Safety' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail with Play Overlay */}
                  <div 
                    className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer"
                    onClick={() => setActiveVideoModal(video)}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors"></div>
                    
                    {/* Play icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-emerald-700/90 text-white flex items-center justify-center shadow-md group-hover:scale-115 group-hover:bg-emerald-600 transition-all duration-300">
                        <svg className="w-5 h-5 fill-current translate-x-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* Card Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                      <span className="text-emerald-700 font-bold uppercase tracking-wider">{video.categoryLabel}</span>
                      <span>{video.duration}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug tracking-tight group-hover:text-emerald-700 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {video.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setActiveVideoModal(video)}
                    className="font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
                  >
                    <span>Watch Video</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                    </svg>
                  </button>

                  <a
                    href={`https://www.youtube.com/watch?v=sExrHCIGkH0`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-rose-600 transition-colors flex items-center space-x-1"
                    title="View on YouTube"
                  >
                    <span className="text-[11px] font-mono">YouTube</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube Channel Subscribe Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-8 md:p-12 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-rose-400 text-xs font-mono font-bold uppercase tracking-wider">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>@polarisigl on YouTube</span>
              </div>
              <h3 className="text-xl md:text-3xl font-bold tracking-tight">
                Stay Updated with Our Latest Engineering Footage
              </h3>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                Subscribe to our official YouTube channel for new field deployment videos, equipment showcases, and technical masterclasses.
              </p>
            </div>

            <a
              href="https://www.youtube.com/@polarisigl?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-2 shadow-xl hover:shadow-rose-600/40"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>Subscribe on YouTube</span>
            </a>
          </div>

        </div>
      </section>

      {/* 4. Interactive Video Playback Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-700/60 rounded text-[10px] font-mono uppercase font-bold">
                  {activeVideoModal.categoryLabel}
                </span>
                <h3 className="text-sm font-bold truncate">
                  {activeVideoModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-white p-1 text-sm font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideoModal.youtubeId}?autoplay=1&rel=0`}
                title={activeVideoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              ></iframe>
            </div>

            <div className="p-5 bg-slate-900 text-slate-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-800">
              <p className="line-clamp-2 max-w-2xl">{activeVideoModal.description}</p>
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoModal.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1.5 transition-all"
              >
                <span>Watch on YouTube</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Videos;
