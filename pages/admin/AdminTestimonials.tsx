import React, { useState } from 'react';
import { CMSTestimonial } from '../../types';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCheck,
  IconClose,
  IconAlert
} from '../../components/admin/AdminIcons';

interface AdminTestimonialsProps {
  testimonials: CMSTestimonial[];
  loading: boolean;
  onSave: (testimonial: Partial<CMSTestimonial> & { quote: string; author_name: string; author_title: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({
  testimonials,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const isDark = theme === 'dark';
  const [editingItem, setEditingItem] = useState<CMSTestimonial | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<CMSTestimonial>>({
    author_name: '',
    author_title: '',
    author_company: '',
    author_initials: '',
    quote: '',
    is_placeholder: false,
    status: 'published',
    display_order: 1
  });

  const openCreate = () => {
    setFormData({
      author_name: '',
      author_title: '',
      author_company: '',
      author_initials: '',
      quote: '',
      is_placeholder: false,
      status: 'published',
      display_order: testimonials.length + 1
    });
    setEditingItem(null);
    setIsCreating(true);
  };

  const openEdit = (item: CMSTestimonial) => {
    setFormData({
      ...item
    });
    setEditingItem(item);
    setIsCreating(false);
  };

  const handleClose = () => {
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.author_name || !formData.quote) {
      alert('Author name and quotation content are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = {
        ...formData,
        author_initials: formData.author_initials || formData.author_name?.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase(),
        display_order: Number(formData.display_order) || 1
      };
      if (editingItem?.id) {
        payload.id = editingItem.id;
      }
      await onSave(payload);
      handleClose();
    } catch (err: any) {
      alert('Failed to save endorsement: ' + (err?.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the endorsement from "${name}"?`)) {
      await onDelete(id);
    }
  };

  const isModalOpen = isCreating || Boolean(editingItem);

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Client Endorsements & Testimonials
            </h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
              isDark ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' : 'bg-emerald-100 text-emerald-900 border-emerald-300/60'
            }`}>
              {testimonials.length} Total
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage verified client commendations and operational endorsements. Placeholders are visibly marked to prevent misrepresentation.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-xs transition-all flex items-center space-x-2 self-start sm:self-auto"
        >
          <IconPlus className="w-4 h-4" />
          <span>Add Endorsement</span>
        </button>
      </div>

      {/* Warning Notice about Placeholder Testimonials */}
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDark ? 'bg-amber-950/30 border-amber-800/50 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <IconAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <span className="font-bold">Content Governance Protocol:</span> Testimonials flagged as <code className="font-mono font-bold bg-amber-500/20 px-1 py-0.5 rounded">Sample / Placeholder</code> will display a distinct Draft notice on the public website. Only uncheck this flag once formal client verification and written corporate clearance have been received.
        </div>
      </div>

      {/* Testimonials List */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className={`p-12 border rounded-2xl text-center text-sm font-medium ${
          isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
        }`}>
          No testimonials registered yet. Click "Add Endorsement" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded ${
                      item.status === 'published'
                        ? (isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-emerald-50 text-emerald-800 border border-emerald-200')
                        : (isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600')
                    }`}>
                      {item.status}
                    </span>
                    {item.is_placeholder ? (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-500/10 text-amber-600 border border-amber-500/30">
                        Sample / Draft
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-blue-500/10 text-blue-600 border border-blue-500/30">
                        Verified Endorsement
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400">Order: {item.display_order}</span>
                </div>

                <p className={`text-sm italic leading-relaxed mb-4 line-clamp-4 ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  "{item.quote}"
                </p>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-800 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {item.author_initials || item.author_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.author_name}
                    </p>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 truncate">
                      {item.author_title}
                    </p>
                    {item.author_company && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {item.author_company}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => openEdit(item)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <IconEdit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.author_name)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-1.5 transition-colors"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Editor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`p-5 border-b flex items-center justify-between ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h2 className="text-base font-bold">
                {isCreating ? 'Add Client Endorsement' : 'Edit Endorsement'}
              </h2>
              <button
                onClick={handleClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.author_name || ''}
                  onChange={e => setFormData({ ...formData, author_name: e.target.value })}
                  placeholder="e.g. Engr. Simbi Kesiye Wabote"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                    Author Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.author_title || ''}
                    onChange={e => setFormData({ ...formData, author_title: e.target.value })}
                    placeholder="e.g. Former Executive Secretary"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={formData.author_company || ''}
                    onChange={e => setFormData({ ...formData, author_company: e.target.value })}
                    placeholder="e.g. NCDMB"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                  Endorsement Quotation *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.quote || ''}
                  onChange={e => setFormData({ ...formData, quote: e.target.value })}
                  placeholder="Enter the direct quotation or technical evaluation statement..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order || 1}
                    onChange={e => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                    Publication Status
                  </label>
                  <select
                    value={formData.status || 'published'}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600 dark:text-slate-300">
                    Initials (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.author_initials || ''}
                    onChange={e => setFormData({ ...formData, author_initials: e.target.value.toUpperCase() })}
                    placeholder="e.g. SW"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Placeholder checkbox */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                formData.is_placeholder
                  ? (isDark ? 'bg-amber-950/40 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900')
                  : (isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700')
              }`}>
                <input
                  id="is_placeholder"
                  type="checkbox"
                  checked={formData.is_placeholder || false}
                  onChange={e => setFormData({ ...formData, is_placeholder: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
                <label htmlFor="is_placeholder" className="text-xs leading-snug cursor-pointer">
                  <span className="font-bold block">Flag as Sample / Placeholder Draft</span>
                  When checked, the website marks this item as sample copy with a visible indicator so it cannot be confused with a formally executed client reference.
                </label>
              </div>

              <div className="pt-4 border-t flex items-center justify-end gap-3 border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleClose}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                    isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {submitting && <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                  <span>{isCreating ? 'Create Endorsement' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
