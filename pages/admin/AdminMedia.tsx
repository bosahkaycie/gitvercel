import React, { useState, useEffect, useMemo } from 'react';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  IconMedia,
  IconCopy,
  IconCheck,
  IconUpload,
  IconGlobe,
  IconTrash,
  IconSearch,
  IconVideo,
  IconServices,
  IconBlog,
  IconSliders,
  IconPlay,
  IconEye,
  IconClose,
  IconGrid,
  IconList,
  IconDownload,
  IconAlert
} from '../../components/admin/AdminIcons';

interface AdminMediaProps {
  theme?: 'light' | 'dark';
}

export interface MediaItem {
  id: string;
  name: string;
  rawName?: string;
  path?: string;
  storageBucket?: string;
  bucket: 'videos' | 'services' | 'blog' | 'sliders' | 'media';
  url: string;
  size: string;
  bytes?: number;
  type: string;
  updated_at?: string;
  isCloudStorage?: boolean;
}

const BUCKETS = [
  { id: 'videos', name: 'Videos & Motion', path: '/videos/', icon: IconVideo },
  { id: 'services', name: 'Services & Solutions', path: '/services/', icon: IconServices },
  { id: 'sliders', name: 'Homepage Sliders', path: '/sliders/', icon: IconSliders },
  { id: 'blog', name: 'Blog & Articles', path: '/blog/', icon: IconBlog },
  { id: 'media', name: 'General Media', path: '/media/', icon: IconMedia }
] as const;

// Curated built-in system assets bundled locally in repository
const INITIAL_SYSTEM_MEDIA: MediaItem[] = [
  { id: 'sys-v1', name: 'FRANKSTAR LOOP.mp4', path: '/assets/FRANKSTAR LOOP.mp4', bucket: 'videos', url: '/assets/FRANKSTAR LOOP.mp4', size: '18.4 MB', type: 'video/mp4' },
  { id: 'sys-v2', name: 'OFFSHORE INTELLIGENCE.mp4', path: '/assets/OFFSHORE INTELLIGENCE.mp4', bucket: 'videos', url: '/assets/OFFSHORE INTELLIGENCE.mp4', size: '24.1 MB', type: 'video/mp4' },
  { id: 'sys-v3', name: 'DIGITAL INTELLINGENCE.mp4', path: '/assets/DIGITAL INTELLINGENCE.mp4', bucket: 'videos', url: '/assets/DIGITAL INTELLINGENCE.mp4', size: '15.8 MB', type: 'video/mp4' },
  { id: 'sys-v4', name: 'ground_intelligence.mp4', path: '/assets/videos/ground_intelligence.mp4', bucket: 'videos', url: '/assets/videos/ground_intelligence.mp4', size: '12.2 MB', type: 'video/mp4' },
  { id: 'sys-m1', name: 'digital_intel_scanner.jpg', path: '/assets/digital_intel_scanner.jpg', bucket: 'services', url: '/assets/digital_intel_scanner.jpg', size: '2.4 MB', type: 'image/jpeg' },
  { id: 'sys-m2', name: 'marine_intel_metocean.jpg', path: '/assets/marine_intel_metocean.jpg', bucket: 'services', url: '/assets/marine_intel_metocean.jpg', size: '1.8 MB', type: 'image/jpeg' },
  { id: 'sys-m3', name: 'cpt.png', path: '/assets/cpt.png', bucket: 'services', url: '/assets/cpt.png', size: '3.1 MB', type: 'image/png' },
  { id: 'sys-m4', name: 'geomatics_survey.png', path: '/assets/geomatics_survey.png', bucket: 'services', url: '/assets/geomatics_survey.png', size: '2.9 MB', type: 'image/png' },
  { id: 'sys-m5', name: 'IMG_6170.jpg', path: '/assets/IMG_6170.jpg', bucket: 'blog', url: '/assets/IMG_6170.jpg', size: '1.5 MB', type: 'image/jpeg' },
  { id: 'sys-m6', name: 'DJI_0003.jpg', path: '/assets/DJI_0003.jpg', bucket: 'sliders', url: '/assets/DJI_0003.jpg', size: '4.2 MB', type: 'image/jpeg' },
  { id: 'sys-m7', name: 'newpipeline.png', path: '/assets/newpipeline.png', bucket: 'services', url: '/assets/newpipeline.png', size: '2.2 MB', type: 'image/png' },
  { id: 'sys-m8', name: 'rig_positioning.png', path: '/assets/rig_positioning.png', bucket: 'services', url: '/assets/rig_positioning.png', size: '1.9 MB', type: 'image/png' },
  { id: 'sys-m9', name: 'drilling.png', path: '/assets/drilling.png', bucket: 'services', url: '/assets/drilling.png', size: '2.7 MB', type: 'image/png' },
  { id: 'sys-m10', name: 'procure.jpg', path: '/assets/procure.jpg', bucket: 'services', url: '/assets/procure.jpg', size: '1.4 MB', type: 'image/jpeg' }
];

const LOCAL_STORAGE_KEY_CUSTOM_MEDIA = 'pigl_custom_media_v1';

const AdminMedia: React.FC<AdminMediaProps> = ({ theme = 'light' }) => {
  const [activeBucket, setActiveBucket] = useState<'videos' | 'services' | 'sliders' | 'blog' | 'media'>('videos');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'video' | 'image'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploaderKey, setUploaderKey] = useState(0);

  // Modals
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<MediaItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const isDark = theme === 'dark';

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch real media from Supabase storage API and merge with local/system assets
  const fetchMediaAssets = async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    let cloudFiles: MediaItem[] = [];
    try {
      const resp = await fetch('/api/media?bucket=all');
      if (resp.ok) {
        const json = await resp.json();
        if (json.success && Array.isArray(json.files)) {
          cloudFiles = json.files;
        }
      }
    } catch (e) {
      console.warn('Could not fetch cloud media files from /api/media:', e);
    }

    // Load custom uploaded local storage items (for offline or instantaneous preview)
    let localItems: MediaItem[] = [];
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CUSTOM_MEDIA);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          localItems = parsed;
        }
      }
    } catch (e) {}

    // Deduplicate items: Cloud files take precedence by URL or path, then local, then system assets
    const seenUrls = new Set<string>();
    const seenPaths = new Set<string>();
    const merged: MediaItem[] = [];

    // 1. Add cloud files from Supabase
    for (const item of cloudFiles) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        if (item.path) seenPaths.add(item.path);
        merged.push(item);
      }
    }

    // 2. Add local storage items
    for (const item of localItems) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        merged.push(item);
      }
    }

    // 3. Add system baseline assets
    for (const item of INITIAL_SYSTEM_MEDIA) {
      if (!seenUrls.has(item.url) && !seenPaths.has(item.path || '')) {
        seenUrls.add(item.url);
        merged.push(item);
      }
    }

    setMediaList(merged);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMediaAssets();
  }, []);

  // Filtered Media calculation
  const bucketCounts = useMemo(() => {
    const counts: Record<string, number> = {
      videos: 0,
      services: 0,
      sliders: 0,
      blog: 0,
      media: 0
    };
    for (const item of mediaList) {
      if (counts[item.bucket] !== undefined) {
        counts[item.bucket]++;
      }
    }
    return counts;
  }, [mediaList]);

  const filteredMedia = useMemo(() => {
    return mediaList.filter(item => {
      // Bucket filter
      if (item.bucket !== activeBucket) return false;

      // Type filter
      const isVideo = Boolean(
        item.type?.startsWith('video/') ||
        item.bucket === 'videos' ||
        /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.url)
      );

      if (typeFilter === 'video' && !isVideo) return false;
      if (typeFilter === 'image' && isVideo) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchRaw = item.rawName ? item.rawName.toLowerCase().includes(q) : false;
        const matchUrl = item.url.toLowerCase().includes(q);
        if (!matchName && !matchRaw && !matchUrl) return false;
      }

      return true;
    });
  }, [mediaList, activeBucket, typeFilter, searchQuery]);

  // Handle Upload Completion
  const handleUploadSuccess = (url: string) => {
    const isVid = url.startsWith('data:video') || /\.(mp4|webm|ogg|mov)($|\?)/i.test(url) || activeBucket === 'videos';
    const cleanUrlParts = url.split('/');
    const rawFileName = cleanUrlParts[cleanUrlParts.length - 1].split('?')[0];
    const cleanName = rawFileName.replace(/^\d{10,14}_/, '') || (isVid ? `video_asset_${Date.now()}.mp4` : `media_${Date.now()}.png`);

    const newItem: MediaItem = {
      id: `m-${Date.now()}`,
      rawName: rawFileName,
      name: cleanName,
      path: activeBucket === 'videos' ? `videos/${rawFileName}` : rawFileName,
      storageBucket: activeBucket === 'videos' ? 'media' : activeBucket,
      url,
      bucket: activeBucket,
      size: isVid ? 'Video Asset' : 'Optimized Image',
      type: isVid ? 'video/mp4' : 'image/jpeg',
      updated_at: new Date().toISOString(),
      isCloudStorage: url.includes('supabase.co')
    };

    const updated = [newItem, ...mediaList];
    setMediaList(updated);

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MEDIA, JSON.stringify(updated));
    } catch {}

    // Reset uploader key to clear the upload box preview
    setUploaderKey(prev => prev + 1);
    showToast(`Asset "${cleanName}" uploaded successfully to /${activeBucket}/!`);

    // Silently re-sync with Supabase Storage
    setTimeout(() => {
      fetchMediaAssets(true);
    }, 1200);
  };

  // Copy to clipboard
  const copyToClipboard = (id: string, url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Direct asset URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Delete media asset handler
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      // 1. If uploaded to Supabase Storage, remove it remotely via API
      if (itemToDelete.isCloudStorage && itemToDelete.path) {
        await fetch('/api/media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'delete',
            storageBucket: itemToDelete.storageBucket || (itemToDelete.bucket === 'videos' ? 'media' : itemToDelete.bucket),
            path: itemToDelete.path
          })
        });
      }

      // 2. Remove from active list
      const updated = mediaList.filter(m => m.id !== itemToDelete.id && m.url !== itemToDelete.url);
      setMediaList(updated);

      // 3. Update localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY_CUSTOM_MEDIA, JSON.stringify(updated));
      } catch {}

      showToast(`Asset "${itemToDelete.name}" permanently deleted.`);
      setItemToDelete(null);
      if (previewItem?.id === itemToDelete.id) {
        setPreviewItem(null);
      }
    } catch (err: any) {
      showToast(`Failed to delete asset: ${err.message}`, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center space-x-2 animate-fadeIn ${
          toast.type === 'success'
            ? 'bg-emerald-600 text-white border-emerald-500'
            : toast.type === 'error'
              ? 'bg-rose-600 text-white border-rose-500'
              : 'bg-slate-900 text-white border-slate-700'
        }`}>
          {toast.type === 'success' && <IconCheck className="w-4 h-4" />}
          {toast.type === 'error' && <IconAlert className="w-4 h-4" />}
          {toast.type === 'info' && <IconCheck className="w-4 h-4" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Quick Actions */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight flex items-center space-x-2.5 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <IconMedia className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>Media Library & Asset Manager</span>
            </h1>
            <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Manage, preview, copy URLs, and upload website video loops, imagery, and documents.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => fetchMediaAssets(true)}
              disabled={refreshing}
              title="Refresh and sync files from cloud storage"
              className={`px-3 py-2 text-xs font-bold rounded-xl border transition-all flex items-center space-x-1.5 ${
                isDark
                  ? 'border-slate-800 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{refreshing ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={() => setIsUploadOpen(!isUploadOpen)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center space-x-1.5 ${
                isUploadOpen
                  ? isDark
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <IconUpload className="w-3.5 h-3.5" />
              <span>{isUploadOpen ? 'Close Uploader' : 'Upload New Asset'}</span>
            </button>
          </div>
        </div>

        {/* Collapsible / Streamlined Upload Drawer */}
        {isUploadOpen && (
          <div className={`mt-5 pt-5 border-t animate-fadeIn ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Target Destination: <span className="font-mono text-emerald-600 dark:text-emerald-400">/{activeBucket}/</span>
                </span>
              </div>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {activeBucket === 'videos' ? 'Supports MP4, WebM, QuickTime (up to 50MB)' : 'Supports WebP, PNG, JPG, PDF (up to 15MB)'}
              </span>
            </div>
            <ImageUploader
              key={uploaderKey}
              bucket={activeBucket}
              onUploadComplete={handleUploadSuccess}
              label={activeBucket === 'videos' ? 'Upload Video Loop or Clip' : 'Upload Image or Document Asset'}
              helperText={activeBucket === 'videos' ? 'Faststart MP4 or WebM videos will be stream-ready immediately' : 'Images are automatically optimized for web delivery'}
              accept={activeBucket === 'videos' ? 'video/mp4,video/webm,video/ogg,video/quicktime' : 'image/*,video/*,.pdf'}
              theme={theme}
            />
          </div>
        )}
      </div>

      {/* Sleek, Compact Horizontal Category Filter Tabs */}
      <div className={`p-2 rounded-2xl border transition-all ${
        isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-xs'
      }`}>
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {BUCKETS.map((b) => {
            const Icon = b.icon;
            const isCurrent = activeBucket === b.id;
            const count = bucketCounts[b.id] || 0;

            return (
              <button
                key={b.id}
                onClick={() => setActiveBucket(b.id)}
                className={`flex-shrink-0 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDark
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-slate-400'}`} />
                <span className="whitespace-nowrap">{b.name}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isCurrent
                    ? 'bg-emerald-700/80 text-white'
                    : isDark
                      ? 'bg-slate-800 text-slate-400'
                      : 'bg-slate-200 text-slate-600'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter Toolbar: Search, Type Filter, View Toggle */}
        <div className={`mt-3 pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
          isDark ? 'border-slate-800' : 'border-slate-100'
        }`}>
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <IconSearch className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${BUCKETS.find(b => b.id === activeBucket)?.name || 'media'}...`}
              className={`w-full pl-9 pr-8 py-1.5 text-xs rounded-xl border transition-colors outline-none ${
                isDark
                  ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-600'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <IconClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Type Filter */}
            <div className={`p-0.5 rounded-lg border flex items-center text-[11px] font-bold ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  typeFilter === 'all'
                    ? isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('video')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  typeFilter === 'video'
                    ? isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Videos
              </button>
              <button
                onClick={() => setTypeFilter('image')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  typeFilter === 'image'
                    ? isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-900 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Images
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className={`p-0.5 rounded-lg border flex items-center ${
              isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
            }`}>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <IconGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                title="List View"
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'list'
                    ? isDark ? 'bg-slate-800 text-emerald-400' : 'bg-white text-emerald-600 shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <IconList className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Media Items Area */}
      {loading ? (
        <div className={`p-16 border rounded-2xl text-center space-y-3 ${
          isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Synchronizing media library with cloud storage...
          </p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className={`p-16 border rounded-2xl text-center space-y-4 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-slate-800/50 flex items-center justify-center mx-auto text-slate-400">
            <IconSearch className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">No media assets found</h4>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {searchQuery
                ? `No files in /${activeBucket}/ match your search "${searchQuery}".`
                : `No assets currently stored in /${activeBucket}/.`}
            </p>
          </div>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm inline-flex items-center space-x-1.5"
          >
            <IconUpload className="w-3.5 h-3.5" />
            <span>Upload First Asset</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => {
            const isVideoItem = Boolean(
              item.type?.startsWith('video/') ||
              item.bucket === 'videos' ||
              /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.url)
            );

            return (
              <div
                key={item.id}
                className={`border rounded-2xl overflow-hidden shadow-xs flex flex-col group transition-all relative ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:shadow-lg'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {/* Visual Thumbnail */}
                <div
                  onClick={() => setPreviewItem(item)}
                  className="h-44 bg-slate-950 relative overflow-hidden flex items-center justify-center cursor-pointer select-none"
                >
                  {isVideoItem ? (
                    <div className="w-full h-full relative flex items-center justify-center bg-black">
                      <video
                        src={item.url}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <IconPlay className="w-4 h-4 ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-600/90 text-white flex items-center space-x-1 shadow-sm">
                        <IconVideo className="w-3 h-3" />
                        <span>VIDEO</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative flex items-center justify-center bg-slate-900">
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-slate-200 border border-slate-700">
                        <span>IMAGE</span>
                      </div>
                    </div>
                  )}

                  {/* Cloud indicator badge */}
                  {item.isCloudStorage && (
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-800/80 shadow-xs">
                      Cloud Storage
                    </div>
                  )}
                </div>

                {/* Content & Metadata */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4
                      onClick={() => setPreviewItem(item)}
                      className={`font-bold text-xs sm:text-sm truncate cursor-pointer hover:text-emerald-500 transition-colors ${
                        isDark ? 'text-slate-100' : 'text-slate-900'
                      }`}
                      title={item.name}
                    >
                      {item.name}
                    </h4>
                    <div className={`flex items-center justify-between text-[11px] font-mono mt-1 ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      <span>{item.size}</span>
                      <span className="uppercase font-semibold text-[10px] bg-slate-800/50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
                        /{item.bucket}/
                      </span>
                    </div>
                  </div>

                  {/* Management Actions Toolbar */}
                  <div className={`pt-3 border-t flex items-center justify-between gap-1.5 ${
                    isDark ? 'border-slate-800' : 'border-slate-100'
                  }`}>
                    {/* Preview Button */}
                    <button
                      onClick={() => setPreviewItem(item)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center space-x-1 ${
                        isDark
                          ? 'border-slate-800 bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Preview / Play Asset"
                    >
                      <IconEye className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{isVideoItem ? 'Play' : 'View'}</span>
                    </button>

                    {/* Copy Link Button */}
                    <button
                      onClick={(e) => copyToClipboard(item.id, item.url, e)}
                      className={`flex-1 py-1.5 px-2 text-xs font-bold rounded-lg border transition-all flex items-center justify-center space-x-1 ${
                        copiedId === item.id
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : isDark
                            ? 'border-slate-800 bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                      title="Copy Direct URL"
                    >
                      {copiedId === item.id ? (
                        <>
                          <IconCheck className="w-3.5 h-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <IconCopy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    {/* Delete Action */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setItemToDelete(item);
                      }}
                      className="p-1.5 rounded-lg border border-rose-800/40 bg-rose-950/30 text-rose-400 hover:bg-rose-900/60 hover:text-rose-200 transition-colors"
                      title="Delete Asset from Storage"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST / TABLE VIEW */
        <div className={`border rounded-2xl overflow-hidden shadow-xs ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`border-b font-bold uppercase tracking-wider ${
                isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
              }`}>
                <tr>
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Bucket</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                {filteredMedia.map((item) => {
                  const isVideoItem = Boolean(
                    item.type?.startsWith('video/') ||
                    item.bucket === 'videos' ||
                    /\.(mp4|webm|ogg|mov)($|\?)/i.test(item.url)
                  );

                  return (
                    <tr key={item.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/80'}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div
                            onClick={() => setPreviewItem(item)}
                            className="w-12 h-10 rounded-lg overflow-hidden bg-slate-950 flex-shrink-0 cursor-pointer relative"
                          >
                            {isVideoItem ? (
                              <div className="w-full h-full flex items-center justify-center bg-black">
                                <IconPlay className="w-4 h-4 text-emerald-400" />
                              </div>
                            ) : (
                              <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="truncate max-w-xs sm:max-w-md">
                            <p
                              onClick={() => setPreviewItem(item)}
                              className="font-bold hover:text-emerald-500 cursor-pointer truncate"
                              title={item.name}
                            >
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate font-mono">{item.url}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold">/{item.bucket}/</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          isVideoItem ? 'bg-red-950 text-red-300 border border-red-800/80' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {isVideoItem ? 'VIDEO' : 'IMAGE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{item.size}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => setPreviewItem(item)}
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                            title="Preview / Play"
                          >
                            <IconEye className="w-3.5 h-3.5 text-emerald-500" />
                          </button>
                          <button
                            onClick={(e) => copyToClipboard(item.id, item.url, e)}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center space-x-1 ${
                              copiedId === item.id
                                ? 'bg-emerald-600 text-white border-emerald-500'
                                : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            {copiedId === item.id ? <IconCheck className="w-3 h-3" /> : <IconCopy className="w-3 h-3" />}
                            <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                          </button>
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
                            title="Open Link in New Tab"
                          >
                            <IconGlobe className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1.5 rounded-lg border border-rose-800/60 bg-rose-950/40 text-rose-400 hover:bg-rose-900/80 hover:text-white"
                            title="Delete Asset"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FULL PREVIEW MODAL */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border flex flex-col ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`p-4 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className="flex items-center space-x-2.5 truncate max-w-xl">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  previewItem.type?.startsWith('video/') || previewItem.bucket === 'videos'
                    ? 'bg-red-600 text-white'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {previewItem.type?.startsWith('video/') || previewItem.bucket === 'videos' ? 'VIDEO' : 'IMAGE'}
                </span>
                <h3 className="font-bold text-sm truncate">{previewItem.name}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                aria-label="Close Preview"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Viewer */}
            <div className="p-6 bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
              {previewItem.type?.startsWith('video/') || previewItem.bucket === 'videos' ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[60vh] max-w-full rounded-lg shadow-xl"
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[60vh] max-w-full object-contain rounded-lg shadow-xl"
                />
              )}
            </div>

            {/* Modal Footer / Metadata & Actions */}
            <div className={`p-5 border-t space-y-4 ${
              isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
            }`}>
              {/* Direct Link Input Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Direct Asset CDN URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={previewItem.url}
                    className={`flex-1 px-3 py-2 text-xs font-mono rounded-xl border outline-none ${
                      isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-800'
                    }`}
                  />
                  <button
                    onClick={() => copyToClipboard(previewItem.id, previewItem.url)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors flex items-center space-x-1.5 flex-shrink-0"
                  >
                    {copiedId === previewItem.id ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Details & Destructive Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                  <span>Size: <strong className="text-white">{previewItem.size}</strong></span>
                  <span>Bucket: <strong className="text-white">/{previewItem.bucket}/</strong></span>
                  {previewItem.path && <span className="truncate max-w-xs">Path: {previewItem.path}</span>}
                </div>

                <div className="flex items-center space-x-2.5">
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <IconGlobe className="w-3.5 h-3.5" />
                    <span>Open in Tab</span>
                  </a>

                  <button
                    onClick={() => {
                      setItemToDelete(previewItem);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-rose-800/80 bg-rose-950/60 text-rose-300 hover:bg-rose-900 text-xs font-bold transition-colors flex items-center space-x-1"
                  >
                    <IconTrash className="w-3.5 h-3.5" />
                    <span>Delete File</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl border space-y-5 ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center space-x-3 text-rose-500">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center">
                <IconTrash className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h3 className="font-bold text-base">Delete Media Asset</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Permanently remove from storage
                </p>
              </div>
            </div>

            <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <p className="font-bold text-sm truncate">{itemToDelete.name}</p>
              <p className="font-mono text-slate-400">Bucket: /{itemToDelete.bucket}/ • Size: {itemToDelete.size}</p>
              <p className="text-amber-500 text-[11px] font-medium pt-1">
                ⚠️ Warning: Once deleted, any webpage or hero banner linking directly to this URL will fail to load it.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white shadow-md transition-colors flex items-center space-x-1.5 disabled:opacity-50"
              >
                <IconTrash className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMedia;
