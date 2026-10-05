import React, { useState, useRef, useEffect } from 'react';
import { uploadMediaFile } from '../../lib/supabase';
import { getYouTubeId, getYouTubeThumbnail } from '../../utils/video';

interface ImageUploaderProps {
  currentUrl?: string;
  onUploadComplete: (url: string) => void;
  bucket?: 'services' | 'blog' | 'sliders' | 'media' | 'videos';
  label?: string;
  helperText?: string;
  accept?: string;
  theme?: 'light' | 'dark';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  onUploadComplete,
  bucket = 'media',
  label = 'Upload Media Asset',
  helperText = 'Images, MP4/WebM Videos, or PDF (Max 50MB for video)',
  accept = 'image/*,video/*,.pdf',
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize internal preview when external currentUrl changes (typing, presets, or clearing)
  useEffect(() => {
    setPreview(currentUrl);
  }, [currentUrl]);

  const youtubeId = preview ? getYouTubeId(preview) : null;
  const isVideo = Boolean(
    !youtubeId && preview && (
      preview.startsWith('data:video') ||
      preview.startsWith('blob:') ||
      /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(preview) ||
      bucket === 'videos' ||
      (accept && accept.includes('video') && !/\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(preview))
    )
  );

  const handleFile = async (file: File) => {
    setError(null);
    setUploading(true);

    try {
      const res = await uploadMediaFile(file, (bucket as any) || 'media');
      if (res.error) {
        setError(res.error);
      } else {
        setPreview(res.url);
        onUploadComplete(res.url);
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className={`block text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
        {label}
      </label>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition-all text-center relative group cursor-pointer min-h-[140px] ${
          isDark 
            ? 'border-slate-700 bg-slate-900/80 hover:bg-slate-800/90 hover:border-emerald-500' 
            : 'border-slate-300 bg-slate-50/70 hover:bg-slate-100/70 hover:border-emerald-600'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {uploading ? (
          <div className="flex flex-col items-center py-4 text-emerald-500">
            <svg className="animate-spin h-8 w-8 mb-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs font-semibold">Processing & uploading media asset...</span>
          </div>
        ) : preview ? (
          <div className="relative w-full flex flex-col items-center">
            <div className={`relative max-h-52 w-full rounded-lg overflow-hidden border shadow-sm mb-2 flex items-center justify-center ${
              isDark ? 'border-slate-700 bg-black' : 'border-slate-200 bg-black'
            }`}>
              {youtubeId ? (
                <div className="relative w-full aspect-video max-h-48 overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={getYouTubeThumbnail(preview) || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                    alt="YouTube Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="px-3 py-1.5 rounded-lg bg-red-600/90 text-white font-bold text-xs flex items-center space-x-1.5 shadow-lg">
                      <span>▶ YouTube Video ({youtubeId})</span>
                    </div>
                  </div>
                </div>
              ) : isVideo ? (
                <video
                  src={preview}
                  controls
                  muted
                  playsInline
                  className="max-h-48 w-full object-contain mx-auto"
                />
              ) : (
                <img src={preview} alt="Upload Preview" className="max-h-48 w-auto object-cover" />
              )}
            </div>
            <div className="flex items-center space-x-2">
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Click or drag new {youtubeId ? 'video' : isVideo ? 'video' : 'image'} to replace
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview('');
                  onUploadComplete('');
                }}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 underline"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div className="py-3">
            <svg className="mx-auto h-8 w-8 text-slate-400 mb-2 group-hover:text-emerald-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className={`text-xs font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Click to upload or drag & drop</p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{helperText}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-500 font-medium">{error}</p>
      )}

      {preview && (
        <div className={`flex items-center space-x-2 text-xs border rounded-lg p-2 ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>URL:</span>
          <input
            type="text"
            readOnly
            value={preview}
            className={`flex-1 bg-transparent outline-none truncate font-mono text-xs ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(preview);
              alert('Media URL copied to clipboard!');
            }}
            className={`px-2 py-0.5 rounded text-xs font-bold uppercase transition-colors ${
              isDark 
                ? 'bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300' 
                : 'bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700'
            }`}
          >
            Copy
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreview('');
              onUploadComplete('');
            }}
            className="px-2 py-0.5 rounded text-xs font-bold uppercase text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
