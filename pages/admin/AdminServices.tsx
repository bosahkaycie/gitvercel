import React, { useState } from 'react';
import { CMSService, ServiceDeliverableItem } from '../../types';
import { getDeliverableDetails } from '../../data/serviceDeliverablesData';
import AdminServiceEditor from './AdminServiceEditor';
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconExternal,
  IconClose,
  IconCheck
} from '../../components/admin/AdminIcons';

interface AdminServicesProps {
  services: CMSService[];
  loading: boolean;
  onSave: (service: Partial<CMSService> & { title: string; category: string }) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  theme?: 'light' | 'dark';
}

const AdminServices: React.FC<AdminServicesProps> = ({
  services,
  loading,
  onSave,
  onDelete,
  theme = 'light'
}) => {
  const [editingService, setEditingService] = useState<CMSService | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [filterDivision, setFilterDivision] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'catalog' | 'deliverables'>('catalog');

  // Quick Modal for Core Deliverables & Focal Points
  const [managingDeliverablesService, setManagingDeliverablesService] = useState<CMSService | null>(null);
  const [modalDeliverablesList, setModalDeliverablesList] = useState<ServiceDeliverableItem[]>([]);
  const [newModalTitle, setNewModalTitle] = useState<string>('');
  const [newModalDesc, setNewModalDesc] = useState<string>('');
  const [modalSaving, setModalSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isDark = theme === 'dark';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDeliverablesModal = (srv: CMSService) => {
    setManagingDeliverablesService(srv);
    const normalized = (srv.capabilities || []).map(item => 
      getDeliverableDetails(item, srv.slug || srv.id)
    );
    setModalDeliverablesList(normalized);
    setNewModalTitle('');
    setNewModalDesc('');
  };

  const handleSaveModalDeliverables = async () => {
    if (!managingDeliverablesService) return;
    setModalSaving(true);
    try {
      const updatedService = {
        ...managingDeliverablesService,
        capabilities: modalDeliverablesList.filter(d => Boolean(d.title?.trim()))
      };
      await onSave(updatedService);
      showToast(`Saved ${modalDeliverablesList.length} Core Deliverables for "${managingDeliverablesService.title}"`);
      setManagingDeliverablesService(null);
    } catch (err: any) {
      alert(`Error saving deliverables: ${err?.message || 'Failed to save'}`);
    } finally {
      setModalSaving(false);
    }
  };

  const handleAddModalDeliverable = () => {
    const title = newModalTitle.trim();
    if (!title) return;
    if (modalDeliverablesList.some(d => d.title.toLowerCase() === title.toLowerCase())) return;
    const deliverableObj = getDeliverableDetails(
      { title, description: newModalDesc.trim() },
      managingDeliverablesService?.slug || managingDeliverablesService?.id
    );
    setModalDeliverablesList(prev => [...prev, deliverableObj]);
    setNewModalTitle('');
    setNewModalDesc('');
  };

  const handleUpdateModalDeliverable = (idx: number, field: keyof ServiceDeliverableItem, val: string) => {
    setModalDeliverablesList(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  const handleRemoveModalDeliverable = (idx: number) => {
    setModalDeliverablesList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleMoveModalDeliverable = (idx: number, dir: 'up' | 'down') => {
    const target = dir === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= modalDeliverablesList.length) return;
    setModalDeliverablesList(prev => {
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const filtered = services
    .filter(s => {
      const matchesDivision = filterDivision === 'All' || s.division === filterDivision || s.category === filterDivision;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            s.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (s.capabilities || []).some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesDivision && matchesSearch;
    })
    .sort((a, b) => a.display_order - b.display_order);

  const handleSaveAndClose = async (payload: any) => {
    await onSave(payload);
    setEditingService(null);
    setIsCreating(false);
  };

  if (isCreating || editingService) {
    return (
      <AdminServiceEditor
        initialData={editingService}
        onSave={handleSaveAndClose}
        theme={theme}
        onCancel={() => {
          setEditingService(null);
          setIsCreating(false);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 font-sans relative ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[99999] px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-bold animate-bounce">
          <IconCheck className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
        isDark ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Engineering Services & Deliverables
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40">
              {services.length} Capabilities Active
            </span>
          </div>
          <p className={`text-xs sm:text-sm mt-1 leading-normal ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage technical services, equipment specifications, and Core Deliverables & Focal Points displayed across the website.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* View Switcher */}
          <div className="flex items-center space-x-1 bg-slate-200/80 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveView('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeView === 'catalog'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Services Directory
            </button>
            <button
              type="button"
              onClick={() => setActiveView('deliverables')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                activeView === 'deliverables'
                  ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none"></span>
              <span>Core Deliverables Matrix</span>
            </button>
          </div>

          <button
            onClick={() => setIsCreating(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center space-x-1.5 shadow-xs"
          >
            <IconPlus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className={`p-4 rounded-2xl border shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
      }`}>
        <div className="relative w-full md:w-84">
          <IconSearch className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search services or deliverables..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark ? 'bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
            }`}
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {[
            'All',
            'Ground Intelligence',
            'Digital Intelligence',
            'Integrated Engineering & Construction Solutions',
            'Industrial & Environmental Technologies',
            'Offshore Intelligence'
          ].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterDivision(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                filterDivision === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab === 'All' ? 'All Divisions' : tab.split(' ')[0] + ' ' + (tab.split(' ')[1] || '')}
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: Core Deliverables Matrix View */}
      {activeView === 'deliverables' && (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            isDark ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold">
                Direct Core Deliverables & Focal Points Manager: Click "Edit Deliverables" on any service to modify, add, or reorder outputs in real-time.
              </span>
            </div>
            <span className="font-mono font-bold">
              {filtered.reduce((acc, curr) => acc + (curr.capabilities?.length || 0), 0)} Total Focal Points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filtered.map((srv) => (
              <div
                key={srv.id}
                className={`border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                        {srv.division}
                      </span>
                      <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {srv.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleOpenDeliverablesModal(srv)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shadow-xs flex items-center space-x-1 shrink-0"
                    >
                      <IconEdit className="w-3.5 h-3.5" />
                      <span>Manage</span>
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border mb-3 ${
                    isDark ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200/80'
                  }`}>
                    <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200 dark:border-slate-800">
                      <h4 className="text-emerald-700 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                        Core Deliverables & Focal Points:
                      </h4>
                      <span className="text-[11px] font-mono text-slate-400">
                        {srv.capabilities?.length || 0} items
                      </span>
                    </div>

                    {(!srv.capabilities || srv.capabilities.length === 0) ? (
                      <p className="text-xs text-slate-400 italic">No deliverables assigned yet. Click "Manage" to add.</p>
                    ) : (
                      <ul className="space-y-2">
                        {srv.capabilities.map((cap, i) => (
                          <li key={i} className="flex items-start space-x-2.5 text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                            <span className="flex-shrink-0 w-1.5 h-1.5 bg-emerald-600 rounded-none mt-1"></span>
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 font-mono">
                  <span>/services/{srv.slug}</span>
                  <a
                    href={`/services/${srv.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <span>View Public Page</span>
                    <IconExternal className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: Standard Services Catalog Table */}
      {activeView === 'catalog' && (
        <div className={`border rounded-2xl shadow-xs overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/90'
        }`}>
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              Loading services catalog...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">
              No services found matching your filter criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className={`border-b text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <tr>
                    <th className="py-3.5 px-4 w-16 text-center">Seq</th>
                    <th className="py-3.5 px-4 sm:px-5">Service Capability</th>
                    <th className="py-3.5 px-4 sm:px-5">Platform Division</th>
                    <th className="py-3.5 px-4 sm:px-5">Core Deliverables</th>
                    <th className="py-3.5 px-4 sm:px-5">Status</th>
                    <th className="py-3.5 px-4 sm:px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
                  {filtered.map((srv) => (
                    <tr key={srv.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50/80'}`}>
                      <td className="py-4 px-4 text-center font-mono font-bold text-slate-400">
                        {srv.display_order}
                      </td>
                      <td className="py-4 px-4 sm:px-5">
                        <div className="flex items-center space-x-3.5">
                          <div className={`w-11 h-11 rounded-xl overflow-hidden border flex-shrink-0 ${
                            isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-100'
                          }`}>
                            <img
                              src={srv.card_image || srv.hero_image}
                              alt={srv.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{srv.title}</p>
                            <div className="flex items-center space-x-2 mt-0.5">
                              <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/services/{srv.slug}</span>
                              {srv.video_url && (
                                <>
                                  <span className="text-slate-400">•</span>
                                  <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1">
                                    <svg className="w-3 h-3 inline-block" fill="currentColor" viewBox="0 0 24 24">
                                      <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    Video Active
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-5">
                        <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                          {srv.category}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-5">
                        <button
                          type="button"
                          onClick={() => handleOpenDeliverablesModal(srv)}
                          className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold border transition-all text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 hover:shadow-xs"
                          title="Click to view and edit Core Deliverables & Focal Points"
                        >
                          <span className="w-1.5 h-1.5 bg-emerald-600 rounded-none"></span>
                          <span>{srv.capabilities?.length || 0} Deliverables</span>
                          <span className="text-[10px] text-emerald-500 font-normal">✎</span>
                        </button>
                      </td>
                      <td className="py-4 px-4 sm:px-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider border ${
                          srv.status === 'published'
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300/60 dark:border-emerald-700/50'
                            : srv.status === 'draft'
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300/60 dark:border-amber-700/50'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                        }`}>
                          {srv.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 sm:px-5 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDeliverablesModal(srv)}
                            title="Manage Core Deliverables & Focal Points"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                          >
                            <span className="text-xs font-bold font-mono px-1">Focal Points</span>
                          </button>
                          <a
                            href={`/services/${srv.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview Public Page"
                            className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <IconExternal className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setEditingService(srv)}
                            title="Edit Service"
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDark ? 'text-slate-300 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                          >
                            <IconEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete service "${srv.title}"?`)) {
                                onDelete(srv.id);
                              }
                            }}
                            title="Delete Service"
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                          >
                            <IconTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* QUICK CORE DELIVERABLES & FOCAL POINTS MODAL */}
      {managingDeliverablesService && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 space-y-5 transition-all ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  {managingDeliverablesService.division}
                </span>
                <h2 className="text-xl font-black tracking-tight">
                  Manage Core Deliverables & Focal Points
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  For: <span className="font-bold">{managingDeliverablesService.title}</span> (<span className="font-mono text-emerald-600">/services/{managingDeliverablesService.slug}</span>)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setManagingDeliverablesService(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <IconClose className="w-5 h-5" />
              </button>
            </div>

            {/* List of Deliverables */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Current Deliverables ({modalDeliverablesList.length})
                </label>
                <span className="text-[11px] text-slate-400 italic">Drag/use arrows to reorder</span>
              </div>

              {modalDeliverablesList.length === 0 ? (
                <div className={`p-6 border-2 border-dashed rounded-xl text-center text-xs ${
                  isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  No deliverables defined yet. Add the first deliverable below.
                </div>
              ) : (
                modalDeliverablesList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 border rounded-xl space-y-2 ${
                      isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 flex items-center justify-center rounded-md font-mono text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                        #{idx + 1}
                      </span>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateModalDeliverable(idx, 'title', e.target.value)}
                        placeholder="Deliverable Title (e.g. Seismic Services)"
                        className={`flex-1 px-3 py-1.5 text-xs sm:text-sm border rounded-lg outline-none font-bold ${
                          isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500'
                        }`}
                      />
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMoveModalDeliverable(idx, 'up')}
                          className="p-1 rounded text-slate-400 hover:text-emerald-500 disabled:opacity-30"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={idx === modalDeliverablesList.length - 1}
                          onClick={() => handleMoveModalDeliverable(idx, 'down')}
                          className="p-1 rounded text-slate-400 hover:text-emerald-500 disabled:opacity-30"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveModalDeliverable(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-600"
                          title="Delete"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => handleUpdateModalDeliverable(idx, 'description', e.target.value)}
                        placeholder="Technical Scope & Description for website popup..."
                        className={`w-full px-3 py-1.5 text-xs border rounded-lg outline-none leading-relaxed ${
                          isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-500'
                        }`}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add new deliverable input */}
            <div className={`p-4 border rounded-xl space-y-2 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider block ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Add Deliverable or Focal Point
              </span>
              <input
                type="text"
                value={newModalTitle}
                onChange={(e) => setNewModalTitle(e.target.value)}
                placeholder="Title (e.g. Seismic Services, Seabed Mapping)..."
                className={`w-full px-3.5 py-2 text-xs sm:text-sm border rounded-lg outline-none font-bold ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-600'
                }`}
              />
              <textarea
                rows={2}
                value={newModalDesc}
                onChange={(e) => setNewModalDesc(e.target.value)}
                placeholder="Detailed technical description and scope for popup content..."
                className={`w-full px-3.5 py-1.5 text-xs border rounded-lg outline-none leading-relaxed ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-200 focus:border-emerald-500' : 'bg-white border-slate-300 text-slate-800 focus:border-emerald-600'
                }`}
              />
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  disabled={!newModalTitle.trim()}
                  onClick={handleAddModalDeliverable}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Add Deliverable
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setManagingDeliverablesService(null)}
                className="px-4 py-2 text-xs font-bold uppercase rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={modalSaving}
                onClick={handleSaveModalDeliverables}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md disabled:opacity-50 flex items-center space-x-1.5"
              >
                {modalSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <IconCheck className="w-4 h-4" />
                    <span>Save Deliverables</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
