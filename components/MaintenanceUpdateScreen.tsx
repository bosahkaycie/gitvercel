import React, { useState, useEffect, useRef } from 'react';
import LogoLightImg from '../assets/logo_light.png';
import LogoDarkImg from '../assets/LOGO.png';
import { SiteSettings } from '../types';

interface MaintenanceUpdateScreenProps {
  settings?: SiteSettings;
}

const PRESET_VIDEOS = [
  { id: 'frankstar', title: 'Offshore Vessel & MetOcean', url: '/assets/FRANKSTAR LOOP.mp4' },
  { id: 'digital', title: '3D Reality Capture & Scanning', url: '/assets/DIGITAL INTELLINGENCE.mp4' },
  { id: 'offshore', title: 'Offshore Telemetry', url: '/assets/OFFSHORE INTELLIGENCE.mp4' },
  { id: 'ground', title: 'Ground Truth & Geotechnical', url: '/assets/videos/ground_intelligence.mp4' }
];

const MaintenanceUpdateScreen: React.FC<MaintenanceUpdateScreenProps> = ({ settings }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState<number>(() => {
    if (settings?.maintenance_video_url) {
      const foundIdx = PRESET_VIDEOS.findIndex(v => v.url === settings.maintenance_video_url);
      if (foundIdx >= 0) return foundIdx;
    }
    return 0;
  });

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [timeWAT, setTimeWAT] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live time ticker in West Africa Time (Port Harcourt HQ)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeWAT(now.toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos', hour12: false }) + ' WAT');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-cycle background videos every 22 seconds
  useEffect(() => {
    const cycleTimer = setInterval(() => {
      setActiveVideoIdx(prev => (prev + 1) % PRESET_VIDEOS.length);
    }, 22000);
    return () => clearInterval(cycleTimer);
  }, []);

  const currentVideo = PRESET_VIDEOS[activeVideoIdx];

  const headline = settings?.maintenance_title?.trim() || 'Website Undergoing Scheduled Systems Update';
  const message = settings?.maintenance_message?.trim() ||
    'Our digital infrastructure is currently undergoing scheduled engineering upgrades and maintenance. All PIGL field operations, offshore survey vessels, and client deliverables continue uninterrupted with full operational integrity.';
  const estimated = settings?.maintenance_estimated_time?.trim() ||
    'Estimated deployment completion: Within the scheduled maintenance window.';
  const phone = settings?.phone || '+234-(0) 809 7081 333';
  const phoneRaw = settings?.phone_raw || '+2348097081333';
  const email = settings?.email_info || 'info@polarisigl.com';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      
      {/* Background Video Player */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          key={currentVideo.url}
          src={currentVideo.url}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-[0.45] contrast-[1.1] transition-all duration-1000"
        />

        {/* Ambient Engineering Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-slate-950/95" />
        
        {/* Subtle Engineering Grid */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-20 px-4 py-4 sm:px-10 sm:py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <img
            src={LogoLightImg}
            alt="Polaris Integrated & GeoSolutions Limited"
            className="h-8 sm:h-11 w-auto object-contain"
          />
          <div className="hidden sm:block h-6 w-px bg-white/20" />
          <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
            POLARIS PORTAL
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Audio Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 backdrop-blur-md text-[11px] sm:text-xs font-mono font-medium flex items-center space-x-1.5 sm:space-x-2 transition-colors"
            title={isMuted ? 'Unmute background operational reel' : 'Mute background reel'}
          >
            <span>{isMuted ? '🔇 Audio' : '🔊 Audio'}</span>
          </button>

          {/* Admin Bypass Link */}
          <a
            href="/admin"
            className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
            title="Sign in to Administrator Backend"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span>Staff Portal</span>
          </a>
        </div>
      </header>

      {/* Main Notice Hero Card */}
      <main className="relative z-20 max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-12 text-center flex flex-col items-center justify-center my-auto w-full">
        {/* Pulsing Status Pill */}
        <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-xl mb-6 shadow-lg shadow-amber-950/30 max-w-full">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase text-amber-300 truncate">
            SYSTEM MAINTENANCE & DEPLOYMENT IN PROGRESS
          </span>
        </div>

        {/* Primary Title */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.18] mb-4 sm:mb-5">
          {headline}
        </h1>

        {/* Message */}
        <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed mb-6 sm:mb-8">
          {message}
        </p>

        {/* Estimated Time Badge */}
        {estimated && (
          <div className="mb-6 sm:mb-8 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md text-xs font-mono text-emerald-400 flex items-center space-x-2 max-w-full">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
              <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="truncate">{estimated}</span>
          </div>
        )}

        {/* 3 Operational Reassurance Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl text-left mb-8 sm:mb-10">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Field Operations</span>
            </div>
            <p className="text-xs font-bold text-white">100% Operational & Active</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Rig, vessel & laser teams on-site.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">HSSEQ Command</span>
            </div>
            <p className="text-xs font-bold text-white">Goal Zero LTI Certified</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">ISO 9001 & 45001 safety active.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10 backdrop-blur-md">
            <div className="flex items-center space-x-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tenders & RFPs</span>
            </div>
            <p className="text-xs font-bold text-white">Direct Email & Hotline</p>
            <p className="text-[10.5px] text-slate-400 mt-0.5">Commercial desk responsive.</p>
          </div>
        </div>

        {/* Urgent Contact Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-semibold w-full sm:w-auto">
          <a
            href={`tel:${phoneRaw}`}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-950/50 hover:scale-[1.02] active:scale-95 text-center"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 0 0-1.02.24l-2.2 2.2a15.045 15.045 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
            </svg>
            <span>Emergency Hotline: {phone}</span>
          </a>

          <a
            href={`mailto:${email}`}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-95 text-center"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
            </svg>
            <span>Commercial Email: {email}</span>
          </a>
        </div>
      </main>

      {/* Video Selector & Footer Telemetry */}
      <footer className="relative z-20 px-6 py-4 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 backdrop-blur-md bg-slate-950/60 text-xs text-slate-400">
        {/* Background Video Selector Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-500 mr-1 hidden md:inline">
            Reel:
          </span>
          {PRESET_VIDEOS.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => setActiveVideoIdx(idx)}
              className={`px-2.5 py-1 rounded text-[10.5px] font-mono transition-colors whitespace-nowrap ${
                activeVideoIdx === idx
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {v.title}
            </button>
          ))}
        </div>

        {/* Live HQ Clock & Copyright */}
        <div className="flex items-center space-x-4 shrink-0 font-mono text-[11px]">
          {timeWAT && (
            <span className="text-emerald-400 font-bold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{timeWAT}</span>
            </span>
          )}
          <span>© {new Date().getFullYear()} Polaris Integrated & GeoSolutions Limited</span>
        </div>
      </footer>
    </div>
  );
};

export default MaintenanceUpdateScreen;
