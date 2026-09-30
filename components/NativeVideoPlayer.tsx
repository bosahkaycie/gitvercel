import React, { useState, useRef } from 'react';
import { getYouTubeId } from '../utils/video';

interface NativeVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
}

/**
 * NativeVideoPlayer
 * 
 * Provides a clean, indigenous, corporate video player experience:
 * - Plays direct video files (.mp4, .webm, /assets/...) using native HTML5 <video>
 *   with ZERO third-party branding, ZERO uploader info, and full 1080p fidelity.
 * - Handles YouTube/Vimeo URLs with a native PIGL branded facade and iframe cropping
 *   to suppress external uploader accounts, avatars, and YouTube watermarks.
 */
const NativeVideoPlayer: React.FC<NativeVideoPlayerProps> = ({
  src,
  poster,
  title = 'Operational Video',
  className = '',
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!src) return null;

  const trimmed = src.trim();
  const youtubeId = getYouTubeId(trimmed);
  const isDirect = !youtubeId && (
    trimmed.startsWith('/assets/') ||
    trimmed.startsWith('blob:') ||
    trimmed.startsWith('data:') ||
    /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed)
  );

  const fallbackPoster = poster || (
    youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : undefined
  );

  const handleNativePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying(true);
    }
  };

  // Case 1: Direct Video File (.mp4, /assets/videos/..., etc.) - 100% Native HTML5
  if (isDirect) {
    return (
      <div className={`relative w-full aspect-video bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-xl group ${className}`}>
        <video
          ref={videoRef}
          src={trimmed}
          poster={fallbackPoster}
          controls={controls}
          playsInline
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full h-full object-cover"
        />

        {/* Custom PIGL Branded Play Overlay when not playing */}
        {!isPlaying && (
          <button
            type="button"
            onClick={handleNativePlayClick}
            aria-label={`Play ${title}`}
            className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-950/30 hover:bg-slate-950/40 transition-colors cursor-pointer group-hover:scale-[1.01]"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-2xl group-hover:border-emerald-500 group-hover:bg-emerald-600 transition-all duration-300">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>
    );
  }

  // Case 2: YouTube Embed with Native Facade & Anti-Branding Crop
  if (youtubeId) {
    // Before click: Native facade without YouTube uploader branding or red button
    if (!isPlaying) {
      return (
        <div
          onClick={() => setIsPlaying(true)}
          className={`relative w-full aspect-video bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-xl cursor-pointer group ${className}`}
        >
          {fallbackPoster && (
            <img
              src={fallbackPoster}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              loading="lazy"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
          
          {/* Centered Native Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900/85 backdrop-blur-md border border-white/25 text-white flex items-center justify-center shadow-2xl group-hover:border-emerald-500 group-hover:bg-emerald-600 group-hover:scale-110 transition-all duration-300">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // When playing: Cropped embed to hide uploader avatar, channel title, and bottom watermark
    const embedParams = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
      iv_load_policy: '3',
      playsinline: '1',
      controls: controls ? '1' : '0'
    });

    return (
      <div className={`relative w-full aspect-video bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-xl ${className}`}>
        <div className="absolute -inset-x-0 -top-8 -bottom-8 overflow-hidden pointer-events-auto">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${embedParams.toString()}`}
            title={title}
            className="w-full h-full border-0 scale-105"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // Case 3: Generic Embed / Fallback iframe
  return (
    <div className={`relative w-full aspect-video bg-slate-950 overflow-hidden rounded-xl border border-slate-800 shadow-xl ${className}`}>
      <iframe
        src={trimmed}
        title={title}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default NativeVideoPlayer;
