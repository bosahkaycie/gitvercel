/**
 * Utility functions for detecting, embedding, and extracting video metadata (YouTube, MP4, WebM)
 */

export const getYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i
  );
  return match && match[1] ? match[1] : null;
};

export const getYouTubeThumbnail = (
  url?: string,
  quality: 'maxres' | 'hq' = 'maxres'
): string | null => {
  const id = getYouTubeId(url);
  if (!id) return null;
  return quality === 'maxres'
    ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    : `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
};

export const getYouTubeEmbedUrl = (
  url?: string,
  options: {
    autoplay?: boolean;
    mute?: boolean;
    loop?: boolean;
    controls?: boolean;
  } = { autoplay: true, mute: true, loop: true, controls: false }
): string | null => {
  const id = getYouTubeId(url);
  if (!id) return null;

  const params = new URLSearchParams();
  if (options.autoplay) params.set('autoplay', '1');
  if (options.mute) params.set('mute', '1');
  if (options.controls === false) params.set('controls', '0');
  if (options.loop) {
    params.set('loop', '1');
    params.set('playlist', id); // required by YouTube for single-video looping
  }
  params.set('playsinline', '1');
  params.set('rel', '0');
  params.set('showinfo', '0');
  params.set('iv_load_policy', '3');
  params.set('modestbranding', '1');
  params.set('enablejsapi', '1');

  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
};

export const isDirectVideoFile = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.ogg') || clean.endsWith('.mov');
};
