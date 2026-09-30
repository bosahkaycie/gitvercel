import React, { useState } from 'react';
import {
  useNavigation,
  DEFAULT_NAVIGATION_CONFIG
} from '../../hooks/useSupabaseData';
import {
  HeaderNavItem,
  HeaderNavSection,
  HeaderNavSubLink,
  FooterColumnItem,
  FooterLinkItem,
  SitePageInfo
} from '../../types';
import {
  IconGlobe,
  IconPlus,
  IconTrash,
  IconEdit,
  IconCheck,
  IconArrowUp,
  IconArrowDown,
  IconExternal,
  IconSearch,
  IconCheckCircle
} from '../../components/admin/AdminIcons';

interface AdminNavigationProps {
  theme?: 'light' | 'dark';
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';
  const {
    navConfig,
    loading,
    saveHeaderNav,
    saveFooterConfig,
    savePages,
    resetToDefaults
  } = useNavigation(true);

  const [activeTab, setActiveTab] = useState<'header' | 'footer' | 'pages'>('header');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingHeaderItem, setEditingHeaderItem] = useState<HeaderNavItem | null>(null);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isNewHeaderItem, setIsNewHeaderItem] = useState(false);

  // Sublink modal
  const [targetParentHeaderId, setTargetParentHeaderId] = useState<string | null>(null);
  const [targetSectionId, setTargetSectionId] = useState<string | null>(null);
  const [editingSubLink, setEditingSubLink] = useState<HeaderNavSubLink | null>(null);
  const [isSubLinkModalOpen, setIsSubLinkModalOpen] = useState(false);

  // Footer link modal
  const [targetFooterColId, setTargetFooterColId] = useState<string | null>(null);
  const [editingFooterLink, setEditingFooterLink] = useState<FooterLinkItem | null>(null);
  const [isFooterLinkModalOpen, setIsFooterLinkModalOpen] = useState(false);
  const [isBottomLinkModal, setIsBottomLinkModal] = useState(false);

  // Footer column modal
  const [editingFooterCol, setEditingFooterCol] = useState<FooterColumnItem | null>(null);
  const [isFooterColModalOpen, setIsFooterColModalOpen] = useState(false);

  // Page editor modal
  const [editingPage, setEditingPage] = useState<SitePageInfo | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  // Reset confirmation modal
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Expandable header sections
  const [expandedHeaderIds, setExpandedHeaderIds] = useState<Record<string, boolean>>({
    'nav-about': true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleExpandHeader = (id: string) => {
    setExpandedHeaderIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ----------------------------------------------------------------------------
  // HEADER HANDLERS
  // ----------------------------------------------------------------------------
  const handleMoveHeader = async (index: number, direction: 'up' | 'down') => {
    const items = [...navConfig.header];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIdx];
    items[targetIdx] = temp;

    // re-index order
    items.forEach((item, idx) => {
      item.order = idx + 1;
    });

    await saveHeaderNav(items);
    showToast('Menu order updated successfully');
  };

  const handleToggleHeaderActive = async (id: string) => {
    const items = navConfig.header.map(item => {
      if (item.id === id) {
        return { ...item, is_active: !item.is_active };
      }
      return item;
    });
    await saveHeaderNav(items);
    showToast('Navigation visibility toggled');
  };

  const handleDeleteHeader = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this navigation item from the header?')) return;
    const items = navConfig.header.filter(item => item.id !== id);
    items.forEach((item, idx) => { item.order = idx + 1; });
    await saveHeaderNav(items);
    showToast('Navigation item removed');
  };

  const handleSaveHeaderModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeaderItem) return;

    let items = [...navConfig.header];
    if (isNewHeaderItem) {
      items.push({
        ...editingHeaderItem,
        id: editingHeaderItem.id || `nav-${Date.now()}`,
        order: items.length + 1
      });
    } else {
      items = items.map(item => item.id === editingHeaderItem.id ? editingHeaderItem : item);
    }

    await saveHeaderNav(items);
    setIsHeaderModalOpen(false);
    setEditingHeaderItem(null);
    showToast(isNewHeaderItem ? 'New header link added' : 'Header link updated');
  };

  // Sub-links handlers
  const handleSaveSubLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetParentHeaderId || !targetSectionId || !editingSubLink) return;

    const items = navConfig.header.map(item => {
      if (item.id === targetParentHeaderId && item.sections) {
        const updatedSections = item.sections.map(sec => {
          if (sec.id === targetSectionId) {
            const isNew = !sec.links.some(l => l.id === editingSubLink.id);
            const updatedLinks = isNew
              ? [...sec.links, { ...editingSubLink, id: editingSubLink.id || `sub-${Date.now()}` }]
              : sec.links.map(l => l.id === editingSubLink.id ? editingSubLink : l);
            return { ...sec, links: updatedLinks };
          }
          return sec;
        });
        return { ...item, sections: updatedSections };
      }
      return item;
    });

    await saveHeaderNav(items);
    setIsSubLinkModalOpen(false);
    setEditingSubLink(null);
    showToast('Sub-link saved successfully');
  };

  const handleDeleteSubLink = async (parentId: string, secId: string, linkId: string) => {
    if (!window.confirm('Delete this sub-menu link?')) return;
    const items = navConfig.header.map(item => {
      if (item.id === parentId && item.sections) {
        const updatedSections = item.sections.map(sec => {
          if (sec.id === secId) {
            return { ...sec, links: sec.links.filter(l => l.id !== linkId) };
          }
          return sec;
        });
        return { ...item, sections: updatedSections };
      }
      return item;
    });

    await saveHeaderNav(items);
    showToast('Sub-link removed');
  };

  const handleAddSection = async (parentId: string) => {
    const title = window.prompt('Enter title for new sub-section (e.g. "Special Initiatives"):');
    if (!title) return;

    const items = navConfig.header.map(item => {
      if (item.id === parentId) {
        const sections = item.sections || [];
        return {
          ...item,
          sections: [
            ...sections,
            {
              id: `sec-${Date.now()}`,
              title,
              links: []
            }
          ]
        };
      }
      return item;
    });

    await saveHeaderNav(items);
    showToast('New section added');
  };

  // ----------------------------------------------------------------------------
  // FOOTER HANDLERS
  // ----------------------------------------------------------------------------
  const handleMoveFooterColumn = async (index: number, direction: 'left' | 'right') => {
    const columns = [...navConfig.footer.columns];
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= columns.length) return;

    const temp = columns[index];
    columns[index] = columns[targetIdx];
    columns[targetIdx] = temp;
    columns.forEach((col, idx) => { col.order = idx + 1; });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer columns reordered');
  };

  const handleToggleFooterColActive = async (id: string) => {
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === id) return { ...col, is_active: !col.is_active };
      return col;
    });
    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer column visibility updated');
  };

  const handleDeleteFooterCol = async (id: string) => {
    if (!window.confirm('Delete this footer column and all its links?')) return;
    const columns = navConfig.footer.columns.filter(col => col.id !== id);
    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer column removed');
  };

  const handleSaveFooterColModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFooterCol) return;

    let columns = [...navConfig.footer.columns];
    const exists = columns.some(c => c.id === editingFooterCol.id);
    if (exists) {
      columns = columns.map(c => c.id === editingFooterCol.id ? editingFooterCol : c);
    } else {
      columns.push({
        ...editingFooterCol,
        id: editingFooterCol.id || `fcol-${Date.now()}`,
        order: columns.length + 1,
        links: editingFooterCol.links || []
      });
    }

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    setIsFooterColModalOpen(false);
    setEditingFooterCol(null);
    showToast('Footer column saved');
  };

  // Footer Links Handlers
  const handleMoveFooterLink = async (colId: string, linkIdx: number, direction: 'up' | 'down') => {
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === colId) {
        const links = [...col.links];
        const targetIdx = direction === 'up' ? linkIdx - 1 : linkIdx + 1;
        if (targetIdx >= 0 && targetIdx < links.length) {
          const temp = links[linkIdx];
          links[linkIdx] = links[targetIdx];
          links[targetIdx] = temp;
          links.forEach((l, idx) => { l.order = idx + 1; });
          return { ...col, links };
        }
      }
      return col;
    });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer links reordered');
  };

  const handleDeleteFooterLink = async (colId: string, linkId: string) => {
    if (!window.confirm('Remove this link from the footer column?')) return;
    const columns = navConfig.footer.columns.map(col => {
      if (col.id === colId) {
        return { ...col, links: col.links.filter(l => l.id !== linkId) };
      }
      return col;
    });

    await saveFooterConfig(columns, navConfig.footer.bottom_links);
    showToast('Footer link deleted');
  };

  const handleSaveFooterLinkModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFooterLink) return;

    if (isBottomLinkModal) {
      let bottomLinks = [...navConfig.footer.bottom_links];
      const exists = bottomLinks.some(l => l.id === editingFooterLink.id);
      if (exists) {
        bottomLinks = bottomLinks.map(l => l.id === editingFooterLink.id ? editingFooterLink : l);
      } else {
        bottomLinks.push({
          ...editingFooterLink,
          id: editingFooterLink.id || `bot-${Date.now()}`,
          order: bottomLinks.length + 1
        });
      }
      await saveFooterConfig(navConfig.footer.columns, bottomLinks);
    } else if (targetFooterColId) {
      const columns = navConfig.footer.columns.map(col => {
        if (col.id === targetFooterColId) {
          const exists = col.links.some(l => l.id === editingFooterLink.id);
          const links = exists
            ? col.links.map(l => l.id === editingFooterLink.id ? editingFooterLink : l)
            : [...col.links, { ...editingFooterLink, id: editingFooterLink.id || `flink-${Date.now()}`, order: col.links.length + 1 }];
          return { ...col, links };
        }
        return col;
      });
      await saveFooterConfig(columns, navConfig.footer.bottom_links);
    }

    setIsFooterLinkModalOpen(false);
    setEditingFooterLink(null);
    setTargetFooterColId(null);
    setIsBottomLinkModal(false);
    showToast('Footer link saved successfully');
  };

  // ----------------------------------------------------------------------------
  // PAGES & SEO HANDLERS
  // ----------------------------------------------------------------------------
  const handleSavePageModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    let pages = [...navConfig.pages];
    const exists = pages.some(p => p.id === editingPage.id);
    if (exists) {
      pages = pages.map(p => p.id === editingPage.id ? { ...editingPage, updated_at: new Date().toISOString() } : p);
    } else {
      pages.push({
        ...editingPage,
        id: editingPage.id || `pg-${Date.now()}`,
        updated_at: new Date().toISOString()
      });
    }

    await savePages(pages);
    setIsPageModalOpen(false);
    setEditingPage(null);
    showToast('Page configuration saved');
  };

  const handleDeletePage = async (id: string) => {
    if (!window.confirm('Delete this page definition? Note: Standard core pages should not be deleted.')) return;
    const pages = navConfig.pages.filter(p => p.id !== id);
    await savePages(pages);
    showToast('Page removed');
  };

  // Reset to default corporate navigation
  const handleConfirmReset = async () => {
    await resetToDefaults();
    setIsResetConfirmOpen(false);
    showToast('Navigation restored to PIGL corporate defaults');
  };

  const filteredPages = navConfig.pages.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.meta_title && p.meta_title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`space-y-6 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center space-x-3 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in text-sm font-semibold">
          <IconCheckCircle className="w-5 h-5 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className={`p-6 rounded-xl border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <IconGlobe className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-black tracking-tight">Navigation & Page Management</h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Control the top bar menu, mega dropdowns, footer columns, and corporate page metadata in real time.
          </p>
        </div>

        <div className="flex items-center space-x-3 w-full lg:w-auto">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-colors flex items-center space-x-1.5 ${
              isDark
                ? 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <span>Live Site Preview</span>
            <IconExternal className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            className="px-3.5 py-2 text-xs font-bold rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('header')}
          className={`pb-3.5 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'header'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Top Header Navigation</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {navConfig.header.filter(h => h.is_active).length} Active
          </span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`pb-3.5 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'footer'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Footer Columns & Links</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {navConfig.footer.columns.length} Columns
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`pb-3.5 border-b-2 flex items-center space-x-2 transition-colors ${
            activeTab === 'pages'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <span>Pages & SEO Metadata</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {navConfig.pages.length} Pages
          </span>
        </button>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: HEADER NAVIGATION                                             */}
      {/* ==================================================================== */}
      {activeTab === 'header' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Drag or use arrows to reorder. Toggle switches hide items without deleting their settings.
            </p>
            <button
              onClick={() => {
                setEditingHeaderItem({
                  id: '',
                  name: '',
                  href: '',
                  type: 'standard',
                  is_active: true,
                  order: navConfig.header.length + 1
                });
                setIsNewHeaderItem(true);
                setIsHeaderModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add Menu Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {navConfig.header.map((item, idx) => {
              const isExpanded = Boolean(expandedHeaderIds[item.id]);
              const hasSections = item.type === 'mega' && item.sections && item.sections.length > 0;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } ${!item.is_active ? 'opacity-60' : ''}`}
                >
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* Item Info */}
                    <div className="flex items-center space-x-3 min-w-0">
                      {/* Order Controls */}
                      <div className="flex flex-col space-y-0.5">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveHeader(idx, 'up')}
                          className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20 transition-colors"
                          title="Move up"
                        >
                          <IconArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === navConfig.header.length - 1}
                          onClick={() => handleMoveHeader(idx, 'down')}
                          className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20 transition-colors"
                          title="Move down"
                        >
                          <IconArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                            {item.name}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${
                            item.type === 'mega'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : item.type === 'external'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                          }`}>
                            {item.type === 'mega' ? 'Mega Menu' : item.type === 'external' ? 'External' : 'Link'}
                          </span>
                          {!item.is_active && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Route: {item.href}</span>
                          {item.badge && (
                            <span className="text-emerald-500 font-semibold">• Badge: "{item.badge}"</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 self-end md:self-center">
                      {item.type === 'mega' && (
                        <button
                          type="button"
                          onClick={() => toggleExpandHeader(item.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          {isExpanded ? 'Hide Sub-links ▲' : `Manage Sub-links (${item.sections?.reduce((acc, s) => acc + s.links.length, 0) || 0}) ▼`}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleHeaderActive(item.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
                          item.is_active
                            ? 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                            : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {item.is_active ? 'Active' : 'Show'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingHeaderItem({ ...item });
                          setIsNewHeaderItem(false);
                          setIsHeaderModalOpen(true);
                        }}
                        className="p-2 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="Edit link details"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteHeader(item.id)}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete menu item"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mega Menu Expandable Sections */}
                  {item.type === 'mega' && isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Dropdown Sections & Submenu Items
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddSection(item.id)}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
                        >
                          <IconPlus className="w-3 h-3" />
                          <span>Add New Section</span>
                        </button>
                      </div>

                      {hasSections ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {item.sections!.map((section) => (
                            <div
                              key={section.id}
                              className={`p-3.5 rounded-lg border ${
                                isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                  {section.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTargetParentHeaderId(item.id);
                                    setTargetSectionId(section.id);
                                    setEditingSubLink({
                                      id: '',
                                      label: '',
                                      href: '',
                                      description: ''
                                    });
                                    setIsSubLinkModalOpen(true);
                                  }}
                                  className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                  + Add Link
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {section.links.map((sublink) => (
                                  <div
                                    key={sublink.id}
                                    className="flex items-center justify-between py-1 px-2 rounded hover:bg-white dark:hover:bg-slate-900 transition-colors text-xs"
                                  >
                                    <div className="min-w-0 pr-2">
                                      <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {sublink.label}
                                      </p>
                                      <p className="text-[10px] text-slate-500 font-mono truncate">
                                        {sublink.href}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setTargetParentHeaderId(item.id);
                                          setTargetSectionId(section.id);
                                          setEditingSubLink({ ...sublink });
                                          setIsSubLinkModalOpen(true);
                                        }}
                                        className="p-1 text-slate-400 hover:text-emerald-500"
                                      >
                                        <IconEdit className="w-3 h-3" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubLink(item.id, section.id, sublink.id)}
                                        className="p-1 text-slate-400 hover:text-red-500"
                                      >
                                        <IconTrash className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          This mega menu is dynamically driven by the services catalog or has no custom child sections.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: FOOTER NAVIGATION                                             */}
      {/* ==================================================================== */}
      {activeTab === 'footer' && (
        <div className="space-y-8">
          {/* Columns Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                  Footer Navigation Columns
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage the columns shown on the desktop and tablet footer grid.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingFooterCol({
                    id: '',
                    title: '',
                    order: navConfig.footer.columns.length + 1,
                    is_active: true,
                    links: []
                  });
                  setIsFooterColModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>Add Footer Column</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {navConfig.footer.columns.map((col, cIdx) => (
                <div
                  key={col.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          Column {cIdx + 1}
                        </span>
                        <h4 className="text-base font-black text-slate-900 dark:text-white">
                          {col.title}
                        </h4>
                      </div>

                      <div className="flex items-center space-x-1">
                        <button
                          disabled={cIdx === 0}
                          onClick={() => handleMoveFooterColumn(cIdx, 'left')}
                          className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                          title="Move left"
                        >
                          ←
                        </button>
                        <button
                          disabled={cIdx === navConfig.footer.columns.length - 1}
                          onClick={() => handleMoveFooterColumn(cIdx, 'right')}
                          className="p-1 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                          title="Move right"
                        >
                          →
                        </button>
                        <button
                          onClick={() => {
                            setEditingFooterCol({ ...col });
                            setIsFooterColModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-500"
                        >
                          <IconEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFooterCol(col.id)}
                          className="p-1 text-slate-400 hover:text-red-500"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Column Links List */}
                    <div className="py-3 space-y-1.5">
                      {col.links.map((link, lIdx) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-xs"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                              {link.label}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400 block truncate">
                              {link.href}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              disabled={lIdx === 0}
                              onClick={() => handleMoveFooterLink(col.id, lIdx, 'up')}
                              className="p-0.5 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                            >
                              <IconArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              disabled={lIdx === col.links.length - 1}
                              onClick={() => handleMoveFooterLink(col.id, lIdx, 'down')}
                              className="p-0.5 text-slate-400 hover:text-emerald-500 disabled:opacity-20"
                            >
                              <IconArrowDown className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => {
                                setTargetFooterColId(col.id);
                                setIsBottomLinkModal(false);
                                setEditingFooterLink({ ...link });
                                setIsFooterLinkModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-emerald-500"
                            >
                              <IconEdit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteFooterLink(col.id, link.id)}
                              className="p-1 text-slate-400 hover:text-red-500"
                            >
                              <IconTrash className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTargetFooterColId(col.id);
                      setIsBottomLinkModal(false);
                      setEditingFooterLink({
                        id: '',
                        label: '',
                        href: '',
                        is_active: true,
                        order: col.links.length + 1
                      });
                      setIsFooterLinkModalOpen(true);
                    }}
                    className="w-full mt-2 py-2 border border-dashed border-slate-300 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:border-emerald-500 rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                  >
                    <IconPlus className="w-3 h-3" />
                    <span>Add Link to {col.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Copyright Bar Links */}
          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Footer Bottom Bar Quick Links
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Links displayed adjacent to the copyright note (e.g. Vendor Portal, Privacy Policy, Terms).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsBottomLinkModal(true);
                  setTargetFooterColId(null);
                  setEditingFooterLink({
                    id: '',
                    label: '',
                    href: '',
                    is_active: true,
                    order: navConfig.footer.bottom_links.length + 1
                  });
                  setIsFooterLinkModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors"
              >
                + Add Bottom Link
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {navConfig.footer.bottom_links.map((link) => (
                <div
                  key={link.id}
                  className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center space-x-2 text-xs"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{link.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">({link.href})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBottomLinkModal(true);
                      setEditingFooterLink({ ...link });
                      setIsFooterLinkModalOpen(true);
                    }}
                    className="text-slate-400 hover:text-emerald-500"
                  >
                    <IconEdit className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: PAGES DIRECTORY & SEO                                         */}
      {/* ==================================================================== */}
      {activeTab === 'pages' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <IconSearch className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search pages by title or route..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-xs rounded-lg border outline-none transition-colors ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 focus:border-emerald-500 text-white placeholder-slate-500'
                    : 'bg-white border-slate-200 focus:border-emerald-500 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <button
              onClick={() => {
                setEditingPage({
                  id: '',
                  title: '',
                  slug: '/',
                  description: '',
                  meta_title: '',
                  meta_description: '',
                  is_published: true,
                  show_in_header: false,
                  show_in_footer: false
                });
                setIsPageModalOpen(true);
              }}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm self-start sm:self-auto"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Add Custom Page</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        {page.title}
                      </h4>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        {page.slug}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => {
                          setEditingPage({ ...page });
                          setIsPageModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="Edit Page SEO"
                      >
                        <IconEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Page"
                      >
                        <IconTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {page.description || 'No internal description.'}
                  </p>

                  {/* SEO Preview Box */}
                  <div className={`p-3 rounded-lg border text-xs space-y-1 ${
                    isDark ? 'bg-slate-950 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Search Preview</p>
                    <p className="font-semibold text-blue-600 dark:text-blue-400 truncate">
                      {page.meta_title || `${page.title} | Polaris Integrated & GeoSolutions`}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px] line-clamp-2">
                      {page.meta_description || 'High-fidelity 3D reality capture, geotechnical investigations, and digital twins across Sub-Saharan Africa.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                  <div className="flex items-center space-x-2">
                    {page.show_in_header && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                        In Header
                      </span>
                    )}
                    {page.show_in_footer && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
                        In Footer
                      </span>
                    )}
                  </div>

                  <a
                    href={page.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-emerald-600 flex items-center space-x-1 font-semibold"
                  >
                    <span>View Page</span>
                    <IconExternal className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 1: HEADER LINK EDITOR                                          */}
      {/* ==================================================================== */}
      {isHeaderModalOpen && editingHeaderItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-lg p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black">
                {isNewHeaderItem ? 'Add Top Menu Item' : 'Edit Top Menu Item'}
              </h3>
              <button
                onClick={() => setIsHeaderModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHeaderModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Menu Label *
                </label>
                <input
                  type="text"
                  required
                  value={editingHeaderItem.name}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, name: e.target.value })}
                  placeholder="e.g. Services, About Us, Sustainability"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    URL Route / Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingHeaderItem.href}
                    onChange={e => setEditingHeaderItem({ ...editingHeaderItem, href: e.target.value })}
                    placeholder="e.g. /about or https://..."
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Display Type
                  </label>
                  <select
                    value={editingHeaderItem.type}
                    onChange={e => setEditingHeaderItem({ ...editingHeaderItem, type: e.target.value as any })}
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                    }`}
                  >
                    <option value="standard">Standard Link</option>
                    <option value="mega">Mega Menu Dropdown</option>
                    <option value="external">External Link</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Optional Badge Tag
                </label>
                <input
                  type="text"
                  value={editingHeaderItem.badge || ''}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, badge: e.target.value })}
                  placeholder="e.g. 'NEW', 'ISO', 'PORTAL'"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="headerIsActive"
                  checked={editingHeaderItem.is_active}
                  onChange={e => setEditingHeaderItem({ ...editingHeaderItem, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="headerIsActive" className="text-sm font-semibold cursor-pointer">
                  Visible in Top Navigation Bar
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsHeaderModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Save Menu Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 2: SUB-LINK EDITOR                                             */}
      {/* ==================================================================== */}
      {isSubLinkModalOpen && editingSubLink && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-black">Edit Dropdown Sub-Link</h3>
              <button
                onClick={() => setIsSubLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSubLink} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Link Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubLink.label}
                  onChange={e => setEditingSubLink({ ...editingSubLink, label: e.target.value })}
                  placeholder="e.g. Core Values"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  URL / Target Route *
                </label>
                <input
                  type="text"
                  required
                  value={editingSubLink.href}
                  onChange={e => setEditingSubLink({ ...editingSubLink, href: e.target.value })}
                  placeholder="e.g. /about?section=values"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={editingSubLink.description || ''}
                  onChange={e => setEditingSubLink({ ...editingSubLink, description: e.target.value })}
                  placeholder="e.g. Professionalism, innovation, integrity and safety"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsSubLinkModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Sub-Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 3: FOOTER LINK & COLUMN EDITORS                                */}
      {/* ==================================================================== */}
      {isFooterColModalOpen && editingFooterCol && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black pb-2 border-b border-slate-200 dark:border-slate-800">
              Edit Footer Column
            </h3>
            <form onSubmit={handleSaveFooterColModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Column Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterCol.title}
                  onChange={e => setEditingFooterCol({ ...editingFooterCol, title: e.target.value })}
                  placeholder="e.g. Core Capabilities, Governance"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFooterColModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFooterLinkModalOpen && editingFooterLink && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black pb-2 border-b border-slate-200 dark:border-slate-800">
              {isBottomLinkModal ? 'Edit Bottom Bar Link' : 'Edit Footer Link'}
            </h3>
            <form onSubmit={handleSaveFooterLinkModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Link Label *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterLink.label}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, label: e.target.value })}
                  placeholder="e.g. Executed Projects"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  URL Route *
                </label>
                <input
                  type="text"
                  required
                  value={editingFooterLink.href}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, href: e.target.value })}
                  placeholder="e.g. /projects or /services/ground-intelligence"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="flinkActive"
                  checked={editingFooterLink.is_active}
                  onChange={e => setEditingFooterLink({ ...editingFooterLink, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="flinkActive" className="text-sm font-semibold cursor-pointer">
                  Visible in Footer
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFooterLinkModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 4: PAGE & SEO METADATA EDITOR                                  */}
      {/* ==================================================================== */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-xl p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-black">Edit Page Metadata & SEO</h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePageModal} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.title}
                    onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                    placeholder="e.g. Careers"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Slug / Route URL *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPage.slug}
                    onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="e.g. /careers"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none font-mono ${
                      isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Google SEO Meta Title (Recommended: &lt;60 chars)
                </label>
                <input
                  type="text"
                  value={editingPage.meta_title || ''}
                  onChange={e => setEditingPage({ ...editingPage, meta_title: e.target.value })}
                  placeholder="e.g. Careers at Polaris Integrated & GeoSolutions Limited"
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Current length: {(editingPage.meta_title || '').length} characters
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Google SEO Meta Description (Recommended: &lt;160 chars)
                </label>
                <textarea
                  rows={3}
                  value={editingPage.meta_description || ''}
                  onChange={e => setEditingPage({ ...editingPage, meta_description: e.target.value })}
                  placeholder="Brief summary appearing in Google search snippets..."
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 focus:border-emerald-500' : 'bg-white border-slate-300 focus:border-emerald-500'
                  }`}
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Current length: {(editingPage.meta_description || '').length} characters
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pgHeader"
                    checked={editingPage.show_in_header}
                    onChange={e => setEditingPage({ ...editingPage, show_in_header: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pgHeader" className="text-xs font-semibold cursor-pointer">
                    Show link in Header
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pgFooter"
                    checked={editingPage.show_in_footer}
                    onChange={e => setEditingPage({ ...editingPage, show_in_footer: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="pgFooter" className="text-xs font-semibold cursor-pointer">
                    Show link in Footer
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Page Metadata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL 5: RESET CONFIRMATION                                          */}
      {/* ==================================================================== */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-2xl border shadow-2xl space-y-4 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className="text-base font-black text-red-500 flex items-center space-x-2">
              <span>⚠️ Restore Default Navigation?</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              This action will reset the top header navigation, mega-menus, and footer columns back to the official corporate layout. Any custom links you created will be replaced by the defaults.
            </p>
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-slate-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminNavigation;
