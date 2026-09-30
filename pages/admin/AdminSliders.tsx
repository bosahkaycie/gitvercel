import React, { useState, useEffect } from 'react';
import { CMSSlider } from '../../types';
import AdminSliderEditor from './AdminSliderEditor';
import {
  IconSliders,
  IconPlus,
  IconEdit,
  IconTrash,
  IconVideo,
  IconCheckCircle,
  IconClose
} from '../../components/admin/AdminIcons';

interface AdminSlidersProps {
  sliders: CMSSlider[];
  loading: boolean;
  onSave: (slider: Partial<CMSSlider> & { title: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

interface ToastNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const AdminSliders: React.FC<AdminSlidersProps> = ({
  sliders,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const [editingSlider, setEditingSlider] = useState<CMSSlider | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const isDark = theme === 'dark';
  const sorted = [...sliders].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

  const handleSaveAndClose = async (payload: any) => {
    try {
      const isNew = !editingSlider;
      await onSave(payload);
      setEditingSlider(null);
      setIsCreating(false);
      setToast({
        type: 'success',
        message: isNew
          ? `Slide "${payload.title}" created successfully! It is live and active on the homepage hero carousel.`
          : `Slide "${payload.title}" updated successfully.`
      });
    } catch (err: any) {
      setToast({
        type: 'error',
        message: `Failed to save slide: ${err?.message || 'Unknown error'}`
      });
    }
  };

  const handleToggleActive = async (slider: CMSSlider) => {
    try {
      const nextActive = !slider.is_active;
      await onSave({
        ...slider,
        is_active: nextActive
      });
      setToast({
        type: 'info',
        message: `Slide "${slider.title}" is now ${nextActive ? 'Active' : 'Inactive'} on the homepage hero.`
      });
    } catch (err: any) {
      setToast({
        type: 'error',
        message: `Failed to update status: ${err?.message || 'Unknown error'}`
      });
    }
  };

  const handleDelete = async (slider: CMSSlider) => {
    if (window.confirm(`Delete slide "${slider.title}"?`)) {
      try {
        await onDelete(slider.id);
        setToast({
          type: 'success',
          message: `Slide "${slider.title}" has been deleted.`
        });
      } catch (err: any) {
        setToast({
          type: 'error',
          message: `Failed to delete slide: ${err?.message || 'Unknown error'}`
        });
      }
    }
  };

  if (isCreating || editingSlider) {
    return (
      <AdminSliderEditor
        initialData={editingSlider}
        onSave={handleSaveAndClose}
        theme={theme}
        onCancel={() => {
          setEditingSlider(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Toast Notification Banner */}
      {toast && (
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-lg border text-sm font-medium transition-all animate-fadeIn ${
          toast.type === 'success'
            ? isDark
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
              : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : toast.type === 'error'
              ? isDark
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : 'bg-rose-50 border-rose-300 text-rose-900'
              : isDark
                ? 'bg-cyan-950/90 border-cyan-800 text-cyan-200'
                : 'bg-cyan-50 border-cyan-300 text-cyan-900'
        }`}>
          <div className="flex items-center space-x-3">
            {toast.type === 'success' && <IconCheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <span className="text-lg leading-none shrink-0">⚠️</span>}
            {toast.type === 'info' && <span className="text-lg leading-none shrink-0">ℹ️</span>}
            <span>{toast.message}</span>
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 hover:opacity-75 transition-opacity ml-4 rounded"
            title="Dismiss notification"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Homepage Sliders & Hero Visuals
          </h1>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage the carousel headlines, backgrounds, videos, and call-to-actions on the PIGL homepage.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add New Slide</span>
        </button>
      </div>

      {/* Sliders Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading slides from database...
        </div>
      ) : sorted.length === 0 ? (
        <div className={`p-12 border rounded-2xl text-center text-sm font-medium ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No homepage slides found. Click "Add New Slide" to configure your hero carousel.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((slide) => (
            <div
              key={slide.id}
              className={`border rounded-2xl overflow-hidden shadow-xs flex flex-col transition-all ${
                isDark 
                  ? slide.is_active ? 'bg-slate-900 border-slate-800' : 'bg-slate-900/60 border-slate-800 opacity-60'
                  : slide.is_active ? 'bg-white border-slate-200/90' : 'bg-white border-slate-200 opacity-60'
              }`}
            >
              {/* Image / Video / Gradient Preview Header */}
              <div className="relative h-48 bg-slate-950 overflow-hidden flex items-center justify-center">
                {slide.desktop_image ? (
                  <img
                    src={slide.desktop_image}
                    alt={slide.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                ) : slide.video_url ? (
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
                    <IconVideo className="w-8 h-8 text-emerald-400 mb-2 opacity-80" />
                    <span className="text-xs font-mono text-slate-300 truncate max-w-full px-2">
                      {slide.video_url}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 flex items-center justify-center text-slate-400 text-xs font-mono">
                    Dark Gradient Background
                  </div>
                )}

                <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-mono font-bold border border-slate-700">
                  Order: #{slide.display_order}
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                    slide.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {slide.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {slide.video_url && (
                  <div className="absolute bottom-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold uppercase flex items-center space-x-1.5 shadow-xs">
                    <IconVideo className="w-3.5 h-3.5" />
                    <span>Video Hero</span>
                  </div>
                )}
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    {slide.subtitle || 'Homepage Slide'}
                  </p>
                  <h3 className={`font-bold text-base leading-snug line-clamp-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {slide.title}
                  </h3>
                  <p className={`text-xs sm:text-sm line-clamp-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {slide.description}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <button
                    onClick={() => handleToggleActive(slide)}
                    className={`text-xs font-bold ${
                      slide.is_active ? 'text-amber-600 dark:text-amber-400 hover:underline' : 'text-emerald-600 dark:text-emerald-400 hover:underline'
                    }`}
                  >
                    {slide.is_active ? 'Deactivate' : 'Activate'}
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingSlider(slide)}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        isDark 
                          ? 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-800/50' 
                          : 'bg-emerald-50 hover:bg-emerald-700 text-emerald-800 hover:text-white border border-emerald-200'
                      }`}
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(slide)}
                      className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-rose-500 hover:text-white hover:bg-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:hover:bg-rose-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <IconTrash className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminSliders;
