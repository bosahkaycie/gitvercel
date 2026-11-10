import React, { useState } from 'react';
import { CMSBlogPost } from '../../types';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUploader from '../../components/admin/ImageUploader';
import { parseGalleryFromContent } from '../../hooks/useSupabaseData';
import {
  IconSearch,
  IconCheck,
  IconClose,
  IconGlobe,
  IconEye,
  IconActivity,
  IconPlus,
  IconTrash,
  IconMedia,
  IconSparkles
} from '../../components/admin/AdminIcons';

const PIGL_MEDIA_LIBRARY_PRESETS = [
  {
    url: '/assets/pigl_3d_laser_scan_facility_cooler-CUnmm91U.jpg',
    title: '3D Laser Scanning Facility Cooler',
    tag: '3D Reality Capture'
  },
  {
    url: '/assets/pigl_3d_laser_scan_manifold_station-DtyXXbQ0.jpg',
    title: 'Offshore Flowstation Manifold 3D Scan',
    tag: 'Digital Twin'
  },
  {
    url: '/assets/pigl_3d_reality_capture_jetty_plant-CifHN2xH.jpg',
    title: 'Jetty Plant Reality Capture',
    tag: 'Reality Capture'
  },
  {
    url: '/assets/pigl_marine_crew_vessel-BeKXaUgs.jpg',
    title: 'PIGL Hydrographic & Crew Support Vessel',
    tag: 'Marine & Metocean'
  },
  {
    url: '/assets/pigl_offshore_geotech_drilling_barge-zSVP95dC.jpg',
    title: 'Geotechnical Pontoon Drilling Rig',
    tag: 'Geosolutions'
  },
  {
    url: '/assets/pigl_offshore_drill_crew_casing-B8l5kXVY.jpg',
    title: 'Offshore Drill Crew Running Casing',
    tag: 'Geotechnical'
  },
  {
    url: '/assets/pigl_pipeline_construction_swamp_cat-B8_iivUg.jpg',
    title: 'Swamp Pipeline Excavation Operations',
    tag: 'Construction'
  },
  {
    url: '/assets/pigl_pipeline_marine_welding-KuU54HxW.jpg',
    title: 'Marine Pipeline Orbital Welding',
    tag: 'Pipeline'
  },
  {
    url: '/assets/pigl_subbottom_profiler_sb216s-B0zcGJyx.jpg',
    title: 'Sub-Bottom Profiler Geophysical Rig',
    tag: 'Geophysics'
  },
  {
    url: '/assets/cpt.png',
    title: '20-Ton Heavy Duty CPT Rig',
    tag: 'CPT Testing'
  },
  {
    url: '/assets/digitwin.png',
    title: 'Digital Twin Dense 3D Point Cloud Mesh',
    tag: 'Digital Twin'
  },
  {
    url: '/assets/IMG_6170.jpg',
    title: 'Field Engineering Inspection Operations',
    tag: 'Field Operations'
  }
];

interface AdminBlogEditorProps {
  initialData?: CMSBlogPost | null;
  onSave: (post: Partial<CMSBlogPost> & { title: string; content: string }) => Promise<any>;
  onCancel: () => void;
  theme?: 'light' | 'dark';
}

const BLOG_CATEGORIES = [
  'Technical Updates',
  'Project Milestones',
  'Industry Insights',
  'HSSEQ & Safety',
  'Company News'
];

const AdminBlogEditor: React.FC<AdminBlogEditorProps> = ({
  initialData,
  onSave,
  onCancel,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [category, setCategory] = useState(initialData?.category || BLOG_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');

  // WordPress-Grade Multi-Image Gallery & Featured Cover State
  const [galleryImages, setGalleryImages] = useState<string[]>(() => {
    let list: string[] = [];
    if (Array.isArray(initialData?.gallery_images) && initialData.gallery_images.length > 0) {
      list = [...initialData.gallery_images];
    } else if (initialData?.content) {
      list = parseGalleryFromContent(initialData.content);
    }
    if (initialData?.featured_image && !list.includes(initialData.featured_image)) {
      list = [initialData.featured_image, ...list];
    }
    if (list.length === 0 && initialData?.featured_image) {
      list = [initialData.featured_image];
    }
    return list.filter(Boolean);
  });
  const [featuredImage, setFeaturedImage] = useState<string>(() => {
    return initialData?.featured_image || (initialData?.gallery_images?.[0] ?? '/assets/IMG_6170.jpg');
  });
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [insertSuccessMsg, setInsertSuccessMsg] = useState<string | null>(null);

  const [author, setAuthor] = useState(initialData?.author || 'Dr. Chigozie Dimgba');
  const [tagsStr, setTagsStr] = useState((initialData?.tags || ['Engineering', 'PIGL', 'Nigeria']).join(', '));
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(initialData?.status || 'published');
  const [featured, setFeatured] = useState<boolean>(initialData?.featured ?? false);
  const [readTime, setReadTime] = useState(initialData?.read_time || '5 min read');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16)
  );

  // WordPress-Grade SEO Meta Fields
  const [focusKeyword, setFocusKeyword] = useState(initialData?.focus_keyword || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonical_url || '');
  const [serpPreviewMode, setSerpPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!initialData) {
      const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setSlug(autoSlug);
    }
  };

  const handleAddImage = (url: string) => {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    setGalleryImages(prev => {
      if (prev.includes(cleanUrl)) return prev;
      return [...prev, cleanUrl];
    });
    if (!featuredImage || featuredImage === '/assets/IMG_6170.jpg') {
      setFeaturedImage(cleanUrl);
    }
    setCustomImageUrl('');
  };

  const handleSetFeatured = (url: string) => {
    setFeaturedImage(url);
    setGalleryImages(prev => {
      if (!prev.includes(url)) {
        return [url, ...prev];
      }
      return prev;
    });
  };

  const handleRemoveImage = (url: string) => {
    setGalleryImages(prev => {
      const next = prev.filter(item => item !== url);
      if (featuredImage === url) {
        setFeaturedImage(next[0] || '');
      }
      return next;
    });
  };

  const handleInsertIntoContent = (url: string, title?: string) => {
    const markdown = `\n\n![${title || 'Article Figure'}](${url})\n\n`;
    setContent(prev => prev + markdown);
    setInsertSuccessMsg('Image inserted into article body!');
    setTimeout(() => setInsertSuccessMsg(null), 3000);
  };

  // Auto-generate SEO metadata from content
  const handleAutoGenerateSEO = () => {
    const generatedSeoTitle = title ? `${title} | PIGL Nigeria` : '';
    setSeoTitle(generatedSeoTitle);

    let cleanSnippet = excerpt || content.replace(/#|\*|_|\[.*?\]\(.*?\)|<.*?>/g, '').trim();
    if (cleanSnippet.length > 155) {
      cleanSnippet = cleanSnippet.substring(0, 152) + '...';
    }
    setSeoDescription(cleanSnippet);

    if (title && !focusKeyword) {
      const words = title.split(' ').filter(w => w.length > 3).slice(0, 3).join(' ');
      setFocusKeyword(words);
    }
  };

  // Calculate live SEO health indicators
  const effectiveSeoTitle = seoTitle || (title ? `${title} | PIGL Technical Insights` : 'Post Title');
  const effectiveSeoDesc = seoDescription || excerpt || 'Technical insights and updates from Polaris Integrated & GeoSolutions Limited.';
  const effectiveSlug = slug || 'post-url-slug';
  const effectiveKeyword = focusKeyword.trim().toLowerCase();

  const seoTitleLength = effectiveSeoTitle.length;
  const seoDescLength = effectiveSeoDesc.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const keywordInTitle = effectiveKeyword ? effectiveSeoTitle.toLowerCase().includes(effectiveKeyword) : null;
  const keywordInDesc = effectiveKeyword ? effectiveSeoDesc.toLowerCase().includes(effectiveKeyword) : null;
  const keywordInSlug = effectiveKeyword ? effectiveSlug.toLowerCase().includes(effectiveKeyword.replace(/\s+/g, '-')) : null;
  const keywordInContent = effectiveKeyword ? content.toLowerCase().includes(effectiveKeyword) : null;
  const hasH2orH3 = /^##+ /m.test(content);
  const hasImage = Boolean(featuredImage || galleryImages.length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Please provide both an article title and content.');
      return;
    }

    setError(null);
    setSaving(true);

    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

    const payload: Partial<CMSBlogPost> & { title: string; content: string } = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      featured_image: featuredImage || galleryImages[0] || '/assets/IMG_6170.jpg',
      gallery_images: galleryImages,
      author,
      category,
      tags,
      status,
      featured,
      read_time: readTime,
      published_at: new Date(publishedAt).toISOString(),
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      focus_keyword: focusKeyword,
      canonical_url: canonicalUrl || `https://polarisigl.com/blog/${slug || 'post'}`
    };

    try {
      await onSave(payload);
    } catch (err: any) {
      setError(err?.message || 'Failed to save article.');
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans pb-16">
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
            ← Back to Articles List
          </button>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {initialData ? `Edit Article: ${initialData.title}` : 'Write New Technical Article'}
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 border rounded-lg text-xs font-bold uppercase transition-colors ${
              isDark ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & Publish Article'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-xl text-xs font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Core Details */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Article Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. PIGL Deploys Leica RTC360 High-Density 3D Laser Scanning"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-base font-bold focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  URL Slug / Permalink *
                </label>
                <div className="flex items-center">
                  <span className={`px-2.5 py-2.5 border border-r-0 rounded-l-lg text-xs font-mono ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}>
                    /blog/
                  </span>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="pigl-deploys-leica-rtc360"
                    className={`w-full px-3 py-2.5 border rounded-r-lg font-mono text-xs focus:border-emerald-500 outline-none ${
                      isDark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  Article Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none font-medium ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  {BLOG_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Short Excerpt / Lead Paragraph *
              </label>
              <textarea
                rows={3}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A compelling summary shown in blog index cards and social previews..."
                className={`w-full p-3 border rounded-lg text-sm focus:border-emerald-500 outline-none leading-relaxed ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
            </div>
          </div>

          {/* Rich Content Editor */}
          <div className={`border rounded-xl p-6 shadow-sm ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <RichTextEditor
              value={content}
              onChange={setContent}
              label="Article Body (Rich Text / Markdown) *"
              minHeight="420px"
              placeholder="Write your article in markdown or formatted text. Use headers (##), bold (**text**), bullet points (- item), blockquotes (> quote), tables, and embed images..."
              theme={theme}
            />
          </div>

          {/* WordPress / Yoast-Grade SEO Optimization Box */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-6 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between border-b pb-3 ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <IconSearch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Search Engine Optimization (SEO)
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Search engine optimization, Google SERP previews & metadata schema
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAutoGenerateSEO}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1 border ${
                  isDark 
                    ? 'bg-emerald-950/80 text-emerald-300 hover:bg-emerald-800 border-emerald-800/50' 
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
                }`}
              >
                <span>Auto-Generate SEO</span>
              </button>
            </div>

            {/* Focus Keyphrase */}
            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Focus Keyphrase / Target Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. 3D Laser Scanning Nigeria, Marine Metocean Telemetry"
                className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                  isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                }`}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                The primary search term you want this publication to rank for on search engines.
              </p>
            </div>

            {/* Google SERP Snippet Preview */}
            <div className={`border rounded-xl p-5 space-y-3 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  Search Result Snippet Preview
                </span>
                <div className={`flex items-center space-x-1 border rounded-lg p-0.5 text-xs font-semibold ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <button
                    type="button"
                    onClick={() => setSerpPreviewMode('desktop')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      serpPreviewMode === 'desktop' ? 'bg-emerald-700 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Desktop
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpPreviewMode('mobile')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${
                      serpPreviewMode === 'mobile' ? 'bg-emerald-700 text-white' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Mobile
                  </button>
                </div>
              </div>

              {/* SERP Card */}
              <div className={`border rounded-lg p-4 font-sans space-y-1 ${serpPreviewMode === 'mobile' ? 'max-w-sm' : ''} ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <div className={`flex items-center space-x-2 text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">P</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>polarisigl.com</span>
                  <span>›</span>
                  <span className="text-slate-500 truncate">blog › {effectiveSlug}</span>
                </div>
                <h4 className="text-base text-blue-500 dark:text-blue-400 hover:underline cursor-pointer font-medium leading-snug line-clamp-2">
                  {effectiveSeoTitle}
                </h4>
                <p className={`text-xs leading-relaxed line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="text-slate-400 mr-1">{new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} —</span>
                  {effectiveSeoDesc}
                </p>
              </div>
            </div>

            {/* SEO Title & Description with Character Meters */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    SEO Title
                  </label>
                  <span className={`text-xs font-semibold ${
                    seoTitleLength >= 40 && seoTitleLength <= 65 
                      ? 'text-emerald-700 dark:text-emerald-400' 
                      : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {seoTitleLength} / 60 characters
                  </span>
                </div>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={title || 'Custom SEO Title...'}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-sm focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full transition-all ${
                      seoTitleLength >= 40 && seoTitleLength <= 65 ? 'bg-emerald-500' : seoTitleLength > 65 ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (seoTitleLength / 60) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Meta Description
                  </label>
                  <span className={`text-xs font-semibold ${
                    seoDescLength >= 120 && seoDescLength <= 160 
                      ? 'text-emerald-700 dark:text-emerald-400' 
                      : 'text-amber-700 dark:text-amber-400'
                  }`}>
                    {seoDescLength} / 160 characters
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder={excerpt || 'Concise search engine description with focus keywords...'}
                  className={`w-full p-3 border rounded-lg text-xs focus:border-emerald-500 outline-none leading-relaxed ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                  }`}
                />
                <div className={`w-full h-1.5 rounded-full mt-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div
                    className={`h-full transition-all ${
                      seoDescLength >= 120 && seoDescLength <= 160 ? 'bg-emerald-500' : seoDescLength > 160 ? 'bg-rose-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, (seoDescLength / 160) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Canonical URL (Optional)
                </label>
                <input
                  type="text"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`https://polarisigl.com/blog/${slug || 'post-slug'}`}
                  className={`w-full px-3.5 py-2.5 border rounded-lg text-xs font-mono focus:border-emerald-500 outline-none ${
                    isDark ? 'bg-slate-800/80 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <p className={`text-xs mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Default: https://polarisigl.com/blog/{slug || 'your-slug'}
                </p>
              </div>
            </div>

            {/* Real-time SEO Health Analysis */}
            <div className={`border-t pt-4 space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                SEO Analysis & Content Health
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${keywordInTitle ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className={keywordInTitle ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Focus keyword in SEO Title: {keywordInTitle ? 'Detected' : 'Not detected in title'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${keywordInDesc ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className={keywordInDesc ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Focus keyword in Meta Description: {keywordInDesc ? 'Detected' : 'Not detected in description'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${keywordInSlug ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className={keywordInSlug ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Focus keyword in URL Slug: {keywordInSlug ? 'Detected' : 'Not in slug'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${wordCount >= 250 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className={wordCount >= 250 ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Text length: {wordCount} words ({wordCount >= 250 ? 'Good depth' : 'Recommended 250+ words'})
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${hasH2orH3 ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                  <span className={hasH2orH3 ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Headings structure: {hasH2orH3 ? 'Subheadings (H2/H3) present' : 'Add subheadings (## or ###) for structure'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${hasImage ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                  <span className={hasImage ? isDark ? 'text-slate-200 font-medium' : 'text-slate-700 font-medium' : 'text-slate-400'}>
                    Cover Image / OpenGraph visual: {hasImage ? 'Selected' : 'Missing featured cover image'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Sidebar Settings (1 col) */}
        <div className="space-y-6">
          
          {/* Publishing Settings */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Publishing Options
            </h3>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Status
              </label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-sm font-bold ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              >
                <option value="published">Published (Live on Website)</option>
                <option value="draft">Draft (Admin Only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Publish Date & Time
              </label>
              <input
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Dr. Chigozie Dimgba"
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-bold uppercase tracking-wider mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Estimated Reading Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="pt-2">
              <label className={`flex items-center space-x-2 text-xs font-bold cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Featured Hero Article</span>
              </label>
            </div>
          </div>

          {/* WordPress-Style Post Media & Gallery Manager */}
          <div className={`border rounded-xl p-5 shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center space-x-2">
                <IconMedia className="w-4 h-4 text-emerald-500" />
                <h3 className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  Post Media &amp; Gallery
                </h3>
              </div>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isDark ? 'bg-slate-800 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {galleryImages.length} {galleryImages.length === 1 ? 'image' : 'images'}
              </span>
            </div>

            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Attach multiple images like WordPress blogs. Choose one as the <strong>Featured Cover</strong>, insert any into the article body, or showcase them in the post gallery.
            </p>

            {insertSuccessMsg && (
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs rounded-lg flex items-center space-x-1.5 animate-fadeIn">
                <IconCheck className="w-3.5 h-3.5 shrink-0" />
                <span>{insertSuccessMsg}</span>
              </div>
            )}

            {/* Attached Images Grid */}
            {galleryImages.length > 0 ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {galleryImages.map((imgUrl, idx) => {
                    const isCover = featuredImage === imgUrl;
                    return (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className={`group relative rounded-lg overflow-hidden border transition-all ${
                          isCover
                            ? 'ring-2 ring-emerald-500 border-emerald-500 shadow-md'
                            : isDark
                            ? 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
                            : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {/* Thumbnail image */}
                        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={`Gallery image ${idx + 1}`}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/IMG_6170.jpg';
                            }}
                          />
                          {/* Featured Cover Badge */}
                          {isCover && (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                              <span>★ Featured Cover</span>
                            </span>
                          )}

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(imgUrl)}
                            title="Remove from post"
                            className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-950/70 hover:bg-red-600 text-white transition-colors cursor-pointer"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Card Actions */}
                        <div className={`p-2 flex items-center justify-between gap-1 text-[11px] ${
                          isDark ? 'bg-slate-900/90' : 'bg-white'
                        }`}>
                          {!isCover ? (
                            <button
                              type="button"
                              onClick={() => handleSetFeatured(imgUrl)}
                              className="text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center space-x-1 cursor-pointer"
                            >
                              <span>★ Set as Featured</span>
                            </button>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                              Primary Cover
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleInsertIntoContent(imgUrl)}
                            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold cursor-pointer"
                            title="Insert into Markdown content"
                          >
                            Insert in Post →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className={`text-center py-6 border-2 border-dashed rounded-lg ${
                isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
              }`}>
                <IconMedia className="w-8 h-8 mx-auto mb-1.5 opacity-50" />
                <p className="text-xs font-semibold">No media attached yet</p>
                <p className="text-[11px]">Upload an image below or select from corporate presets</p>
              </div>
            )}

            {/* Add Image Options */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {/* Image Uploader */}
              <ImageUploader
                label="Upload New Photo"
                onUploadComplete={(url) => handleAddImage(url)}
                bucket="blog"
                helperText="Upload any high-res JPG, PNG or WEBP"
                theme={theme}
              />

              {/* Paste URL or Select from PIGL Library */}
              <div className="flex flex-col gap-2 pt-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    placeholder="Or paste external/asset URL..."
                    className={`flex-1 p-2 border rounded-lg text-xs ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleAddImage(customImageUrl)}
                    disabled={!customImageUrl.trim()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMediaPicker(!showMediaPicker)}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 cursor-pointer ${
                    showMediaPicker
                      ? 'bg-slate-800 text-white border-slate-700'
                      : isDark
                      ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <IconSparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{showMediaPicker ? 'Hide PIGL Media Library' : 'Choose from PIGL Media Library'}</span>
                </button>
              </div>

              {/* PIGL Media Library Quick Picker */}
              {showMediaPicker && (
                <div className={`p-3 rounded-lg border space-y-2 max-h-64 overflow-y-auto ${
                  isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    PIGL Corporate Assets (Click to attach):
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {PIGL_MEDIA_LIBRARY_PRESETS.map((preset) => {
                      const isAttached = galleryImages.includes(preset.url);
                      return (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => handleAddImage(preset.url)}
                          className={`relative text-left rounded overflow-hidden border transition-all p-1 flex items-center space-x-2 group cursor-pointer ${
                            isAttached
                              ? 'border-emerald-500 bg-emerald-500/10'
                              : isDark
                              ? 'border-slate-800 bg-slate-900 hover:border-slate-700'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={preset.url}
                            alt={preset.title}
                            className="w-10 h-10 rounded object-cover shrink-0"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/assets/IMG_6170.jpg';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-bold truncate text-slate-900 dark:text-white">
                              {preset.title}
                            </p>
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold block">
                              {isAttached ? '✓ Attached' : preset.tag}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className={`border rounded-xl p-6 shadow-sm space-y-3 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h3 className={`text-sm font-bold uppercase tracking-wider border-b pb-2 ${
              isDark ? 'text-white border-slate-800' : 'text-slate-900 border-slate-100'
            }`}>
              Tags & Taxonomy
            </h3>

            <div>
              <label className={`block text-xs font-bold mb-1 ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Tags (Comma separated)
              </label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="3D Scanning, Marine, ISO 9001"
                className={`w-full p-2.5 border rounded-lg text-xs ${
                  isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

        </div>

      </div>
    </form>
  );
};

export default AdminBlogEditor;
