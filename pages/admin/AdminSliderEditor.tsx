import React, { useState } from 'react';
import { CMSSlider } from '../../types';
import ImageUploader from '../../components/admin/ImageUploader';
import { IconVideo, IconTrash, IconClose } from '../../components/admin/AdminIcons';
import { getYouTubeId, getYouTubeEmbedUrl, getYouTubeThumbnail } from '../../utils/video';

interface AdminSliderEditorProps {
  initialData?: CMSSlider | null;
  onSave: (slider: Partial<CMSSlider> & { title: string }) => Promise<any>;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const PRESET_VIDEOS = [
  { label: 'PIGL Documentary (YouTube)', url: 'https://www.youtube.com/watch?v=sExrHCIGkH0' },
  { label: 'Frankstar MetOcean Loop', url: '/assets/FRANKSTAR LOOP.mp4' },
  { label: 'Digital Intelligence 3D Scan', url: '/assets/DIGITAL INTELLINGENCE.mp4' },
  { label: 'Offshore Intelligence Vessel', url: '/assets/OFFSHORE INTELLIGENCE.mp4' }
];

const AdminSliderEditor: React.FC<AdminSliderEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [title, setTitle] = useState(initialData?.title || '');
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [desktopImage, setDesktopImage] = useState(initialData?.desktop_image || '');
  const [mobileImage, setMobileImage] = useState(initialData?.mobile_image || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');
  const [ctaText, setCtaText] = useState(initialData?.cta_text || 'Explore Capabilities');
  const [ctaUrl, setCtaUrl] = useState(initialData?.cta_url || '/services');
  const [displayOrder, setDisplayOrder] = useState<number>(initialData?.display_order || 1);
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active ?? true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a slide headline title.');
      return;
    }

    setError(null);
    setSaving(true);

    const ytId = getYouTubeId(videoUrl);
    const ytThumbnail = ytId ? (getYouTubeThumbnail(videoUrl) || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`) : null;
    const cleanVideoUrl = videoUrl ? videoUrl.trim() : null;
    const cleanDesktopImage = desktopImage.trim() || ytThumbnail || '';
    const cleanMobileImage = mobileImage.trim() || cleanDesktopImage || '';

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      desktop_image: cleanDesktopImage,
      mobile_image: cleanMobileImage,
      video_url: cleanVideoUrl,
      cta_text: ctaText.trim() || 'Explore Capabilities',
      cta_url: ctaUrl.trim() || '/services',
      display_order: Number(displayOrder),
      is_active: isActive
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save slide.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-12">
      {/* Top action bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <button
            type="button"
            onClick={onCancel}
            className={`text-xs font-bold transition-colors mb-2 block ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ← Back to Sliders
          </button>
          <h1 className={`text-2xl font-black tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {initialData ? `Edit Homepage Slide: ${initialData.title}` : 'Create New Homepage Slide'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg text-xs font-bold uppercase transition-colors ${
              isDark 
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Slide'}
          </button>
        </div>
      </div>

      {error && (
        <div className={`p-4 border rounded-xl text-xs font-semibold flex items-center space-x-2.5 shadow-sm ${
          isDark ? 'bg-rose-950/90 border-rose-800 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          <span className="text-base shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Slide Content & Typography
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Headline Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pioneering Sub-Surface & Digital Geosolutions"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-base font-bold outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Subtitle / Partner Callout (Optional)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. In Strategic Partnership with Frankstar Technology"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Hero Description Paragraph
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="High-level engineering narrative appearing over the hero..."
                className={`w-full p-3 border rounded-lg text-sm outline-none leading-relaxed transition-colors ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Primary Button Text
                </label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Explore Capabilities"
                  className={`w-full p-2.5 border rounded-lg text-xs outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Button Target URL
                </label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="/services"
                  className={`w-full p-2.5 border rounded-lg text-xs outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Video Background Section */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center space-x-2 border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <IconVideo className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Background Video (Optional / Standalone)
              </h3>
            </div>

            {/* Direct Video Upload from Computer */}
            <div className="pt-1 pb-2">
              <ImageUploader
                bucket="media"
                currentUrl={videoUrl}
                onUploadComplete={(uploadedUrl) => setVideoUrl(uploadedUrl)}
                label="Upload Background Video (MP4 / WebM)"
                helperText="Upload any MP4/WebM video file (up to 50MB) to be saved to Media Library and used in this slide"
                accept="video/mp4,video/webm,video/ogg,video/quicktime"
                theme={theme}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Or Enter Video URL (Direct MP4 or YouTube Link)
              </label>
              <input
                type="text"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g. /assets/FRANKSTAR LOOP.mp4 or https://www.youtube.com/watch?v=sExrHCIGkH0"
                className={`w-full p-2.5 border rounded-lg text-xs font-mono outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Videos loop automatically with muted audio in high-fidelity behind the slide narrative.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="pt-2">
              <span className={`text-[11px] font-bold uppercase block mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Quick Select Available Video Loops:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_VIDEOS.map((vid) => (
                  <button
                    key={vid.url}
                    type="button"
                    onClick={() => setVideoUrl(vid.url)}
                    className={`px-2.5 py-1 text-xs rounded-lg border transition-all ${
                      videoUrl === vid.url
                        ? isDark
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold'
                        : isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {vid.label}
                  </button>
                ))}
                {videoUrl && (
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="px-2.5 py-1 text-xs rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 font-bold flex items-center space-x-1"
                  >
                    <IconClose className="w-3 h-3" />
                    <span>Clear Video</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Video Detection & Preview */}
            {videoUrl && (
              <div className="mt-4 pt-4 border-t border-dashed border-slate-700/50">
                {(() => {
                  const ytId = getYouTubeId(videoUrl);
                  if (ytId) {
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>YouTube Video Detected (ID: {ytId})</span>
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Will loop in background behind slide
                          </span>
                        </div>
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&mute=1&controls=1&loop=1&playlist=${ytId}`}
                            title="YouTube Preview"
                            className="w-full h-full"
                            allow="autoplay; encrypted-media"
                          />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                          <span>Direct Video File Detected</span>
                        </span>
                      </div>
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-800 bg-black shadow-lg">
                        <video
                          src={videoUrl}
                          controls
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Display & Status
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Display Order Sequence
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 1)}
                className={`w-full p-2.5 border rounded-lg text-sm outline-none ${
                  isDark
                    ? 'bg-slate-950 border-slate-700 text-white focus:border-emerald-500'
                    : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Slide position sequence (1, 2, 3...)</p>
            </div>

            <div className="pt-2">
              <label className={`flex items-center space-x-2 text-xs font-bold cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span>Active on Homepage Carousel</span>
              </label>
            </div>
          </div>

          {/* Desktop Background Image */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                Background Image (Optional)
              </h3>
              {desktopImage && (
                <button
                  type="button"
                  onClick={() => {
                    setDesktopImage('');
                    setMobileImage('');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1"
                >
                  <IconTrash className="w-3 h-3" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>

            {desktopImage ? (
              <ImageUploader
                label="High-Res Desktop Visual"
                currentUrl={desktopImage}
                onUploadComplete={(url) => {
                  setDesktopImage(url);
                  if (!mobileImage) setMobileImage(url);
                }}
                bucket="sliders"
                helperText="1920x1080 high-resolution background"
                theme={theme}
              />
            ) : (
              <div className="space-y-3">
                <div className={`p-4 border border-dashed rounded-xl text-center space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-300'
                }`}>
                  <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    No image set. {videoUrl ? 'Using background video.' : 'A sleek corporate dark gradient will be rendered.'}
                  </p>
                </div>
                <ImageUploader
                  label="Add Image Background"
                  currentUrl=""
                  onUploadComplete={(url) => {
                    setDesktopImage(url);
                    if (!mobileImage) setMobileImage(url);
                  }}
                  bucket="sliders"
                  helperText="Optional 1920x1080 background"
                  theme={theme}
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </form>
  );
};

export default AdminSliderEditor;
