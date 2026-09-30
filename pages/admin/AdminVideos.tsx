import React, { useState } from 'react';
import { CMSVideoItem } from '../../types';
import {
  IconVideo,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconCheck,
  IconClose,
  IconEye,
  IconExternal
} from '../../components/admin/AdminIcons';

interface AdminVideosProps {
  videos: CMSVideoItem[];
  loading: boolean;
  onSave: (video: Partial<CMSVideoItem> & { title: string; youtubeId: string }) => Promise<any>;
  onDelete: (id: string) => Promise<boolean>;
  theme?: 'light' | 'dark';
}

const CATEGORY_OPTIONS = [
  { value: 'documentary', label: 'Corporate Documentary' },
  { value: 'ground', label: 'Ground Intelligence' },
  { value: 'digital', label: 'Digital Intelligence' },
  { value: 'pipeline', label: 'Pipeline Engineering' },
  { value: 'marine', label: 'Offshore & Marine' },
  { value: 'hsse', label: 'HSSE & Quality Policy' }
];

export const extractYouTubeId = (urlOrId: string): string => {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  // Patterns like youtu.be/ID or youtube.com/watch?v=ID or youtube.com/embed/ID
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : trimmed;
};

const AdminVideos: React.FC<AdminVideosProps> = ({
  videos,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingVideo, setEditingVideo] = useState<CMSVideoItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<CMSVideoItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formYoutubeInput, setFormYoutubeInput] = useState('');
  const [formCategory, setFormCategory] = useState('documentary');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Corporate Documentary');
  const [formDuration, setFormDuration] = useState('05:00');
  const [formPublishDate, setFormPublishDate] = useState('2026');
  const [formDescription, setFormDescription] = useState('');
  const [formHighlights, setFormHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [formThumbnail, setFormThumbnail] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formFeatured, setFormFeatured] = useState<boolean>(false);

  const openAddModal = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormYoutubeInput('');
    setFormCategory('documentary');
    setFormCategoryLabel('Corporate Documentary');
    setFormDuration('05:00');
    setFormPublishDate(String(new Date().getFullYear()));
    setFormDescription('');
    setFormHighlights([]);
    setHighlightInput('');
    setFormThumbnail('');
    setFormDisplayOrder(videos.length + 1);
    setFormStatus('published');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const openEditModal = (v: CMSVideoItem) => {
    setEditingVideo(v);
    setFormTitle(v.title);
    setFormYoutubeInput(v.youtubeId);
    setFormCategory(v.category);
    setFormCategoryLabel(v.categoryLabel);
    setFormDuration(v.duration);
    setFormPublishDate(v.publishDate);
    setFormDescription(v.description);
    setFormHighlights(v.highlights || []);
    setHighlightInput('');
    setFormThumbnail(v.thumbnail);
    setFormDisplayOrder(v.display_order ?? 1);
    setFormStatus(v.status || 'published');
    setFormFeatured(!!v.featured);
    setIsModalOpen(true);
  };

  const handleCategoryChange = (cat: string) => {
    setFormCategory(cat);
    const found = CATEGORY_OPTIONS.find(c => c.value === cat);
    if (found) {
      setFormCategoryLabel(found.label);
    }
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setFormHighlights([...formHighlights, highlightInput.trim()]);
    setHighlightInput('');
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormHighlights(formHighlights.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(formYoutubeInput);
    if (!ytId) {
      alert('Please enter a valid YouTube Video ID or URL.');
      return;
    }
    if (!formTitle.trim()) {
      alert('Please provide a video title.');
      return;
    }

    setSaving(true);
    try {
      const computedThumbnail = formThumbnail.trim() || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;

      await onSave({
        id: editingVideo ? editingVideo.id : undefined,
        title: formTitle.trim(),
        youtubeId: ytId,
        category: formCategory,
        categoryLabel: formCategoryLabel,
        duration: formDuration.trim() || '05:00',
        publishDate: formPublishDate.trim() || '2026',
        description: formDescription.trim(),
        highlights: formHighlights,
        thumbnail: computedThumbnail,
        display_order: Number(formDisplayOrder) || 1,
        status: formStatus,
        featured: formFeatured
      });

      setNotice(editingVideo ? 'Video showcase updated successfully!' : 'New video showcase published!');
      setTimeout(() => setNotice(null), 3500);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(`Error saving video: ${err.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (v: CMSVideoItem) => {
    if (window.confirm(`Are you sure you want to delete the video: "${v.title}"?`)) {
      await onDelete(v.id);
      setNotice('Video deleted successfully.');
      setTimeout(() => setNotice(null), 3000);
    }
  };

  // Filtered List
  const filtered = videos.filter(v => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between pb-6 border-b gap-4 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
              <IconVideo className="w-5 h-5" />
            </div>
            <div>
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Video Showcase & Corporate Reels
              </h1>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Manage YouTube operational documentaries, in-situ CPT tests, 3D laser reality capture, and offshore field footage.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add New Video</span>
        </button>
      </div>

      {notice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-400 hover:text-white">
            <IconClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="relative flex-1">
          <IconSearch className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos by title, description or category..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-600' 
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              selectedCategory === 'all'
                ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Categories ({videos.length})
          </button>
          {CATEGORY_OPTIONS.map(c => {
            const count = videos.filter(v => v.category === c.value).length;
            return (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                  selectedCategory === c.value
                    ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {c.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Videos Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Loading video showcase catalog...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <IconVideo className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>No Videos Found</h3>
          <p className={`text-xs mt-1 max-w-sm mx-auto ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {searchQuery ? 'No videos matched your filter criteria.' : 'Click "Add New Video" to showcase your first operational field reel or documentary.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(v => (
            <div
              key={v.id}
              className={`rounded-2xl border overflow-hidden transition-all flex flex-col group ${
                isDark ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-black overflow-hidden group">
                <img
                  src={v.thumbnail || `https://img.youtube.com/vi/${v.youtubeId}/maxresdefault.jpg`}
                  alt={v.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    // Fallback to hqdefault if maxresdefault fails
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`;
                  }}
                />
                
                {/* Play Button Overlay */}
                <button
                  onClick={() => setPreviewVideo(v)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-colors group/btn"
                  title="Watch Video"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg transform transition-transform group-hover/btn:scale-110">
                    <svg className="w-5 h-5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </button>

                {/* Duration Badge */}
                <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded text-[10.5px] font-mono font-bold bg-slate-950/80 text-white backdrop-blur-sm border border-white/10">
                  {v.duration}
                </span>

                {/* Status Badge */}
                <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider ${
                  v.status === 'draft'
                    ? 'bg-amber-500/80 text-slate-950'
                    : 'bg-emerald-500/80 text-slate-950'
                }`}>
                  {v.status || 'published'}
                </span>

                {v.featured && (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9.5px] font-bold uppercase tracking-wider bg-indigo-500 text-white shadow-sm">
                    Featured
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                    <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      {v.categoryLabel}
                    </span>
                    <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>
                      {v.publishDate}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold leading-snug line-clamp-2 mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {v.title}
                  </h3>

                  <p className={`text-xs line-clamp-2 leading-relaxed mb-3 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {v.description}
                  </p>

                  {/* Highlights snippet */}
                  {v.highlights && v.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {v.highlights.slice(0, 2).map((h, i) => (
                        <span
                          key={i}
                          className={`text-[10px] px-2 py-0.5 rounded font-medium truncate max-w-full ${
                            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          • {h}
                        </span>
                      ))}
                      {v.highlights.length > 2 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isDark ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          +{v.highlights.length - 2} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className={`pt-3 border-t flex items-center justify-between ${
                  isDark ? 'border-slate-800/80' : 'border-slate-100'
                }`}>
                  <div className="flex items-center space-x-1">
                    <a
                      href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Open on YouTube"
                    >
                      <IconExternal className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono">YT</span>
                    </a>
                    <button
                      onClick={() => setPreviewVideo(v)}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors ${
                        isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                      title="Preview Player"
                    >
                      <IconEye className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Preview</span>
                    </button>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(v)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:text-emerald-700 hover:bg-slate-100'
                      }`}
                      title="Edit Video"
                    >
                      <IconEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(v)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
                      }`}
                      title="Delete Video"
                    >
                      <IconTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-4 border-b mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                  <IconVideo className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black tracking-tight">
                  {editingVideo ? 'Edit Video Showcase' : 'Add New Video Showcase'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Ground Intelligence: 20-Ton Hydraulic CPT & Swamp Soil Characterisation"
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    YouTube URL or ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formYoutubeInput}
                    onChange={(e) => setFormYoutubeInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=sExrHCIGkH0 or sExrHCIGkH0"
                    className={`w-full px-3.5 py-2.5 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <p className={`text-[10px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Parsed ID: <span className="font-mono text-emerald-500 font-bold">{extractYouTubeId(formYoutubeInput) || 'None'}</span>
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Operational Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Category Pill Label
                  </label>
                  <input
                    type="text"
                    value={formCategoryLabel}
                    onChange={(e) => setFormCategoryLabel(e.target.value)}
                    placeholder="e.g. Ground Intelligence"
                    className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Duration (mm:ss)
                  </label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    placeholder="07:14"
                    className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Publish Year / Date
                  </label>
                  <input
                    type="text"
                    value={formPublishDate}
                    onChange={(e) => setFormPublishDate(e.target.value)}
                    placeholder="2026"
                    className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Synopsis / Executive Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Overview of the engineering scope, equipment deployed, and client value delivered..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Highlights List Builder */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Key Technical Highlights / Bullets
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="e.g. 20-Ton Heavy-Duty Hydraulic Thrust Rigs (Press Enter to add)"
                    className={`flex-1 px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                {formHighlights.length > 0 && (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-xl border border-dashed border-slate-700">
                    {formHighlights.map((h, i) => (
                      <div key={i} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs ${
                        isDark ? 'bg-slate-800/80 text-slate-200' : 'bg-slate-100 text-slate-800'
                      }`}>
                        <span>• {h}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(i)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <IconClose className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Thumbnail */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                  Custom Thumbnail URL (Optional - defaults to YouTube MaxRes thumbnail)
                </label>
                <input
                  type="text"
                  value={formThumbnail}
                  onChange={(e) => setFormThumbnail(e.target.value)}
                  placeholder="https://... or leave empty to auto-use YouTube high-res thumbnail"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Status and Order Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Display Sequence Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formDisplayOrder}
                    onChange={(e) => setFormDisplayOrder(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl border font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5">
                    Publish Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl border ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="published">Published (Live)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold">Featured Main Reel</span>
                  </label>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-5 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                    isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-emerald-900/20"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4" />
                      <span>{editingVideo ? 'Update Video' : 'Publish Video'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className={`relative w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-black border-slate-800'
          }`}>
            <div className="flex items-center justify-between p-4 bg-slate-900 text-white border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {previewVideo.categoryLabel}
                </span>
                <h3 className="text-xs font-bold truncate max-w-md">{previewVideo.title}</h3>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${previewVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={previewVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-4 bg-slate-900/90 text-white text-xs">
              <p className="text-slate-300 leading-relaxed mb-2">{previewVideo.description}</p>
              {previewVideo.highlights && previewVideo.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {previewVideo.highlights.map((h, i) => (
                    <span key={i} className="text-[10.5px] px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVideos;
