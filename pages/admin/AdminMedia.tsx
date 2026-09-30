import React, { useState } from 'react';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  IconMedia,
  IconCopy,
  IconCheck,
  IconUpload,
  IconGlobe
} from '../../components/admin/AdminIcons';

interface AdminMediaProps {
  theme?: 'light' | 'dark';
}

const BUCKETS = [
  { id: 'services', name: 'Services (/services/)', desc: 'Hero imagery & diagram assets for capabilities' },
  { id: 'videos', name: 'Videos & Motion (/videos/)', desc: 'MP4, WebM background loops & technical videos for sliders and pages' },
  { id: 'blog', name: 'Blog & News (/blog/)', desc: 'Article thumbnails & technical photo essays' },
  { id: 'sliders', name: 'Homepage Sliders (/sliders/)', desc: 'Full-width 1920x1080 hero carousel images' },
  { id: 'media', name: 'General Media (/media/)', desc: 'Certifications, company profiles, logos, & documents' }
] as const;

// Sample recent media library items for immediate browsing
const INITIAL_MEDIA_ITEMS = [
  { id: 'v1', name: 'FRANKSTAR LOOP.mp4', url: '/assets/FRANKSTAR LOOP.mp4', bucket: 'videos', size: '18.4 MB', type: 'video/mp4' },
  { id: 'v2', name: 'OFFSHORE INTELLIGENCE.mp4', url: '/assets/OFFSHORE INTELLIGENCE.mp4', bucket: 'videos', size: '24.1 MB', type: 'video/mp4' },
  { id: 'v3', name: 'DIGITAL INTELLINGENCE.mp4', url: '/assets/DIGITAL INTELLINGENCE.mp4', bucket: 'videos', size: '15.8 MB', type: 'video/mp4' },
  { id: 'v4', name: 'ground_intelligence.mp4', url: '/assets/videos/ground_intelligence.mp4', bucket: 'videos', size: '12.2 MB', type: 'video/mp4' },
  { id: 'm1', name: 'digital_intel_scanner.jpg', url: '/assets/digital_intel_scanner.jpg', bucket: 'services', size: '2.4 MB', type: 'image/jpeg' },
  { id: 'm2', name: 'marine_intel_metocean.jpg', url: '/assets/marine_intel_metocean.jpg', bucket: 'services', size: '1.8 MB', type: 'image/jpeg' },
  { id: 'm3', name: 'cpt.png', url: '/assets/cpt.png', bucket: 'services', size: '3.1 MB', type: 'image/png' },
  { id: 'm4', name: 'geomatics_survey.png', url: '/assets/geomatics_survey.png', bucket: 'services', size: '2.9 MB', type: 'image/png' },
  { id: 'm5', name: 'IMG_6170.jpg', url: '/assets/IMG_6170.jpg', bucket: 'blog', size: '1.5 MB', type: 'image/jpeg' },
  { id: 'm6', name: 'DJI_0003.jpg', url: '/assets/DJI_0003.jpg', bucket: 'sliders', size: '4.2 MB', type: 'image/jpeg' },
  { id: 'm7', name: 'newpipeline.png', url: '/assets/newpipeline.png', bucket: 'services', size: '2.2 MB', type: 'image/png' },
  { id: 'm8', name: 'rig_positioning.png', url: '/assets/rig_positioning.png', bucket: 'services', size: '1.9 MB', type: 'image/png' },
  { id: 'm9', name: 'drilling.png', url: '/assets/drilling.png', bucket: 'services', size: '2.7 MB', type: 'image/png' },
  { id: 'm10', name: 'procure.jpg', url: '/assets/procure.jpg', bucket: 'services', size: '1.4 MB', type: 'image/jpeg' }
];

const LOCAL_STORAGE_KEY_CUSTOM_MEDIA = 'pigl_custom_media_v1';

const AdminMedia: React.FC<AdminMediaProps> = ({ theme = 'light' }) => {
  const [activeBucket, setActiveBucket] = useState<'services' | 'blog' | 'sliders' | 'media' | 'videos'>('services');
  const [mediaList, setMediaList] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MEDIA);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return INITIAL_MEDIA_ITEMS;
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isDark = theme === 'dark';
  const filteredMedia = mediaList.filter(m => m.bucket === activeBucket);

  const handleUploadSuccess = (url: string) => {
    const isVid = url.startsWith('data:video') || /\.(mp4|webm|ogg|mov)($|\?)/i.test(url) || activeBucket === 'videos';
    const newItem = {
      id: `m-${Date.now()}`,
      name: isVid ? `video_asset_${Date.now()}.mp4` : `media_upload_${Date.now()}.png`,
      url,
      bucket: activeBucket,
      size: isVid ? '< 50 MB' : '< 10 MB',
      type: isVid ? 'video/mp4' : 'image/jpeg'
    };
    const updated = [newItem, ...mediaList];
    setMediaList(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MEDIA, JSON.stringify(updated));
    } catch {}
  };

  const copyToClipboard = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className={`space-y-8 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Media & Storage Buckets
          </h1>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Upload, browse, and copy direct storage URLs for services, blog articles, and homepage sliders.
          </p>
        </div>
      </div>

      {/* Bucket Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {BUCKETS.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBucket(b.id)}
            className={`p-5 rounded-2xl text-left border transition-all ${
              activeBucket === b.id
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                : isDark 
                  ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700' 
                  : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-xs'
            }`}
          >
            <p className="font-bold text-xs sm:text-sm uppercase tracking-wider mb-1.5">
              {b.name}
            </p>
            <p className={`text-xs sm:text-sm leading-relaxed ${activeBucket === b.id ? 'text-emerald-100' : isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {b.desc}
            </p>
          </button>
        ))}
      </div>

      {/* Direct Uploader Box */}
      <div className={`border rounded-2xl p-6 shadow-xs transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <h3 className={`text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 flex items-center space-x-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          <IconUpload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Upload New Asset to <span className="text-emerald-600 dark:text-emerald-400 font-mono">/{activeBucket}/</span></span>
        </h3>
        <ImageUploader
          bucket={activeBucket}
          onUploadComplete={handleUploadSuccess}
          label={activeBucket === 'videos' ? 'Upload Video Asset' : 'Select File'}
          helperText={activeBucket === 'videos' ? 'MP4, WebM, or OGG video clips (up to 50MB)' : 'Max 10MB • Auto-optimized for web delivery'}
          accept={activeBucket === 'videos' ? 'video/mp4,video/webm,video/ogg,video/quicktime' : 'image/*,video/*,.pdf'}
        />
      </div>

      {/* Media Items Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm sm:text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Files in /{activeBucket}/ ({filteredMedia.length})
          </h3>
        </div>

        {filteredMedia.length === 0 ? (
          <div className={`p-12 border rounded-2xl text-center text-sm font-medium ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            No files uploaded to this bucket yet. Use the upload box above to add your first asset.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredMedia.map((item) => {
              const isVideoItem = Boolean(
                item.type?.startsWith('video/') ||
                item.bucket === 'videos' ||
                /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.url)
              );

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl overflow-hidden shadow-xs flex flex-col group transition-all ${
                    isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="h-36 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                    {isVideoItem ? (
                      <div className="w-full h-full relative flex items-center justify-center bg-black">
                        <video
                          src={item.url}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white flex items-center space-x-1 shadow-sm">
                          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                          <span>VIDEO</span>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2 p-2">
                      <button
                        onClick={() => copyToClipboard(item.id, item.url)}
                        className="w-full max-w-[130px] px-3 py-1.5 bg-white text-slate-900 font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors flex items-center justify-center space-x-1.5"
                      >
                        {copiedId === item.id ? (
                          <>
                            <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <IconCopy className="w-3.5 h-3.5" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full max-w-[130px] px-3 py-1 bg-slate-800 text-white font-medium text-[11px] rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <IconGlobe className="w-3 h-3 text-slate-300" />
                        <span>Preview</span>
                      </a>
                    </div>
                  </div>

                <div className="p-3.5 text-xs sm:text-sm flex-1 flex flex-col justify-between space-y-1.5">
                  <p className={`font-bold truncate ${isDark ? 'text-slate-100' : 'text-slate-900'}`} title={item.name}>
                    {item.name}
                  </p>
                  <div className={`flex items-center justify-between font-mono text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>{item.size}</span>
                    <span className="uppercase font-semibold">{item.bucket}</span>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMedia;
