import React, { useState } from 'react';

interface YouTubeFacadeProps {
  videoId: string;
  title: string;
  poster?: string;
  duration?: string;
  className?: string;
  showBadge?: boolean;
  showOverlayText?: boolean;
}

/**
 * High-Performance Privacy-Enhanced YouTube Facade
 * 
 * Prevents YouTube from loading 500KB-1MB of player JavaScript, Google fonts,
 * and tracking cookies on initial page render.
 * 
 * Renders an accessible, responsive poster with a native PIGL branded play button.
 * Instantiates the actual youtube-nocookie iframe only upon intentional user interaction.
 */
export const YouTubeFacade: React.FC<YouTubeFacadeProps> = ({
  videoId,
  title,
  poster,
  duration = '6:20',
  className = '',
  showBadge = true,
  showOverlayText = true
}) => {
  const [isActivated, setIsActivated] = useState(false);
  const [imgError, setImgError] = useState(false);

  const primaryPoster = poster || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const fallbackPoster = '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg';

  if (isActivated) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden shadow-xl border border-slate-200 bg-slate-950 ${className}`}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={title}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onClick={() => setIsActivated(true)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsActivated(true);
        }
      }}
      className={`relative aspect-video w-full overflow-hidden shadow-xl border border-slate-200 bg-slate-950 cursor-pointer group select-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${className}`}
    >
      {/* Background Poster Image */}
      <img
        src={imgError ? fallbackPoster : primaryPoster}
        alt={title}
        width="1280"
        height="720"
        loading="lazy"
        decoding="async"
        onError={() => setImgError(true)}
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
      />

      {/* Cinematic Gradient Scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40 transition-opacity duration-300 group-hover:opacity-80 pointer-events-none" />

      {/* Duration & Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        {showBadge && (
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-emerald-400 border border-emerald-500/40 rounded-lg shadow-md backdrop-blur-sm font-mono">
            PIGL Documentary
          </span>
        )}
        {duration && (
          <span className="px-2.5 py-1 text-[11px] font-semibold font-mono text-slate-200 bg-slate-950/80 rounded-lg backdrop-blur-sm border border-white/10 shadow-md">
            {duration}
          </span>
        )}
      </div>

      {/* Centered Play Button Interaction */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/95 text-white flex items-center justify-center shadow-2xl backdrop-blur-xs border-2 border-white/40 group-hover:bg-emerald-500 group-hover:scale-110 group-hover:shadow-emerald-600/50 transition-all duration-300">
          <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>

      {/* Bottom Title Bar */}
      {showOverlayText && (
        <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-white text-xs pointer-events-none">
          <span className="font-semibold text-slate-100 line-clamp-1 group-hover:text-emerald-300 transition-colors">
            {title}
          </span>
          <span className="text-[11px] text-slate-300 flex items-center gap-1.5 flex-shrink-0 ml-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Click to Play
          </span>
        </div>
      )}
    </div>
  );
};

export default YouTubeFacade;

