import React, { useState, useMemo } from 'react';
import { PageHeaderConfig, HeaderBackgroundSettings } from '../../types';
import { usePageHeaders, useAdminAuth } from '../../hooks/useSupabaseData';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  IconGlobe,
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconClose,
  IconSearch,
  IconEye,
  IconExternal,
  IconUpload,
  IconCheckCircle
} from '../../components/admin/AdminIcons';

interface AdminPageHeadersProps {
  theme?: 'light' | 'dark';
  initialPageId?: string;
}

const PRESET_LIBRARY_IMAGES = [
  { name: 'Marine Crew Vessel', url: '/assets/operations/pigl_marine_crew_vessel.jpg' },
  { name: 'Geomatics Survey Quay', url: '/assets/operations/pigl_geomatics_survey_quay.jpg' },
  { name: 'Logistics Base Aerial', url: '/assets/operations/pigl_logistics_base_aerial.jpg' },
  { name: 'Offshore Geotech Barge', url: '/assets/operations/pigl_offshore_geotech_drilling_barge.jpg' },
  { name: 'Pipeline Welding Operation', url: '/assets/operations/pigl_pipeline_marine_welding.jpg' },
  { name: 'Subsea Reality Capture Jetty', url: '/assets/operations/pigl_3d_reality_capture_jetty_plant.jpg' },
  { name: 'Swamp Pipeline Construction', url: '/assets/operations/pigl_pipeline_construction_swamp_cat.jpg' },
  { name: 'Drill Crew Casing', url: '/assets/operations/pigl_offshore_drill_crew_casing.jpg' },
  { name: 'Field Team Swamp Operations', url: '/assets/pigl_field_team_swamp.jpg' },
  { name: 'Leica 3D Reality Scanner', url: '/assets/digital_intel_scanner.jpg' }
];

export const AdminPageHeaders: React.FC<AdminPageHeadersProps> = ({
  theme = 'light',
  initialPageId = 'about'
}) => {
  const isDark = theme === 'dark';
  const { user } = useAdminAuth();
  const adminEmail = user?.email || 'admin@polarisigl.com';

  const {
    pages,
    topHeader,
    loading,
    savePageBreadcrumb,
    removePageBreadcrumb,
    saveTopHeader,
    removeTopHeader,
    resetAllHeaders,
    reload
  } = usePageHeaders(true);

  const [activeSection, setActiveSection] = useState<'breadcrumbs' | 'top_header'>('breadcrumbs');
  const [selectedPageId, setSelectedPageId] = useState<string>(initialPageId);
  const [searchFilter, setSearchFilter] = useState('');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Breadcrumb Editor Form State
  const [stagedBreadcrumbImage, setStagedBreadcrumbImage] = useState<string>('');
  const [stagedBreadcrumbTitle, setStagedBreadcrumbTitle] = useState<string>('');
  const [stagedOverlayOpacity, setStagedOverlayOpacity] = useState<number>(0.35);
  const [isSavingBreadcrumb, setIsSavingBreadcrumb] = useState(false);

  // Top Header Editor Form State
  const [stagedTopHeaderImage, setStagedTopHeaderImage] = useState<string>('');
  const [stagedTopHeaderOpacity, setStagedTopHeaderOpacity] = useState<number>(0.30);
  const [isSavingTopHeader, setIsSavingTopHeader] = useState(false);

  // Feedback Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const pagesList = useMemo(() => {
    return Object.values(pages || {});
  }, [pages]);

  const filteredPages = useMemo(() => {
    if (!searchFilter.trim()) return pagesList;
    const q = searchFilter.toLowerCase();
    return pagesList.filter(
      p => p.page_name.toLowerCase().includes(q) || p.page_slug.toLowerCase().includes(q)
    );
  }, [pagesList, searchFilter]);

  const activePageConfig: PageHeaderConfig = useMemo(() => {
    return (
      pages[selectedPageId] ||
      pagesList[0] || {
        id: 'about',
        page_name: 'About Us',
        page_slug: '/about',
        fallback_image: '/assets/teaching.jpeg',
        overlay_opacity: 0.30
      }
    );
  }, [pages, selectedPageId, pagesList]);

  // Sync staged form inputs when active page changes
  React.useEffect(() => {
    if (activePageConfig) {
      setStagedBreadcrumbImage(activePageConfig.breadcrumb_image || '');
      setStagedBreadcrumbTitle(activePageConfig.breadcrumb_title || activePageConfig.page_name);
      setStagedOverlayOpacity(activePageConfig.overlay_opacity ?? 0.35);
    }
  }, [activePageConfig]);

  // Sync top header form inputs
  React.useEffect(() => {
    if (topHeader) {
      setStagedTopHeaderImage(topHeader.top_header_bg_image || '');
      setStagedTopHeaderOpacity(topHeader.top_header_overlay_opacity ?? 0.30);
    }
  }, [topHeader]);

  // Save Breadcrumb Handler
  const handleSaveBreadcrumb = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const imageToSave = stagedBreadcrumbImage.trim() || activePageConfig.breadcrumb_image || activePageConfig.fallback_image || '';
    if (!imageToSave) {
      showToast('Please select or upload a breadcrumb image before saving.', 'error');
      return;
    }

    setIsSavingBreadcrumb(true);
    try {
      await savePageBreadcrumb(selectedPageId, stagedBreadcrumbImage.trim(), {
        breadcrumb_title: stagedBreadcrumbTitle.trim(),
        overlay_opacity: stagedOverlayOpacity,
        adminEmail
      });
      showToast(`Updated breadcrumb background for "${activePageConfig.page_name}" successfully.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save breadcrumb image.', 'error');
    } finally {
      setIsSavingBreadcrumb(false);
    }
  };

  // Remove Breadcrumb Handler
  const handleRemoveBreadcrumb = async () => {
    const confirmRemove = window.confirm(
      `Remove custom breadcrumb image for "${activePageConfig.page_name}"? The page will gracefully fall back to its approved default background.`
    );
    if (!confirmRemove) return;

    setIsSavingBreadcrumb(true);
    try {
      await removePageBreadcrumb(selectedPageId, adminEmail);
      setStagedBreadcrumbImage('');
      showToast(`Removed custom breadcrumb image for "${activePageConfig.page_name}". Default restored.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to remove image.', 'error');
    } finally {
      setIsSavingBreadcrumb(false);
    }
  };

  // Save Top Header Handler
  const handleSaveTopHeader = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!stagedTopHeaderImage.trim()) {
      showToast('Please select or upload a top header image.', 'error');
      return;
    }

    setIsSavingTopHeader(true);
    try {
      await saveTopHeader(stagedTopHeaderImage.trim(), {
        overlay_opacity: stagedTopHeaderOpacity,
        active: true,
        adminEmail
      });
      showToast('Updated main website top header background image successfully.');
    } catch (err: any) {
      showToast(err.message || 'Failed to save top header image.', 'error');
    } finally {
      setIsSavingTopHeader(false);
    }
  };

  // Remove Top Header Handler
  const handleRemoveTopHeader = async () => {
    const confirmRemove = window.confirm(
      'Remove top header background image? The top navigation bar will revert to its standard clean transparent/solid style.'
    );
    if (!confirmRemove) return;

    setIsSavingTopHeader(true);
    try {
      await removeTopHeader(adminEmail);
      setStagedTopHeaderImage('');
      showToast('Removed top header background image. Standard style restored.');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove top header.', 'error');
    } finally {
      setIsSavingTopHeader(false);
    }
  };

  // Reset All Headers Handler
  const handleResetAll = async () => {
    const confirmReset = window.confirm(
      'Reset all page breadcrumbs and top header backgrounds back to original baseline engineering imagery?'
    );
    if (!confirmReset) return;

    try {
      await resetAllHeaders();
      showToast('Reset all breadcrumb and header images to baseline defaults.');
    } catch (err: any) {
      showToast(err.message || 'Failed to reset.', 'error');
    }
  };

  const customPagesCount = pagesList.filter(p => Boolean(p.breadcrumb_image)).length;

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-xs font-bold animate-fade-in ${
            toast.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <IconCheck className="w-4 h-4" />
          ) : (
            <IconClose className="w-4 h-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Section Header & Tab Controls */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">Page Breadcrumb & Header Image Management</h2>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                customPagesCount > 0
                  ? isDark
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isDark
                  ? 'bg-slate-800 text-slate-400'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {customPagesCount} Custom Banners Active
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Upload, preview, replace, or remove background imagery for individual page breadcrumbs and the main website top header.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title="Restore all breadcrumbs to baseline default photography"
          >
            Reset All Defaults
          </button>
        </div>
      </div>

      {/* Main Mode Toggle: Breadcrumbs vs Top Header */}
      <div className="flex space-x-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveSection('breadcrumbs')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center space-x-2 ${
            activeSection === 'breadcrumbs'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Page Breadcrumb Sections</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
            {pagesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('top_header')}
          className={`pb-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-b-2 flex items-center space-x-2 ${
            activeSection === 'top_header'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 font-bold'
              : isDark
              ? 'border-transparent text-slate-400 hover:text-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>Top Header Background</span>
          {topHeader?.top_header_bg_image && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* SECTION A: PAGE BREADCRUMB MANAGEMENT */}
      {activeSection === 'breadcrumbs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Page Directory List (4 Cols) */}
          <div
            className={`lg:col-span-4 rounded-2xl border p-4 space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Website Page
              </span>
              <span className="text-xs text-slate-400">
                {filteredPages.length} pages
              </span>
            </div>

            {/* Search filter */}
            <div className="relative">
              <IconSearch className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter pages by name or slug..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className={`w-full pl-8 pr-3 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Page Items */}
            <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
              {filteredPages.map(pageItem => {
                const isSelected = selectedPageId === pageItem.id;
                const hasCustom = Boolean(pageItem.breadcrumb_image);
                const activeThumb = pageItem.breadcrumb_image || pageItem.fallback_image || '/assets/newoffshore.png';

                return (
                  <button
                    key={pageItem.id}
                    type="button"
                    onClick={() => setSelectedPageId(pageItem.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center space-x-3 cursor-pointer ${
                      isSelected
                        ? isDark
                          ? 'bg-emerald-950/60 border-emerald-500 ring-1 ring-emerald-500'
                          : 'bg-emerald-50/80 border-emerald-600 ring-1 ring-emerald-600'
                        : isDark
                        ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Small thumbnail */}
                    <div className="w-12 h-9 rounded-lg overflow-hidden bg-slate-800 shrink-0 border border-slate-700/50 relative">
                      <img
                        src={activeThumb}
                        alt={pageItem.page_name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {hasCustom && (
                        <span
                          className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 shadow-xs"
                          title="Custom background active"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate flex items-center space-x-1.5">
                        <span className={isSelected ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                          {pageItem.page_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate mt-0.5">
                        {pageItem.page_slug}
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                        hasCustom
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {hasCustom ? 'Custom' : 'Default'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Page Breadcrumb Banner Editor & Live Simulator (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Editor Panel Card */}
            <div
              className={`rounded-2xl border p-6 space-y-6 ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Active Target Page
                    </span>
                    <a
                      href={activePageConfig.page_slug}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-emerald-500 transition-colors inline-flex items-center space-x-1"
                      title="Open page on live website"
                    >
                      <span>{activePageConfig.page_slug}</span>
                      <IconExternal className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <h3 className="text-lg font-bold mt-0.5">
                    {activePageConfig.page_name}
                  </h3>
                </div>

                {/* Viewport Toggles for Live Preview */}
                <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
                  {(['desktop', 'tablet', 'mobile'] as const).map(vp => (
                    <button
                      key={vp}
                      type="button"
                      onClick={() => setPreviewViewport(vp)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                        previewViewport === vp
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {vp}
                    </button>
                  ))}
                </div>
              </div>

              {/* LIVE RESPONSIVE SIMULATOR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                    <IconEye className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Live Breadcrumb Banner Simulator</span>
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {stagedBreadcrumbImage ? 'Previewing assigned / staged image' : 'Showing default baseline image'}
                  </span>
                </div>

                <div
                  className={`mx-auto rounded-2xl overflow-hidden border transition-all duration-300 relative shadow-inner ${
                    previewViewport === 'mobile'
                      ? 'max-w-[360px]'
                      : previewViewport === 'tablet'
                      ? 'max-w-[620px]'
                      : 'w-full'
                  } ${isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-950'}`}
                >
                  {/* Hero Breadcrumb Area */}
                  <div className="relative pt-16 pb-12 px-6 sm:px-10 overflow-hidden text-white min-h-[220px] flex flex-col justify-between">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                      <img
                        src={stagedBreadcrumbImage || activePageConfig.fallback_image || '/assets/newoffshore.png'}
                        alt={activePageConfig.page_name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                        style={{ opacity: 1 - stagedOverlayOpacity }}
                      />
                      {/* Gradient overlay preserving legibility */}
                      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
                    </div>

                    {/* Breadcrumbs trail */}
                    <div className="relative z-10 flex items-center space-x-2 text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-6">
                      <span className="text-slate-400">Home</span>
                      <span className="text-slate-500">/</span>
                      <span className="text-white">
                        {stagedBreadcrumbTitle || activePageConfig.page_name}
                      </span>
                    </div>

                    {/* Headline and text */}
                    <div className="relative z-10 max-w-xl">
                      <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {activePageConfig.page_name}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2">
                        {activePageConfig.breadcrumb_title ||
                          'Comprehensive engineering and technical capabilities across Sub-Saharan Africa.'}
                      </p>
                    </div>

                    {/* Reflective energy line at base */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-300 to-transparent z-10 opacity-70" />
                  </div>
                </div>
              </div>

              {/* IMAGE UPLOAD & SELECTION CONTROLS */}
              <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Upload or Replace Breadcrumb Background
                  </label>
                  {Boolean(activePageConfig.breadcrumb_image) && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                      <IconCheckCircle className="w-3.5 h-3.5" />
                      <span>Custom Image Active</span>
                    </span>
                  )}
                </div>

                {/* Built-in Preset Library Selection */}
                <div>
                  <span className="text-[11px] text-slate-500 block mb-2 font-medium">
                    Quick-Select From Authentic Engineering Gallery:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_LIBRARY_IMAGES.map(item => (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => setStagedBreadcrumbImage(item.url)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          stagedBreadcrumbImage === item.url
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Persistent Image Uploader Component */}
                <div className="pt-2">
                  <ImageUploader
                    currentUrl={stagedBreadcrumbImage}
                    onUploadComplete={url => setStagedBreadcrumbImage(url)}
                    bucket="media"
                    label="Upload Custom Breadcrumb Banner (JPG, PNG, WebP)"
                    helperText="High-resolution landscape image (1920x600 recommended, max 15MB). Automatically saved to cloud storage."
                    theme={theme}
                  />
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Or Direct Image Asset Path / URL
                  </label>
                  <input
                    type="text"
                    value={stagedBreadcrumbImage}
                    onChange={e => setStagedBreadcrumbImage(e.target.value)}
                    placeholder="https://... or /assets/..."
                    className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Overlay Opacity Slider & Custom Title */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Breadcrumb Headline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={stagedBreadcrumbTitle}
                      onChange={e => setStagedBreadcrumbTitle(e.target.value)}
                      placeholder={activePageConfig.page_name}
                      className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-white'
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Dark Overlay Shade
                      </label>
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {Math.round(stagedOverlayOpacity * 100)}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={0.8}
                      step={0.05}
                      value={stagedOverlayOpacity}
                      onChange={e => setStagedOverlayOpacity(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    {Boolean(activePageConfig.breadcrumb_image) && (
                      <button
                        type="button"
                        onClick={handleRemoveBreadcrumb}
                        disabled={isSavingBreadcrumb}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                      >
                        <IconTrash className="w-4 h-4" />
                        <span>Remove Custom Banner</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setStagedBreadcrumbImage(activePageConfig.breadcrumb_image || '');
                        setStagedBreadcrumbTitle(activePageConfig.breadcrumb_title || activePageConfig.page_name);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                        isDark
                          ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                          : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveBreadcrumb()}
                      disabled={isSavingBreadcrumb}
                      className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                    >
                      <IconCheck className="w-4 h-4" />
                      <span>{isSavingBreadcrumb ? 'Saving...' : 'Save Breadcrumb Image'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: TOP HEADER BACKGROUND MANAGEMENT */}
      {activeSection === 'top_header' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div
            className={`rounded-2xl border p-6 space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
            }`}
          >
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Global Website Navigation Header
                </span>
                {topHeader?.top_header_bg_image && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Active
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold mt-1">
                Top Header Background Image
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Configure a persistent photographic or textured background behind the top navigation header bar across all pages.
              </p>
            </div>

            {/* LIVE HEADER SIMULATOR */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                <IconEye className="w-3.5 h-3.5 text-emerald-500" />
                <span>Live Navigation Header Simulator</span>
              </span>

              <div
                className={`w-full rounded-2xl overflow-hidden border relative ${
                  isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-900'
                }`}
              >
                {/* Simulated Header Bar */}
                <div className="relative py-4 px-6 flex items-center justify-between overflow-hidden">
                  {/* Background Image Layer */}
                  {stagedTopHeaderImage && (
                    <div className="absolute inset-0 z-0">
                      <img
                        src={stagedTopHeaderImage}
                        alt="Top Header Background"
                        className="w-full h-full object-cover"
                        style={{ opacity: 1 - stagedTopHeaderOpacity }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
                    </div>
                  )}

                  {/* Header Logo */}
                  <div className="relative z-10 flex items-center space-x-3">
                    <img
                      src="/assets/logo_light.png"
                      alt="PIGL"
                      className="h-8 w-auto object-contain"
                    />
                  </div>

                  {/* Nav Links */}
                  <div className="relative z-10 hidden md:flex items-center space-x-6 text-xs font-bold text-white uppercase tracking-wider">
                    <span className="text-emerald-400">Home</span>
                    <span className="text-slate-300">About Us</span>
                    <span className="text-slate-300">Services</span>
                    <span className="text-slate-300">Projects</span>
                    <span className="text-slate-300">Contact</span>
                  </div>

                  {/* CTA button */}
                  <div className="relative z-10">
                    <span className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
                      Request Consultation
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upload & Replace Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Upload or Replace Top Header Background
              </label>

              {/* Preset selection */}
              <div>
                <span className="text-[11px] text-slate-500 block mb-2 font-medium">
                  Quick-Select From Authentic Maritime / Technical Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_LIBRARY_IMAGES.slice(0, 6).map(item => (
                    <button
                      key={item.url}
                      type="button"
                      onClick={() => setStagedTopHeaderImage(item.url)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        stagedTopHeaderImage === item.url
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : isDark
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Uploader */}
              <div className="pt-2">
                <ImageUploader
                  currentUrl={stagedTopHeaderImage}
                  onUploadComplete={url => setStagedTopHeaderImage(url)}
                  bucket="media"
                  label="Upload Custom Header Background (JPG, PNG, WebP)"
                  helperText="Seamless pattern, subtle ambient photo, or dark engineering texture (1920x150, max 15MB)."
                  theme={theme}
                />
              </div>

              {/* Direct URL */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Or Direct Image Asset Path / URL
                </label>
                <input
                  type="text"
                  value={stagedTopHeaderImage}
                  onChange={e => setStagedTopHeaderImage(e.target.value)}
                  placeholder="https://... or /assets/..."
                  className={`w-full px-3 py-2 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Overlay Opacity Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Header Dark Gradient Overlay
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    {Math.round(stagedTopHeaderOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={0.8}
                  step={0.05}
                  value={stagedTopHeaderOpacity}
                  onChange={e => setStagedTopHeaderOpacity(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <div>
                  {Boolean(topHeader?.top_header_bg_image) && (
                    <button
                      type="button"
                      onClick={handleRemoveTopHeader}
                      disabled={isSavingTopHeader}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-600 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer disabled:opacity-50 flex items-center space-x-1.5"
                    >
                      <IconTrash className="w-4 h-4" />
                      <span>Remove Header Background</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setStagedTopHeaderImage(topHeader?.top_header_bg_image || '')}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                      isDark
                        ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                        : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveTopHeader()}
                    disabled={isSavingTopHeader || !stagedTopHeaderImage.trim()}
                    className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer flex items-center space-x-2"
                  >
                    <IconCheck className="w-4 h-4" />
                    <span>{isSavingTopHeader ? 'Saving...' : 'Save Top Header Background'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPageHeaders;
