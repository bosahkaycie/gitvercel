import React, { useState, useMemo } from 'react';
import { ClientRelationshipItem, DEFAULT_CLIENT_RELATIONSHIPS } from '../../types';
import { useClientLogos } from '../../hooks/useSupabaseData';
import ImageUploader from '../../components/admin/ImageUploader';
import {
  IconBuilding,
  IconPlus,
  IconEdit,
  IconTrash,
  IconExternal,
  IconCheck,
  IconClose,
  IconSearch,
  IconEye
} from '../../components/admin/AdminIcons';

interface AdminClientLogosProps {
  theme?: 'light' | 'dark';
}

const CATEGORIES: Array<ClientRelationshipItem['category']> = [
  'Direct Client',
  'Project & Delivery Partner',
  'Industry Stakeholder'
];

const PRESET_LOGOS = [
  { name: 'Shell', url: '/assets/clients/shell.svg' },
  { name: 'NNPC Limited', url: '/assets/clients/nnpc.svg' },
  { name: 'TotalEnergies', url: '/assets/clients/totalenergies.svg' },
  { name: 'Renaissance Africa Energy', url: '/assets/clients/renaissance.svg' },
  { name: 'Newcross E&P', url: '/assets/clients/newcross.svg' },
  { name: 'Pan Ocean Oil Corp', url: '/assets/clients/panocean.svg' },
  { name: 'Matrix Energy', url: '/assets/clients/matrix.svg' }
];

export const AdminClientLogos: React.FC<AdminClientLogosProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const {
    clients,
    loading,
    saveClient,
    deleteClient,
    reorderClients,
    toggleStatus,
    resetToDefault
  } = useClientLogos(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientRelationshipItem | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ClientRelationshipItem['category']>('Direct Client');
  const [formRole, setFormRole] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formWebsite, setFormWebsite] = useState('');
  const [formDisplayOrder, setFormDisplayOrder] = useState<number>(1);
  const [formStatus, setFormStatus] = useState<'published' | 'draft'>('published');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormName('');
    setFormCategory('Direct Client');
    setFormRole('Operating Engagement');
    setFormLogoUrl('');
    setFormWebsite('');
    setFormDisplayOrder(clients.length + 1);
    setFormStatus('published');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (item: ClientRelationshipItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormCategory(item.category);
    setFormRole(item.role || '');
    setFormLogoUrl(item.logo_url);
    setFormWebsite(item.website || '');
    setFormDisplayOrder(item.display_order);
    setFormStatus(item.status);
    setFormError(null);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Organisation name is required.');
      return;
    }
    if (!formLogoUrl.trim()) {
      setFormError('Please select or upload a logo asset.');
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    try {
      await saveClient({
        ...(editingItem ? { id: editingItem.id } : {}),
        name: formName.trim(),
        category: formCategory,
        role: formRole.trim(),
        logo_url: formLogoUrl.trim(),
        website: formWebsite.trim(),
        display_order: Number(formDisplayOrder) || 1,
        status: formStatus
      });

      setModalOpen(false);
      showNotification(
        editingItem
          ? `Updated "${formName.trim()}" successfully.`
          : `Added "${formName.trim()}" to landing page client carousel.`
      );
    } catch (err: any) {
      setFormError(err.message || 'Failed to save organisation.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (item: ClientRelationshipItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${item.name}" from the landing page carousel?`
    );
    if (!confirmed) return;

    try {
      await deleteClient(item.id);
      showNotification(`Removed "${item.name}".`);
    } catch (err: any) {
      alert(`Error deleting organisation: ${err.message}`);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      'Reset client organisations back to the 7 approved baseline defaults (Shell, NNPC, TotalEnergies, Renaissance, Newcross, Pan Ocean, Matrix)?'
    );
    if (!confirmed) return;

    try {
      await resetToDefault();
      showNotification('Reset client logos to approved baseline defaults.');
    } catch (err: any) {
      alert(`Error resetting: ${err.message}`);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredClients.length) return;

    const listCopy = [...clients];
    const sourceItem = filteredClients[index];
    const targetItem = filteredClients[targetIndex];

    const actualSourceIdx = listCopy.findIndex(c => c.id === sourceItem.id);
    const actualTargetIdx = listCopy.findIndex(c => c.id === targetItem.id);

    if (actualSourceIdx >= 0 && actualTargetIdx >= 0) {
      const temp = listCopy[actualSourceIdx];
      listCopy[actualSourceIdx] = listCopy[actualTargetIdx];
      listCopy[actualTargetIdx] = temp;
      await reorderClients(listCopy);
      showNotification(`Updated display order.`);
    }
  };

  // Filtered list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchQuery =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.role && c.role.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCategory =
        selectedCategory === 'all' || c.category === selectedCategory;
      const matchStatus =
        selectedStatus === 'all' || c.status === selectedStatus;
      return matchQuery && matchCategory && matchStatus;
    });
  }, [clients, searchQuery, selectedCategory, selectedStatus]);

  const publishedCount = clients.filter(c => c.status === 'published').length;
  const draftCount = clients.filter(c => c.status === 'draft').length;

  return (
    <div className={`space-y-6 font-sans ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm font-semibold animate-fade-in">
          <IconCheck className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold">Landing Page Client Organisations</h2>
            <span
              className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}
            >
              {publishedCount} Published
            </span>
            {draftCount > 0 && (
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                  isDark ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                {draftCount} Draft
              </span>
            )}
          </div>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage corporate clients and industry stakeholder logos displayed in the homepage &ldquo;Organisations We Have Worked With&rdquo; carousel.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleReset}
            type="button"
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300'
                : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
            }`}
            title="Restore baseline Shell, NNPC, TotalEnergies, etc."
          >
            Reset Defaults
          </button>

          <button
            onClick={openAddModal}
            type="button"
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all flex items-center space-x-2 cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Organisation</span>
          </button>
        </div>
      </div>

      {/* Live Homepage Carousel Preview Banner */}
      <div
        className={`p-4 rounded-2xl border ${
          isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <IconEye className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Live Homepage Carousel Ticker Preview
            </span>
          </div>
          <span className="text-[11px] text-slate-500">
            {publishedCount} logos currently visible to public visitors
          </span>
        </div>

        <div className="overflow-x-auto py-3 px-2 no-scrollbar flex items-center space-x-4">
          {clients
            .filter(c => c.status === 'published')
            .map((client, idx) => (
              <div
                key={client.id}
                className={`flex-shrink-0 flex items-center space-x-3 px-4 py-2.5 rounded-xl border transition-all ${
                  isDark
                    ? 'bg-slate-950/80 border-slate-800'
                    : 'bg-white border-slate-200/90 shadow-xs'
                }`}
              >
                <div className="w-10 h-10 flex items-center justify-center p-1 bg-white/5 rounded-lg border border-slate-200/30">
                  <img
                    src={client.logo_url}
                    alt={client.name}
                    className="max-h-8 max-w-[40px] object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{client.name}</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    #{idx + 1} &bull; {client.category}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by organisation name or role..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className={`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className={`px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <option value="all">All Statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Client Organisation Table / Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-sm font-medium">
          <svg className="animate-spin h-6 w-6 text-emerald-500 mx-auto mb-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading client organisations...
        </div>
      ) : filteredClients.length === 0 ? (
        <div
          className={`p-12 border rounded-2xl text-center text-sm font-medium ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}
        >
          No client organisations found matching your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredClients.map((item, index) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-4 min-w-0 flex-1">
                {/* Order Controls */}
                <div className="flex flex-col items-center justify-center shrink-0 space-y-1">
                  <button
                    onClick={() => handleMoveOrder(index, 'up')}
                    disabled={index === 0}
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-emerald-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <span className="text-xs font-bold text-slate-400">
                    #{item.display_order}
                  </span>
                  <button
                    onClick={() => handleMoveOrder(index, 'down')}
                    disabled={index === filteredClients.length - 1}
                    type="button"
                    className="p-1 rounded text-slate-400 hover:text-emerald-500 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>

                {/* Logo Box */}
                <div
                  className={`w-16 h-14 rounded-xl border flex items-center justify-center p-2 shrink-0 ${
                    isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                  }`}
                >
                  <img
                    src={item.logo_url}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="text-base font-bold truncate">{item.name}</h3>
                    {item.website && (
                      <a
                        href={item.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                        title={item.website}
                      >
                        <IconExternal className="w-3.5 h-3.5 inline" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 mt-1 flex-wrap gap-y-1">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        item.category === 'Direct Client'
                          ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300'
                          : item.category === 'Industry Stakeholder'
                          ? 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300'
                          : 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                      }`}
                    >
                      {item.category}
                    </span>
                    {item.role && (
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        &bull; {item.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => toggleStatus(item.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                    item.status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  }`}
                  title="Click to toggle status"
                >
                  {item.status}
                </button>

                <button
                  onClick={() => openEditModal(item)}
                  type="button"
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Edit Organisation"
                >
                  <IconEdit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(item)}
                  type="button"
                  className="p-2 rounded-xl border border-red-200 dark:border-red-900/60 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                  title="Delete Organisation"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Organisation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 shadow-2xl border max-h-[90vh] overflow-y-auto ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <IconBuilding className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold">
                  {editingItem ? 'Edit Client Organisation' : 'Add Client Organisation'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                type="button"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Organisation Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shell, NNPC Limited, TotalEnergies"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Category *
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value as any)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Engagement Subtitle / Role */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Engagement Subtitle / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Operating Engagement, Upstream Asset Operations"
                  value={formRole}
                  onChange={e => setFormRole(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Logo Asset Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Logo Asset *
                </label>

                {/* Built-in Presets */}
                <div className="mb-2">
                  <span className="text-[11px] text-slate-500 block mb-1">Quick Select Built-in Logo:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_LOGOS.map(preset => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => {
                          setFormLogoUrl(preset.url);
                          if (!formName) setFormName(preset.name);
                        }}
                        className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          formLogoUrl === preset.url
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : isDark
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                            : 'bg-slate-100 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL or Upload */}
                <div className="mt-3">
                  <ImageUploader
                    currentUrl={formLogoUrl}
                    onUploadComplete={url => setFormLogoUrl(url)}
                    bucket="media"
                    label="Upload Custom Logo (SVG / PNG / WebP)"
                    helperText="Upload transparent vector SVG or high-res PNG for optimal display in the ticker."
                    theme={theme}
                  />
                </div>

                {/* Direct URL input fallback */}
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Or enter direct image/SVG path (e.g. /assets/clients/shell.svg)"
                    value={formLogoUrl}
                    onChange={e => setFormLogoUrl(e.target.value)}
                    className={`w-full px-3 py-1.5 rounded-lg text-xs border font-mono ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-slate-300'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>

                {/* Preview */}
                {formLogoUrl && (
                  <div className="mt-3 p-3 rounded-xl border flex items-center space-x-3 bg-slate-950/20">
                    <div className="w-12 h-12 rounded-lg bg-white/10 p-1 flex items-center justify-center border border-white/20">
                      <img
                        src={formLogoUrl}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="text-xs">
                      <div className="font-semibold text-emerald-500">Logo preview ready</div>
                      <div className="text-slate-400 truncate max-w-xs">{formLogoUrl}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formWebsite}
                  onChange={e => setFormWebsite(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-white'
                      : 'bg-white border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Order & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formDisplayOrder}
                    onChange={e => setFormDisplayOrder(Number(e.target.value))}
                    className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-sm border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isDark
                        ? 'bg-slate-950 border-slate-800 text-white'
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer ${
                    isDark
                      ? 'border-slate-700 hover:bg-slate-800 text-slate-300'
                      : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {formSubmitting
                    ? 'Saving...'
                    : editingItem
                    ? 'Update Organisation'
                    : 'Add Organisation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientLogos;
